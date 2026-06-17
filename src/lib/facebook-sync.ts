import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

const GRAPH_VERSION = "v25.0";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FacebookCampaignInsights {
  impressions: string;
  reach: string;
  clicks: string;
  unique_clicks: string;
  spend: string;
  cpc: string;
  ctr: string;
  frequency: string;
  actions: { action_type: string; value: string }[] | null;
  cost_per_action_type: { action_type: string; value: string }[] | null;
  date_start: string;
  date_stop: string;
}

export interface FacebookCampaignMerged {
  id: string;
  name: string;
  status: string;
  objective: string;
  daily_budget: string | null;
  lifetime_budget: string | null;
  start_time: string | null;
  stop_time: string | null;
  created_time: string;
  insights: FacebookCampaignInsights | null;
}

export interface SyncResult {
  success: boolean;
  message: string;
  campaignsCount: number;
  insightsCount: number;
  matchedCount: number;
  unmatchedCount: number;
  upsertedCampaigns: number;
  savedToDb: number;
  dbCampaignCount: number;
  dbCampaignsWithExternalId: number;
  filePath: string;
}

// ── Enum mappers ─────────────────────────────────────────────────────────────

function mapStatus(fbStatus: string): "ACTIVE" | "PAUSED" | "COMPLETED" {
  switch (fbStatus?.toUpperCase()) {
    case "ACTIVE":
    case "IN_PROCESS":   return "ACTIVE";
    case "PAUSED":
    case "WITH_ISSUES":  return "PAUSED";
    default:             return "COMPLETED";
  }
}

function mapObjective(objective: string): "BRAND_AWARENESS" | "TRAFFIC" | "ENGAGEMENT" | "LEADS" | "SALES" {
  switch (objective?.toUpperCase()) {
    case "LINK_CLICKS":
    case "OUTCOME_TRAFFIC":              return "TRAFFIC";
    case "POST_ENGAGEMENT":
    case "VIDEO_VIEWS":
    case "OUTCOME_ENGAGEMENT":           return "ENGAGEMENT";
    case "MESSAGES":
    case "LEAD_GENERATION":
    case "OUTCOME_LEADS":                return "LEADS";
    case "CONVERSIONS":
    case "OUTCOME_SALES":
    case "PRODUCT_CATALOG_SALES":        return "SALES";
    default:                             return "BRAND_AWARENESS";
  }
}

// ── Action extractor ─────────────────────────────────────────────────────────

function extractAction(actions: any[] | null, actionType: string): number {
  if (!actions) return 0;
  const found = actions.find((a) => a.action_type === actionType);
  return found ? parseInt(found.value, 10) || 0 : 0;
}

function toDecimal(value: string | undefined | null): number | null {
  if (!value) return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fbGet<T = unknown>(endpoint: string, token: string): Promise<T> {
  const sep = endpoint.includes("?") ? "&" : "?";
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${endpoint}${sep}access_token=${token}`;

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      `Facebook API error on /${endpoint.split("?")[0]}: ${JSON.stringify(
        (data as any)?.error ?? data,
        null,
        2
      )}`
    );
  }

  return data as T;
}

async function fbGetAll(endpoint: string, token: string): Promise<any[]> {
  const results: any[] = [];
  const sep = endpoint.includes("?") ? "&" : "?";
  let url: string | null =
    `https://graph.facebook.com/${GRAPH_VERSION}/${endpoint}${sep}access_token=${token}`;
  while (url) {
    const res  = await fetch(url, { cache: "no-store" });
    const data = await res.json() as any;
    if (!res.ok) throw new Error(`FB API error: ${JSON.stringify(data?.error ?? data)}`);
    results.push(...(data.data ?? []));
    url = data.paging?.next ?? null;
  }
  return results;
}

// ── Fetch-to-candidates function (new import workflow) ────────────────────────

export interface FetchCandidatesResult {
  success:                boolean;
  message:                string;
  campaignsFetched:       number;
  insightsFetched:        number;
  adsetsFetched:          number;
  campaignsLinkedToPages: number;
  campaignsWithoutPage:   number;
  candidatesUpserted:     number;
}

export async function fetchFacebookCandidates(): Promise<FetchCandidatesResult> {
  const token       = process.env.FACEBOOK_ACCESS_TOKEN;
  const adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID;
  if (!token || !adAccountId) {
    throw new Error("Missing FACEBOOK_ACCESS_TOKEN or FACEBOOK_AD_ACCOUNT_ID in environment.");
  }

  // 1. Campaigns
  const effectiveStatus = encodeURIComponent(
    JSON.stringify(["ACTIVE", "PAUSED", "ARCHIVED", "IN_PROCESS", "WITH_ISSUES"])
  );
  const campaigns = await fbGetAll(
    `${adAccountId}/campaigns?fields=id,name,status,effective_status,objective,daily_budget,lifetime_budget,start_time,stop_time,created_time&effective_status=${effectiveStatus}&limit=200`,
    token
  );
  console.log(`[fb-candidates] Campaigns: ${campaigns.length}`);

  // 2. Insights
  const insightsRaw = await fbGetAll(
    `${adAccountId}/insights?fields=campaign_id,impressions,reach,clicks,unique_clicks,spend,cpc,ctr,frequency,actions,cost_per_action_type,date_start,date_stop&level=campaign&date_preset=maximum&limit=200`,
    token
  );
  const insightsMap = new Map<string, any>();
  for (const row of insightsRaw) insightsMap.set(String(row.campaign_id).trim(), row);
  console.log(`[fb-candidates] Insights: ${insightsRaw.length}`);

  // 3. AdSets → campaignId → pageId map
  const adsets = await fbGetAll(
    `${adAccountId}/adsets?fields=id,name,campaign{id,name},promoted_object&limit=100`,
    token
  );
  const campaignPageMap = new Map<string, string>();
  for (const adset of adsets) {
    const pageId     = adset.promoted_object?.page_id;
    const campaignId = String(adset.campaign?.id ?? "").trim();
    if (pageId && campaignId && !campaignPageMap.has(campaignId)) {
      campaignPageMap.set(campaignId, String(pageId).trim());
    }
  }
  console.log(`[fb-candidates] AdSets: ${adsets.length}, campaign→page mappings: ${campaignPageMap.size}`);

  // 4. Load SocialPages from DB
  const socialPages = await prisma.socialPage.findMany({
    where:  { platform: "META" },
    select: { id: true, externalPageId: true },
  });
  const pageIdToSocialPageId = new Map(
    socialPages.filter((p) => p.externalPageId).map((p) => [p.externalPageId!, p.id])
  );

  // 5. Upsert ImportCandidates
  let candidatesUpserted = 0;
  let linked = 0;
  let unlinked = 0;

  for (const c of campaigns) {
    const fbCampaignId = String(c.id).trim();
    const fbPageId     = campaignPageMap.get(fbCampaignId) ?? null;
    const socialPageId = fbPageId ? (pageIdToSocialPageId.get(fbPageId) ?? null) : null;
    const insights     = insightsMap.get(fbCampaignId) ?? null;

    if (socialPageId) linked++; else unlinked++;

    const shared = {
      name:                c.name,
      fbStatus:            c.status         ?? "UNKNOWN",
      fbObjective:         c.objective       ?? "UNKNOWN",
      dailyBudget:         c.daily_budget    ?? null,
      lifetimeBudget:      c.lifetime_budget ?? null,
      startTime:           c.start_time      ?? null,
      stopTime:            c.stop_time       ?? null,
      createdTime:         c.created_time    ?? null,
      fbPageId,
      socialPageId,
      insightsJson:        insights ?? undefined,
      fetchedAt:           new Date(),
    };

    await prisma.importCandidate.upsert({
      where:  { externalCampaignId: fbCampaignId },
      update: shared,
      create: { ...shared, externalCampaignId: fbCampaignId, externalAdAccountId: adAccountId },
    });
    candidatesUpserted++;
  }

  return {
    success:                true,
    message:                `Fetched ${campaigns.length} campaigns, ${adsets.length} adsets. ${linked} linked to pages, ${unlinked} without page.`,
    campaignsFetched:       campaigns.length,
    insightsFetched:        insightsRaw.length,
    adsetsFetched:          adsets.length,
    campaignsLinkedToPages: linked,
    campaignsWithoutPage:   unlinked,
    candidatesUpserted,
  };
}

// ── Legacy sync function (writes directly to Campaign table) ──────────────────
// ── Core sync function ────────────────────────────────────────────────────────

export async function syncFacebookCampaigns(): Promise<SyncResult> {
  const token       = process.env.FACEBOOK_ACCESS_TOKEN;
  const adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID;

  if (!token || !adAccountId) {
    throw new Error("Missing FACEBOOK_ACCESS_TOKEN or FACEBOOK_AD_ACCOUNT_ID in environment.");
  }

  // 1. Fetch campaigns
  console.log(`[facebook-sync] Fetching campaigns for account: ${adAccountId}`);
  const effectiveStatus = encodeURIComponent(
    JSON.stringify(["ACTIVE", "PAUSED", "ARCHIVED", "IN_PROCESS", "WITH_ISSUES"])
  );
  const campaignsEndpoint =
    `${adAccountId}/campaigns?fields=id,name,status,effective_status,objective,daily_budget,lifetime_budget,start_time,stop_time,created_time` +
    `&effective_status=${effectiveStatus}&limit=200`;
  const campaignsRes = await fbGet<{ data: any[] }>(campaignsEndpoint, token);
  const campaigns: any[] = campaignsRes.data ?? [];
  console.log(`[facebook-sync] Campaigns fetched: ${campaigns.length}`);

  // 2. Fetch account-level insights (all campaigns at once)
  console.log(`[facebook-sync] Fetching insights for account: ${adAccountId}`);
  const insightsRes = await fbGet<{ data: any[] }>(
    `${adAccountId}/insights?fields=campaign_id,campaign_name,impressions,reach,clicks,unique_clicks,spend,cpc,ctr,frequency,actions,cost_per_action_type,date_start,date_stop&level=campaign&date_preset=maximum`,
    token
  );
  const insightsRaw: any[] = insightsRes.data ?? [];
  console.log(`[facebook-sync] Insights fetched: ${insightsRaw.length}`);

  // 3. Build insights map by campaign_id (trim + String cast for safe comparison)
  const insightsMap = new Map<string, FacebookCampaignInsights>();
  for (const row of insightsRaw) {
    const key = String(row.campaign_id).trim();
    insightsMap.set(key, {
      impressions:           row.impressions           ?? "0",
      reach:                 row.reach                 ?? "0",
      clicks:                row.clicks                ?? "0",
      unique_clicks:         row.unique_clicks         ?? "0",
      spend:                 row.spend                 ?? "0",
      cpc:                   row.cpc                   ?? "0",
      ctr:                   row.ctr                   ?? "0",
      frequency:             row.frequency             ?? "0",
      actions:               row.actions               ?? null,
      cost_per_action_type:  row.cost_per_action_type  ?? null,
      date_start:            row.date_start            ?? "",
      date_stop:             row.date_stop             ?? "",
    });
  }

  // ── Debug logs ──────────────────────────────────────────────────────────────
  const campaignIds = campaigns.map((c) => String(c.id).trim());
  const insightIds  = insightsRaw.map((r) => String(r.campaign_id).trim());
  const matchedIds  = campaignIds.filter((id) => insightsMap.has(id));
  const unmatchedCampaignIds = campaignIds.filter((id) => !insightsMap.has(id));
  const orphanInsightIds     = insightIds.filter((id) => !campaignIds.includes(id));

  console.log("[facebook-sync] Campaign IDs from campaigns endpoint:", campaignIds);
  console.log("[facebook-sync] Campaign IDs from insights endpoint: ", insightIds);
  console.log("[facebook-sync] Matched IDs:                         ", matchedIds);
  console.log("[facebook-sync] Unmatched campaign IDs (no insight): ", unmatchedCampaignIds);
  console.log("[facebook-sync] Insight IDs not in campaigns:        ", orphanInsightIds);

  // 4. Merge campaigns with insights
  const merged: FacebookCampaignMerged[] = campaigns.map((c) => ({
    id:               c.id,
    name:             c.name,
    status:           c.status,
    objective:        c.objective,
    daily_budget:     c.daily_budget     ?? null,
    lifetime_budget:  c.lifetime_budget  ?? null,
    start_time:       c.start_time       ?? null,
    stop_time:        c.stop_time        ?? null,
    created_time:     c.created_time,
    insights:         insightsMap.get(String(c.id).trim()) ?? null,
  }));

  // 5. Save to disk
  const dataDir = path.join(process.cwd(), "data");
  await fs.mkdir(dataDir, { recursive: true });

  const rawCampaignsPath  = path.join(dataDir, "facebook-campaigns-raw.json");
  const rawInsightsPath   = path.join(dataDir, "facebook-insights-raw.json");
  const insightsOnlyPath  = path.join(dataDir, "facebook-insights-only.json");
  const filePath          = path.join(dataDir, "facebook-campaigns.json");

  await fs.writeFile(rawCampaignsPath, JSON.stringify(campaignsRes, null, 2), "utf-8");
  console.log(`[facebook-sync] Raw campaigns saved  → ${rawCampaignsPath}`);

  await fs.writeFile(rawInsightsPath, JSON.stringify(insightsRes, null, 2), "utf-8");
  console.log(`[facebook-sync] Raw insights saved   → ${rawInsightsPath}`);

  await fs.writeFile(insightsOnlyPath, JSON.stringify(insightsRaw, null, 2), "utf-8");
  console.log(`[facebook-sync] Insights-only saved  → ${insightsOnlyPath}`);

  await fs.writeFile(filePath, JSON.stringify(merged, null, 2), "utf-8");
  console.log(`[facebook-sync] Merged result saved  → ${filePath}`);

  // 6. Debug — DB state before upsert
  const dbCampaignCount = await prisma.campaign.count();
  const dbCampaignsWithExternalId = await prisma.campaign.count({
    where: { externalCampaignId: { not: null } },
  });
  console.log(`[facebook-sync] DB campaigns total: ${dbCampaignCount}, with externalCampaignId: ${dbCampaignsWithExternalId}`);

  // 7. Fetch all ads to build campaignId → pageId map
  console.log(`[facebook-sync] Fetching ads to resolve page_id per campaign...`);
  let campaignPageMap = new Map<string, string>(); // fbCampaignId → fbPageId
  try {
    const adsRes = await fbGet<{ data: any[] }>(
      `${adAccountId}/ads?fields=campaign_id,creative{object_story_spec{page_id}}&limit=500`,
      token
    );
    for (const ad of adsRes.data ?? []) {
      const pageId    = ad.creative?.object_story_spec?.page_id;
      const campaignId = String(ad.campaign_id ?? "").trim();
      if (pageId && campaignId && !campaignPageMap.has(campaignId)) {
        campaignPageMap.set(campaignId, String(pageId).trim());
      }
    }
    console.log(`[facebook-sync] Resolved page_id for ${campaignPageMap.size} campaigns from ads.`);
  } catch (err) {
    console.warn("[facebook-sync] Could not fetch ads for page matching, will use fallback:", err);
  }

  // 8. Load all META SocialPages from DB, indexed by externalPageId
  const allMetaPages = await prisma.socialPage.findMany({
    where: { platform: "META" },
    select: { id: true, externalPageId: true },
  });
  const pageIdToSocialPageId = new Map(
    allMetaPages.filter((p) => p.externalPageId).map((p) => [p.externalPageId!, p.id])
  );
  const fallbackSocialPageId = allMetaPages[0]?.id ?? null;

  console.log(`[facebook-sync] META SocialPages in DB: ${allMetaPages.length}`);
  if (!fallbackSocialPageId) {
    console.warn("[facebook-sync] No META SocialPage found — campaign upsert will be skipped.");
  }

  // 9. Upsert ALL campaigns → build fbId→dbId map
  let upsertedCampaigns = 0;
  const fbIdToDbId = new Map<string, string>(); // fbCampaignId → db Campaign.id

  if (fallbackSocialPageId) {
    for (const c of merged) {
      try {
        const startDate = c.start_time ? new Date(c.start_time) : new Date(c.created_time);
        const endDate   = c.stop_time  ? new Date(c.stop_time)  : new Date();
        const budget    = parseFloat(c.lifetime_budget ?? c.daily_budget ?? "0") || 0;

        const fbPageId       = campaignPageMap.get(c.id);
        const resolvedPageId = (fbPageId && pageIdToSocialPageId.get(fbPageId)) ?? fallbackSocialPageId;

        console.log(`[facebook-sync] Campaign FB id=${c.id} → fbPage=${fbPageId ?? "unknown"} → SocialPage=${resolvedPageId}`);

        const existing = await prisma.campaign.findFirst({
          where: { externalCampaignId: c.id },
          select: { id: true },
        });

        let dbId: string;

        if (existing) {
          await prisma.campaign.update({
            where: { id: existing.id },
            data:  { name: c.name, status: mapStatus(c.status), marketingGoal: mapObjective(c.objective), budget, startDate, endDate, pageId: resolvedPageId },
          });
          dbId = existing.id;
        } else {
          const created = await prisma.campaign.create({
            data: {
              name:                c.name,
              pageId:              resolvedPageId,
              platform:            "META",
              status:              mapStatus(c.status),
              marketingGoal:       mapObjective(c.objective),
              budget,
              startDate,
              endDate,
              externalCampaignId:  c.id,
              externalAdAccountId: adAccountId,
            },
            select: { id: true },
          });
          dbId = created.id;
        }

        fbIdToDbId.set(c.id, dbId);
        upsertedCampaigns++;
      } catch (err) {
        console.error(`[facebook-sync] Campaign upsert failed for FB id=${c.id}:`, err);
      }
    }
    console.log(`[facebook-sync] Campaigns upserted: ${upsertedCampaigns}`);
  }

  // 9. Upsert CampaignPerformance for campaigns that have insights
  //    Use fbIdToDbId map directly — no extra DB lookup needed
  let savedToDb = 0;

  for (const c of merged) {
    if (!c.insights) continue;

    const dbId = fbIdToDbId.get(c.id);
    if (!dbId) {
      console.warn(`[facebook-sync] No DB id for FB campaign ${c.id}, skipping performance.`);
      continue;
    }

    try {
      const ins = c.insights;
      const syncDate = ins.date_stop ? new Date(ins.date_stop) : new Date();
      syncDate.setUTCHours(0, 0, 0, 0);

      const performanceData = {
        impressions:     parseInt(ins.impressions)   || 0,
        reach:           parseInt(ins.reach)         || 0,
        clicks:          parseInt(ins.clicks)        || 0,
        uniqueClicks:    parseInt(ins.unique_clicks) || 0,
        spend:           parseFloat(ins.spend)       || 0,
        cpc:             toDecimal(ins.cpc),
        ctr:             toDecimal(ins.ctr),
        frequency:       toDecimal(ins.frequency),
        linkClicks:      extractAction(ins.actions, "link_click"),
        comments:        extractAction(ins.actions, "comment"),
        reactions:       extractAction(ins.actions, "post_reaction"),
        videoViews:      extractAction(ins.actions, "video_view"),
        engagements:     extractAction(ins.actions, "post_engagement"),
        messagesStarted: extractAction(ins.actions, "onsite_conversion.messaging_conversation_started_7d"),
      };

      await prisma.campaignPerformance.upsert({
        where:  { campaignId_date: { campaignId: dbId, date: syncDate } },
        update: performanceData,
        create: { campaignId: dbId, date: syncDate, ...performanceData },
      });

      savedToDb++;
      console.log(`[facebook-sync] Performance saved for FB id=${c.id} → DB id=${dbId}`);
    } catch (dbErr) {
      console.error(`[facebook-sync] Performance upsert failed for FB id=${c.id}:`, dbErr);
    }
  }

  console.log(`[facebook-sync] Performance records saved: ${savedToDb}`);

  return {
    success:                  true,
    message:                  `Synced ${campaigns.length} FB campaigns — ${upsertedCampaigns} upserted, ${savedToDb} performance records saved.`,
    campaignsCount:           campaigns.length,
    insightsCount:            insightsRaw.length,
    matchedCount:             matchedIds.length,
    unmatchedCount:           unmatchedCampaignIds.length,
    upsertedCampaigns,
    savedToDb,
    dbCampaignCount,
    dbCampaignsWithExternalId,
    filePath,
  };
}

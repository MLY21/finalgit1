import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// ── Helpers (mirrors facebook-sync.ts) ───────────────────────────────────────

function mapStatus(s: string): "ACTIVE" | "PAUSED" | "COMPLETED" {
  switch (s?.toUpperCase()) {
    case "ACTIVE":
    case "IN_PROCESS":  return "ACTIVE";
    case "PAUSED":
    case "WITH_ISSUES": return "PAUSED";
    default:            return "COMPLETED";
  }
}

function mapObjective(o: string): "BRAND_AWARENESS" | "TRAFFIC" | "ENGAGEMENT" | "LEADS" | "SALES" {
  switch (o?.toUpperCase()) {
    case "LINK_CLICKS":
    case "OUTCOME_TRAFFIC":     return "TRAFFIC";
    case "POST_ENGAGEMENT":
    case "VIDEO_VIEWS":
    case "OUTCOME_ENGAGEMENT":  return "ENGAGEMENT";
    case "MESSAGES":
    case "LEAD_GENERATION":
    case "OUTCOME_LEADS":       return "LEADS";
    case "CONVERSIONS":
    case "OUTCOME_SALES":
    case "PRODUCT_CATALOG_SALES": return "SALES";
    default:                    return "BRAND_AWARENESS";
  }
}

function extractAction(actions: any[] | null, type: string): number {
  if (!actions) return 0;
  const found = actions.find((a) => a.action_type === type);
  return found ? parseInt(found.value, 10) || 0 : 0;
}

function toDecimal(v: string | null | undefined): number | null {
  if (!v) return null;
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

// ── POST /api/facebook/import ─────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { externalCampaignIds } = body as { externalCampaignIds: string[] };

  if (!Array.isArray(externalCampaignIds) || externalCampaignIds.length === 0) {
    return NextResponse.json({ success: false, message: "No campaigns selected." }, { status: 400 });
  }

  const candidates = await prisma.importCandidate.findMany({
    where: { externalCampaignId: { in: externalCampaignIds } },
  });

  let campaignsImported    = 0;
  let performancesSaved    = 0;
  let campaignsLinkedToPages = 0;
  let campaignsWithoutPage = 0;

  for (const candidate of candidates) {
    try {
      const budget    = parseFloat(candidate.lifetimeBudget ?? candidate.dailyBudget ?? "0") / 100 || 0;
      const startDate = candidate.startTime  ? new Date(candidate.startTime)  : new Date(candidate.createdTime ?? Date.now());
      const endDate   = candidate.stopTime   ? new Date(candidate.stopTime)   : new Date();

      const campaignData = {
        name:                candidate.name,
        pageId:              candidate.socialPageId,
        platform:            "META"  as const,
        status:              mapStatus(candidate.fbStatus),
        marketingGoal:       mapObjective(candidate.fbObjective),
        budget,
        startDate,
        endDate,
        externalAdAccountId: candidate.externalAdAccountId,
        lastSync:            new Date(),
      };

      const existing = await prisma.campaign.findFirst({
        where:  { externalCampaignId: candidate.externalCampaignId },
        select: { id: true },
      });

      let dbId: string;
      if (existing) {
        await prisma.campaign.update({ where: { id: existing.id }, data: campaignData });
        dbId = existing.id;
      } else {
        const created = await prisma.campaign.create({
          data:   { ...campaignData, externalCampaignId: candidate.externalCampaignId },
          select: { id: true },
        });
        dbId = created.id;
      }

      campaignsImported++;
      if (candidate.socialPageId) campaignsLinkedToPages++; else campaignsWithoutPage++;

      // Save performance if insights available
      if (candidate.insightsJson) {
        const ins = candidate.insightsJson as any;
        const syncDate = ins.date_stop ? new Date(ins.date_stop) : new Date();
        syncDate.setUTCHours(0, 0, 0, 0);

        const perfData = {
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
          update: perfData,
          create: { campaignId: dbId, date: syncDate, ...perfData },
        });
        performancesSaved++;
      }
    } catch (err) {
      console.error(`[import] Failed for ${candidate.externalCampaignId}:`, err);
    }
  }

  return NextResponse.json({
    success: true,
    message: `Imported ${campaignsImported} campaign(s). ${performancesSaved} performance record(s) saved.`,
    data: {
      campaignsFetched:       externalCampaignIds.length,
      campaignsSelected:      externalCampaignIds.length,
      campaignsImported,
      campaignsLinkedToPages,
      campaignsWithoutPage,
      performancesSaved,
    },
  });
}


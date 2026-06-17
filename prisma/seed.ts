import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

type DailyRow = {
  impressions: number;
  reach: number;
  clicks: number;
  leads: number;
  conversions: number;
  spend: number;
};

type CampDef = {
  pageId: string;
  name: string;
  externalId: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  goal: "LEADS" | "BRAND_AWARENESS" | "TRAFFIC" | "ENGAGEMENT" | "SALES";
  budget: number;
  daysBack: number;
  dailyData: DailyRow[];
};

async function seedCampaign(def: CampDef) {
  const existing = await prisma.campaign.findFirst({
    where: { externalCampaignId: def.externalId },
  });
  if (existing) {
    console.log(`   ↩️  Already exists: ${def.name}`);
    return existing;
  }

  const days = def.dailyData.length;
  const campaign = await prisma.campaign.create({
    data: {
      pageId: def.pageId,
      name: def.name,
      platform: "META",
      status: def.status,
      marketingGoal: def.goal,
      budget: def.budget,
      startDate: daysAgo(def.daysBack + days),
      endDate: daysAgo(def.daysBack),
      externalCampaignId: def.externalId,
      externalAdAccountId: "act_448299103",
      lastSync: new Date(),
    },
  });

  const perfRows = def.dailyData.map((row, i) => ({
    campaignId: campaign.id,
    date: daysAgo(def.daysBack + days - 1 - i),
    ...row,
  }));

  await prisma.campaignPerformance.createMany({ data: perfRows });

  const totalSpend = def.dailyData.reduce((s, r) => s + r.spend, 0);
  const totalImpressions = def.dailyData.reduce((s, r) => s + r.impressions, 0);
  const totalClicks = def.dailyData.reduce((s, r) => s + r.clicks, 0);
  const totalLeads = def.dailyData.reduce((s, r) => s + r.leads, 0);
  console.log(
    `   ✅ ${def.name} | Impressions: ${totalImpressions.toLocaleString()} | Clicks: ${totalClicks.toLocaleString()} | Leads: ${totalLeads} | Spent: ${totalSpend.toFixed(0)} LYD`
  );
  return campaign;
}

async function main() {
  // ── Admin user ──────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "mohamed@gmail.com" },
    update: {},
    create: {
      name: "Admin",
      email: "mohamed@gmail.com",
      password: await bcrypt.hash("123455123455", 10),
      role: "ADMIN",
      avatarInitials: "AD",
    },
  });
  console.log(`✅ Admin: ${admin.email}`);

  // ── Find first two clients ────────────────────────────────────
  const clients = await prisma.client.findMany({
    where: { adminId: admin.id },
    orderBy: { createdAt: "asc" },
    take: 2,
  });

  if (clients.length < 2) {
    console.log("⚠️  Need at least 2 clients. Create them via the dashboard first, then re-run seed.");
    return;
  }

  const [client1, client2] = clients;
  console.log(`📦 Client 1: ${client1.name}`);
  console.log(`📦 Client 2: ${client2.name}`);

  // ── Get or create SocialPage (always syncs externalPageId = adAccountId) ────
  async function getOrCreatePage(clientId: string, clientName: string, adAccountId: string) {
    const existing = await prisma.socialPage.findFirst({
      where: { clientId, platform: "META" },
    });
    if (existing) {
      if (existing.externalPageId !== adAccountId) {
        return prisma.socialPage.update({
          where: { id: existing.id },
          data: { externalPageId: adAccountId },
        });
      }
      return existing;
    }
    return prisma.socialPage.create({
      data: {
        clientId,
        name: `${clientName} – Meta Ads Page`,
        platform: "META",
        externalPageId: adAccountId,
        isActive: true,
      },
    });
  }

  const page1 = await getOrCreatePage(client1.id, client1.name, "act_448299103");
  const page2 = await getOrCreatePage(client2.id, client2.name, "act_987654321");

  console.log("\n🌱 Seeding campaigns...");

  // ── Campaign 1 – Client1: Lead Generation (14 days) ───────────
  await seedCampaign({
    pageId: page1.id,
    name: `${client1.name} – Lead Generation Q3`,
    externalId: `seed_${client1.id.slice(0, 6)}_001`,
    status: "ACTIVE",
    goal: "LEADS",
    budget: 12000,
    daysBack: 0,
    dailyData: [
      { impressions: 5200,  reach: 3800,  clicks: 195, leads: 22, conversions: 9,  spend: 825 },
      { impressions: 6100,  reach: 4300,  clicks: 230, leads: 27, conversions: 11, spend: 870 },
      { impressions: 7400,  reach: 5200,  clicks: 285, leads: 33, conversions: 14, spend: 910 },
      { impressions: 8900,  reach: 6100,  clicks: 340, leads: 40, conversions: 17, spend: 855 },
      { impressions: 7800,  reach: 5500,  clicks: 305, leads: 36, conversions: 15, spend: 790 },
      { impressions: 9200,  reach: 6400,  clicks: 375, leads: 44, conversions: 19, spend: 920 },
      { impressions: 10400, reach: 7200,  clicks: 420, leads: 51, conversions: 22, spend: 945 },
      { impressions: 9600,  reach: 6700,  clicks: 390, leads: 47, conversions: 20, spend: 880 },
      { impressions: 11200, reach: 7800,  clicks: 455, leads: 55, conversions: 24, spend: 965 },
      { impressions: 10800, reach: 7500,  clicks: 440, leads: 53, conversions: 23, spend: 930 },
      { impressions: 9400,  reach: 6500,  clicks: 380, leads: 45, conversions: 19, spend: 860 },
      { impressions: 8700,  reach: 6000,  clicks: 350, leads: 42, conversions: 18, spend: 830 },
      { impressions: 10100, reach: 7000,  clicks: 410, leads: 49, conversions: 21, spend: 900 },
      { impressions: 11500, reach: 8000,  clicks: 470, leads: 57, conversions: 25, spend: 970 },
    ],
  });

  // ── Campaign 2 – Client1: Brand Awareness (14 days) ──────────
  await seedCampaign({
    pageId: page1.id,
    name: `${client1.name} – Brand Awareness`,
    externalId: `seed_${client1.id.slice(0, 6)}_002`,
    status: "PAUSED",
    goal: "BRAND_AWARENESS",
    budget: 7500,
    daysBack: 5,
    dailyData: [
      { impressions: 9500,  reach: 7200,  clicks: 190, leads: 12, conversions: 5,  spend: 520 },
      { impressions: 11200, reach: 8400,  clicks: 225, leads: 15, conversions: 7,  spend: 540 },
      { impressions: 14600, reach: 10800, clicks: 285, leads: 19, conversions: 9,  spend: 560 },
      { impressions: 12800, reach: 9500,  clicks: 250, leads: 17, conversions: 8,  spend: 535 },
      { impressions: 16200, reach: 12000, clicks: 320, leads: 22, conversions: 10, spend: 575 },
      { impressions: 18400, reach: 13600, clicks: 370, leads: 26, conversions: 12, spend: 590 },
      { impressions: 15700, reach: 11600, clicks: 310, leads: 21, conversions: 10, spend: 555 },
      { impressions: 13500, reach: 10000, clicks: 265, leads: 18, conversions: 8,  spend: 530 },
      { impressions: 17800, reach: 13200, clicks: 355, leads: 25, conversions: 11, spend: 585 },
      { impressions: 20100, reach: 14800, clicks: 400, leads: 28, conversions: 13, spend: 600 },
      { impressions: 19200, reach: 14200, clicks: 380, leads: 27, conversions: 12, spend: 595 },
      { impressions: 16500, reach: 12200, clicks: 325, leads: 23, conversions: 11, spend: 570 },
      { impressions: 21300, reach: 15700, clicks: 425, leads: 30, conversions: 14, spend: 610 },
      { impressions: 18900, reach: 14000, clicks: 375, leads: 26, conversions: 12, spend: 590 },
    ],
  });

  // ── Campaign 3 – Client2: Sales Boost (14 days) ───────────────
  await seedCampaign({
    pageId: page2.id,
    name: `${client2.name} – Sales Boost Q3`,
    externalId: `seed_${client2.id.slice(0, 6)}_001`,
    status: "ACTIVE",
    goal: "SALES",
    budget: 15000,
    daysBack: 0,
    dailyData: [
      { impressions: 6800,  reach: 5000,  clicks: 280, leads: 30, conversions: 12, spend: 1050 },
      { impressions: 8200,  reach: 6000,  clicks: 340, leads: 37, conversions: 15, spend: 1090 },
      { impressions: 9700,  reach: 7100,  clicks: 400, leads: 44, conversions: 18, spend: 1120 },
      { impressions: 11400, reach: 8300,  clicks: 475, leads: 52, conversions: 21, spend: 1080 },
      { impressions: 10200, reach: 7500,  clicks: 425, leads: 47, conversions: 19, spend: 1060 },
      { impressions: 12600, reach: 9200,  clicks: 520, leads: 58, conversions: 24, spend: 1140 },
      { impressions: 14100, reach: 10300, clicks: 585, leads: 65, conversions: 27, spend: 1160 },
      { impressions: 13200, reach: 9700,  clicks: 545, leads: 61, conversions: 25, spend: 1100 },
      { impressions: 11800, reach: 8600,  clicks: 490, leads: 54, conversions: 22, spend: 1070 },
      { impressions: 15300, reach: 11200, clicks: 635, leads: 71, conversions: 29, spend: 1180 },
      { impressions: 13700, reach: 10000, clicks: 565, leads: 63, conversions: 26, spend: 1110 },
      { impressions: 12500, reach: 9100,  clicks: 515, leads: 57, conversions: 23, spend: 1075 },
      { impressions: 16200, reach: 11800, clicks: 670, leads: 75, conversions: 31, spend: 1200 },
      { impressions: 14800, reach: 10800, clicks: 610, leads: 68, conversions: 28, spend: 1150 },
    ],
  });

  // ── Campaign 4 – Client2: Traffic Drive (14 days) ────────────
  await seedCampaign({
    pageId: page2.id,
    name: `${client2.name} – Traffic Drive`,
    externalId: `seed_${client2.id.slice(0, 6)}_002`,
    status: "ACTIVE",
    goal: "TRAFFIC",
    budget: 9000,
    daysBack: 0,
    dailyData: [
      { impressions: 4400,  reach: 3200, clicks: 310, leads: 18, conversions: 14, spend: 625 },
      { impressions: 5100,  reach: 3700, clicks: 360, leads: 22, conversions: 17, spend: 645 },
      { impressions: 6200,  reach: 4500, clicks: 445, leads: 27, conversions: 21, spend: 670 },
      { impressions: 7300,  reach: 5300, clicks: 520, leads: 32, conversions: 25, spend: 655 },
      { impressions: 6600,  reach: 4800, clicks: 470, leads: 29, conversions: 22, spend: 640 },
      { impressions: 8100,  reach: 5900, clicks: 575, leads: 36, conversions: 28, spend: 680 },
      { impressions: 9200,  reach: 6700, clicks: 650, leads: 41, conversions: 32, spend: 695 },
      { impressions: 8500,  reach: 6200, clicks: 605, leads: 38, conversions: 29, spend: 665 },
      { impressions: 7800,  reach: 5700, clicks: 555, leads: 34, conversions: 27, spend: 650 },
      { impressions: 10200, reach: 7400, clicks: 720, leads: 45, conversions: 35, spend: 710 },
      { impressions: 9500,  reach: 6900, clicks: 670, leads: 42, conversions: 33, spend: 690 },
      { impressions: 8800,  reach: 6400, clicks: 625, leads: 39, conversions: 30, spend: 660 },
      { impressions: 11100, reach: 8100, clicks: 785, leads: 49, conversions: 38, spend: 725 },
      { impressions: 10400, reach: 7600, clicks: 735, leads: 46, conversions: 36, spend: 700 },
    ],
  });

  // ── Campaign 5 – Client2: Engagement Boost (14 days) ─────────
  await seedCampaign({
    pageId: page2.id,
    name: `${client2.name} – Engagement Boost`,
    externalId: `seed_${client2.id.slice(0, 6)}_003`,
    status: "COMPLETED",
    goal: "ENGAGEMENT",
    budget: 5500,
    daysBack: 20,
    dailyData: [
      { impressions: 3100, reach: 2300, clicks: 120, leads: 9,  conversions: 3, spend: 380 },
      { impressions: 3800, reach: 2800, clicks: 148, leads: 11, conversions: 4, spend: 390 },
      { impressions: 4500, reach: 3300, clicks: 176, leads: 14, conversions: 5, spend: 400 },
      { impressions: 5200, reach: 3800, clicks: 205, leads: 16, conversions: 6, spend: 405 },
      { impressions: 4800, reach: 3500, clicks: 188, leads: 15, conversions: 6, spend: 395 },
      { impressions: 5900, reach: 4300, clicks: 232, leads: 18, conversions: 7, spend: 410 },
      { impressions: 6600, reach: 4800, clicks: 260, leads: 21, conversions: 8, spend: 415 },
      { impressions: 6100, reach: 4500, clicks: 240, leads: 19, conversions: 7, spend: 408 },
      { impressions: 5500, reach: 4000, clicks: 215, leads: 17, conversions: 6, spend: 400 },
      { impressions: 7200, reach: 5200, clicks: 283, leads: 23, conversions: 9, spend: 420 },
      { impressions: 6800, reach: 4900, clicks: 265, leads: 21, conversions: 8, spend: 412 },
      { impressions: 6200, reach: 4500, clicks: 242, leads: 19, conversions: 7, spend: 404 },
      { impressions: 7500, reach: 5500, clicks: 295, leads: 24, conversions: 9, spend: 422 },
      { impressions: 7100, reach: 5100, clicks: 277, leads: 22, conversions: 8, spend: 416 },
    ],
  });

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

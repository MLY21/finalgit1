import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑️  Starting data reset — admin users will be preserved...\n");

  const cpCount    = await prisma.campaignPerformance.count();
  const cnCount    = await prisma.campaignNote.count();
  const alCount    = await prisma.activityLog.count();
  const camCount   = await prisma.campaign.count();
  const spCount    = await prisma.socialPage.count();
  const clCount    = await prisma.client.count();
  const sessCount  = await prisma.session.count();
  const userCount  = await prisma.user.count({ where: { role: { not: "ADMIN" } } });

  console.log("📊 Current counts:");
  console.log(`   CampaignPerformance : ${cpCount}`);
  console.log(`   CampaignNote        : ${cnCount}`);
  console.log(`   ActivityLog         : ${alCount}`);
  console.log(`   Campaign            : ${camCount}`);
  console.log(`   SocialPage          : ${spCount}`);
  console.log(`   Client              : ${clCount}`);
  console.log(`   Session             : ${sessCount}`);
  console.log(`   Non-admin users     : ${userCount}`);
  console.log("");

  // Delete in safe dependency order
  const d1 = await prisma.campaignPerformance.deleteMany();
  console.log(`✅ Deleted CampaignPerformance : ${d1.count}`);

  const d2 = await prisma.campaignNote.deleteMany();
  console.log(`✅ Deleted CampaignNote        : ${d2.count}`);

  const d3 = await prisma.activityLog.deleteMany();
  console.log(`✅ Deleted ActivityLog         : ${d3.count}`);

  const d4 = await prisma.campaign.deleteMany();
  console.log(`✅ Deleted Campaign            : ${d4.count}`);

  const d5 = await prisma.socialPage.deleteMany();
  console.log(`✅ Deleted SocialPage          : ${d5.count}`);

  const d6 = await prisma.client.deleteMany();
  console.log(`✅ Deleted Client              : ${d6.count}`);

  const d7 = await prisma.session.deleteMany();
  console.log(`✅ Deleted Session             : ${d7.count}`);

  const d8 = await prisma.user.deleteMany({ where: { role: { not: "ADMIN" } } });
  console.log(`✅ Deleted non-admin users     : ${d8.count}`);

  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
  console.log(`\n🔒 Admin users preserved      : ${adminCount}`);
  console.log("\n✅ Reset complete. Tables and admin accounts are intact.");
}

main()
  .catch((e) => {
    console.error("❌ Reset failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

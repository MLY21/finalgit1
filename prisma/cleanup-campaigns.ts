import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // CampaignPerformance deleted via cascade when Campaign is deleted
  const deleted = await prisma.campaign.deleteMany({});
  console.log(`✅ Deleted ${deleted.count} campaign(s) (performance data removed via cascade).`);
  console.log("✅ Clients, Users, and SocialPages were NOT affected.");
}

main()
  .catch((e) => {
    console.error("❌ Cleanup failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

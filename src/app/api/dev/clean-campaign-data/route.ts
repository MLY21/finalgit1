import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { success: false, message: "This endpoint is disabled in production." },
      { status: 403 }
    );
  }

  try {
    const [deletedPerformance, deletedNotes, deletedCampaigns] =
      await prisma.$transaction([
        prisma.campaignPerformance.deleteMany({}),
        prisma.campaignNote.deleteMany({}),
        prisma.campaign.deleteMany({}),
      ]);

    console.log(
      `[clean-campaign-data] Deleted: ${deletedPerformance.count} performance records, ` +
        `${deletedNotes.count} notes, ${deletedCampaigns.count} campaigns.`
    );

    return NextResponse.json({
      success: true,
      message: "Campaign data cleaned successfully.",
      deleted: {
        campaignPerformance: deletedPerformance.count,
        campaignNotes: deletedNotes.count,
        campaigns: deletedCampaigns.count,
      },
    });
  } catch (error: any) {
    console.error("[clean-campaign-data] Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message ?? "Cleanup failed." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const candidates = await prisma.importCandidate.findMany({
    orderBy: { fetchedAt: "desc" },
    include: {
      socialPage: {
        include: { client: { select: { id: true, name: true, company: true } } },
      },
    },
  });

  return NextResponse.json({
    success: true,
    data: candidates.map((c) => ({
      id:                  c.id,
      externalCampaignId:  c.externalCampaignId,
      name:                c.name,
      fbStatus:            c.fbStatus,
      fbObjective:         c.fbObjective,
      dailyBudget:         c.dailyBudget,
      lifetimeBudget:      c.lifetimeBudget,
      startTime:           c.startTime,
      stopTime:            c.stopTime,
      fbPageId:            c.fbPageId,
      socialPageId:        c.socialPageId,
      socialPageName:      c.socialPage?.name        ?? null,
      clientId:            c.socialPage?.client?.id   ?? null,
      clientName:          c.socialPage?.client?.name ?? null,
      hasInsights:         !!c.insightsJson,
      fetchedAt:           c.fetchedAt.toISOString(),
    })),
  });
}

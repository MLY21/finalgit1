import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { clientId, campaignIds } = body as { clientId: string; campaignIds: string[] };

  if (!clientId || !Array.isArray(campaignIds) || campaignIds.length === 0) {
    return NextResponse.json(
      { success: false, message: "clientId and non-empty campaignIds are required." },
      { status: 400 }
    );
  }

  const client = await prisma.client.findFirst({
    where: { id: clientId, adminId: user.id },
    select: { id: true },
  });

  if (!client) {
    return NextResponse.json({ success: false, message: "Client not found." }, { status: 404 });
  }

  const result = await prisma.campaign.updateMany({
    where: { id: { in: campaignIds } },
    data: { clientId, assignmentStatus: "MANUAL_ASSIGNED" },
  });

  return NextResponse.json({
    success: true,
    message: `${result.count} campaign(s) assigned to client.`,
    updatedCount: result.count,
  });
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { campaignIds } = body as { campaignIds: string[] };

  if (!Array.isArray(campaignIds) || campaignIds.length === 0) {
    return NextResponse.json({ success: false, message: "campaignIds required." }, { status: 400 });
  }

  const result = await prisma.campaign.updateMany({
    where: { id: { in: campaignIds } },
    data: { clientId: null, assignmentStatus: "UNASSIGNED" },
  });

  return NextResponse.json({
    success: true,
    message: `${result.count} campaign(s) unassigned.`,
    updatedCount: result.count,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const unassignedOnly = searchParams.get("unassignedOnly") === "true";
  const search        = searchParams.get("search") ?? "";
  const status        = searchParams.get("status") ?? "";
  const objective     = searchParams.get("objective") ?? "";

  const campaigns = await prisma.campaign.findMany({
    where: {
      ...(unassignedOnly ? { assignmentStatus: "UNASSIGNED" } : {}),
      ...(search ? { name: { contains: search } } : {}),
      ...(status ? { status: status as any } : {}),
      ...(objective ? { marketingGoal: objective as any } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      status: true,
      marketingGoal: true,
      platform: true,
      budget: true,
      startDate: true,
      endDate: true,
      assignmentStatus: true,
      externalCampaignId: true,
      clientId: true,
      client: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ success: true, data: campaigns });
}

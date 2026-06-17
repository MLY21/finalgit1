import { NextRequest, NextResponse } from "next/server";
import type { BusinessType, ClientStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

const businessTypeMap: Record<string, BusinessType> = {
  "E-commerce": "E_COMMERCE",
  "Restaurant": "RESTAURANT",
  "Clinic": "CLINIC",
  "Education": "EDUCATION",
  "Real Estate": "REAL_ESTATE",
  "Other": "OTHER",
};

const businessTypeDisplayMap: Record<string, string> = {
  E_COMMERCE: "E-commerce",
  RESTAURANT: "Restaurant",
  CLINIC: "Clinic",
  EDUCATION: "Education",
  REAL_ESTATE: "Real Estate",
  OTHER: "Other",
};

const statusDisplayMap: Record<string, string> = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  SUSPENDED: "suspended",
};

async function getAdminAndClient(
  id: string
): Promise<
  | { error: NextResponse }
  | { admin: { id: string; role: string }; client: Awaited<ReturnType<typeof prisma.client.findUnique>> }
> {
  const admin = await getAuthUser();
  if (!admin || admin.role !== "ADMIN") {
    return {
      error: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }),
    };
  }

  const client = await prisma.client.findFirst({
    where: { id, adminId: admin.id },
  });

  if (!client) {
    return {
      error: NextResponse.json({ success: false, message: "Client not found" }, { status: 404 }),
    };
  }

  return { admin, client };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getAdminAndClient(id);
  if ("error" in result) return result.error;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          mustChangePassword: true,
          createdAt: true,
        },
      },
      socialPages: {
        include: {
          campaigns: {
            orderBy: { createdAt: "desc" },
            include: {
              performancePoints: {
                orderBy: { date: "asc" },
                take: 30,
              },
            },
          },
        },
      },
      campaigns: {
        where:  { assignmentStatus: "MANUAL_ASSIGNED" },
        orderBy: { createdAt: "desc" },
        include: {
          performancePoints: { orderBy: { date: "asc" }, take: 30 },
        },
      },
      activityLogs: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!client) {
    return NextResponse.json({ success: false, message: "Client not found" }, { status: 404 });
  }

  const linkedPage = client.socialPages.find((p) => p.platform === "META") ?? null;

  const pageLinkedCampaigns   = client.socialPages.flatMap((p) => p.campaigns);
  const manualCampaigns       = client.campaigns ?? [];
  const allCampaignIds        = new Set(pageLinkedCampaigns.map((c) => c.id));
  const mergedExtra           = manualCampaigns.filter((c) => !allCampaignIds.has(c.id));
  const allCampaigns          = [...pageLinkedCampaigns, ...mergedExtra];

  const totalBudget = allCampaigns.reduce(
    (sum, c) => sum + Number(c.budget),
    0
  );

  const totalSpend = allCampaigns.flatMap((c) => c.performancePoints).reduce(
    (sum, p) => sum + Number(p.spend),
    0
  );

  return NextResponse.json({
    success: true,
    data: {
      id: client.id,
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      businessType: businessTypeDisplayMap[client.businessType] ?? client.businessType,
      status: statusDisplayMap[client.status] ?? client.status.toLowerCase(),
      notes: client.notes ?? "",
      avatarInitials: client.avatarInitials,
      createdAt: client.createdAt.toISOString(),
      user: client.user ?? null,
      campaigns: allCampaigns.map((c) => ({
        id: c.id,
        name: c.name,
        platform: c.platform.toLowerCase(),
        status: c.status.toLowerCase(),
        budget: Number(c.budget),
        spent: c.performancePoints.reduce((s, p) => s + Number(p.spend), 0),
        performance:
          c.performancePoints.length > 0
            ? Math.round(
                (c.performancePoints[c.performancePoints.length - 1].clicks /
                  Math.max(
                    c.performancePoints[c.performancePoints.length - 1].impressions,
                    1
                  )) *
                  100
              )
            : 0,
        date: c.startDate.toISOString().split("T")[0],
        performanceSeries: c.performancePoints.map((p) => ({
          date: p.date.toISOString().split("T")[0],
          clicks: p.clicks,
          impressions: p.impressions,
          spend: Number(p.spend),
        })),
      })),
      activityLogs: client.activityLogs.map((a) => ({
        id: a.id,
        type: a.type,
        description: a.description,
        timestamp: a.createdAt.toISOString(),
      })),
      totalBudget,
      totalSpend,
      campaignsCount: allCampaigns.length,
      facebookPage: linkedPage
        ? { id: linkedPage.id, name: linkedPage.name, externalPageId: linkedPage.externalPageId }
        : null,
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getAdminAndClient(id);
  if ("error" in result) return result.error;

  const body = await request.json();
  const { name, company, email, phone, businessType, status, notes, socialPageId } = body;

  if (!name || !company || !email) {
    return NextResponse.json(
      { success: false, message: "Name, company, and email are required" },
      { status: 400 }
    );
  }

  const mappedBusinessType: BusinessType = businessTypeMap[businessType] ?? "OTHER";
  const mappedStatus: ClientStatus = (status?.toUpperCase() as ClientStatus) ?? "PENDING";

  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  await prisma.$transaction(async (tx) => {
    await tx.client.update({
      where: { id },
      data: {
        name,
        company,
        email,
        phone: phone ?? "",
        businessType: mappedBusinessType,
        status: mappedStatus,
        notes: notes || null,
        avatarInitials: initials,
      },
    });

    const linkedUser = await tx.user.findFirst({ where: { clientId: id } });
    if (linkedUser) {
      await tx.user.update({
        where: { id: linkedUser.id },
        data: { name, email },
      });
    }

    if (socialPageId !== undefined) {
      await tx.socialPage.updateMany({
        where: { clientId: id },
        data:  { clientId: null },
      });
      if (socialPageId) {
        await tx.socialPage.update({
          where: { id: socialPageId },
          data:  { clientId: id },
        });
      }
    }
  });

  return NextResponse.json({ success: true, message: "Client updated successfully" });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await getAdminAndClient(id);
  if ("error" in result) return result.error;

  const campaignCount = await prisma.campaign.count({
    where: { socialPage: { clientId: id } },
  });

  if (campaignCount > 0) {
    return NextResponse.json(
      {
        success: false,
        message: `Cannot delete client: they have ${campaignCount} active campaign(s). Remove the campaigns first.`,
      },
      { status: 409 }
    );
  }

  await prisma.$transaction(async (tx) => {
    const linkedUser = await tx.user.findFirst({ where: { clientId: id } });

    await tx.client.delete({ where: { id } });

    if (linkedUser) {
      await tx.user.delete({ where: { id: linkedUser.id } });
    }
  });

  return NextResponse.json({ success: true, message: "Client deleted successfully" });
}

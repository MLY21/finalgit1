import { NextRequest, NextResponse } from "next/server";
import type { BusinessType, ClientStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

function generateTempPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const special = "#@$!";
  const all = upper + lower + digits;
  let pass = "Cli-";
  for (let i = 0; i < 7; i++) {
    pass += all[Math.floor(Math.random() * all.length)];
  }
  pass += special[Math.floor(Math.random() * special.length)];
  return pass;
}

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

export async function GET() {
  const user = await getAuthUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const clients = await prisma.client.findMany({
    where: { adminId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      socialPages: {
        include: {
          _count: { select: { campaigns: true } },
        },
      },
    },
  });

  const result = clients.map((client) => ({
    id: client.id,
    name: client.name,
    company: client.company,
    email: client.email,
    phone: client.phone,
    businessType: businessTypeDisplayMap[client.businessType] ?? client.businessType,
    status: statusDisplayMap[client.status] ?? client.status.toLowerCase(),
    notes: client.notes ?? "",
    avatarInitials: client.avatarInitials,
    createdAt: client.createdAt.toISOString().split("T")[0],
    campaignsCount: client.socialPages.reduce(
      (sum, page) => sum + page._count.campaigns,
      0
    ),
    totalBudget: 0,
    totalRevenue: 0,
  }));

  return NextResponse.json({ success: true, data: result });
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

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

  const tempPassword = generateTempPassword();
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const { client, userRecord } = await prisma.$transaction(async (tx) => {
    const newClient = await tx.client.create({
      data: {
        name,
        company,
        email,
        phone: phone ?? "",
        businessType: mappedBusinessType,
        status: mappedStatus,
        notes: notes || null,
        avatarInitials: initials,
        adminId: user.id,
      },
    });

    const newUser = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT",
        avatarInitials: initials,
        mustChangePassword: true,
        clientId: newClient.id,
      },
    });

    if (socialPageId) {
      await tx.socialPage.update({
        where: { id: socialPageId },
        data:  { clientId: newClient.id },
      });
    }

    return { client: newClient, userRecord: newUser };
  });

  const { password: _password, ...userWithoutPassword } = userRecord;

  return NextResponse.json(
    {
      success: true,
      message: "Client and login account created successfully",
      data: {
        client,
        user: userWithoutPassword,
        temporaryPassword: tempPassword,
      },
    },
    { status: 201 }
  );
}

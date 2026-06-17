import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: { client: true },
  });

  if (!userData) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  const { password: _password, ...rest } = userData;

  return NextResponse.json({ success: true, data: rest });
}

export async function PUT(request: NextRequest) {
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { name, email, phone, company } = await request.json();

  if (!name || !email) {
    return NextResponse.json(
      { success: false, message: "Name and email are required" },
      { status: 400 }
    );
  }

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { clientId: true },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { name, email },
  });

  if (userData?.clientId) {
    await prisma.client.update({
      where: { id: userData.clientId },
      data: {
        ...(phone !== undefined && { phone }),
        ...(company !== undefined && { company }),
        name,
        email,
      },
    });
  }

  return NextResponse.json({ success: true, message: "Profile updated successfully" });
}

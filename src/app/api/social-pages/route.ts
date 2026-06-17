import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const pages = await prisma.socialPage.findMany({
    where:   { platform: "META" },
    orderBy: { name: "asc" },
    select:  { id: true, name: true, externalPageId: true, clientId: true },
  });

  return NextResponse.json({ success: true, data: pages });
}

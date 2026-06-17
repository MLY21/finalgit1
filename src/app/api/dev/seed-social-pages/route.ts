import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PAGES = [
  { name: "Libya Store",                     externalPageId: "119750891218743" },
  { name: "الحرف اليدوية",                   externalPageId: "107147217591227" },
  { name: "استراحات للايجار",                externalPageId: "100429745477537" },
  { name: "Super Cars لكماليات السيارات",    externalPageId: "102181329377701" },
];

export async function POST() {
  const results = [];

  for (const page of PAGES) {
    const record = await prisma.socialPage.upsert({
      where:  { externalPageId: page.externalPageId },
      update: { name: page.name },
      create: { name: page.name, platform: "META", externalPageId: page.externalPageId, isActive: true },
    });
    results.push({ id: record.id, name: record.name, externalPageId: record.externalPageId });
  }

  return NextResponse.json({ success: true, message: `${results.length} pages seeded.`, data: results });
}

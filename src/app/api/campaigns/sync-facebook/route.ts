import { NextResponse } from "next/server";
import { fetchFacebookCandidates } from "@/lib/facebook-sync";
import { getAuthUser } from "@/lib/auth";

export async function POST() {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await fetchFacebookCandidates();
    return NextResponse.json({ success: true, message: result.message, data: result });
  } catch (error: any) {
    console.error("[sync-facebook] Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message ?? "Facebook sync failed." },
      { status: 500 }
    );
  }
}

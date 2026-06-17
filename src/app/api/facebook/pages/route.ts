import { NextResponse } from "next/server";

const GRAPH_VERSION = "v25.0";

export async function GET() {
  const token = process.env.FACEBOOK_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "FACEBOOK_ACCESS_TOKEN not configured." },
      { status: 500 }
    );
  }

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/me/accounts?fields=id,name,picture&access_token=${token}`,
    { cache: "no-store" }
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { success: false, message: data?.error?.message ?? "Failed to fetch Facebook pages." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, data: data.data ?? [] });
}

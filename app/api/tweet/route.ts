import { NextRequest, NextResponse } from "next/server";
import { extractId, fetchTweet } from "@/lib/twitter";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json body" }, { status: 400 });
  }
  const id = extractId(body.url || "");
  if (!id)
    return NextResponse.json(
      { error: "invalid tweet url. expected x.com/<user>/status/<id>" },
      { status: 400 },
    );
  try {
    const data = await fetchTweet(id);
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

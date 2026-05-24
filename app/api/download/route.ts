import { NextRequest } from "next/server";

export const runtime = "nodejs";

const ALLOWED_HOSTS = new Set([
  "video.twimg.com",
  "video-cf.twimg.com",
  "pbs.twimg.com",
]);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const filename = (searchParams.get("filename") || "yoink.mp4").replace(/["\r\n]/g, "");
  if (!url) return new Response("missing url", { status: 400 });
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new Response("bad url", { status: 400 });
  }
  if (!ALLOWED_HOSTS.has(parsed.hostname))
    return new Response("host not allowed", { status: 403 });

  const upstream = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0" },
  });
  if (!upstream.ok || !upstream.body)
    return new Response(`upstream ${upstream.status}`, { status: 502 });

  const headers = new Headers();
  headers.set("content-type", upstream.headers.get("content-type") || "video/mp4");
  headers.set("content-disposition", `attachment; filename="${filename}"`);
  const cl = upstream.headers.get("content-length");
  if (cl) headers.set("content-length", cl);
  headers.set("cache-control", "no-store");

  return new Response(upstream.body, { headers });
}

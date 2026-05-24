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
  if (!url) return new Response("missing url", { status: 400 });
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return new Response("bad url", { status: 400 });
  }
  if (!ALLOWED_HOSTS.has(parsed.hostname))
    return new Response("host not allowed", { status: 403 });

  const range = req.headers.get("range") || undefined;
  const upstream = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      ...(range ? { range } : {}),
    },
  });
  if (!upstream.body)
    return new Response(`upstream ${upstream.status}`, { status: 502 });

  const headers = new Headers();
  const passthrough = [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
    "etag",
    "last-modified",
  ];
  for (const h of passthrough) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }
  if (!headers.has("accept-ranges")) headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "public, max-age=3600");

  return new Response(upstream.body, { status: upstream.status, headers });
}

export async function HEAD(req: NextRequest) {
  return GET(req);
}

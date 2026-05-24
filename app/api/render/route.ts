import { NextRequest } from "next/server";
import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { extractId } from "@/lib/twitter";

export const runtime = "nodejs";
export const maxDuration = 300;

const PROJECT_ROOT = path.resolve(process.cwd());
const RENDER_SCRIPT = path.join(PROJECT_ROOT, "scripts", "render.sh");

function runRender(tweetUrl: string, outPath: string, tmpDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = spawn(RENDER_SCRIPT, [], {
      cwd: PROJECT_ROOT,
      env: {
        ...process.env,
        TWEET_URL: tweetUrl,
        OUT_PATH: outPath,
        TMP_DIR: tmpDir,
        KEEP_TMP: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stderr = "";
    p.stderr.on("data", (d) => {
      stderr += d.toString();
    });
    p.stdout.on("data", () => {});
    p.on("error", reject);
    p.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`render exit ${code}: ${stderr.slice(-1200)}`));
    });
  });
}

async function handle(url: string | null) {
  if (!url) return new Response("missing url", { status: 400 });
  const id = extractId(url);
  if (!id) return new Response("invalid tweet url", { status: 400 });

  try {
    await fs.access(RENDER_SCRIPT);
  } catch {
    return new Response(`render script missing at ${RENDER_SCRIPT}`, { status: 500 });
  }

  const slug = crypto.randomBytes(4).toString("hex");
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), `yoink-${id}-${slug}-`));
  const outPath = path.join(tmpDir, "out.mp4");

  try {
    await runRender(url, outPath, tmpDir);
    const buf = await fs.readFile(outPath);
    return new Response(buf as unknown as BodyInit, {
      headers: {
        "content-type": "video/mp4",
        "content-disposition": `attachment; filename="yoink-${id}-with-post.mp4"`,
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "render failed";
    return new Response(msg, { status: 500 });
  } finally {
    fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  return handle(searchParams.get("url"));
}

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("invalid json", { status: 400 });
  }
  return handle(body.url || null);
}

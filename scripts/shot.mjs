import { chromium } from "playwright";
import fs from "node:fs";

const [, , url, outDir] = process.argv;
if (!url || !outDir) {
  console.error("usage: node shot.mjs <tweet-url> <out-dir>");
  process.exit(1);
}

const idMatch = url.match(/status\/(\d+)/);
if (!idMatch) {
  console.error("invalid tweet url");
  process.exit(1);
}
const id = idMatch[1];
const token = ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");
const api = `https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=${token}&lang=en`;

const res = await fetch(api, { headers: { "user-agent": "Mozilla/5.0" } });
if (!res.ok) {
  console.error(`syndication ${res.status}`);
  process.exit(1);
}
const t = await res.json();

const name = t.user.name;
const handle = t.user.screen_name;
const avatar = (t.user.profile_image_url_https || "").replace("_normal", "_x96");
const verified = !!(t.user.verified || t.user.is_blue_verified || t.user.verified_type);
const text = (t.text || "").replace(/https?:\/\/t\.co\/\S+/g, "").trim();
const media = (t.mediaDetails || [])[0];
const aspect = media ? media.original_info.width / media.original_info.height : 16 / 9;

function esc(s) {
  return (s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

const verifiedSvg = verified
  ? `<svg class="verified" viewBox="0 0 22 22"><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"/></svg>`
  : "";

const html = `<!doctype html><html><head><meta charset="utf-8"/>
<style>
  html,body{margin:0;padding:0;background:transparent}
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased}
  .wrap{padding:32px;width:640px;box-sizing:border-box;background:transparent}
  .card{background:#15202b;border-radius:24px;padding:18px 22px 22px;color:#e7e9ea;box-shadow:0 8px 40px rgba(0,0,0,.45)}
  header{display:flex;align-items:center;gap:12px}
  .avatar{width:48px;height:48px;border-radius:50%}
  .who{flex:1;line-height:1.15}
  .name-row{display:flex;align-items:center;gap:4px;font-weight:800;font-size:17px}
  .verified{width:18px;height:18px;fill:#1d9bf0}
  .handle{color:#71767b;font-size:15px;margin-top:2px}
  .xlogo{width:24px;height:24px;fill:#e7e9ea;opacity:.95}
  .text{font-size:22px;line-height:1.32;margin:14px 2px 14px;white-space:pre-wrap}
  .media{width:100%;aspect-ratio:${aspect};background:#000;border-radius:18px;overflow:hidden;position:relative}
  .media img{width:100%;height:100%;object-fit:cover;display:block}
</style></head><body>
<div class="wrap"><div class="card" id="card">
  <header>
    <img class="avatar" src="${avatar}"/>
    <div class="who">
      <div class="name-row">${esc(name)}${verifiedSvg}</div>
      <div class="handle">@${esc(handle)}</div>
    </div>
    <svg class="xlogo" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  </header>
  <div class="text">${esc(text)}</div>
  <div class="media" id="media">${media ? `<img src="${media.media_url_https}?format=jpg&name=large"/>` : ""}</div>
</div></div>
</body></html>`;

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 800, height: 1400 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.setContent(html, { waitUntil: "networkidle" });

const card = await p.$("#card");
const cardBox = await card.boundingBox();
const mediaEl = await p.$("#media");
const mediaBox = await mediaEl.boundingBox();

await card.screenshot({ path: `${outDir}/card.png`, omitBackground: true });

const dsf = 2;
const local = {
  x: Math.round((mediaBox.x - cardBox.x) * dsf),
  y: Math.round((mediaBox.y - cardBox.y) * dsf),
  w: Math.round(mediaBox.width * dsf),
  h: Math.round(mediaBox.height * dsf),
};
const cardSize = {
  w: Math.round(cardBox.width * dsf),
  h: Math.round(cardBox.height * dsf),
};

const maskDataUrl = await p.evaluate(
  ({ w, h, r }) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(w, 0, w, h, r);
    ctx.arcTo(w, h, 0, h, r);
    ctx.arcTo(0, h, 0, 0, r);
    ctx.arcTo(0, 0, w, 0, r);
    ctx.closePath();
    ctx.fill();
    return c.toDataURL("image/png");
  },
  { w: local.w, h: local.h, r: 36 },
);
fs.writeFileSync(`${outDir}/mask.png`, Buffer.from(maskDataUrl.split(",")[1], "base64"));

fs.writeFileSync(`${outDir}/bbox.json`, JSON.stringify({ media: local, card: cardSize }));
await b.close();

export type Variant = {
  label: string;
  bitrate: number;
  url: string;
  width: number;
  height: number;
};

export type TweetMedia = {
  poster: string;
  width: number;
  height: number;
  durationSec: number;
  variants: Variant[];
};

export type TweetData = {
  id: string;
  name: string;
  handle: string;
  verified: boolean;
  avatar: string;
  time: string;
  text: string;
  stats: { replies: number; reposts: number; likes: number; views: number };
  media?: TweetMedia;
};

export function extractId(url: string): string | null {
  const m = url.match(/status\/(\d+)/);
  return m ? m[1] : null;
}

function token(id: string): string {
  return ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");
}

function labelForHeight(h: number): string {
  if (h >= 1080) return "1080p";
  if (h >= 720) return "720p";
  if (h >= 480) return "480p";
  if (h >= 360) return "360p";
  return `${h}p`;
}

function ratioFmt(w: number, h: number): string {
  const g = gcd(w, h);
  return `${w / g}:${h / g}`;
}
function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

export function aspectRatioOf(media: TweetMedia): string {
  return ratioFmt(media.width, media.height);
}

export function durationFmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function sizeEstimate(bitrate: number, durationSec: number): string {
  const bytes = (bitrate / 8) * durationSec;
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

export async function fetchTweet(id: string): Promise<TweetData> {
  const url = `https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=${token(id)}&lang=en`;
  const res = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`syndication ${res.status}`);
  const t = await res.json();

  const m = (t.mediaDetails || [])[0];
  let media: TweetMedia | undefined;
  if (m && m.video_info) {
    const seen = new Set<string>();
    const variants: Variant[] = (m.video_info.variants as Array<{ content_type: string; bitrate?: number; url: string }>)
      .filter((v) => v.content_type === "video/mp4")
      .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))
      .map((v): Variant => {
        const wh = v.url.match(/\/(\d+)x(\d+)\//) || [];
        const w = parseInt(wh[1] || "0", 10) || m.original_info.width;
        const h = parseInt(wh[2] || "0", 10) || m.original_info.height;
        return {
          label: labelForHeight(h),
          bitrate: v.bitrate || 0,
          url: v.url,
          width: w,
          height: h,
        };
      })
      .filter((v) => {
        if (seen.has(v.label)) return false;
        seen.add(v.label);
        return true;
      });

    media = {
      poster: m.media_url_https,
      width: m.original_info.width,
      height: m.original_info.height,
      durationSec: (m.video_info.duration_millis || 0) / 1000,
      variants,
    };
  }

  const stats = {
    replies: t.conversation_count || 0,
    reposts: t.retweet_count || 0,
    likes: t.favorite_count || 0,
    views: t.view_count || 0,
  };

  const created = new Date(t.created_at);
  const time = created.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

  const text = (t.text || "")
    .replace(/https?:\/\/t\.co\/\S+\s*$/g, "")
    .trim();

  return {
    id,
    name: t.user.name,
    handle: t.user.screen_name,
    verified: !!(t.user.verified || t.user.is_blue_verified),
    avatar: (t.user.profile_image_url_https || "").replace("_normal", "_x96"),
    time,
    text,
    stats,
    media,
  };
}

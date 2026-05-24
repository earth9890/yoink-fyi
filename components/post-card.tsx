"use client";

import Image from "next/image";
import { Icon } from "@/components/icon";
import { Pill, Dot, Crosshair } from "@/components/atoms";
import { aspectRatioOf, durationFmt, type TweetData } from "@/lib/twitter";

interface VideoSurfaceProps {
  posterUrl: string;
  videoUrl: string;
}

function VideoSurface({ posterUrl, videoUrl }: VideoSurfaceProps) {
  const proxied = `/api/stream?url=${encodeURIComponent(videoUrl)}`;
  return (
    <video
      controls
      playsInline
      preload="metadata"
      poster={posterUrl}
      src={proxied}
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        borderRadius: "var(--r)",
        border: "1px solid var(--line)",
        background: "#000",
      }}
    />
  );
}

interface PostCardProps {
  tweet: TweetData;
  accent: string;
}

export function PostCard({ tweet, accent }: PostCardProps) {
  const media = tweet.media;
  const topVariant = media?.variants[0];
  const ratio = media ? aspectRatioOf(media) : "16:9";
  const handleUrl = `https://x.com/${tweet.handle}/status/${tweet.id}`;

  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: "var(--r-lg)",
        background: "linear-gradient(180deg, var(--ink-2) 0%, var(--ink-3) 100%)",
        padding: 18,
        position: "relative",
      }}
    >
      <Crosshair size={10} style={{ position: "absolute", top: -5, left: -5 }} />
      <Crosshair size={10} style={{ position: "absolute", top: -5, right: -5 }} />
      <Crosshair size={10} style={{ position: "absolute", bottom: -5, left: -5 }} />
      <Crosshair size={10} style={{ position: "absolute", bottom: -5, right: -5 }} />

      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}
      >
        <div className="row" style={{ gap: 12, alignItems: "center" }}>
          {tweet.avatar ? (
            <Image
              src={tweet.avatar}
              alt={tweet.name}
              width={44}
              height={44}
              unoptimized
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "1px solid var(--line)",
                flexShrink: 0,
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(140deg, #f5f5f4 0%, #b3b3b0 100%)",
                border: "1px solid var(--line)",
                flexShrink: 0,
              }}
            />
          )}
          <div className="col" style={{ gap: 2 }}>
            <div className="row" style={{ gap: 6 }}>
              <span style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>{tweet.name}</span>
              {tweet.verified && (
                <span style={{ color: accent }}>
                  <Icon name="verified" size={13} />
                </span>
              )}
            </div>
            <a
              href={handleUrl}
              target="_blank"
              rel="noreferrer"
              className="mono"
              style={{ fontSize: 11, color: "var(--mute)", textDecoration: "none" }}
            >
              @{tweet.handle} · {tweet.time}
            </a>
          </div>
        </div>
        <Pill tone="line">
          <Dot tone="acid" />
          &nbsp;{media ? "video detected" : "no video"}
        </Pill>
      </div>

      {tweet.text && (
        <p
          style={{
            margin: "0 0 16px",
            fontSize: 16,
            lineHeight: 1.4,
            letterSpacing: "-0.005em",
            color: "var(--paper)",
            whiteSpace: "pre-wrap",
          }}
        >
          {tweet.text}
        </p>
      )}

      {media && topVariant && (
        <VideoSurface posterUrl={media.poster} videoUrl={topVariant.url} />
      )}

      <div
        className="row"
        style={{ justifyContent: "space-between", marginTop: 14, gap: 8, flexWrap: "wrap" }}
      >
        <div className="row" style={{ gap: 18, color: "var(--mute)" }}>
          <span className="row mono" style={{ gap: 5, fontSize: 11.5 }}>
            <Icon name="reply" size={12} /> {tweet.stats.replies.toLocaleString()}
          </span>
          <span className="row mono" style={{ gap: 5, fontSize: 11.5 }}>
            <Icon name="repost" size={12} /> {tweet.stats.reposts.toLocaleString()}
          </span>
          <span className="row mono" style={{ gap: 5, fontSize: 11.5 }}>
            <Icon name="heart" size={12} /> {tweet.stats.likes.toLocaleString()}
          </span>
          {tweet.stats.views > 0 && (
            <span className="row mono" style={{ gap: 5, fontSize: 11.5 }}>
              <Icon name="eye" size={12} /> {(tweet.stats.views / 1000).toFixed(0)}k
            </span>
          )}
        </div>
        {media && (
          <div className="row" style={{ gap: 6 }}>
            <Pill tone="mute">{durationFmt(media.durationSec)}</Pill>
            <Pill tone="mute">{ratio}</Pill>
            <Pill tone="mute">{topVariant?.label}</Pill>
          </div>
        )}
      </div>
    </div>
  );
}

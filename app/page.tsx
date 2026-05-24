"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/top-bar";
import { Hero } from "@/components/hero";
import { PostCard } from "@/components/post-card";
import { Picker, type Mode } from "@/components/picker";
import { EmptyPaste } from "@/components/empty-paste";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/icon";
import { Pill, Dot } from "@/components/atoms";
import { durationFmt, type TweetData } from "@/lib/twitter";

const ACCENT = "#d6ff3e";

export default function Page() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [errMsg, setErrMsg] = useState<string>("");
  const [tweet, setTweet] = useState<TweetData | null>(null);
  const [selectedVariantUrl, setSelectedVariantUrl] = useState<string>("");
  const [mode, setMode] = useState<Mode>("direct");
  const [downloading, setDownloading] = useState(false);
  const [renderProgress, setRenderProgress] = useState<string>("");

  useEffect(() => {
    document.documentElement.style.setProperty("--acid", ACCENT);
  }, []);

  const onSubmit = async () => {
    if (!url.trim() || status === "loading") return;
    setStatus("loading");
    setErrMsg("");
    setTweet(null);
    try {
      const res = await fetch("/api/tweet", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrMsg(data.error || `error ${res.status}`);
        setStatus("error");
        return;
      }
      if (!data.media || !data.media.variants.length) {
        setErrMsg("no video found in that tweet");
        setTweet(data);
        setStatus("error");
        return;
      }
      setTweet(data);
      setSelectedVariantUrl(data.media.variants[0].url);
      setStatus("ready");
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : "network error");
      setStatus("error");
    }
  };

  const triggerBrowserDownload = (href: string, filename: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const onDownload = async () => {
    if (!tweet || !tweet.media || !selectedVariantUrl) return;
    const variant = tweet.media.variants.find((v) => v.url === selectedVariantUrl);
    if (!variant) return;

    if (mode === "direct") {
      const filename = `yoink-${tweet.handle}-${tweet.id}-${variant.label}.mp4`;
      const proxyUrl = `/api/download?url=${encodeURIComponent(variant.url)}&filename=${encodeURIComponent(filename)}`;
      triggerBrowserDownload(proxyUrl, filename);
      return;
    }

    // with-post: render then download
    setDownloading(true);
    setRenderProgress("rendering…");
    try {
      const tweetUrl = `https://x.com/${tweet.handle}/status/${tweet.id}`;
      const res = await fetch(`/api/render?url=${encodeURIComponent(tweetUrl)}`);
      if (!res.ok) {
        const text = await res.text();
        setErrMsg(`render failed: ${text.slice(0, 200)}`);
        setDownloading(false);
        setRenderProgress("");
        return;
      }
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      triggerBrowserDownload(objUrl, `yoink-${tweet.handle}-${tweet.id}-with-post.mp4`);
      setTimeout(() => URL.revokeObjectURL(objUrl), 60_000);
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : "render failed");
    } finally {
      setDownloading(false);
      setRenderProgress("");
    }
  };

  const showResult = status === "ready" && tweet && tweet.media;

  return (
    <div>
      <TopBar />
      <Hero
        url={url}
        setUrl={setUrl}
        onSubmit={onSubmit}
        status={status === "loading" ? "loading" : status === "ready" ? "ready" : "idle"}
      />

      <section style={{ maxWidth: 1240, margin: "24px auto 0", padding: "0 28px" }}>
        {status === "idle" && <EmptyPaste />}

        {status === "loading" && (
          <div
            style={{
              border: "1px dashed var(--line-2)",
              borderRadius: "var(--r-lg)",
              padding: "56px 28px",
              textAlign: "center",
              background: "rgba(14,14,16,0.5)",
              color: "var(--paper-2)",
            }}
          >
            <span
              className="spin"
              style={{
                display: "inline-block",
                width: 18,
                height: 18,
                border: "1.6px solid var(--paper)",
                borderTopColor: "transparent",
                borderRadius: "50%",
                marginBottom: 14,
              }}
            />
            <div style={{ fontSize: 18 }}>fetching tweet…</div>
            <div
              className="mono"
              style={{ fontSize: 11, color: "var(--mute)", marginTop: 6 }}
            >
              syndication api
            </div>
          </div>
        )}

        {status === "error" && (
          <div
            style={{
              border: "1px solid oklch(70% 0.18 28)",
              borderRadius: "var(--r-lg)",
              padding: "28px 24px",
              background: "rgba(120,30,30,0.08)",
              color: "var(--paper)",
            }}
          >
            <div className="row" style={{ gap: 10, marginBottom: 8 }}>
              <Icon name="x" size={16} style={{ color: "oklch(75% 0.18 28)" }} />
              <span style={{ fontWeight: 600 }}>could not yoink</span>
            </div>
            <div className="mono" style={{ fontSize: 12, color: "var(--mute)" }}>
              {errMsg}
            </div>
            {tweet && (
              <div style={{ marginTop: 18 }}>
                <PostCard tweet={tweet} accent={ACCENT} />
              </div>
            )}
          </div>
        )}

        {showResult && tweet && tweet.media && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: 24,
              alignItems: "flex-start",
            }}
          >
            <div className="col" style={{ gap: 14 }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <div className="row" style={{ gap: 10 }}>
                  <Pill tone="acid">
                    <Dot tone="paper" style={{ background: "var(--acid-ink)" }} />
                    &nbsp;ready
                  </Pill>
                  <span className="micro">
                    {tweet.media.variants.length} streams · {durationFmt(tweet.media.durationSec)}
                  </span>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  <button
                    className="row mono"
                    onClick={() => {
                      navigator.clipboard?.writeText(selectedVariantUrl);
                    }}
                    style={{
                      gap: 6,
                      padding: "6px 10px",
                      border: "1px solid var(--line)",
                      borderRadius: "var(--r-pill)",
                      fontSize: 11,
                      color: "var(--paper-2)",
                    }}
                  >
                    <Icon name="link" size={11} /> copy stream url
                  </button>
                  <button
                    className="row mono"
                    onClick={() => {
                      setStatus("idle");
                      setUrl("");
                      setTweet(null);
                    }}
                    style={{
                      gap: 6,
                      padding: "6px 10px",
                      border: "1px solid var(--line)",
                      borderRadius: "var(--r-pill)",
                      fontSize: 11,
                      color: "var(--paper-2)",
                    }}
                  >
                    <Icon name="x" size={11} /> clear
                  </button>
                </div>
              </div>

              <PostCard tweet={tweet} accent={ACCENT} />

              <div
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "var(--r)",
                  background: "var(--ink-2)",
                  padding: "14px 18px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 18,
                }}
              >
                <div className="col" style={{ gap: 4 }}>
                  <span className="micro">duration</span>
                  <span className="mono" style={{ fontSize: 13 }}>
                    00:00 → {durationFmt(tweet.media.durationSec)}
                  </span>
                </div>
                <div className="col" style={{ gap: 4 }}>
                  <span className="micro">source</span>
                  <span className="mono" style={{ fontSize: 13 }}>
                    @{tweet.handle} · {tweet.id.slice(0, 12)}…
                  </span>
                </div>
                <div className="col" style={{ gap: 4 }}>
                  <span className="micro">filename</span>
                  <span
                    className="mono"
                    style={{
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    yoink-{tweet.handle}-
                    {mode === "with-post" ? "with-post" : selectedVariantUrl ? "video" : ""}.mp4
                  </span>
                </div>
              </div>

              {renderProgress && (
                <div
                  className="mono"
                  style={{ fontSize: 12, color: "var(--mute)", padding: "4px 8px" }}
                >
                  {renderProgress}
                </div>
              )}
              {errMsg && status === "ready" && (
                <div
                  className="mono"
                  style={{ fontSize: 12, color: "oklch(75% 0.18 28)", padding: "4px 8px" }}
                >
                  {errMsg}
                </div>
              )}
            </div>

            <Picker
              variants={tweet.media.variants}
              durationSec={tweet.media.durationSec}
              selectedVariantUrl={selectedVariantUrl}
              setSelectedVariantUrl={setSelectedVariantUrl}
              mode={mode}
              setMode={setMode}
              onDownload={onDownload}
              downloading={downloading}
            />
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

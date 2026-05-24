"use client";

import { Icon } from "@/components/icon";
import { Hairline } from "@/components/atoms";
import { sizeEstimate, type Variant } from "@/lib/twitter";

interface VariantRowProps {
  v: Variant;
  durationSec: number;
  selected: boolean;
  onSelect: () => void;
}

function VariantRow({ v, durationSec, selected, onSelect }: VariantRowProps) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: "100%",
        textAlign: "left",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto auto",
        alignItems: "center",
        gap: 14,
        padding: "14px 14px",
        borderRadius: "var(--r)",
        border: `1px solid ${selected ? "var(--paper)" : "var(--line)"}`,
        background: selected ? "var(--paper)" : "transparent",
        color: selected ? "var(--ink)" : "var(--paper)",
        transition: "all 120ms ease",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: `1.5px solid ${selected ? "var(--ink)" : "var(--line-2)"}`,
          display: "grid",
          placeItems: "center",
        }}
      >
        {selected && (
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--ink)" }} />
        )}
      </div>
      <div className="col" style={{ gap: 2 }}>
        <span style={{ fontWeight: 600, letterSpacing: "-0.01em", fontSize: 14.5 }}>
          {v.label}
        </span>
        <span
          className="mono"
          style={{
            fontSize: 10.5,
            color: selected ? "var(--mute-2)" : "var(--mute)",
            letterSpacing: "0.04em",
          }}
        >
          .mp4 · {v.width}×{v.height} · {(v.bitrate / 1000).toFixed(0)} kbps
        </span>
      </div>
      <span
        className="mono"
        style={{ fontSize: 11.5, color: selected ? "var(--mute-2)" : "var(--mute)" }}
      >
        {sizeEstimate(v.bitrate, durationSec)}
      </span>
      <Icon name="down" size={14} style={{ opacity: 0.55 }} />
    </button>
  );
}

export type Mode = "direct" | "with-post";

interface ModeChipProps {
  title: string;
  sub: string;
  iconName: "play" | "caption";
  selected: boolean;
  onSelect: () => void;
}

function ModeChip({ title, sub, iconName, selected, onSelect }: ModeChipProps) {
  return (
    <button
      onClick={onSelect}
      style={{
        flex: "1 1 0",
        minWidth: 0,
        textAlign: "left",
        padding: "14px 14px 16px",
        border: `1px solid ${selected ? "var(--paper)" : "var(--line)"}`,
        borderRadius: "var(--r)",
        background: selected ? "rgba(245,245,244,0.04)" : "transparent",
        color: "var(--paper)",
        position: "relative",
        transition: "all 120ms ease",
      }}
    >
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            border: "1px solid var(--line-2)",
            borderRadius: 8,
            display: "grid",
            placeItems: "center",
            color: selected ? "var(--paper)" : "var(--paper-2)",
          }}
        >
          <Icon name={iconName} size={14} />
        </div>
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: `1.5px solid ${selected ? "var(--paper)" : "var(--line-2)"}`,
            display: "grid",
            placeItems: "center",
          }}
        >
          {selected && <Icon name="check" size={8} style={{ color: "var(--paper)" }} />}
        </span>
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.005em" }}>{title}</div>
      <div
        className="mono"
        style={{ fontSize: 10.5, color: "var(--mute)", marginTop: 3, letterSpacing: "0.02em" }}
      >
        {sub}
      </div>
    </button>
  );
}

interface PickerProps {
  variants: Variant[];
  durationSec: number;
  selectedVariantUrl: string;
  setSelectedVariantUrl: (url: string) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  onDownload: () => void;
  downloading: boolean;
}

export function Picker({
  variants,
  durationSec,
  selectedVariantUrl,
  setSelectedVariantUrl,
  mode,
  setMode,
  onDownload,
  downloading,
}: PickerProps) {
  const selected = variants.find((v) => v.url === selectedVariantUrl) || variants[0];
  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: "var(--r-lg)",
        background: "var(--ink-2)",
        padding: 18,
        position: "sticky",
        top: 90,
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="micro">choose quality</div>
        <div className="micro" style={{ color: "var(--paper-2)" }}>
          {variants.length} available
        </div>
      </div>
      <div className="col" style={{ gap: 6 }}>
        {variants.map((v) => (
          <VariantRow
            key={v.url}
            v={v}
            durationSec={durationSec}
            selected={v.url === selected?.url}
            onSelect={() => setSelectedVariantUrl(v.url)}
          />
        ))}
      </div>

      <Hairline />

      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="micro">download mode</div>
        <div className="micro" style={{ color: "var(--paper-2)" }}>
          {mode === "direct" ? "video only" : "with post"}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <ModeChip
          title="video only"
          sub="just the clip, original quality"
          iconName="play"
          selected={mode === "direct"}
          onSelect={() => setMode("direct")}
        />
        <ModeChip
          title="with post"
          sub="card + video composite mp4"
          iconName="caption"
          selected={mode === "with-post"}
          onSelect={() => setMode("with-post")}
        />
      </div>

      <Hairline />

      <div className="col" style={{ gap: 10 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="micro">
            {mode === "with-post" ? "render server-side" : "stream from twimg"}
          </div>
          <span className="mono" style={{ fontSize: 11, color: "var(--paper-2)" }}>
            {selected ? sizeEstimate(selected.bitrate, durationSec) : "—"}
          </span>
        </div>
        <button
          onClick={onDownload}
          disabled={downloading || !selected}
          style={{
            width: "100%",
            padding: "16px 18px",
            background: "var(--acid)",
            color: "var(--acid-ink)",
            borderRadius: "var(--r)",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            fontSize: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            opacity: downloading || !selected ? 0.6 : 1,
            cursor: downloading || !selected ? "not-allowed" : "pointer",
          }}
        >
          <span className="row" style={{ gap: 10 }}>
            {downloading ? (
              <span
                className="spin"
                style={{
                  width: 14,
                  height: 14,
                  border: "1.6px solid var(--acid-ink)",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  display: "inline-block",
                }}
              />
            ) : (
              <Icon name="down" size={16} />
            )}
            {downloading
              ? mode === "with-post"
                ? "rendering…"
                : "starting…"
              : `download ${selected?.label ?? ""}`}
          </span>
          <span className="mono" style={{ fontSize: 11, opacity: 0.7 }}>↵ enter</span>
        </button>
        <div className="row" style={{ justifyContent: "space-between", color: "var(--mute)" }}>
          <span className="micro">no watermark</span>
          <span className="micro">no email</span>
          <span className="micro">no signup</span>
        </div>
      </div>
    </div>
  );
}

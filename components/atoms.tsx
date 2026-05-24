import * as React from "react";

type PillTone = "line" | "acid" | "ink" | "mute";

interface PillProps {
  tone?: PillTone;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Pill({ tone = "line", children, style }: PillProps) {
  const map: Record<PillTone, { bg: string; bd: string; fg: string }> = {
    line: { bg: "transparent", bd: "var(--line)", fg: "var(--paper-2)" },
    acid: { bg: "var(--acid)", bd: "var(--acid)", fg: "var(--acid-ink)" },
    ink: { bg: "var(--ink-3)", bd: "var(--line-2)", fg: "var(--paper)" },
    mute: { bg: "transparent", bd: "var(--line)", fg: "var(--mute)" },
  };
  const t = map[tone] || map.line;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 9px",
        borderRadius: "var(--r-pill)",
        background: t.bg,
        border: `1px solid ${t.bd}`,
        color: t.fg,
        fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
        fontSize: 10.5,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

type DotTone = "acid" | "mute" | "paper";

interface DotProps {
  tone?: DotTone;
  size?: number;
  style?: React.CSSProperties;
}

export function Dot({ tone = "acid", size = 6, style }: DotProps) {
  const map: Record<DotTone, string> = {
    acid: "var(--acid)",
    mute: "var(--mute)",
    paper: "var(--paper)",
  };
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: map[tone] || map.acid,
        display: "inline-block",
        ...style,
      }}
    />
  );
}

interface HairlineProps {
  vertical?: boolean;
  style?: React.CSSProperties;
}

export function Hairline({ vertical = false, style }: HairlineProps) {
  return (
    <div
      style={{
        background: "var(--line)",
        ...(vertical
          ? { width: 1, alignSelf: "stretch" }
          : { height: 1, width: "100%" }),
        ...style,
      }}
    />
  );
}

interface CrosshairProps {
  size?: number;
  style?: React.CSSProperties;
}

export function Crosshair({ size = 14, style }: CrosshairProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" style={style}>
      <path d="M7 0v14M0 7h14" stroke="var(--line-2)" strokeWidth="1" />
    </svg>
  );
}

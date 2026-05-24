import { Icon } from "@/components/icon";
import { Pill } from "@/components/atoms";

export function EmptyPaste() {
  return (
    <div
      style={{
        border: "1px dashed var(--line-2)",
        borderRadius: "var(--r-lg)",
        padding: "56px 28px",
        textAlign: "center",
        background: "rgba(14,14,16,0.5)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: "1px solid var(--line-2)",
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          margin: "0 auto 18px",
        }}
      >
        <Icon name="clip" size={20} style={{ color: "var(--paper-2)" }} />
      </div>
      <div style={{ fontSize: 20, letterSpacing: "-0.015em", fontWeight: 500 }}>
        drop a tweet link up there
      </div>
      <div
        className="mono"
        style={{
          fontSize: 11,
          color: "var(--mute)",
          marginTop: 6,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        we accept x.com, twitter.com, t.co, fxtwitter, vxtwitter
      </div>
      <div
        className="row"
        style={{
          justifyContent: "center",
          marginTop: 24,
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <Pill tone="line">cmd&nbsp;+&nbsp;v anywhere</Pill>
        <Pill tone="line">⌘K to search history</Pill>
        <Pill tone="line">enter to yoink</Pill>
      </div>
    </div>
  );
}

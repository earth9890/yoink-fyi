import { Icon } from "@/components/icon";

export function Footer() {
  return (
    <footer
      style={{
        maxWidth: 1240,
        margin: "96px auto 36px",
        padding: "24px 28px 0",
        borderTop: "1px solid var(--line)",
      }}
    >
      <div
        className="row"
        style={{
          justifyContent: "space-between",
          marginTop: 24,
          flexWrap: "wrap",
          gap: 18,
        }}
      >
        <div className="row" style={{ gap: 10 }}>
          <div
            style={{
              width: 18,
              height: 18,
              border: "1px solid var(--paper)",
              borderRadius: 5,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name="logo" size={10} />
          </div>
          <span style={{ fontWeight: 600, fontSize: 13.5 }}>Yoink.fyi</span>
          <span className="micro" style={{ marginLeft: 8 }}>
            © 2026 — pull, not push
          </span>
        </div>
        <div className="row" style={{ gap: 24 }}>
          <span className="micro">terms</span>
          <span className="micro">privacy</span>
          <span className="micro">dmca</span>
          <span className="micro">status · all green</span>
        </div>
      </div>
    </footer>
  );
}

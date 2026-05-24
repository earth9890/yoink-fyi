"use client";

import { useRef } from "react";
import { Icon } from "@/components/icon";
import { Pill, Dot } from "@/components/atoms";

interface HeroProps {
  url: string;
  setUrl: (s: string) => void;
  onSubmit: () => void;
  status: "idle" | "loading" | "ready";
}

export function Hero({ url, setUrl, onSubmit, status }: HeroProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const paste = async () => {
    try {
      const t = await navigator.clipboard.readText();
      if (t) {
        setUrl(t.trim());
        inputRef.current?.focus();
      }
    } catch (e) {
      inputRef.current?.focus();
    }
  };

  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 28px 28px', textAlign: 'left' }}>
      <div className="row" style={{ gap: 10, marginBottom: 22 }}>
        <Pill><Dot />&nbsp;Live · no signup</Pill>
        <span className="micro">free for personal use</span>
      </div>
      <h1 style={{ margin: 0, fontSize: 'clamp(54px,9vw,108px)', lineHeight: 0.94, letterSpacing: '-0.045em', fontWeight: 500 }}>
        pull the&nbsp;video<br />
        out of any&nbsp;<span className="serif" style={{ fontStyle: 'italic', fontWeight: 400 }}>tweet.</span>
      </h1>
      <p style={{ maxWidth: 560, color: 'var(--mute)', fontSize: 17, lineHeight: 1.45, margin: '22px 0 36px', letterSpacing: '-0.005em' }}>
        Paste a post link. Yoink fetches every quality, plus a stitched
        version with the post baked in. No watermark, no email, no
        bullshit.
      </p>

      <div style={{ position: 'relative', border: '1px solid var(--line-2)', borderRadius: 'var(--r-lg)', background: 'var(--ink-2)', padding: '4px 4px 4px 18px', display: 'flex', alignItems: 'center', gap: 10, maxWidth: 780, boxShadow: '0 30px 60px -30px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.03)' }}>
        <Icon name="link" size={16} style={{ color: 'var(--mute)' }} />
        <input
          ref={inputRef}
          value={url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') onSubmit(); }}
          placeholder="paste a tweet url — x.com/handle/status/…"
          style={{ flex: 1, padding: '18px 4px', background: 'transparent', border: 0, outline: 'none', fontSize: 17, letterSpacing: '-0.01em' }}
        />
        <button onClick={paste} className="row" style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: 'var(--r)', color: 'var(--paper-2)', fontSize: 12.5, gap: 6 }}>
          <Icon name="paste" size={13} /> paste
        </button>
        <button
          onClick={onSubmit}
          disabled={status === 'loading'}
          className="row"
          style={{ padding: '12px 18px', background: 'var(--paper)', color: 'var(--ink)', borderRadius: 'var(--r)', fontWeight: 600, fontSize: 13.5, gap: 8, letterSpacing: '-0.005em', opacity: status === 'loading' ? 0.7 : 1 }}
        >
          {status === 'loading' ? <><span className="spin" style={{ width: 12, height: 12, border: '1.6px solid var(--ink)', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block' }} /> fetching</> : <>yoink it <Icon name="arrow" size={13} /></>}
        </button>
      </div>

      <div className="row" style={{ gap: 24, marginTop: 18, flexWrap: 'wrap' }}>
        <span className="micro"><Dot tone="acid" style={{ marginRight: 6 }} />average yoink · 1.4s</span>
        <span className="micro">supports · video / gif / audio</span>
        <span className="micro">max length · 2h 20m</span>
        <span className="micro">no rate limit on free tier</span>
      </div>
    </section>
  );
}

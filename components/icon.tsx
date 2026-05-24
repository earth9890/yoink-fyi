import type { CSSProperties, SVGProps } from "react";

export type IconName =
  | "arrow"
  | "down"
  | "paste"
  | "clip"
  | "play"
  | "pause"
  | "sound"
  | "check"
  | "x"
  | "spark"
  | "file"
  | "gear"
  | "history"
  | "verified"
  | "reply"
  | "repost"
  | "heart"
  | "eye"
  | "link"
  | "split"
  | "audio"
  | "gif"
  | "crop"
  | "caption"
  | "logo";

export interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  style?: CSSProperties | undefined;
}

function Icon({ name, size = 14, stroke = 1.6, style }: IconProps) {
  const s = {
    width: size,
    height: size,
    stroke: "currentColor",
    strokeWidth: stroke,
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...style,
  } as unknown as SVGProps<SVGGElement>;
  const v: SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
  };
  switch (name) {
    case "arrow":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </g>
        </svg>
      );
    case "down":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M12 4v14M6 12l6 6 6-6" />
          </g>
        </svg>
      );
    case "paste":
      return (
        <svg {...v}>
          <g {...s}>
            <rect x="9" y="3" width="10" height="14" rx="2" />
            <path d="M5 7v12a2 2 0 0 0 2 2h10" />
          </g>
        </svg>
      );
    case "clip":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M10 13a3 3 0 0 0 4.2 0l3.6-3.6a3 3 0 0 0-4.2-4.2l-1 1" />
            <path d="M14 11a3 3 0 0 0-4.2 0l-3.6 3.6a3 3 0 0 0 4.2 4.2l1-1" />
          </g>
        </svg>
      );
    case "play":
      return (
        <svg {...v}>
          <g {...s} fill="currentColor">
            <path d="M7 5v14l12-7z" />
          </g>
        </svg>
      );
    case "pause":
      return (
        <svg {...v}>
          <g {...s} fill="currentColor">
            <rect x="6" y="5" width="4" height="14" />
            <rect x="14" y="5" width="4" height="14" />
          </g>
        </svg>
      );
    case "sound":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M4 9v6h4l5 4V5L8 9H4z" />
            <path d="M17 8a5 5 0 0 1 0 8" />
          </g>
        </svg>
      );
    case "check":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M4 12l5 5L20 6" />
          </g>
        </svg>
      );
    case "x":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M6 6l12 12M18 6L6 18" />
          </g>
        </svg>
      );
    case "spark":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
          </g>
        </svg>
      );
    case "file":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5" />
          </g>
        </svg>
      );
    case "gear":
      return (
        <svg {...v}>
          <g {...s}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8L4.2 7a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.4.6 1 .9 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
          </g>
        </svg>
      );
    case "history":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
          </g>
        </svg>
      );
    case "verified":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M12 2l2.4 1.8L17.4 3l.9 2.9 2.7 1.4-.9 3 1.4 2.7L20 15l-.6 3-3 .3-1.4 2.7L12 19.6 9 21l-1.4-2.7-3-.3L4 15l-1.5-2 1.4-2.7-.9-3L5.7 5.9 6.6 3l3 .8z" />
            <path d="M9 12l2 2 4-4" />
          </g>
        </svg>
      );
    case "reply":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M21 12a8 8 0 0 1-12.4 6.7L4 20l1.3-4.6A8 8 0 1 1 21 12z" />
          </g>
        </svg>
      );
    case "repost":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M3 7h12l-3-3M21 17H9l3 3" />
          </g>
        </svg>
      );
    case "heart":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M12 21s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z" />
          </g>
        </svg>
      );
    case "eye":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
          </g>
        </svg>
      );
    case "link":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
            <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
          </g>
        </svg>
      );
    case "split":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M6 3v4a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v6" />
            <path d="M3 6l3-3 3 3M15 18l3 3 3-3" />
          </g>
        </svg>
      );
    case "audio":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </g>
        </svg>
      );
    case "gif":
      return (
        <svg {...v}>
          <g {...s}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M9 10v4M9 10h-2M13 10v4M16 10v4M16 12h3" />
          </g>
        </svg>
      );
    case "crop":
      return (
        <svg {...v}>
          <g {...s}>
            <path d="M6 2v16a2 2 0 0 0 2 2h14" />
            <path d="M22 18H8a2 2 0 0 1-2-2V2" />
          </g>
        </svg>
      );
    case "caption":
      return (
        <svg {...v}>
          <g {...s}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M7 14h4M13 14h4M7 11h10" />
          </g>
        </svg>
      );
    case "logo":
      return (
        <svg {...v}>
          <g>
            <path d="M5 5l7 14L14 13l6-1z" fill="currentColor" />
          </g>
        </svg>
      );
    default:
      return null;
  }
}

export { Icon };
export default Icon;

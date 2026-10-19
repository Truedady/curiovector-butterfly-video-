import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT_BODY, FONT_HEAD, Layout } from "../theme";
import { fade, prog, rand } from "../lib/anim";

/** Deep navy atmosphere with soft drifting light motes (deterministic). */
export const Background: React.FC<{ t: number; L: Layout; tint?: string }> = ({ t, L, tint = C.morphoRoyal }) => {
  const n = L.fmt === "landscape" ? 46 : 54;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 80% 70% at 50% 45%, ${C.navyLift} 0%, ${C.navy} 55%, ${C.navyDeep} 100%)`,
      }}
    >
      <svg width={L.w} height={L.h} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="mote">
            <stop offset="0" stopColor={C.morphoIce} stopOpacity="0.9" />
            <stop offset="0.4" stopColor={C.cyan} stopOpacity="0.35" />
            <stop offset="1" stopColor={C.cyan} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bgTint" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={tint} stopOpacity="0.18" />
            <stop offset="1" stopColor={tint} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx={L.w * 0.5} cy={L.h * 0.48} rx={L.w * 0.6} ry={L.h * 0.55} fill="url(#bgTint)" />
        {Array.from({ length: n }).map((_, i) => {
          const sp = 6 + rand(i * 3) * 16;
          const x = ((rand(i) * L.w + t * sp * (rand(i + 9) > 0.5 ? 1 : -0.6)) % (L.w + 80)) - 40;
          const y = (rand(i * 7 + 1) * L.h - t * sp * 0.7 + L.h * 4) % L.h;
          const r = 2 + rand(i * 11) * 7;
          const tw = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * (0.6 + rand(i * 5)) + i));
          return <circle key={i} cx={(x + L.w) % L.w} cy={y} r={r * 3} fill="url(#mote)" opacity={0.28 * tw} />;
        })}
      </svg>
      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(2,5,16,0.65) 100%)" }} />
    </AbsoluteFill>
  );
};

export type Seg = [string, boolean?];

/** Large editorial headline: white with selective orange emphasis, staggered line reveal. */
export const Headline: React.FC<{
  t: number;
  at: number;
  out?: number;
  lines: Seg[][];
  x: number;
  y: number;
  size: number;
  align?: "left" | "center";
  width?: number;
  kicker?: string;
  /** optional per-line reveal times / font sizes */
  lineAt?: number[];
  lineSizes?: number[];
}> = ({ t, at, out, lines, x, y, size, align = "left", width = 1400, kicker, lineAt, lineSizes }) => {
  const lt = (li: number) => lineAt?.[li] ?? at + li * 0.14;
  const lastAt = lt(lines.length - 1);
  const outP = out === undefined ? 0 : prog(t, out, out + 0.5);
  if (t < at - 0.05 || outP >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? x - width / 2 : x,
        top: y,
        width,
        textAlign: align,
        fontFamily: FONT_HEAD,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: "-0.01em",
        color: C.white,
        textShadow: "0 6px 40px rgba(4,10,28,0.85), 0 2px 8px rgba(4,10,28,0.6)",
        opacity: 1 - outP,
        transform: `translateY(${-outP * 18}px)`,
      }}
    >
      {kicker && (
        <div
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: size * 0.22,
            letterSpacing: "0.32em",
            color: C.cyan,
            marginBottom: size * 0.18,
            opacity: fade(t, at, 0.5),
          }}
        >
          {kicker}
        </div>
      )}
      {lines.map((segs, li) => {
        const p = prog(t, lt(li), lt(li) + 0.7, "out");
        return (
          <div key={li} style={{ overflow: "hidden", paddingBottom: size * 0.06, fontSize: lineSizes?.[li] ?? size }}>
            <div style={{ transform: `translateY(${(1 - p) * 70}%)`, opacity: p }}>
              {segs.map(([txt, acc], si) => (
                <span key={si} style={{ color: acc ? C.orange : C.white }}>
                  {txt}
                </span>
              ))}
            </div>
          </div>
        );
      })}
      <div
        style={{
          height: Math.max(4, size * 0.055),
          width: size * 1.6,
          marginTop: size * 0.12,
          marginLeft: align === "center" ? "auto" : 0,
          marginRight: align === "center" ? "auto" : 0,
          background: C.orange,
          borderRadius: 4,
          transformOrigin: align === "center" ? "50% 50%" : "0 50%",
          transform: `scaleX(${prog(t, lastAt + 0.25, lastAt + 1.0, "out")})`,
        }}
      />
    </div>
  );
};

/** Short explanatory label for diagrams (SVG). */
export const Label: React.FC<{
  t: number;
  at: number;
  out?: number;
  x: number;
  y: number;
  text: string;
  sub?: string;
  size?: number;
  color?: string;
  anchor?: "start" | "middle" | "end";
  dot?: boolean;
}> = ({ t, at, out, x, y, text, sub, size = 30, color = C.white, anchor = "start", dot = true }) => {
  const o = fade(t, at, 0.45, out, 0.4);
  if (o <= 0) return null;
  const dy = (1 - prog(t, at, at + 0.6, "out")) * 14;
  const dotX = anchor === "start" ? x - size * 0.6 : anchor === "end" ? x + size * 0.6 : x;
  return (
    <g opacity={o} transform={`translate(0 ${dy})`}>
      {dot && anchor !== "middle" && <circle cx={dotX} cy={y - size * 0.34} r={size * 0.17} fill={color === C.white ? C.cyan : color} />}
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        fontFamily={FONT_BODY}
        fontWeight={700}
        fontSize={size}
        letterSpacing={size * 0.12}
        fill={color}
        style={{ paintOrder: "stroke", stroke: "rgba(4,10,28,0.7)", strokeWidth: size * 0.14 }}
      >
        {text}
      </text>
      {sub && (
        <text x={x} y={y + size * 1.25} textAnchor={anchor} fontFamily={FONT_BODY} fontWeight={500} fontSize={size * 0.72} fill="#B9C8E8" style={{ paintOrder: "stroke", stroke: "rgba(4,10,28,0.7)", strokeWidth: size * 0.1 }}>
          {sub}
        </text>
      )}
    </g>
  );
};

/** Animated leader line. */
export const Leader: React.FC<{ t: number; at: number; out?: number; x1: number; y1: number; x2: number; y2: number; color?: string }> = ({
  t,
  at,
  out,
  x1,
  y1,
  x2,
  y2,
  color = C.cyan,
}) => {
  const p = prog(t, at, at + 0.6, "out");
  const o = fade(t, at, 0.2, out, 0.4);
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={color} strokeWidth={2} strokeOpacity={0.85} />
      <circle cx={x2} cy={y2} r={6 * p} fill="none" stroke={color} strokeWidth={2} />
    </g>
  );
};

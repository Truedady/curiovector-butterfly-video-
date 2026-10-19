import React from "react";
import { fade, prog, wavePath } from "../lib/anim";

/** A light wave travelling from P to Q: drawn progressively, crests moving along the path. */
export const TravelWave: React.FC<{
  t: number;
  at: number;
  dur: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  wl: number;
  amp: number;
  width?: number;
  out?: number;
  phase?: number;
  speed?: number;
  opacity?: number;
  glow?: number;
  taper?: number;
}> = ({ t, at, dur, x1, y1, x2, y2, color, wl, amp, width = 4, out, phase = 0, speed = 260, opacity = 1, glow = 0.22, taper = 0.12 }) => {
  if (t < at) return null;
  const o = fade(t, at, 0.15, out, 0.6) * opacity;
  if (o <= 0) return null;
  const h = prog(t, at, at + dur, "linear");
  const ex = x1 + (x2 - x1) * h;
  const ey = y1 + (y2 - y1) * h;
  const len = Math.hypot(ex - x1, ey - y1);
  if (len < 2) return null;
  const ph = (t * speed * Math.PI * 2) / wl + phase;
  const steps = Math.max(12, Math.round(len / 6));
  const d = wavePath(x1, y1, ex, ey, wl, amp, ph, taper, steps);
  return (
    <g opacity={o}>
      {glow > 0 && <path d={d} stroke={color} strokeWidth={width * 4.5} strokeOpacity={glow} fill="none" strokeLinecap="round" />}
      <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" />
    </g>
  );
};

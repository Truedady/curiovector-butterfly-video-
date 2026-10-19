import React from "react";
import { C } from "../theme";
import { mix } from "../lib/color";
import { rand } from "../lib/anim";

// A single morpho wing scale: elongated blade with a softly toothed tip, base at (0,0), tip toward +y.
export const SCALE_W = 74;
export const SCALE_L = 118;
export const SCALE_PATH =
  "M-37 0 L-37 96 C-37 110 -30 118 -21 118 Q-14 112 -8 118 Q0 124 8 118 Q14 112 21 118 C30 118 37 110 37 96 L37 0 Q0 -6 -37 0 Z";

const VARIANTS = [
  ["#0A2C8F", "#1E7BFF", "#7BDCFF"],
  ["#0B2780", "#1767F0", "#5FCBFF"],
  ["#0C3299", "#2B8CFF", "#9BE8FF"],
  ["#09246F", "#1459DD", "#4CB8FF"],
  ["#0D35A0", "#2593FF", "#86E0FF"],
];

export const ScaleDefs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    {VARIANTS.map((v, i) => (
      <linearGradient key={i} id={`${id}v${i}`} x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor={v[0]} />
        <stop offset="0.55" stopColor={v[1]} />
        <stop offset="1" stopColor={v[2]} />
      </linearGradient>
    ))}
    <pattern id={`${id}ridge`} width="6.4" height="40" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="1.5" height="40" fill="#E6FAFF" fillOpacity="0.38" />
      <rect x="1.5" y="0" width="1" height="40" fill="#020B30" fillOpacity="0.35" />
    </pattern>
    <linearGradient id={`${id}hl`} x1="0" x2="1" y1="0" y2="0.3">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
      <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.85" />
      <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
    </linearGradient>
  </defs>
);

/** One scale with ridges, specular highlight and soft shadow. */
export const Scale: React.FC<{ id: string; variant: number; hl: number; ridges?: number; stroke?: string }> = ({ id, variant, hl, ridges = 1, stroke }) => (
  <g>
    <path d={SCALE_PATH} transform="translate(3 8)" fill="#010414" opacity={0.55} />
    <path d={SCALE_PATH} fill={`url(#${id}v${variant % VARIANTS.length})`} stroke={stroke ?? "#020A2A"} strokeWidth={stroke ? 3 : 1.2} strokeOpacity={0.8} />
    <path d={SCALE_PATH} fill={`url(#${id}ridge)`} opacity={ridges} />
    {hl > 0.02 && <path d={SCALE_PATH} fill={`url(#${id}hl)`} opacity={hl} style={{ mixBlendMode: "screen" }} />}
  </g>
);

export const SX = 66;
export const SY = 44;

/**
 * Field of overlapping scales ("shingles"), culled to what is on screen.
 * Field coords: scale (r,c) base at (c*SX + (r odd ? SX/2 : 0), r*SY). Focus scale (0,0) centre = (0, SCALE_L/2).
 */
export const ScaleField: React.FC<{
  id: string;
  w: number;
  h: number;
  z: number;
  rot: number;
  focus?: [number, number];
  band: number; // specular band position (field x units)
  dimOthers?: number;
  focusGlow?: number;
}> = ({ id, w, h, z, rot, focus = [0, SCALE_L / 2], band, dimOthers = 0, focusGlow = 0 }) => {
  const a = (rot * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  // screen corners → field coordinates
  const corners = [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ].map(([sx, sy]) => {
    const dx = (sx - w / 2) / z;
    const dy = (sy - h / 2) / z;
    // inverse of rotate(-rot) is rotate(+rot)
    return [cos * dx - sin * dy + focus[0], sin * dx + cos * dy + focus[1]];
  });
  const xs = corners.map((p) => p[0]);
  const ys = corners.map((p) => p[1]);
  const rMin = Math.floor((Math.min(...ys) - SCALE_L - 20) / SY);
  const rMax = Math.ceil((Math.max(...ys) + 20) / SY);
  const cMin = Math.floor((Math.min(...xs) - SX) / SX);
  const cMax = Math.ceil((Math.max(...xs) + SX) / SX);
  const items: React.ReactNode[] = [];
  for (let r = rMax; r >= rMin; r--) {
    for (let c = cMin; c <= cMax; c++) {
      if (r === 0 && c === 0 && focusGlow > 0) continue;
      const seed = (r + 500) * 1009 + (c + 500) * 17;
      const x = c * SX + (r & 1 ? SX / 2 : 0) + (rand(seed) - 0.5) * 6;
      const y = r * SY + (rand(seed + 1) - 0.5) * 5;
      const rr = (rand(seed + 2) - 0.5) * 5;
      const d = (x + y * 0.35 - band) / 260;
      const hl = 0.55 * Math.exp(-d * d) + 0.06 * rand(seed + 3);
      items.push(
        <g key={`${r}_${c}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rr.toFixed(2)})`}>
          <Scale id={id} variant={Math.floor(rand(seed + 4) * 5)} hl={hl} />
        </g>,
      );
    }
  }
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      <ScaleDefs id={id} />
      <g transform={`translate(${w / 2} ${h / 2}) rotate(${-rot}) scale(${z}) translate(${-focus[0]} ${-focus[1]})`}>
        {items}
      </g>
      {dimOthers > 0 && <rect width={w} height={h} fill={C.navyDeep} opacity={dimOthers * 0.68} />}
      {focusGlow > 0 && (
        <g transform={`translate(${w / 2} ${h / 2}) rotate(${-rot}) scale(${z}) translate(${-focus[0]} ${-focus[1]})`}>
          <path d={SCALE_PATH} fill="none" stroke={C.cyan} strokeWidth={10 / z} strokeOpacity={0.35 * focusGlow} transform="scale(1.04)" />
          <Scale id={id} variant={2} hl={0.35 + 0.3 * focusGlow} ridges={1} stroke={mix(C.cyan, "#FFFFFF", 0.3)} />
        </g>
      )}
    </svg>
  );
};

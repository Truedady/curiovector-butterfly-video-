import React from "react";
import { C } from "../theme";
import { mix, shade } from "../lib/color";

// Original vector illustration of a blue morpho (Morpho peleides / menelaus type), dorsal view.
// Local coordinate system: body axis at x = 0, thorax near y = 0.
// Right-side wings are drawn once and mirrored for the left side, so anatomy stays symmetric.
// Approximate extents: x ±495, y -340…395.

export const MORPHO_BOUNDS = { w: 1000, h: 740, cy: 25 };

// ---------- Wing geometry (right side) ----------
export const FOREWING =
  "M16 -46 C70 -132 214 -262 414 -322 C454 -334 488 -322 492 -294 C488 -248 454 -200 443 -140 " +
  "C432 -80 418 -18 388 34 C372 62 338 76 298 70 C208 54 100 30 18 8 Z";

// Costa + apex + outer margin (used for the dark border band).
const FORE_COSTA = "M16 -46 C70 -132 214 -262 414 -322";
const FORE_OUTER = "M414 -322 C454 -334 488 -322 492 -294 C488 -248 454 -200 443 -140 C432 -80 418 -18 388 34 C372 62 338 76 298 70";

// Hindwing outer margin is gently scalloped between vein endings.
const HIND_MARGIN_PTS: [number, number][] = [
  [330, 40],
  [376, 84],
  [398, 142],
  [400, 204],
  [382, 262],
  [348, 314],
  [298, 354],
  [238, 382],
  [176, 392],
  [122, 380],
];
const HIND_CENTER: [number, number] = [170, 170];

const scallopPath = (pts: [number, number][], bulge: number) => {
  let d = "";
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    const vx = mx - HIND_CENTER[0];
    const vy = my - HIND_CENTER[1];
    const l = Math.hypot(vx, vy);
    d += `Q${(mx + (vx / l) * bulge).toFixed(1)} ${(my + (vy / l) * bulge).toFixed(1)} ${x1} ${y1} `;
  }
  return d;
};

const HIND_OUTER = `M330 40 ${scallopPath(HIND_MARGIN_PTS, 13)}`;
export const HINDWING =
  `M16 -6 C110 -12 240 4 330 40 ${scallopPath(HIND_MARGIN_PTS, 13)}` +
  "C84 370 58 330 46 282 C32 222 22 122 16 40 Z";

// Veins (radiating from the wing base, gently bowed).
const FORE_VEINS: [number, number, number, number][] = [
  [470, -306, 230, -230],
  [480, -232, 250, -170],
  [450, -160, 250, -120],
  [434, -86, 240, -70],
  [412, -20, 230, -30],
  [384, 34, 220, 8],
  [298, 66, 170, 30],
];
const HIND_VEINS: [number, number, number, number][] = [
  [376, 84, 200, 40],
  [398, 142, 210, 80],
  [400, 204, 210, 120],
  [382, 262, 200, 150],
  [348, 314, 180, 170],
  [298, 354, 150, 190],
  [238, 382, 120, 210],
  [176, 392, 90, 230],
];

export type MorphoProps = {
  id: string;
  /** seconds, drives shimmer travel */
  t: number;
  /** wing openness as horizontal foreshortening, 1 = flat, ~0.3 = strongly raised */
  open?: number;
  /** 0 = ideal viewing angle (vivid), 1 = oblique (darker, violet-shifted) */
  angleMix?: number;
  /** overall luminance multiplier */
  glow?: number;
  /** 0..1 transparent structural overlay (final reveal) */
  xray?: number;
  /** 0..1 position of the specular sweep across the wings (undefined = automatic) */
  sweep?: number;
  hindLag?: number;
};

const Wing: React.FC<{
  id: string;
  part: "fore" | "hind";
  side: "R" | "L";
  angleMix: number;
  glow: number;
  sweep: number;
  xray: number;
}> = ({ id, part, side, angleMix, glow, sweep, xray }) => {
  const k = `${id}${side}${part}`;
  // Viewing-angle dependent palette: vivid sky/electric blues → deeper violet-navy when oblique.
  const g = glow * (1 - 0.45 * angleMix);
  const cIce = shade(mix(C.morphoIce, "#9C8CFF", angleMix * 0.6), Math.max(0.35, Math.min(1.04, g)));
  const cBright = shade(mix(C.morphoBright, "#5B58E8", angleMix * 0.7), Math.max(0.3, Math.min(1.03, g)));
  const cElec = shade(mix(C.morphoElectric, "#3B2FC0", angleMix * 0.7), Math.max(0.3, Math.min(1.02, g)));
  const cRoyal = shade(mix(C.morphoRoyal, "#241C8A", angleMix * 0.7), Math.max(0.3, g * 0.95));
  const cDeep = shade(mix(C.morphoDeep, "#140F4A", angleMix * 0.7), Math.max(0.3, g * 0.9));
  const fillOpacity = 1 - 0.55 * xray;
  const sweepX = -250 + sweep * 1100;

  return (
    <g>
      <defs>
        <radialGradient id={`${k}fg`} gradientUnits="userSpaceOnUse" cx="190" cy="-90" r="360" fx="140" fy="-40">
          <stop offset="0" stopColor={cIce} />
          <stop offset="0.28" stopColor={cBright} />
          <stop offset="0.6" stopColor={cElec} />
          <stop offset="0.85" stopColor={cRoyal} />
          <stop offset="1" stopColor={cDeep} />
        </radialGradient>
        <radialGradient id={`${k}hg`} gradientUnits="userSpaceOnUse" cx="150" cy="110" r="310" fx="110" fy="70">
          <stop offset="0" stopColor={cBright} />
          <stop offset="0.3" stopColor={cElec} />
          <stop offset="0.72" stopColor={cRoyal} />
          <stop offset="1" stopColor={cDeep} />
        </radialGradient>
        <radialGradient id={`${k}base`} gradientUnits="userSpaceOnUse" cx="10" cy="10" r="170">
          <stop offset="0" stopColor="#030716" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="#06102E" stopOpacity="0.5" />
          <stop offset="1" stopColor="#06102E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${k}sw`} gradientUnits="userSpaceOnUse" x1={sweepX - 260} y1="-90" x2={sweepX + 260} y2="90">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.3" stopColor="#9EE7FF" stopOpacity={0.22 * (1 - angleMix * 0.6)} />
          <stop offset="0.5" stopColor="#E4FAFF" stopOpacity={0.5 * (1 - angleMix * 0.6)} />
          <stop offset="0.7" stopColor="#9EE7FF" stopOpacity={0.22 * (1 - angleMix * 0.6)} />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <pattern id={`${k}tex`} width="9" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
          <path d="M0 3.5 Q4.5 0 9 3.5" fill="none" stroke="#FFFFFF" strokeOpacity="0.16" strokeWidth="0.8" />
        </pattern>
        <pattern id={`${k}xr`} width="26" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
          <path d="M1 20 L1 6 Q1 1 6 1 L20 1 Q25 1 25 6 L25 20" fill="none" stroke={C.cyan} strokeWidth="1.1" strokeOpacity="0.9" />
          <path d="M6 18 L6 5 M10 18 L10 4 M14 18 L14 4 M18 18 L18 4 M22 18 L22 5" stroke={C.cyan} strokeWidth="0.45" strokeOpacity="0.55" />
        </pattern>
        <clipPath id={`${k}fc`}>
          <path d={FOREWING} />
        </clipPath>
        <clipPath id={`${k}hc`}>
          <path d={HINDWING} />
        </clipPath>
      </defs>

      {/* ---------- HINDWING ---------- */}
      {part === "hind" && (
      <g clipPath={`url(#${k}hc)`}>
        <path d={HINDWING} fill={`url(#${k}hg)`} opacity={fillOpacity} />
        <path d={HINDWING} fill={`url(#${k}tex)`} opacity={fillOpacity} />
        {HIND_VEINS.map(([x, y, cx, cy], i) => (
          <path key={i} d={`M22 14 Q${cx} ${cy} ${x} ${y}`} stroke="#05123A" strokeOpacity={0.45} strokeWidth={2.2} fill="none" />
        ))}
        <path d={HINDWING} fill={`url(#${k}base)`} />
        {/* shadow cast by the overlapping forewing */}
        <path d={FOREWING} transform="translate(6 16)" fill="#020615" opacity={0.45} />
        <path d={HIND_OUTER} stroke={C.border} strokeWidth={52} fill="none" strokeLinejoin="round" />
        {HIND_MARGIN_PTS.slice(1, -1).map(([x, y], i) => {
          const vx = x - HIND_CENTER[0];
          const vy = y - HIND_CENTER[1];
          const l = Math.hypot(vx, vy);
          return <ellipse key={i} cx={x - (vx / l) * 12} cy={y - (vy / l) * 12} rx={4.2} ry={2.4} fill="#C9DDF5" opacity={0.55} transform={`rotate(${(Math.atan2(vy, vx) * 180) / Math.PI + 90} ${x - (vx / l) * 12} ${y - (vy / l) * 12})`} />;
        })}
        <path d={HINDWING} fill={`url(#${k}sw)`} style={{ mixBlendMode: "screen" }} />
        {xray > 0 && <path d={HINDWING} fill={`url(#${k}xr)`} opacity={xray} />}
      </g>
      )}
      {part === "hind" && <path d={HINDWING} fill="none" stroke="#000" strokeOpacity={0.4} strokeWidth={1.4} />}

      {/* ---------- FOREWING ---------- */}
      {part === "fore" && (
      <g clipPath={`url(#${k}fc)`}>
        <path d={FOREWING} fill={`url(#${k}fg)`} opacity={fillOpacity} />
        <path d={FOREWING} fill={`url(#${k}tex)`} opacity={fillOpacity} />
        {FORE_VEINS.map(([x, y, cx, cy], i) => (
          <path key={i} d={`M24 -26 Q${cx} ${cy} ${x} ${y}`} stroke="#05123A" strokeOpacity={0.45} strokeWidth={2.2} fill="none" />
        ))}
        {/* discal cell closing vein */}
        <path d="M232 -150 Q248 -96 238 -46" stroke="#05123A" strokeOpacity={0.4} strokeWidth={2} fill="none" />
        <path d={FOREWING} fill={`url(#${k}base)`} />
        <path d={FORE_COSTA} stroke={C.border} strokeWidth={30} fill="none" />
        <path d={FORE_OUTER} stroke={C.border} strokeWidth={84} fill="none" strokeLinejoin="round" />
        <ellipse cx={468} cy={-300} rx={96} ry={66} fill={C.border} transform="rotate(-20 468 -300)" />
        {/* small pale spots in the black apical band */}
        {[
          [430, -286, 6],
          [452, -248, 5],
          [448, -205, 4.5],
          [436, -160, 4],
          [395, -296, 4],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#E6EEFA" opacity={0.75} />
        ))}
        <path d={FOREWING} fill={`url(#${k}sw)`} style={{ mixBlendMode: "screen" }} />
        {xray > 0 && <path d={FOREWING} fill={`url(#${k}xr)`} opacity={xray} />}
      </g>
      )}
      {part === "fore" && <path d={FOREWING} fill="none" stroke="#000" strokeOpacity={0.5} strokeWidth={1.4} />}
    </g>
  );
};

const Body: React.FC<{ id: string }> = ({ id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}ab`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#0B0A10" />
        <stop offset="0.45" stopColor="#3A3242" />
        <stop offset="0.6" stopColor="#24202C" />
        <stop offset="1" stopColor="#07060A" />
      </linearGradient>
      <radialGradient id={`${id}th`} cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#3E4A6A" />
        <stop offset="0.6" stopColor="#141826" />
        <stop offset="1" stopColor="#05060B" />
      </radialGradient>
    </defs>
    {/* antennae: long, slender, gently clubbed */}
    {[-1, 1].map((sx) => (
      <g key={sx} transform={`scale(${sx} 1)`}>
        <path d="M5 -76 C22 -150 60 -240 104 -312" stroke="#0A0A10" strokeWidth={3.2} fill="none" strokeLinecap="round" />
        <path d="M5 -76 C22 -150 60 -240 104 -312" stroke="#5B6B8F" strokeOpacity={0.35} strokeWidth={1} fill="none" />
        <ellipse cx={106} cy={-316} rx={4.6} ry={11} fill="#0A0A10" transform="rotate(32 106 -316)" />
      </g>
    ))}
    {/* abdomen */}
    <path d="M-11 24 C-17 92 -13 182 -3 234 C-1 241 1 241 3 234 C13 182 17 92 11 24 Z" fill={`url(#${id}ab)`} />
    {[50, 78, 106, 134, 160, 186, 210].map((y, i) => (
      <path key={i} d={`M${-12 + i * 0.9} ${y} Q0 ${y + 5} ${12 - i * 0.9} ${y}`} stroke="#000" strokeOpacity={0.5} strokeWidth={1.2} fill="none" />
    ))}
    {/* thorax with soft hair */}
    <ellipse cx={0} cy={-14} rx={19} ry={46} fill={`url(#${id}th)`} />
    {Array.from({ length: 14 }).map((_, i) => {
      const a = (i / 14) * Math.PI * 2;
      const x = Math.cos(a) * 17;
      const y = -14 + Math.sin(a) * 42;
      return <line key={i} x1={x} y1={y} x2={x * 1.18} y2={-14 + (y + 14) * 1.08} stroke="#3A5A9A" strokeOpacity={0.45} strokeWidth={1.6} strokeLinecap="round" />;
    })}
    {/* head, eyes, palps */}
    <circle cx={0} cy={-66} r={14} fill="#0E0F16" />
    <circle cx={-9} cy={-69} r={7.5} fill="#2A2420" />
    <circle cx={9} cy={-69} r={7.5} fill="#2A2420" />
    <circle cx={-10.5} cy={-71} r={2.2} fill="#BFD4FF" opacity={0.7} />
    <circle cx={7.5} cy={-71} r={2.2} fill="#BFD4FF" opacity={0.7} />
    <path d="M-4 -78 Q-6 -90 -3 -96 M4 -78 Q6 -90 3 -96" stroke="#1A1A22" strokeWidth={3} strokeLinecap="round" fill="none" />
  </g>
);

export const Morpho: React.FC<MorphoProps> = ({ id, t, open = 1, angleMix = 0, glow = 1, xray = 0, sweep, hindLag = 0.04 }) => {
  // Raised wings are seen more obliquely → physically darker / violet-shifted.
  const obliq = Math.min(1, angleMix + (1 - open) * 0.9);
  const sw = sweep ?? ((t * 0.32) % 1.6) / 1.6;
  const hindOpen = Math.min(1, open + hindLag);
  const common = { id, angleMix: obliq, glow, sweep: sw, xray };
  return (
    <g>
      {(["L", "R"] as const).map((side) => (
        <g key={side} transform={`scale(${side === "R" ? 1 : -1} 1)`}>
          <g transform={`scale(${hindOpen} 1)`}>
            <Wing part="hind" side={side} {...common} />
          </g>
          <g transform={`scale(${open} 1)`}>
            <Wing part="fore" side={side} {...common} />
          </g>
        </g>
      ))}
      <Body id={id} />
    </g>
  );
};

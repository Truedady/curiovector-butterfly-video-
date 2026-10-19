import React from "react";
import { C } from "../theme";
import { rand } from "../lib/anim";

// Cross-section of a morpho cover scale (cutaway): parallel ridges rising from the scale's
// lower layer. Each ridge carries staggered, shelf-like lamellae ("Christmas-tree" profile).
// Dimensions are schematic; spacing is deliberately *nearly* regular — real structures vary.

export type NanoGeom = {
  trees: number[]; // ridge x positions
  base: number; // y of the scale's lower layer (top surface)
  H: number; // nominal ridge height (px)
  u: number; // unit scale
  N: number; // tiers per ridge
  m: number; // index of the ridge used for the light demo
};

export const nanoGeom = (fmt: "landscape" | "portrait"): NanoGeom =>
  fmt === "landscape"
    ? { trees: [80, 300, 520, 740, 960, 1180, 1400, 1620, 1840], base: 930, H: 470, u: 1, N: 8, m: 3 }
    : { trees: [-140, 140, 420, 700, 980, 1260], base: 1420, H: 640, u: 1.3, N: 8, m: 2 };

const spacing = (g: NanoGeom) => (g.H / g.u - 70) / g.N;
const treeH = (g: NanoGeom, i: number) => g.H + (rand(i * 13 + 2) - 0.5) * 30 * g.u;

export const tierY = (g: NanoGeom, i: number, k: number) => {
  const sp = spacing(g);
  return g.base - g.u * (44 + k * sp) + (rand(i * 31 + k * 7) - 0.5) * 6 * g.u - (treeH(g, i) - g.H) * (k / g.N);
};
export const shelfLen = (g: NanoGeom, i: number, k: number) => g.u * (96 - k * 6.5) * (1 + (rand(i * 17 + k * 3) - 0.5) * 0.14);

/** Reflection points on the right shelves of the demo ridge (upper/middle tiers). */
export const reflectPoints = (g: NanoGeom) => {
  const x = g.trees[g.m];
  return [6, 5, 4, 3].map((k) => [x + g.u * 8 + shelfLen(g, g.m, k) * 0.55, tierY(g, g.m, k) - 2 * g.u] as [number, number]);
};

const Shelf: React.FC<{ x: number; y: number; len: number; th: number; dir: 1 | -1; id: string }> = ({ x, y, len, th, dir, id }) => {
  const tilt = len * 0.07;
  const x2 = x + dir * len;
  const d = `M${x} ${y - th / 2} L${x2} ${y - th / 2 - tilt} Q${x2 + dir * th * 0.6} ${y - tilt} ${x2} ${y + th / 2 - tilt} L${x} ${y + th / 2} Z`;
  return <path d={d} fill={`url(#${id}chit)`} stroke={C.cyan} strokeOpacity={0.55} strokeWidth={1.2} />;
};

export const Ridge: React.FC<{ g: NanoGeom; i: number; id: string; hi?: number }> = ({ g, i, id, hi = 0 }) => {
  const x = g.trees[i];
  const u = g.u;
  const h = treeH(g, i);
  const top = g.base - h;
  const sp = spacing(g) * u;
  return (
    <g>
      {/* trunk */}
      <path
        d={`M${x - 9 * u} ${g.base} L${x - 5 * u} ${top + 10 * u} Q${x} ${top - 4 * u} ${x + 5 * u} ${top + 10 * u} L${x + 9 * u} ${g.base} Z`}
        fill={`url(#${id}trunk)`}
        stroke={C.cyan}
        strokeOpacity={0.5 + hi * 0.4}
        strokeWidth={1.2}
      />
      {Array.from({ length: g.N }).map((_, k) => {
        const y = tierY(g, i, k);
        const len = shelfLen(g, i, k);
        return (
          <g key={k}>
            <Shelf x={x + 6 * u} y={y} len={len} th={10 * u} dir={1} id={id} />
            {k < g.N && <Shelf x={x - 6 * u} y={y + sp * 0.5} len={len * 0.97} th={10 * u} dir={-1} id={id} />}
          </g>
        );
      })}
    </g>
  );
};

/** Defs shared by the nanostructure drawings. */
export const NanoDefs: React.FC<{ id: string; glow?: number }> = ({ id, glow = 0 }) => (
  <defs>
    <linearGradient id={`${id}chit`} x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor={glow > 0.5 ? "#E6FAFF" : "#D8ECFF"} />
      <stop offset="1" stopColor="#6FA6E6" />
    </linearGradient>
    <linearGradient id={`${id}trunk`} x1="0" x2="1">
      <stop offset="0" stopColor="#8FB9EC" />
      <stop offset="0.5" stopColor="#D9EEFF" />
      <stop offset="1" stopColor="#6E9BD6" />
    </linearGradient>
    <linearGradient id={`${id}base`} x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#3A2A2A" />
      <stop offset="0.4" stopColor="#21161A" />
      <stop offset="1" stopColor="#0B0810" />
    </linearGradient>
    <linearGradient id={`${id}air`} x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stopColor="#0B2A6E" stopOpacity="0" />
      <stop offset="1" stopColor="#123C9A" stopOpacity="0.35" />
    </linearGradient>
  </defs>
);

/** Full cutaway: lower layer + ridges, with receding depth slices for a dimensional look. */
export const NanoCutaway: React.FC<{ g: NanoGeom; id: string; w: number; reveal: number; hi?: number }> = ({ g, id, w, reveal, hi = 0 }) => {
  const u = g.u;
  const revealTop = g.base + 40 * u - (g.H + 120 * u) * reveal;
  return (
    <g>
      <defs>
        <clipPath id={`${id}rv`}>
          <rect x={-200} y={revealTop} width={w + 400} height={4000} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}rv)`}>
        {/* soft blue haze inside the structure */}
        <rect x={0} y={g.base - g.H - 30 * u} width={w} height={g.H + 30 * u} fill={`url(#${id}air)`} />
        {/* depth slices (ridges run back into the scale) */}
        {[2, 1].map((d) => (
          <g key={d} transform={`translate(${d * 26 * u} ${-d * 18 * u})`} opacity={d === 2 ? 0.16 : 0.32}>
            {g.trees.map((_, i) => (
              <Ridge key={i} g={g} i={i} id={id} />
            ))}
          </g>
        ))}
        {/* lower layer of the scale (contains dark pigment) */}
        <path d={`M-10 ${g.base} L${w + 10} ${g.base} L${w + 10} ${g.base + 36 * u} L-10 ${g.base + 36 * u} Z`} fill={`url(#${id}base)`} />
        <line x1={-10} y1={g.base} x2={w + 10} y2={g.base} stroke={C.cyan} strokeOpacity={0.45} strokeWidth={1.5} />
        {g.trees.map((_, i) => (
          <Ridge key={i} g={g} i={i} id={id} hi={i === g.m ? hi : 0} />
        ))}
      </g>
    </g>
  );
};

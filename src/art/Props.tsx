import React from "react";
import { C } from "../theme";

/** Soft light source (sunlight) — warm-white core with gentle rays. */
export const Sun: React.FC<{ x: number; y: number; r: number; t: number; id: string; o?: number }> = ({ x, y, r, t, id, o = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <defs>
      <radialGradient id={`${id}sun`}>
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="0.25" stopColor="#FFF6E0" />
        <stop offset="0.5" stopColor="#FFE3B0" stopOpacity="0.5" />
        <stop offset="1" stopColor="#FFD08A" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle r={r * 3.2} fill={`url(#${id}sun)`} />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2 + t * 0.08;
      return (
        <line key={i} x1={Math.cos(a) * r * 1.3} y1={Math.sin(a) * r * 1.3} x2={Math.cos(a) * r * 2.1} y2={Math.sin(a) * r * 2.1} stroke="#FFF2D6" strokeWidth={r * 0.09} strokeLinecap="round" opacity={0.55} />
      );
    })}
    <circle r={r} fill="#FFFDF6" />
  </g>
);

/** Stylized human eye — consistent with the CurioVector eye-movement episode language. */
export const Eye: React.FC<{ x: number; y: number; size: number; id: string; tint?: string; tintAmt?: number; look?: number }> = ({
  x,
  y,
  size,
  id,
  tint = C.cyan,
  tintAmt = 0,
  look = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${size})`}>
    <defs>
      <radialGradient id={`${id}iris`}>
        <stop offset="0" stopColor="#0B1430" />
        <stop offset="0.35" stopColor="#1F4F86" />
        <stop offset="0.8" stopColor={C.cyan} />
        <stop offset="1" stopColor="#0E2D5A" />
      </radialGradient>
      <radialGradient id={`${id}tint`}>
        <stop offset="0" stopColor={tint} stopOpacity="0.8" />
        <stop offset="1" stopColor={tint} stopOpacity="0" />
      </radialGradient>
      <clipPath id={`${id}clip`}>
        <path d="M-90 0 Q0 -62 90 0 Q0 62 -90 0 Z" />
      </clipPath>
    </defs>
    <circle r={130} fill={`url(#${id}tint)`} opacity={tintAmt} />
    <path d="M-90 0 Q0 -62 90 0 Q0 62 -90 0 Z" fill="#EEF3FF" />
    <g clipPath={`url(#${id}clip)`}>
      <circle cx={look * 18} r={34} fill={`url(#${id}iris)`} />
      <circle cx={look * 18} r={14} fill="#03060F" />
      <circle cx={look * 18 - 10} cy={-10} r={6} fill="#FFFFFF" opacity={0.9} />
      <path d="M-90 -40 Q0 -70 90 -40 L90 -20 Q0 -46 -90 -20 Z" fill="#000" opacity={0.12} />
    </g>
    <path d="M-90 0 Q0 -62 90 0 Q0 62 -90 0 Z" fill="none" stroke={C.white} strokeWidth={4} />
    <path d="M-96 -6 Q0 -78 96 -6" fill="none" stroke={C.white} strokeWidth={3} opacity={0.5} />
  </g>
);

/** Illustrated red apple (a familiar pigment-colored object). Centre (0,0), ~410 wide. */
export const Apple: React.FC<{ x: number; y: number; s: number; id: string }> = ({ x, y, s, id }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <radialGradient id={`${id}ap`} cx="0.36" cy="0.32" r="0.75">
        <stop offset="0" stopColor="#FF8A78" />
        <stop offset="0.28" stopColor="#F2343A" />
        <stop offset="0.7" stopColor="#B4121F" />
        <stop offset="1" stopColor="#5E0712" />
      </radialGradient>
      <linearGradient id={`${id}lf`} x1="0" x2="1">
        <stop offset="0" stopColor="#2F9E57" />
        <stop offset="1" stopColor="#88D86A" />
      </linearGradient>
      <radialGradient id={`${id}sh`}>
        <stop offset="0" stopColor="#000" stopOpacity="0.5" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={10} cy={215} rx={190} ry={26} fill={`url(#${id}sh)`} />
    <path
      d="M0 -150 C60 -205 190 -190 205 -60 C220 70 140 205 40 200 C20 198 10 190 0 190 C-10 190 -20 198 -40 200 C-140 205 -220 70 -205 -60 C-190 -190 -60 -205 0 -150 Z"
      fill={`url(#${id}ap)`}
    />
    {Array.from({ length: 26 }).map((_, i) => {
      const a = i * 2.39996;
      const rr = 40 + ((i * 37) % 140);
      return <ellipse key={i} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr * 0.9 + 10} rx={2.4} ry={1.6} fill="#FFD0A0" opacity={0.3} />;
    })}
    <ellipse cx={-92} cy={-78} rx={46} ry={28} fill="#FFFFFF" opacity={0.28} transform="rotate(-35 -92 -78)" />
    <ellipse cx={-104} cy={-92} rx={14} ry={8} fill="#FFFFFF" opacity={0.6} transform="rotate(-35 -104 -92)" />
    <path d="M0 -150 C-4 -175 2 -205 18 -232" stroke="#4A2A16" strokeWidth={10} strokeLinecap="round" fill="none" />
    <path d="M14 -200 C50 -250 120 -250 150 -222 C110 -190 50 -186 14 -200 Z" fill={`url(#${id}lf)`} />
    <path d="M20 -201 C70 -222 110 -224 146 -222" stroke="#1E6B3B" strokeWidth={2.5} fill="none" />
  </g>
);

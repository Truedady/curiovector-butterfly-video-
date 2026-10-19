import React from "react";
import { C } from "../theme";

// Original illustrations: an iridescent jewel beetle (dorsal view) and a peacock tail feather.
// Both owe their shimmer to structural colour (multilayer cuticle / structured barbules).

const LEGS: [number, number, number, number, number, number][] = [
  [52, -128, 160, -214, 186, -290],
  [86, -20, 214, 6, 262, 94],
  [80, 66, 204, 168, 236, 288],
];

export const Beetle: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const sh = (t * 0.35) % 1;
  const rot = -30 + Math.sin(t * 0.7) * 25;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}ely`} x1="0" x2="1" y1="0" y2="1" gradientTransform={`rotate(${rot} 0.5 0.5)`}>
          <stop offset="0" stopColor="#8B5CF6" />
          <stop offset={0.18 + 0.1 * Math.sin(t)} stopColor="#2F6CF2" />
          <stop offset="0.42" stopColor="#14C3B4" />
          <stop offset="0.62" stopColor="#38E58C" />
          <stop offset="0.82" stopColor="#E3D14C" />
          <stop offset="1" stopColor="#D9733A" />
        </linearGradient>
        <linearGradient id={`${id}pro`} x1="0" x2="1" y1="1" y2="0" gradientTransform={`rotate(${-rot} 0.5 0.5)`}>
          <stop offset="0" stopColor="#1C4FD6" />
          <stop offset="0.5" stopColor="#22D1A0" />
          <stop offset="1" stopColor="#D7D24E" />
        </linearGradient>
        <linearGradient id={`${id}sh`} x1={sh * 1.6 - 0.6} x2={sh * 1.6} y1="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}shadow`}>
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={10} cy={30} rx={250} ry={320} fill={`url(#${id}shadow)`} />
      {/* legs & antennae */}
      {[-1, 1].map((sx) => (
        <g key={sx} transform={`scale(${sx} 1)`}>
          {LEGS.map(([x0, y0, x1, y1, x2, y2], i) => (
            <g key={i}>
              <path d={`M${x0} ${y0} L${x1} ${y1} L${x2} ${y2}`} stroke="#0E1A2C" strokeWidth={15} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d={`M${x0} ${y0} L${x1} ${y1} L${x2} ${y2}`} stroke="#3C8F8C" strokeOpacity={0.6} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={x2} cy={y2} r={6} fill="#0E1A2C" />
            </g>
          ))}
          <path d="M26 -246 Q50 -280 70 -300" stroke="#0E1A2C" strokeWidth={5} fill="none" strokeLinecap="round" />
          {[0, 1, 2].map((i) => (
            <ellipse key={i} cx={72 + i * 6} cy={-304 - i * 8} rx={6} ry={11} fill="#16243A" transform={`rotate(40 ${72 + i * 6} ${-304 - i * 8})`} />
          ))}
        </g>
      ))}
      {/* head */}
      <ellipse cx={0} cy={-222} rx={56} ry={42} fill={`url(#${id}pro)`} />
      <ellipse cx={-40} cy={-232} rx={12} ry={14} fill="#0B1220" />
      <ellipse cx={40} cy={-232} rx={12} ry={14} fill="#0B1220" />
      {/* pronotum */}
      <path d="M-104 -92 C-118 -150 -76 -198 0 -198 C76 -198 118 -150 104 -92 C70 -84 -70 -84 -104 -92 Z" fill={`url(#${id}pro)`} stroke="#06101E" strokeWidth={3} />
      <path d="M-60 -170 Q0 -190 60 -170" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={6} fill="none" strokeLinecap="round" />
      {/* elytra */}
      {[-1, 1].map((sx) => (
        <g key={sx} transform={`scale(${sx} 1)`}>
          <path d="M3 -90 C80 -96 146 -82 150 -20 C156 80 112 204 3 266 Z" fill={`url(#${id}ely)`} stroke="#06101E" strokeWidth={3} />
          {[24, 50, 76, 102, 126].map((x, i) => (
            <path key={i} d={`M${x} -78 Q${x + 12} ${60} ${x * 0.5} ${236 - i * 22}`} stroke="#04203A" strokeOpacity={0.35} strokeWidth={2} fill="none" />
          ))}
          <path d="M3 -90 C80 -96 146 -82 150 -20 C156 80 112 204 3 266 Z" fill={`url(#${id}sh)`} style={{ mixBlendMode: "screen" }} />
        </g>
      ))}
      <path d="M0 -90 L0 266" stroke="#06101E" strokeWidth={4} />
      <path d="M-18 -90 L0 -52 L18 -90 Z" fill="#0B1F3A" />
      <ellipse cx={-70} cy={-10} rx={22} ry={70} fill="#FFFFFF" opacity={0.18} transform="rotate(8 -70 -10)" />
    </g>
  );
};

export const PeacockFeather: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const sh = (t * 0.3) % 1;
  const barbs: React.ReactNode[] = [];
  for (let i = 0; i < 84; i++) {
    const y = 560 - i * 13.5;
    const nearEye = Math.max(0, 1 - Math.abs(y + 300) / 380);
    const len = 50 + 190 * nearEye + (i % 3) * 8;
    const col = i % 2 ? "#4FC08D" : "#B6A24A";
    for (const sx of [-1, 1]) {
      barbs.push(
        <path
          key={`${i}${sx}`}
          d={`M0 ${y} Q${sx * len * 0.55} ${y - len * 0.25} ${sx * len} ${y - len * 0.75}`}
          stroke={col}
          strokeOpacity={0.45 + 0.25 * nearEye}
          strokeWidth={2.2}
          fill="none"
        />,
      );
    }
  }
  return (
    <g>
      <defs>
        <radialGradient id={`${id}r1`}>
          <stop offset="0.6" stopColor="#C2A13E" />
          <stop offset="1" stopColor="#7A5E1E" />
        </radialGradient>
        <radialGradient id={`${id}r2`}>
          <stop offset="0.5" stopColor="#2CCB78" />
          <stop offset="1" stopColor="#18915A" />
        </radialGradient>
        <radialGradient id={`${id}r3`}>
          <stop offset="0.4" stopColor="#3FE3D6" />
          <stop offset="1" stopColor="#1AA3B8" />
        </radialGradient>
        <radialGradient id={`${id}r4`} cx="0.45" cy="0.55">
          <stop offset="0" stopColor="#2E5BEA" />
          <stop offset="0.7" stopColor="#13258C" />
          <stop offset="1" stopColor="#0A1450" />
        </radialGradient>
        <linearGradient id={`${id}sh`} x1={sh * 1.8 - 0.8} x2={sh * 1.8} y1="0" y2="0.6">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}eye`}>
          <ellipse cx={0} cy={-330} rx={160} ry={200} />
        </clipPath>
      </defs>
      {barbs}
      {/* shaft (rachis) */}
      <path d="M0 640 C4 400 2 0 0 -300" stroke="#E9DFC0" strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M0 640 C4 400 2 0 0 -300" stroke={C.white} strokeOpacity={0.5} strokeWidth={2} fill="none" />
      {/* the eye (ocellus) */}
      <ellipse cx={0} cy={-330} rx={160} ry={200} fill={`url(#${id}r1)`} opacity={0.95} />
      <ellipse cx={0} cy={-318} rx={124} ry={158} fill={`url(#${id}r2)`} />
      <ellipse cx={0} cy={-308} rx={92} ry={118} fill="#9A7A2A" />
      <ellipse cx={0} cy={-304} rx={78} ry={100} fill={`url(#${id}r3)`} />
      <path d="M0 -380 C-34 -420 -82 -380 -62 -320 C-48 -276 -18 -250 0 -230 C18 -250 48 -276 62 -320 C82 -380 34 -420 0 -380 Z" fill={`url(#${id}r4)`} />
      <g clipPath={`url(#${id}eye)`}>
        <rect x={-170} y={-540} width={340} height={420} fill={`url(#${id}sh)`} style={{ mixBlendMode: "screen" }} />
      </g>
    </g>
  );
};

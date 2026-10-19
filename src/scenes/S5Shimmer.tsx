import React from "react";
import { AbsoluteFill } from "remotion";
import { Morpho } from "../art/Morpho";
import { NanoCutaway, NanoDefs, NanoGeom, shelfLen, tierY } from "../art/Nano";
import { Eye, Sun } from "../art/Props";
import { Glow, flapOpen } from "../art/common";
import { Headline, Label } from "../components/ui";
import { TravelWave } from "../components/Wave";
import { fade, lerp, prog } from "../lib/anim";
import { BEATS } from "../timeline";
import { C, FONT_BODY, Layout } from "../theme";

const DIVE = { x: 250, y: -105 };

/** Tilt (degrees) of the wing relative to the viewer over time. */
const tiltAt = (t: number) => {
  const a = BEATS.tilt;
  const k1 = prog(t, a, a + 1.3);
  const k2 = prog(t, a + 1.3, a + 3.0);
  const k3 = prog(t, a + 3.0, a + 5.4);
  const k4 = prog(t, a + 5.4, BEATS.darkPigments);
  return 30 * k1 - 54 * k2 + 36 * k3 - 12 * k4;
};

export const S5Shimmer: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const land = L.fmt === "landscape";
  // Poses
  const P1 = land ? { x: 930, y: 560, s: 0.82 } : { x: 540, y: 960, s: 1.06 };
  const P2 = land ? { x: 560, y: 560, s: 0.7 } : { x: 540, y: 600, s: 0.72 };
  const P3 = land ? { x: 1280, y: 540, s: 0.96 } : { x: 540, y: 1090, s: 1.1 };
  const toP2 = prog(t, BEATS.darkPigments - 0.2, BEATS.darkPigments + 1.0);
  const toP3 = prog(t, BEATS.notPigmentFree - 0.3, BEATS.notPigmentFree + 1.0);
  const base = {
    x: lerp(lerp(P1.x, P2.x, toP2), P3.x, toP3),
    y: lerp(lerp(P1.y, P2.y, toP2), P3.y, toP3),
    s: lerp(lerp(P1.s, P2.s, toP2), P3.s, toP3),
  };
  // Pull back out of the nanostructure (reverse of the scene 2 dive)
  const pb = prog(t, BEATS.stranger - 0.2, BEATS.stranger + 2.4, "inOut");
  const zoom = Math.pow(9, 1 - pb);
  const s = base.s * zoom;
  const fx = lerp(L.w / 2, base.x + base.s * DIVE.x, pb);
  const fy = lerp(L.h / 2, base.y + base.s * DIVE.y, pb);
  const bx = fx - s * DIVE.x;
  const by = fy - s * DIVE.y + Math.sin(t * 0.8) * 5 * pb;

  const tilt = tiltAt(t);
  const tiltX = tilt * 0.35;
  const mismatch = Math.min(1, Math.abs(tilt) / 34);
  const amp = 0.12 * prog(t, BEATS.darkPigments, BEATS.darkPigments + 1) + 0.04;
  const open = flapOpen(t, amp, 3.0);
  const sweep = 0.45 + tilt / 70;

  // Light-angle schematic (sun → wing → eye)
  const schemO = fade(t, BEATS.tilt - 0.3, 0.6, BEATS.darkPigments - 0.4, 0.5);
  const sun = land ? [240, 190] : [170, 560];
  const eye = land ? [1690, 600] : [860, 1460];
  const wc = [P1.x, P1.y - 40];
  const baseAng = Math.atan2(eye[1] - wc[1], eye[0] - wc[0]);
  const refAng = baseAng + ((2 * tilt) * Math.PI) / 180;
  const beamLen = land ? 760 : 620;
  const hitEye = 1 - mismatch;

  // Dark pigment inset
  const insetO = fade(t, BEATS.darkPigments + 0.3, 0.6, BEATS.notPigmentFree - 0.4, 0.5);
  const card = land ? { x: 1020, y: 170, w: 800, h: 700 } : { x: 70, y: 1010, w: 940, h: 560 };

  return (
    <AbsoluteFill>
      <svg width={L.w} height={L.h} style={{ position: "absolute", inset: 0 }}>
        <Glow x={base.x} y={base.y} rx={560 * base.s} ry={380 * base.s} opacity={0.55 * pb * (0.55 + 0.45 * hitEye)} id="s5g" />
        {schemO > 0 && (
          <g opacity={schemO}>
            <Sun x={sun[0]} y={sun[1]} r={land ? 38 : 42} t={t} id="s5" />
            <TravelWave t={t} at={BEATS.tilt - 0.2} dur={0.9} x1={sun[0] + 60} y1={sun[1] + 40} x2={wc[0]} y2={wc[1]} color="#FFF4DC" wl={46} amp={7} width={2.5} glow={0.15} />
            {/* reflected beam swings with the tilt */}
            <defs>
              <linearGradient id="s5beam" x1="0" x2="1">
                <stop offset="0" stopColor="#7FD6FF" stopOpacity="0.8" />
                <stop offset="1" stopColor="#2E9BFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g transform={`translate(${wc[0]} ${wc[1]}) rotate(${(refAng * 180) / Math.PI})`} opacity={prog(t, BEATS.tilt + 0.4, BEATS.tilt + 1.0)}>
              <path d={`M0 0 L${beamLen} ${-46} L${beamLen} ${46} Z`} fill="url(#s5beam)" opacity={0.5} />
              <line x1={0} y1={0} x2={beamLen} y2={0} stroke="#BDEBFF" strokeWidth={3} strokeOpacity={0.8} />
            </g>
            <Eye x={eye[0]} y={eye[1]} size={land ? 0.95 : 1.05} id="s5e" tint={C.morphoBright} tintAmt={hitEye * prog(t, BEATS.tilt + 0.6, BEATS.tilt + 1.2)} look={land ? -0.5 : -0.3} />
            {/* angle marker */}
            {(() => {
              const o = fade(t, BEATS.angle + 0.1, 0.5);
              const inAng = Math.atan2(sun[1] - wc[1], sun[0] - wc[0]);
              const r = land ? 150 : 140;
              const a1 = inAng;
              const a2 = refAng;
              const large = 0;
              const sweepFlag = a2 > a1 ? 1 : 0;
              const d = `M${wc[0] + Math.cos(a1) * r} ${wc[1] + Math.sin(a1) * r} A${r} ${r} 0 ${large} ${sweepFlag} ${wc[0] + Math.cos(a2) * r} ${wc[1] + Math.sin(a2) * r}`;
              return o > 0 ? <path d={d} fill="none" stroke={C.orange} strokeWidth={4} opacity={o} strokeDasharray="10 8" /> : null;
            })()}
          </g>
        )}
      </svg>

      {/* Butterfly with true 3D tilt toward / away from the light */}
      <div style={{ position: "absolute", inset: 0, perspective: 2200 }}>
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${base.x}px ${base.y}px`, transform: `rotateY(${tilt}deg) rotateX(${tiltX}deg)` }}>
          <svg width={L.w} height={L.h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            <g transform={`translate(${bx} ${by}) scale(${s})`}>
              <Morpho id="s5m" t={t} open={open} angleMix={mismatch * 0.85} glow={0.95 + 0.25 * hitEye * schemO} sweep={sweep} />
            </g>
          </svg>
        </div>
      </div>

      <svg width={L.w} height={L.h} style={{ position: "absolute", inset: 0 }}>
        <Label
          t={t}
          at={BEATS.tilt + 0.8}
          out={BEATS.darkPigments - 0.4}
          x={land ? 120 : 540}
          y={land ? 960 : 330}
          anchor={land ? "start" : "middle"}
          size={land ? 36 : 44}
          text="TILT → BRIGHTNESS & HUE SHIFT"
          dot={land}
        />
        <Label
          t={t}
          at={BEATS.angle + 0.3}
          out={BEATS.darkPigments - 0.4}
          x={land ? 120 : 540}
          y={land ? 1020 : 400}
          anchor={land ? "start" : "middle"}
          size={land ? 28 : 34}
          color={C.orange}
          dot={false}
          text="WHAT YOU SEE DEPENDS ON THE ANGLE"
        />
        {insetO > 0 && <PigmentInset t={t} o={insetO} {...card} land={land} />}
      </svg>

      <Headline
        t={t}
        at={BEATS.notPigmentFree + 0.1}
        out={BEATS.noBluePigmentNeeded - 0.25}
        lines={[[["NOT "], ["PIGMENT-FREE", true]]]}
        x={land ? 120 : 540}
        y={land ? 440 : 330}
        size={land ? 88 : 96}
        align={land ? "left" : "center"}
        width={land ? 900 : 1040}
      />
      <Headline
        t={t}
        at={BEATS.noBluePigmentNeeded + 0.1}
        lines={[[["NO "], ["BLUE PIGMENT", true]], [["NEEDED"]]]}
        x={land ? 120 : 540}
        y={land ? 380 : 270}
        size={land ? 88 : 104}
        align={land ? "left" : "center"}
        width={land ? 900 : 1040}
      />
    </AbsoluteFill>
  );
};

/** Cutaway inset: blue-reflecting ridges above a dark pigment layer that soaks up the rest. */
const PigmentInset: React.FC<{ t: number; o: number; x: number; y: number; w: number; h: number; land: boolean }> = ({ t, o, x, y, w, h, land }) => {
  const u = land ? 0.62 : 0.58;
  const g: NanoGeom = {
    trees: land ? [40, 175, 310, 445, 580, 715] : [30, 160, 290, 420, 550, 680, 810, 940],
    base: h * 0.6,
    H: h * (land ? 0.34 : 0.36),
    u,
    N: 7,
    m: 2,
  };
  const P: [number, number] = [g.trees[g.m] + 8 * u + shelfLen(g, g.m, 4) * 0.6, tierY(g, g.m, 4)];
  const a = BEATS.darkPigments + 0.9;
  const deep = h * 0.86;
  return (
    <g opacity={o} transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id="insClip">
          <rect width={w} height={h} rx={28} />
        </clipPath>
        <linearGradient id="melLayer" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#3A2618" />
          <stop offset="1" stopColor="#0C0705" />
        </linearGradient>
      </defs>
      <rect width={w} height={h} rx={28} fill="rgba(6,14,38,0.92)" stroke={C.cyan} strokeOpacity={0.45} strokeWidth={2} />
      <g clipPath="url(#insClip)">
        <NanoDefs id="s5n" />
        <NanoCutaway g={g} id="s5n" w={w} reveal={1} />
        {/* dark pigment (melanin) beneath the reflecting structures */}
        <rect x={0} y={g.base + 36 * u} width={w} height={h - g.base} fill="url(#melLayer)" />
        {Array.from({ length: 40 }).map((_, i) => (
          <ellipse key={i} cx={(i * 97) % w} cy={g.base + 50 * u + ((i * 53) % Math.max(10, h - g.base - 60 * u))} rx={9} ry={5} fill="#5A3A22" opacity={0.45} />
        ))}
        {/* light */}
        <TravelWave t={t} at={a} dur={1.0} x1={P[0] - 240} y1={P[1] - 230} x2={P[0]} y2={P[1]} color="#F4F8FF" wl={30} amp={6} width={2.4} glow={0.15} />
        <TravelWave t={t} at={a + 1.0} dur={0.9} x1={P[0]} y1={P[1]} x2={P[0] + 250} y2={P[1] - 240} color="#58B4FF" wl={28} amp={8} width={3.4} glow={0.25} />
        {[C.red, C.green, C.yellow].map((col, i) => {
          const ex = P[0] + 70 + i * 60;
          const fadeO = 1 - prog(t, BEATS.darkPigmentsAbsorb + 0.4 + i * 0.2, BEATS.darkPigmentsAbsorb + 1.6 + i * 0.2);
          const glowP = prog(t, BEATS.darkPigmentsAbsorb + 0.3, BEATS.darkPigmentsAbsorb + 1.2);
          return (
            <g key={i}>
              <TravelWave t={t} at={a + 1.1 + i * 0.15} dur={1.0} x1={P[0]} y1={P[1]} x2={ex} y2={deep - 20} color={col} wl={[36, 30, 33][i]} amp={5} width={2.4} opacity={0.4 + 0.6 * fadeO} glow={0.12} />
              <circle cx={ex} cy={deep - 20} r={8 + 14 * glowP} fill={col} opacity={0.35 * glowP * (1 - prog(t, BEATS.darkPigmentsAbsorb + 1.4, BEATS.darkPigmentsAbsorb + 2.8))} />
            </g>
          );
        })}
      </g>
      <text x={28} y={50} fontFamily={FONT_BODY} fontWeight={700} fontSize={land ? 26 : 28} letterSpacing={3} fill={C.cyan}>
        INSIDE THE WING · CUTAWAY
      </text>
      <Label t={t} at={BEATS.darkPigments + 1.4} x={28} y={g.base + 36 * u + (land ? 70 : 64)} text="DARK PIGMENT (MELANIN)" size={land ? 28 : 30} color="#FFC9A0" dot={false} />
      <Label
        t={t}
        at={BEATS.darkPigmentsAbsorb + 0.2}
        x={28}
        y={g.base + 36 * u + (land ? 112 : 104)}
        text="absorbs light that isn't reflected"
        size={land ? 24 : 26}
        color="#C9D6F2"
        dot={false}
      />
    </g>
  );
};

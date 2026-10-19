import React from "react";
import { AbsoluteFill } from "remotion";
import { Apple, Eye, Sun } from "../art/Props";
import { Headline, Label, Leader } from "../components/ui";
import { TravelWave } from "../components/Wave";
import { fade, lerp, prog } from "../lib/anim";
import { BEATS } from "../timeline";
import { C, FONT_BODY, Layout } from "../theme";

// Visible spectrum used in the diagrams (wavelength in px roughly follows real ordering).
export const SPECTRUM = [
  { c: C.violet, wl: 36 },
  { c: C.blue, wl: 41 },
  { c: C.green, wl: 47 },
  { c: C.yellow, wl: 53 },
  { c: C.amber, wl: 58 },
  { c: C.red, wl: 64 },
];

export const S3Pigment: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const land = L.fmt === "landscape";
  const G = land
    ? { sun: [250, 330], apple: [1010, 690], as: 1.0, hit: [812, 610], eye: [430, 880], eyeS: 1.15, inner: [930, 690] }
    : { sun: [190, 600], apple: [640, 1090], as: 1.15, hit: [414, 998], eye: [240, 1440], eyeS: 1.2, inner: [600, 1090] };
  const [sx, sy] = G.sun;
  const [hx, hy] = G.hit;
  const [ex, ey] = G.eye;
  const tIn = BEATS.redAbsorbs + 0.05;
  const tHit = tIn + 1.25;
  const tRed = BEATS.redReflects - 0.25;
  const appear = fade(t, BEATS.pigmentsIntro - 0.1, 0.7);
  const camS = lerp(1.04, 1, prog(t, BEATS.pigmentsIntro - 0.2, 41, "out"));

  // perpendicular offset for the braided white beam
  const dx = hx - sx;
  const dy = hy - sy;
  const ln = Math.hypot(dx, dy);
  const nx = -dy / ln;
  const ny = dx / ln;

  return (
    <AbsoluteFill>
      <svg width={L.w} height={L.h} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${L.w / 2} ${L.h / 2}) scale(${camS}) translate(${-L.w / 2} ${-L.h / 2})`} opacity={appear}>
          <Sun x={sx} y={sy} r={land ? 44 : 48} t={t} id="s3" />
          <Apple x={G.apple[0]} y={G.apple[1]} s={G.as} id="s3a" />
          {/* incoming white light: all colours travelling together */}
          {SPECTRUM.map((w, i) => {
            const off = (i - 2.5) * 6;
            return (
              <TravelWave
                key={i}
                t={t}
                at={tIn}
                dur={1.25}
                x1={sx + nx * off + dx * 0.08}
                y1={sy + ny * off + dy * 0.08}
                x2={hx + nx * off * 0.2}
                y2={hy + ny * off * 0.2}
                color={w.c}
                wl={w.wl}
                amp={11}
                width={3}
                glow={0.12}
              />
            );
          })}
          {/* absorbed colours: enter the surface and fade out */}
          {SPECTRUM.slice(0, 4).map((w, i) => {
            const ang = Math.atan2(G.inner[1] - hy, G.inner[0] - hx) + (i - 1.5) * 0.28;
            const L2 = 150 * G.as;
            const tx = hx + Math.cos(ang) * L2;
            const ty = hy + Math.sin(ang) * L2;
            const o = 1 - prog(t, tHit + 0.5 + i * 0.12, tHit + 1.9 + i * 0.12);
            const dot = prog(t, tHit + 0.6, tHit + 1.4);
            return (
              <g key={i}>
                <TravelWave t={t} at={tHit} dur={0.9} x1={hx} y1={hy} x2={tx} y2={ty} color={w.c} wl={w.wl * 0.8} amp={8} width={3} opacity={o} glow={0.2} />
                <circle cx={tx} cy={ty} r={6 + dot * 16} fill={w.c} opacity={0.5 * dot * (1 - prog(t, tHit + 1.4, tHit + 2.6))} />
              </g>
            );
          })}
          {/* faint orange: real pigments are not perfectly selective */}
          <TravelWave t={t} at={tRed + 0.1} dur={1.3} x1={hx} y1={hy} x2={lerp(hx, ex, 0.55) + 30} y2={lerp(hy, ey, 0.55) - 20} color={C.amber} wl={58} amp={5} width={2} opacity={0.35} glow={0.1} />
          {/* reflected red reaches the eye */}
          <TravelWave t={t} at={tRed} dur={1.3} x1={hx} y1={hy} x2={ex + (hx - ex) * 0.16} y2={ey + (hy - ey) * 0.16} color={C.red} wl={64} amp={13} width={4.5} glow={0.28} />
          <Eye x={ex} y={ey} size={G.eyeS} id="s3e" tint={C.red} tintAmt={prog(t, tRed + 1.1, tRed + 1.6)} look={-0.2} />
          {/* impact flash */}
          <circle cx={hx} cy={hy} r={18 + 30 * prog(t, tHit, tHit + 0.5)} fill="#FFFFFF" opacity={0.6 * Math.sin(Math.PI * prog(t, tHit - 0.1, tHit + 0.6))} />
        </g>

        {/* labels */}
        <Label t={t} at={tIn + 0.4} x={land ? 330 : 470} y={land ? 560 : 700} size={land ? 30 : 36} text="WHITE LIGHT" sub="a mix of many colors" />
        <Label t={t} at={BEATS.redAbsorbs + 0.2} x={G.apple[0]} y={G.apple[1] + (land ? 270 : 315)} anchor="middle" size={land ? 26 : 32} color="#FFB3A8" text="RED PIGMENT" />
        <Leader t={t} at={tHit + 0.8} x1={land ? 1330 : 880} y1={land ? 520 : 1440} x2={G.inner[0] + (land ? 40 : 40)} y2={G.inner[1] - (land ? 40 : -60)} />
        <Label t={t} at={tHit + 0.8} x={land ? 1360 : 860} y={land ? 500 : 1500} anchor={land ? "start" : "middle"} size={land ? 30 : 36} text="ABSORBED" sub="blue, green, yellow…" dot={land} />
        <Label t={t} at={tRed + 0.9} x={land ? 520 : 120} y={land ? 760 : 1270} size={land ? 30 : 36} color={C.red} text="RED IS REFLECTED" sub="so the apple looks red" dot={false} />
      </svg>
      <Headline
        t={t}
        at={BEATS.pigmentsIntro + 0.1}
        lines={land ? [[["COLOR FROM "], ["PIGMENT", true]]] : [[["COLOR FROM"]], [["PIGMENT", true]]]}
        x={land ? 120 : 540}
        y={land ? 90 : 230}
        size={land ? 78 : 104}
        align={land ? "left" : "center"}
        width={land ? 1400 : 1000}
      />
      {/* spectrum legend */}
      <SpectrumChip t={t} at={tIn + 0.6} x={land ? 1360 : 540} y={land ? 160 : 480} center={!land} />
    </AbsoluteFill>
  );
};

const SpectrumChip: React.FC<{ t: number; at: number; x: number; y: number; center: boolean }> = ({ t, at, x, y, center }) => {
  const o = fade(t, at, 0.5);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: center ? x - 300 : x, top: y, width: 600, textAlign: center ? "center" : "left", opacity: o }}>
      <div style={{ display: "inline-flex", gap: 8, padding: "10px 14px", borderRadius: 999, background: "rgba(8,19,47,0.75)", border: "1.5px solid rgba(67,197,245,0.4)" }}>
        {SPECTRUM.map((w, i) => (
          <div key={i} style={{ width: 34, height: 12, borderRadius: 6, background: w.c }} />
        ))}
      </div>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 24, letterSpacing: "0.12em", color: "#B9C8E8", marginTop: 10 }}>WHITE LIGHT = ALL COLORS MIXED</div>
    </div>
  );
};

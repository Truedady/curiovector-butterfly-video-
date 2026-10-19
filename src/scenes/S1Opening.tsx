import React from "react";
import { AbsoluteFill } from "remotion";
import { Morpho } from "../art/Morpho";
import { Glow, flapOpen } from "../art/common";
import { Headline } from "../components/ui";
import { fade, lerp, prog } from "../lib/anim";
import { BEATS } from "../timeline";
import { C, FONT_BODY, FONT_HEAD, Layout } from "../theme";

// Hero pose at the end of scene 1 — scene 2 begins its zoom from exactly here.
export const heroPose = (L: Layout) => (L.fmt === "landscape" ? { x: 1270, y: 520, s: 0.98 } : { x: 540, y: 1090, s: 1.1 });

export const S1Opening: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const land = L.fmt === "landscape";
  const hero = heroPose(L);
  // Emerge from darkness: large & close, then settle; shift aside when the headline lands.
  const settle = prog(t, 0, 2.6);
  const aside = prog(t, BEATS.noPigmentHeadline - 0.2, BEATS.noPigmentHeadline + 1.3);
  const start = land ? { x: 960, y: 560, s: 1.42 } : { x: 540, y: 980, s: 1.4 };
  const mid = land ? { x: 960, y: 540, s: 1.18 } : { x: 540, y: 980, s: 1.16 };
  const drift = prog(t, 4, 16.2, "linear");
  const x = lerp(lerp(start.x, mid.x, settle), hero.x, aside);
  const y = lerp(lerp(start.y, mid.y, settle), hero.y, aside) + Math.sin(t * 0.8) * 6;
  const s = lerp(lerp(start.s, mid.s, settle), hero.s, aside) * (1 + 0.025 * drift);
  // Majestic slow beats at the opening, then gentle breathing (flattening toward the zoom).
  const amp = lerp(0.42, 0.12, prog(t, 1.5, 6)) * (1 - prog(t, 14.6, 16.1));
  const open = flapOpen(t, amp, lerp(2.3, 3.2, prog(t, 0, 6)));
  const emerge = 0.3 + 0.7 * prog(t, 0, 1.3, "out");
  // Two specular sweeps: the opening reveal and "electric-blue ink".
  const sweep1 = prog(t, 0.15, 2.2, "inOut");
  const sweep2 = prog(t, BEATS.electricInk + 0.3, BEATS.electricInk + 2.6, "inOut");
  const sweep = t < 6 ? sweep1 : t < BEATS.electricInk ? 1.2 : sweep2;
  const glow = lerp(0.75, 1.08, prog(t, 0, 1.6)) + 0.12 * Math.sin(Math.PI * sweep2);
  const streak = Math.sin(Math.PI * prog(t, 0.3, 2.0));

  return (
    <AbsoluteFill>
      <svg width={L.w} height={L.h} style={{ position: "absolute", inset: 0 }}>
        <Glow x={x} y={y} rx={620 * s} ry={420 * s} opacity={0.75 * emerge} />
        {/* anamorphic light streak during the opening reveal */}
        <defs>
          <linearGradient id="s1streak" x1="0" x2="1">
            <stop offset="0" stopColor={C.cyan} stopOpacity="0" />
            <stop offset="0.5" stopColor={C.morphoIce} stopOpacity="0.55" />
            <stop offset="1" stopColor={C.cyan} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x={0} y={y - 40 - 3} width={L.w} height={6} fill="url(#s1streak)" opacity={streak * 0.7} />
        <g transform={`translate(${x} ${y}) scale(${s})`} opacity={emerge}>
          <Morpho id="s1m" t={t} open={open} glow={glow} sweep={sweep} />
        </g>
      </svg>
      <Headline
        t={t}
        at={BEATS.noPigmentHeadline + 0.15}
        out={BEATS.meetMorpho - 0.65}
        lines={land ? [[["NO BLUE"]], [["PIGMENT?", true]]] : [[["NO BLUE"]], [["PIGMENT?", true]]]}
        x={land ? 120 : 540}
        y={land ? 360 : 300}
        size={land ? 116 : 138}
        align={land ? "left" : "center"}
        width={land ? 820 : 1000}
      />
      <Title t={t} L={L} />
    </AbsoluteFill>
  );
};

const Title: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const land = L.fmt === "landscape";
  const o = fade(t, BEATS.meetMorpho + 0.1, 0.6, 15.3, 0.6);
  if (o <= 0) return null;
  const p = prog(t, BEATS.meetMorpho, BEATS.meetMorpho + 0.9, "out");
  return (
    <div
      style={{
        position: "absolute",
        left: land ? 120 : 0,
        width: land ? 760 : L.w,
        top: land ? 430 : 330,
        textAlign: land ? "left" : "center",
        opacity: o,
        transform: `translateY(${(1 - p) * 26}px)`,
      }}
    >
      <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: land ? 26 : 30, letterSpacing: "0.34em", color: C.cyan }}>MEET THE</div>
      <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: land ? 104 : 112, color: C.white, lineHeight: 1.05, textShadow: "0 6px 40px rgba(4,10,28,0.9)" }}>
        BLUE <span style={{ color: C.orange }}>MORPHO</span>
      </div>
      <div style={{ fontFamily: FONT_BODY, fontStyle: "italic", fontWeight: 500, fontSize: land ? 30 : 32, color: "#C6D4F2", marginTop: 8 }}>
        Morpho butterflies · tropical forests of the Americas
      </div>
    </div>
  );
};

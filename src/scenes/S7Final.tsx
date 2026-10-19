import React from "react";
import { AbsoluteFill } from "remotion";
import { Morpho } from "../art/Morpho";
import { Glow, flapOpen } from "../art/common";
import { Headline, Label } from "../components/ui";
import { lerp, prog } from "../lib/anim";
import { BEATS } from "../timeline";
import { C, Layout } from "../theme";

export const S7Final: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const land = L.fmt === "landscape";
  const pose = land ? { x: 960, y: 470, s: 1.0 } : { x: 540, y: 1130, s: 1.12 };
  const enter = prog(t, BEATS.finalOverlay - 0.2, BEATS.finalOverlay + 1.0, "out");
  const s = pose.s * lerp(0.9, 1, enter) * (1 + 0.03 * prog(t, BEATS.finalRestore, 122.2, "linear"));
  // Transparent structural overlay, then the brilliant surface returns.
  const xr = prog(t, BEATS.finalOverlay + 0.3, BEATS.finalOverlay + 1.3) * (1 - prog(t, BEATS.finalRestore - 0.1, BEATS.finalRestore + 0.8));
  const scan = prog(t, BEATS.finalOverlay + 0.2, BEATS.finalOverlay + 1.8, "inOut");
  const restore = prog(t, BEATS.finalRestore - 0.1, BEATS.finalRestore + 1.6, "inOut");
  const sweep = t < BEATS.finalRestore ? 1.3 : restore;
  const glow = 1 + 0.22 * Math.sin(Math.PI * restore) + 0.08 * restore;
  const amp = lerp(0.1, 0.28, restore);
  const open = flapOpen(t, amp, 2.6);
  const scanX = pose.x + (scan - 0.5) * 1100 * pose.s;

  return (
    <AbsoluteFill>
      <svg width={L.w} height={L.h} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="s7scan" x1="0" x2="1">
            <stop offset="0" stopColor={C.cyan} stopOpacity="0" />
            <stop offset="0.5" stopColor={C.morphoIce} stopOpacity="0.9" />
            <stop offset="1" stopColor={C.cyan} stopOpacity="0" />
          </linearGradient>
        </defs>
        <Glow x={pose.x} y={pose.y} rx={640 * s} ry={440 * s} opacity={0.55 + 0.35 * restore} id="s7g" />
        <g transform={`translate(${pose.x} ${pose.y}) scale(${s})`} opacity={enter}>
          <Morpho id="s7m" t={t} open={open} glow={glow} xray={xr * 0.95} sweep={sweep} />
        </g>
        {scan > 0 && scan < 1 && <rect x={scanX - 40} y={pose.y - 380 * pose.s} width={80} height={780 * pose.s} fill="url(#s7scan)" opacity={0.7} />}
        <Label
          t={t}
          at={BEATS.finalOverlay + 1.0}
          out={BEATS.finalRestore - 0.3}
          x={land ? 960 : 540}
          y={land ? 1000 : 400}
          anchor="middle"
          size={land ? 30 : 38}
          text="SCALES · RIDGES · LAYERS"
          sub="the hidden architecture behind the blue"
          dot={false}
          color={C.cyan}
        />
      </svg>
      <Headline
        t={t}
        at={BEATS.finalRestore + 0.15}
        lines={land ? [[["BUILT TO MAKE "], ["BLUE LIGHT", true], [" STAND OUT"]]] : [[["BUILT TO MAKE"]], [["BLUE LIGHT", true]], [["STAND OUT"]]]}
        x={land ? 960 : 540}
        y={land ? 905 : 250}
        size={land ? 70 : 108}
        align="center"
        width={land ? 1800 : 1040}
      />
    </AbsoluteFill>
  );
};

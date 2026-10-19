import React from "react";
import { AbsoluteFill } from "remotion";
import { Beetle, PeacockFeather } from "../art/Beetle";
import { Morpho } from "../art/Morpho";
import { Glow, flapOpen } from "../art/common";
import { Headline, Label } from "../components/ui";
import { lerp, prog } from "../lib/anim";
import { BEATS } from "../timeline";
import { Layout } from "../theme";

export const S6Nature: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const land = L.fmt === "landscape";
  const a = BEATS.beetleFeather;
  const from = land ? { x: 1280, y: 540, s: 0.96 } : { x: 540, y: 1090, s: 1.1 };
  const to = land ? { x: 960, y: 300, s: 0.4 } : { x: 540, y: 360, s: 0.46 };
  const mv = prog(t, BEATS.notAlone - 0.2, a + 0.4);
  const bO = 1 - 0.9 * prog(t, BEATS.chemistry - 0.3, BEATS.chemistry + 0.5);
  const bx = lerp(from.x, to.x, mv);
  const by = lerp(from.y, to.y, mv) + Math.sin(t * 0.9) * 6;
  const bs = lerp(from.s, to.s, mv);

  const inB = prog(t, a - 0.1, a + 1.1, "out");
  const inF = prog(t, a + 0.35, a + 1.6, "out");
  const dim = 1 - 0.35 * prog(t, BEATS.chemistry - 0.2, BEATS.chemistry + 0.6);
  const beetle = land ? { x: 470, y: 620, s: 0.82 } : { x: 300, y: 930, s: 0.74 };
  const feather = land ? { x: 1460, y: 600, s: 0.66, r: -20 } : { x: 790, y: 1060, s: 0.6, r: -16 };

  return (
    <AbsoluteFill>
      <svg width={L.w} height={L.h} style={{ position: "absolute", inset: 0 }}>
        <Glow x={bx} y={by} rx={520 * bs} ry={360 * bs} opacity={0.6 * bO} id="s6g" />
        <g transform={`translate(${bx} ${by}) scale(${bs})`} opacity={bO}>
          <Morpho id="s6m" t={t} open={flapOpen(t, 0.35, 1.9)} glow={1.05} />
        </g>
        <g opacity={inB * dim} transform={`translate(${beetle.x - (1 - inB) * 160} ${beetle.y}) scale(${beetle.s}) rotate(${-8 + Math.sin(t * 0.5) * 2})`}>
          <Glow x={0} y={0} rx={330} ry={380} color="#22C58F" opacity={0.5} id="s6bg" />
          <Beetle t={t} id="s6b" />
        </g>
        <g opacity={inF * dim} transform={`translate(${feather.x + (1 - inF) * 160} ${feather.y}) rotate(${feather.r + Math.sin(t * 0.6) * 2.5}) scale(${feather.s})`}>
          <Glow x={0} y={-330} rx={300} ry={360} color="#1FA3C8" opacity={0.5} id="s6fg" />
          <PeacockFeather t={t} id="s6f" />
        </g>
        <Label
          t={t}
          at={a + 0.9}
          x={beetle.x}
          y={land ? 990 : 1230}
          anchor="middle"
          size={land ? 32 : 38}
          text="JEWEL BEETLE"
          sub="layered shell"
        />
        <Label
          t={t}
          at={a + 1.5}
          x={land ? 1250 : 820}
          y={land ? 990 : 1510}
          anchor="middle"
          size={land ? 32 : 38}
          text="PEACOCK FEATHER"
          sub="structured barbules"
        />
        <Label
          t={t}
          at={a + 2.6}
          out={BEATS.chemistry - 0.3}
          x={land ? 960 : 540}
          y={land ? 560 : 640}
          anchor="middle"
          size={land ? 26 : 32}
          color="#B9C8E8"
          text="DIFFERENT STRUCTURES"
          sub="each with its own kind of shimmer"
          dot={false}
        />
      </svg>
      <Headline
        t={t}
        at={BEATS.notAlone + 0.05}
        out={a + 2.2}
        lines={[[["NOT "], ["ALONE", true]]]}
        x={land ? 960 : 540}
        y={land ? 560 : 640}
        size={land ? 64 : 76}
        align="center"
        width={1000}
      />
      <Headline
        t={t}
        at={BEATS.chemistry + 0.05}
        lines={[[["NOT JUST CHEMISTRY"]], [["IT'S "], ["PHYSICS", true]]]}
        lineAt={[BEATS.chemistry + 0.05, BEATS.physics]}
        lineSizes={land ? [70, 124] : [72, 136]}
        x={land ? 960 : 540}
        y={land ? 70 : 230}
        size={land ? 70 : 72}
        align="center"
        width={1600}
      />
    </AbsoluteFill>
  );
};

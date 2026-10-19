import React from "react";
import { AbsoluteFill } from "remotion";
import { Morpho } from "../art/Morpho";
import { ScaleField } from "../art/Scales";
import { Label } from "../components/ui";
import { fade, lerp, prog } from "../lib/anim";
import { BEATS } from "../timeline";
import { C, Layout } from "../theme";
import { heroPose } from "./S1Opening";

// Point on the right forewing that the camera dives into (Morpho local coords).
const DIVE = { x: 250, y: -105 };

export const S2Zoom: React.FC<{ t: number; L: Layout }> = ({ t, L }) => {
  const land = L.fmt === "landscape";
  const hero = heroPose(L);
  const cx = L.w / 2;
  const cy = land ? L.h / 2 : L.h * 0.5;

  // 1) Dive: exponential zoom toward the wing point.
  const p = prog(t, BEATS.zoomIn, BEATS.surfaceDisappears + 0.6, "inOut");
  const zoomMax = 11;
  const s = hero.s * Math.pow(zoomMax, p);
  const fx = lerp(hero.x + hero.s * DIVE.x, cx, p);
  const fy = lerp(hero.y + hero.s * DIVE.y, cy, p);
  const bx = fx - s * DIVE.x;
  const by = fy - s * DIVE.y;
  const morphoO = 1 - prog(t, BEATS.surfaceDisappears - 0.2, BEATS.surfaceDisappears + 1.0);

  // 2) Scales resolve out of the smooth blue, keep drifting, then single out one scale.
  const fieldIn = prog(t, BEATS.surfaceDisappears - 0.25, BEATS.surfaceDisappears + 1.1);
  const zA = lerp(0.42, 0.95, prog(t, BEATS.surfaceDisappears - 0.25, BEATS.scalesAppear + 1.5, "out"));
  const zB = lerp(1, 1.18, prog(t, BEATS.scalesAppear + 1.5, BEATS.hidingSomething, "linear"));
  const zC = lerp(1, land ? 3.4 : 3.9, prog(t, BEATS.hidingSomething, BEATS.hidingSomething + 2.6, "inOut"));
  const z = zA * zB * zC * (land ? 1 : 1.15);
  const rot = lerp(22, 14, prog(t, BEATS.surfaceDisappears, 32, "linear"));
  const band = lerp(-900, 900, prog(t, BEATS.surfaceDisappears, BEATS.hidingSomething + 1, "linear"));
  const focusP = prog(t, BEATS.hidingSomething + 0.2, BEATS.hidingSomething + 1.6);
  const flash = Math.sin(Math.PI * prog(t, BEATS.surfaceDisappears - 0.3, BEATS.surfaceDisappears + 1.0));

  return (
    <AbsoluteFill>
      {fieldIn > 0 && (
        <AbsoluteFill style={{ opacity: fieldIn }}>
          <ScaleField id="s2f" w={L.w} h={L.h} z={z} rot={rot} band={band} dimOthers={focusP} focusGlow={focusP} />
        </AbsoluteFill>
      )}
      {morphoO > 0 && (
        <svg width={L.w} height={L.h} style={{ position: "absolute", inset: 0, opacity: morphoO }}>
          <g transform={`translate(${bx} ${by}) scale(${s})`}>
            <Morpho id="s2m" t={t} open={1} glow={1.05} sweep={lerp(0.3, 0.6, p)} />
          </g>
        </svg>
      )}
      {/* luminous flash while the surface dissolves into scales */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(140,225,255,${0.35 * flash}) 0%, rgba(67,197,245,0) 60%)` }} />
      {/* legibility gradient for labels */}
      <AbsoluteFill
        style={{
          background: land
            ? "linear-gradient(0deg, rgba(4,10,28,0.85) 0%, rgba(4,10,28,0) 32%)"
            : "linear-gradient(180deg, rgba(4,10,28,0.85) 0%, rgba(4,10,28,0) 22%), linear-gradient(0deg, rgba(4,10,28,0.8) 0%, rgba(4,10,28,0) 26%)",
          opacity: fade(t, BEATS.scalesAppear, 0.6),
        }}
      />
      <svg width={L.w} height={L.h} style={{ position: "absolute", inset: 0 }}>
        <Label
          t={t}
          at={BEATS.scalesAppear + 0.3}
          out={BEATS.hidingSomething - 0.1}
          x={land ? 130 : 540}
          y={land ? 930 : 330}
          anchor={land ? "start" : "middle"}
          size={land ? 44 : 50}
          text="TINY OVERLAPPING SCALES"
          sub={undefined}
        />
        <Label
          t={t}
          at={BEATS.shingles + 0.1}
          out={BEATS.hidingSomething - 0.1}
          x={land ? 130 : 540}
          y={land ? 990 : 400}
          anchor={land ? "start" : "middle"}
          size={land ? 30 : 36}
          color={C.orange}
          dot={false}
          text="ARRANGED LIKE SHINGLES ON A ROOF"
        />
        <Label
          t={t}
          at={BEATS.hidingSomething + 1.0}
          x={land ? 130 : 540}
          y={land ? 930 : 1430}
          anchor={land ? "start" : "middle"}
          size={land ? 44 : 50}
          text="ONE SINGLE SCALE"
        />
        <Label
          t={t}
          at={BEATS.hidingSomething + 1.3}
          x={land ? 130 : 540}
          y={land ? 990 : 1500}
          anchor={land ? "start" : "middle"}
          size={land ? 30 : 34}
          color="#B9C8E8"
          dot={false}
          text="ABOUT 0.1 MM ACROSS"
        />
      </svg>
    </AbsoluteFill>
  );
};

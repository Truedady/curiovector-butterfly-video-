import React from "react";
import { C } from "../theme";

/** Wing openness for a slow, organic flap (1 = flat open). */
export const flapOpen = (t: number, amp: number, period: number) => {
  const ph = (t / period) * Math.PI * 2;
  // asymmetric stroke: quicker downstroke, slower recovery
  const c = 0.5 - 0.5 * Math.cos(ph + 0.35 * Math.sin(ph));
  return 1 - amp * c;
};

/** Soft luminous halo (gradient, no blur filter → cheap & stable to render). */
export const Glow: React.FC<{ x: number; y: number; rx: number; ry: number; opacity?: number; color?: string; id?: string }> = ({
  x,
  y,
  rx,
  ry,
  opacity = 1,
  color = C.morphoElectric,
  id = "glow",
}) => (
  <g opacity={opacity}>
    <defs>
      <radialGradient id={`${id}${Math.round(rx)}`}>
        <stop offset="0" stopColor={color} stopOpacity="0.55" />
        <stop offset="0.45" stopColor={color} stopOpacity="0.18" />
        <stop offset="1" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${id}${Math.round(rx)})`} />
  </g>
);

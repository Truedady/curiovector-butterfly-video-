import { Easing, interpolate } from "remotion";

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const easeInOut = Easing.bezier(0.45, 0, 0.2, 1);
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

/** Eased 0→1 progress of time t between a and b (seconds). */
export const prog = (t: number, a: number, b: number, ease: "inOut" | "out" | "linear" = "inOut") =>
  interpolate(t, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease === "inOut" ? easeInOut : ease === "out" ? easeOut : undefined,
  });

/** Fade in at `a` over `d` seconds, optionally fade out at `b`. */
export const fade = (t: number, a: number, d = 0.5, b?: number, dOut = 0.5) => {
  const i = prog(t, a, a + d, "out");
  const o = b === undefined ? 1 : 1 - prog(t, b, b + dOut, "inOut");
  return Math.min(i, o);
};

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** Deterministic pseudo-random in [0,1) from an integer seed. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Sine wave path along a segment, optionally tapered at both ends. */
export const wavePath = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  wavelength: number,
  amp: number,
  phase: number,
  taper = 0.15,
  steps = 90,
) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const dist = u * len;
    const env = taper > 0 ? Math.min(1, u / taper, (1 - u) / taper) : 1;
    const o = Math.sin((dist / wavelength) * Math.PI * 2 - phase) * amp * env;
    const x = x1 + dx * u + nx * o;
    const y = y1 + dy * u + ny * o;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
};

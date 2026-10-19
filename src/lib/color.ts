const toRgb = (hex: string) => {
  if (hex.startsWith("rgb")) return (hex.match(/\d+/g) ?? ["0", "0", "0"]).slice(0, 3).map(Number);
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

/** Linear blend of two hex colors. */
export const mix = (a: string, b: string, p: number) => {
  const A = toRgb(a);
  const B = toRgb(b);
  const q = Math.max(0, Math.min(1, p));
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * q));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

/** Multiply brightness of a hex color (k > 1 brightens toward white). */
export const shade = (hex: string, k: number) => {
  if (k >= 1) return mix(hex, "#FFFFFF", Math.min(1, k - 1));
  return mix("#000000", hex, k);
};

// CurioVector brand palette + episode-specific natural blues.
export const C = {
  navy: "#08132F",
  navyDeep: "#040A1C",
  navyLift: "#10224D",
  cyan: "#43C5F5",
  orange: "#FF923E",
  white: "#F8FAFF",
  // Morpho blues
  morphoIce: "#A4EEFF",
  morphoBright: "#3FC6FF",
  morphoElectric: "#1A86FF",
  morphoRoyal: "#0E52E0",
  morphoDeep: "#0A2C9C",
  morphoInk: "#071A5C",
  border: "#060914",
  melanin: "#2A1A12",
  // Spectrum used in light diagrams
  violet: "#8B6CFF",
  blue: "#3E8BFF",
  green: "#3FD27A",
  yellow: "#FFD84A",
  amber: "#FF9F3A",
  red: "#FF4B4B",
};

export const FONT_HEAD = "Montserrat, 'Helvetica Neue', Arial, sans-serif";
export const FONT_BODY = "Inter, 'Helvetica Neue', Arial, sans-serif";

export type Fmt = "landscape" | "portrait";
export type Layout = { fmt: Fmt; w: number; h: number };

import React from "react";
import { Composition, continueRender, delayRender } from "remotion";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/500-italic.css";
import { Episode } from "./Episode";
import { DURATION_FRAMES, FPS } from "./timeline";

// Make sure brand fonts are ready before any frame is captured.
const fontHandle = delayRender("Loading fonts");
Promise.all(
  ["800 80px Montserrat", "700 80px Montserrat", "500 40px Inter", "600 40px Inter", "700 40px Inter", "italic 500 40px Inter"].map((f) =>
    document.fonts.load(f),
  ),
)
  .then(() => document.fonts.ready)
  .finally(() => continueRender(fontHandle));

const Landscape: React.FC = () => <Episode L={{ fmt: "landscape", w: 1920, h: 1080 }} />;
const Shorts: React.FC = () => <Episode L={{ fmt: "portrait", w: 1080, h: 1920 }} />;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="CurioVectorButterflyLandscape" component={Landscape} durationInFrames={DURATION_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="CurioVectorButterflyShorts" component={Shorts} durationInFrames={DURATION_FRAMES} fps={FPS} width={1080} height={1920} />
  </>
);

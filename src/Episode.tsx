import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Background } from "./components/ui";
import { FPS, SCENES, SFX, SceneId } from "./timeline";
import { Layout } from "./theme";
import { S1Opening } from "./scenes/S1Opening";
import { S2Zoom } from "./scenes/S2Zoom";
import { S3Pigment } from "./scenes/S3Pigment";
import { S4Nano } from "./scenes/S4Nano";
import { S5Shimmer } from "./scenes/S5Shimmer";
import { S6Nature } from "./scenes/S6Nature";
import { S7Final } from "./scenes/S7Final";
import { clamp01 } from "./lib/anim";

const SCENE_COMPONENTS: Record<SceneId, React.FC<{ t: number; L: Layout }>> = {
  s1: S1Opening,
  s2: S2Zoom,
  s3: S3Pigment,
  s4: S4Nano,
  s5: S5Shimmer,
  s6: S6Nature,
  s7: S7Final,
};

const XFADE = 0.45; // seconds of cross-dissolve on each side of a scene boundary

/** One episode, rendered natively for either layout from the shared master timeline. */
export const Episode: React.FC<{ L: Layout }> = ({ L }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: "#08132F" }}>
      <Background t={t} L={L} />
      {SCENES.map((sc, i) => {
        const first = i === 0;
        const last = i === SCENES.length - 1;
        if (t < sc.start - (first ? 0 : XFADE) || t > sc.end + (last ? 99 : XFADE)) return null;
        const fin = first ? 1 : clamp01((t - (sc.start - XFADE)) / (2 * XFADE));
        const fout = last ? 1 : 1 - clamp01((t - (sc.end - XFADE)) / (2 * XFADE));
        const Comp = SCENE_COMPONENTS[sc.id];
        return (
          <AbsoluteFill key={sc.id} style={{ opacity: Math.min(fin, fout) }}>
            <Comp t={t} L={L} />
          </AbsoluteFill>
        );
      })}
      <Audio src={staticFile("butterfly_voiceover.mp3")} volume={1} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} layout="none">
          <Audio src={staticFile(s.src)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

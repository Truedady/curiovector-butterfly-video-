# CurioVector — Episode 3: The Blue Morpho Butterfly

Remotion (React + TypeScript + SVG) source for the CurioVector explainer on why the blue morpho
looks brilliantly blue without blue pigment. Two native compositions share one master timeline:

| Composition | Size | FPS | Output |
|---|---|---|---|
| `CurioVectorButterflyLandscape` | 1920×1080 | 30 | `out/CurioVector_Butterfly_16x9.mp4` |
| `CurioVectorButterflyShorts` | 1080×1920 | 30 | `out/CurioVector_Butterfly_9x16.mp4` |

Both are exactly 3,664 frames long (122.12 s, which is the length of `butterfly_voiceover.mp3`). They are H.264 with AAC audio.

## Render

```bash
npm install
npm run typecheck
npm run render:landscape   # → out/CurioVector_Butterfly_16x9.mp4
npm run render:shorts      # → out/CurioVector_Butterfly_9x16.mp4
npm run studio             # interactive preview
```

In a container without Remotion's own Chrome, point it to a local headless Chromium:
`REMOTION_BROWSER=/path/to/headless_shell npm run render:landscape`, or pass
`--browser-executable=/path/to/headless_shell`.

MP4s are git-ignored (`out/`). Render them locally with the commands above.

## Project layout

```
butterfly_script.txt / butterfly_voiceover.mp3   original narration sources (unchanged)
public/butterfly_voiceover.mp3                   copy served to Remotion
public/sfx/*.wav                                 original synthesized sound accents
scripts/make_sfx.sh                              regenerates the SFX with ffmpeg (no samples)
src/timeline.ts                                  MASTER TIMELINE: sentences, beats, scenes, SFX cues
src/Episode.tsx                                  scene sequencer + cross-dissolves + audio (shared)
src/Root.tsx                                     the two compositions + font loading
src/art/Morpho.tsx                               original SVG blue morpho (dorsal view)
src/art/Scales.tsx                               wing-scale artwork + culled "shingle" scale field
src/art/Nano.tsx                                 cutaway of ridges with shelf-like lamellae
src/art/Props.tsx, Beetle.tsx                    sun, eye, apple, jewel beetle, peacock feather
src/components/                                  headline, labels, leaders, background, light waves
src/scenes/S1…S7                                 scenes; each one lays out landscape and portrait separately
```

## Timeline and alignment

Sentence timing was aligned once with `ffmpeg -af silencedetect=noise=-38dB:d=0.25`. That found 40 pauses: 32 sentence boundaries and 8 pauses inside sentences, which serve as extra visual beats. Every reveal is keyed to `BEATS` in `src/timeline.ts`. Edit the times there and both formats follow.

## Scenes

1. **The Impossible Blue (0–16 s):** the morpho emerges from darkness, then the "NO BLUE PIGMENT?" headline and the title.
2. **Zoom Into the Wing (16–32 s):** an exponential dive dissolves the wing into overlapping scales, then isolates one scale.
3. **How Pigments Work (32–41 s):** white light hits a red apple. Blue, green and yellow are absorbed, and red is reflected to the eye.
4. **Nanostructure Reveal (41–76 s):** a cut through one scale shows the ridges and their shelf-like layers. Blue waves reflected from successive layers stay in step and reinforce; other colors are weaker and out of step. The scene ends on "STRUCTURAL COLORATION".
5. **The Shimmering Wing (76–102 s):** the camera pulls back and the wing tilts in 3D. Brightness and hue shift with the angle between the light source and the eye. A cutaway shows dark melanin absorbing the light that isn't reflected.
6. **Nature's Optical Trick (102–116 s):** a jewel beetle and a peacock feather, each with a different structure. "Not just chemistry: it's physics."
7. **Final Reveal (116–122 s):** a transparent structural overlay, then the blue returns: "Built to make blue light stand out."

## Scientific notes (what the visuals deliberately say / avoid)

- The blue is mainly **structural**: microscopic scales carry ridges with stacked lamellae, and interference and scattering selectively enhance blue reflection. Other wavelengths are reflected **less efficiently**; the visuals don't show them eliminated.
- The wings are **not pigment-free**. Dark melanin underneath absorbs stray light, and the video says so explicitly.
- The wing **reflects** sunlight and never emits light. Brightness and hue depend on the viewing and lighting angle.
- The nanostructure drawing is labeled schematic. Its spacing is regular but carries small deliberate variations (real structures aren't perfectly uniform). Scale-bar wording: ridges are less than 1 µm apart, and a human hair is about 70 µm wide.
- Beetles and feathers are shown with **different** structures (a layered shell and structured barbules), to avoid implying that all structural colors work the same way.

References: Smithsonian, *Beautiful Blue Morpho*; NMNH, *What Makes Things Blue*; doi:10.1063/1.3239513.

## Audio

Narration is used unaltered (no change to speed or pitch). The sound accents (shimmer, whoosh, reveal and wave pulse) are synthesized from sine waves and noise by `scripts/make_sfx.sh`, mixed far below the voice. There is no music.

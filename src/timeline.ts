// MASTER TIMELINE — shared by both compositions.
// Source of truth: butterfly_voiceover.mp3 (122.122 s, measured with ffprobe).
// Sentence boundaries were aligned once using ffmpeg silencedetect
// (noise=-38dB, d=0.25): 40 pauses = 32 sentence boundaries + 8 in-sentence pauses.
// All times are in seconds from the start of the narration.

export const FPS = 30;
export const AUDIO_DURATION_S = 122.122438;
export const DURATION_FRAMES = Math.ceil(AUDIO_DURATION_S * FPS); // 3664

export type Sentence = { id: number; start: number; end: number; text: string };

export const SENTENCES: Sentence[] = [
  { id: 1, start: 0.0, end: 2.12, text: "This butterfly is bright blue." },
  { id: 2, start: 2.6, end: 4.92, text: "But blue pigment isn't what makes it blue." },
  { id: 3, start: 5.38, end: 7.94, text: "So where does that incredible color come from?" },
  { id: 4, start: 8.59, end: 10.75, text: "Meet the blue morpho butterfly." },
  { id: 5, start: 11.31, end: 15.6, text: "At first glance, its wings look almost painted with electric-blue ink." },
  { id: 6, start: 16.12, end: 18.8, text: "But zoom in, and something strange happens." },
  { id: 7, start: 19.31, end: 21.52, text: "The smooth blue surface disappears." },
  { id: 8, start: 22.01, end: 28.03, text: "Instead, you find thousands of tiny scales covering the wings, almost like shingles on a roof." },
  { id: 9, start: 28.56, end: 31.6, text: "And those scales are hiding something extraordinary." },
  { id: 10, start: 32.19, end: 34.43, text: "Normally, color comes from pigments." },
  { id: 11, start: 34.89, end: 40.68, text: "A red pigment absorbs some wavelengths of light and reflects others, making an object appear red." },
  { id: 12, start: 41.23, end: 43.88, text: "But the morpho butterfly uses a different trick." },
  { id: 13, start: 44.38, end: 50.79, text: "Inside its wing scales are microscopic structures, with features far smaller than the width of a human hair." },
  { id: 14, start: 51.3, end: 54.19, text: "They're arranged in incredibly precise patterns." },
  { id: 15, start: 54.67, end: 59.36, text: "When sunlight hits these structures, some reflected light waves reinforce each other." },
  { id: 16, start: 59.85, end: 62.61, text: "Other wavelengths are reflected much less efficiently." },
  { id: 17, start: 63.14, end: 63.8, text: "And the result?" },
  { id: 18, start: 64.27, end: 67.14, text: "An intense blue that can look almost metallic." },
  { id: 19, start: 67.66, end: 70.42, text: "Scientists call this structural coloration." },
  { id: 20, start: 70.91, end: 72.91, text: "The blue isn't coming from blue dye." },
  { id: 21, start: 73.29, end: 75.96, text: "It's coming from the way the wing interacts with light." },
  { id: 22, start: 76.51, end: 78.72, text: "But here's where things get even stranger." },
  { id: 23, start: 79.26, end: 83.06, text: "Tilt the wing, and the color can change in brightness and appearance." },
  { id: 24, start: 83.46, end: 87.18, text: "That's because the light reaching your eyes depends partly on the angle." },
  { id: 25, start: 87.62, end: 93.91, text: "And underneath that brilliant blue, the wings can contain dark pigments that help absorb unwanted light." },
  { id: 26, start: 94.42, end: 97.43, text: "So this butterfly isn't completely pigment-free." },
  { id: 27, start: 97.87, end: 101.7, text: "It simply doesn't need blue pigment to produce its spectacular blue." },
  { id: 28, start: 102.25, end: 103.21, text: "And it's not alone." },
  { id: 29, start: 103.68, end: 109.66, text: "Similar optical tricks help create shimmering colors in some beetles, bird feathers, and other animals." },
  { id: 30, start: 110.12, end: 114.46, text: "Which means some of nature's most beautiful colors aren't just about chemistry." },
  { id: 31, start: 114.92, end: 116.06, text: "They're about physics." },
  { id: 32, start: 116.61, end: 119.2, text: "A butterfly wing isn't merely colored blue." },
  { id: 33, start: 119.62, end: 122.0, text: "It's built to make blue light stand out." },
];

const s = (id: number) => SENTENCES[id - 1];

// Visual beats (seconds). In-sentence beats come from the in-sentence pauses.
export const BEATS = {
  noPigmentHeadline: s(2).start,
  whereFrom: s(3).start,
  meetMorpho: s(4).start,
  electricInk: s(5).start,
  zoomIn: s(6).start,
  surfaceDisappears: s(7).start,
  scalesAppear: s(8).start,
  shingles: 26.41, // pause after "...covering the wings,"
  hidingSomething: s(9).start,
  pigmentsIntro: s(10).start,
  redAbsorbs: s(11).start,
  redReflects: 38.98, // pause before "...making an object appear red"
  differentTrick: s(12).start,
  insideScales: s(13).start,
  hairCompare: 47.75, // "...with features far smaller than the width of a human hair"
  precisePatterns: s(14).start,
  sunlightHits: s(15).start,
  reinforce: 56.7, // "...some reflected light waves reinforce each other"
  otherWavelengths: s(16).start,
  theResult: s(17).start,
  metallic: s(18).start,
  structuralColoration: s(19).start,
  notDye: s(20).start,
  interactsLight: s(21).start,
  stranger: s(22).start,
  tilt: s(23).start,
  angle: s(24).start,
  darkPigments: s(25).start,
  darkPigmentsAbsorb: 89.94, // "...the wings can contain dark pigments that help absorb unwanted light"
  notPigmentFree: s(26).start,
  noBluePigmentNeeded: s(27).start,
  notAlone: s(28).start,
  beetleFeather: s(29).start,
  chemistry: s(30).start,
  physics: s(31).start,
  finalOverlay: s(32).start,
  finalRestore: s(33).start,
} as const;

export type SceneId = "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7";

// Scene windows. Each scene fades in over the end of the previous one (see Episode.tsx).
export const SCENES: { id: SceneId; start: number; end: number; title: string }[] = [
  { id: "s1", start: 0, end: s(6).start, title: "The Impossible Blue" },
  { id: "s2", start: s(6).start, end: s(10).start - 0.15, title: "Zoom Into the Wing" },
  { id: "s3", start: s(10).start - 0.15, end: s(12).start - 0.2, title: "How Pigments Work" },
  { id: "s4", start: s(12).start - 0.2, end: s(22).start - 0.2, title: "The Nanostructure Reveal" },
  { id: "s5", start: s(22).start - 0.2, end: s(28).start - 0.15, title: "The Shimmering Wing" },
  { id: "s6", start: s(28).start - 0.15, end: s(32).start - 0.2, title: "Nature's Optical Trick" },
  { id: "s7", start: s(32).start - 0.2, end: AUDIO_DURATION_S + 1, title: "Final Reveal" },
];

// Sound accents (synthesized, see scripts/make_sfx.sh). Volume is kept far below narration.
export const SFX: { src: string; at: number; volume: number }[] = [
  { src: "sfx/shimmer.wav", at: 0.05, volume: 0.16 },
  { src: "sfx/whoosh.wav", at: s(6).start + 0.1, volume: 0.14 },
  { src: "sfx/reveal.wav", at: s(13).start - 0.3, volume: 0.16 },
  { src: "sfx/wave.wav", at: 56.7, volume: 0.1 },
  { src: "sfx/shimmer.wav", at: s(23).start, volume: 0.12 },
  { src: "sfx/whoosh.wav", at: s(28).start - 0.4, volume: 0.1 },
  { src: "sfx/reveal.wav", at: s(32).start - 0.3, volume: 0.13 },
  { src: "sfx/shimmer.wav", at: s(33).start, volume: 0.15 },
];

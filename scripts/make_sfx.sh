#!/usr/bin/env bash
# Synthesizes the subtle, original sound accents used in the episode.
# Everything is generated from sine waves / noise with ffmpeg: no third-party samples.
set -euo pipefail
OUT="$(dirname "$0")/../public/sfx"
mkdir -p "$OUT"
F="ffmpeg -y -hide_banner -loglevel error"

# Gentle wing shimmer: soft high chime cluster with tremolo + short echo tail.
$F -f lavfi -i "sine=f=2093:d=2.6" -f lavfi -i "sine=f=2637:d=2.6" -f lavfi -i "sine=f=3136:d=2.6" -f lavfi -i "sine=f=4186:d=2.6" \
  -filter_complex "[0][1][2][3]amix=inputs=4,tremolo=f=11:d=0.7,afade=t=in:d=0.25,afade=t=out:st=0.6:d=2.0,aecho=0.8:0.6:70|140:0.35|0.2,volume=0.9" \
  -ar 48000 -ac 2 "$OUT/shimmer.wav"

# Soft zoom whoosh: band-limited pink noise swelling and fading.
$F -f lavfi -i "anoisesrc=color=pink:d=1.8:a=0.6:seed=7" \
  -af "highpass=f=250,lowpass=f=2600,afade=t=in:d=0.9:curve=qsin,afade=t=out:st=0.9:d=0.9:curve=qsin,volume=0.8" \
  -ar 48000 -ac 2 "$OUT/whoosh.wav"

# Microscopic reveal: low warm swell (fifth interval) with airy echo.
$F -f lavfi -i "sine=f=196:d=3.2" -f lavfi -i "sine=f=294:d=3.2" -f lavfi -i "sine=f=392:d=3.2" \
  -filter_complex "[0][1][2]amix=inputs=3,afade=t=in:d=1.1:curve=qsin,afade=t=out:st=1.4:d=1.8,aecho=0.8:0.7:180|360:0.3|0.18,volume=1.4" \
  -ar 48000 -ac 2 "$OUT/reveal.wav"

# Light-wave interaction: two close tones beating gently (a "pulse" of interference).
$F -f lavfi -i "sine=f=880:d=2.2" -f lavfi -i "sine=f=886:d=2.2" \
  -filter_complex "[0][1]amix=inputs=2,afade=t=in:d=0.4,afade=t=out:st=0.8:d=1.4,aecho=0.8:0.6:90:0.3,volume=0.7" \
  -ar 48000 -ac 2 "$OUT/wave.wav"
echo "SFX written to $OUT"

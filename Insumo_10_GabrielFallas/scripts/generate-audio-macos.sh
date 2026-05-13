#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT_DIR/public/audio"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

mkdir -p "$OUT_DIR"

render_wav() {
  local voice="$1"
  local rate="$2"
  local output_name="$3"
  local text="$4"
  local aiff_path="$TMP_DIR/${output_name%.wav}.aiff"
  local wav_path="$OUT_DIR/$output_name"

  say -v "$voice" -r "$rate" -o "$aiff_path" -- "$text"
  afconvert -f WAVE -d LEI16@22050 "$aiff_path" "$wav_path" >/dev/null 2>&1
}

render_wav \
  "Daniel" \
  178 \
  "zed.wav" \
  "Hello, I am Zed. If you are considering a STEM degree, I can share real robotics and AI projects and help you choose a first step."

render_wav \
  "Samantha" \
  176 \
  "yuki.wav" \
  "Hi, I am Yuki. I can guide your workouts, adapt to your level, and share general nutrition tips to support your goals."

render_wav \
  "Karen" \
  174 \
  "alicia.wav" \
  "Hi, I am Alicia. I can help you plan a trip to Japan with seasonal routes, food recommendations, and practical travel tips."

ls -lh "$OUT_DIR"/*.wav

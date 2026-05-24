#!/usr/bin/env bash
# render.sh — composite tweet card + playing video into a single mp4
# usage: TWEET_URL=... OUT_PATH=... [TMP_DIR=...] ./scripts/render.sh
set -euo pipefail

URL="${TWEET_URL:?TWEET_URL required}"
OUT="${OUT_PATH:?OUT_PATH required}"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TMP="${TMP_DIR:-$(mktemp -d /tmp/yoink-render.XXXXXX)}"
mkdir -p "$TMP"

cleanup() {
  if [ -z "${KEEP_TMP:-}" ]; then
    rm -rf "$TMP"
  fi
  return 0
}
trap cleanup EXIT

for bin in yt-dlp ffmpeg ffprobe node; do
  command -v "$bin" >/dev/null || { echo "missing: $bin" >&2; exit 1; }
done

echo "[1/4] download video (URL=$URL)" >&2
yt-dlp --force-overwrites --no-mtime \
  -o "$TMP/video.%(ext)s" \
  -f "bv*+ba/b" --merge-output-format mp4 \
  "$URL" >&2

VIDEO="$TMP/video.mp4"
[ -f "$VIDEO" ] || VIDEO="$(ls "$TMP"/video.* | head -n1)"

echo "[2/4] render card via playwright" >&2
( cd "$PROJECT_DIR" && node "$PROJECT_DIR/scripts/shot.mjs" "$URL" "$TMP" >&2 )

MX=$(node -e "console.log(require('$TMP/bbox.json').media.x)")
MY=$(node -e "console.log(require('$TMP/bbox.json').media.y)")
MW=$(node -e "console.log(require('$TMP/bbox.json').media.w)")
MH=$(node -e "console.log(require('$TMP/bbox.json').media.h)")
CW=$(node -e "console.log(require('$TMP/bbox.json').card.w)")
CH=$(node -e "console.log(require('$TMP/bbox.json').card.h)")

echo "[3/4] probe (card ${CW}x${CH}, media ${MW}x${MH} @ ${MX},${MY})" >&2
DUR=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$VIDEO")

PAD=64
OW=$(( CW + PAD*2 )); OW=$(( OW % 2 == 0 ? OW : OW + 1 ))
OH=$(( CH + PAD*2 )); OH=$(( OH % 2 == 0 ? OH : OH + 1 ))
CX=$(( (OW - CW)/2 ))
CY=$(( (OH - CH)/2 ))
VX=$(( CX + MX ))
VY=$(( CY + MY ))
MW2=$(( MW % 2 == 0 ? MW : MW - 1 ))
MH2=$(( MH % 2 == 0 ? MH : MH - 1 ))

echo "[4/4] composite -> $OUT" >&2
ffmpeg -y \
  -loop 1 -t "$DUR" -i "$TMP/card.png" \
  -i "$VIDEO" \
  -loop 1 -t "$DUR" -i "$TMP/mask.png" \
  -filter_complex "
    color=c=#000000:s=${OW}x${OH}:d=${DUR}[bg];
    [1:v]scale=${MW2}:${MH2}:force_original_aspect_ratio=increase,crop=${MW2}:${MH2},format=yuva420p[vid];
    [2:v]format=gray,scale=${MW2}:${MH2}[mask];
    [vid][mask]alphamerge[vmasked];
    [bg][0:v]overlay=${CX}:${CY}[withcard];
    [withcard][vmasked]overlay=${VX}:${VY}:shortest=1[out]
  " \
  -map "[out]" -map 1:a? \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium \
  -c:a aac -b:a 192k -shortest \
  "$OUT" >&2

echo "done: $OUT" >&2

#!/usr/bin/env bash
# Genera la narración por escena con la voz del sistema (macOS `say`) y
# escribe src/narration.json con la duración real de cada clip.
# Para cambiar de proveedor (ElevenLabs, fal.ai, Kokoro...) basta con producir
# los mismos WAV en public/narration/<scene>.wav y volver a correr este script
# con SKIP_SYNTH=1.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPT="${1:-$ROOT/script/chip-supply-chain.json}"
case "$SCRIPT" in /*) ;; *) SCRIPT="$(pwd)/$SCRIPT";; esac
SLUG=$(node -e "console.log(require('$SCRIPT').id)")
OUT="$ROOT/public/narration/$SLUG"
DATA="$ROOT/src/data/$SLUG"
mkdir -p "$OUT" "$DATA"
VOICE=$(node -e "const s=require('$SCRIPT');console.log(s.scratchVoice||'Samantha')")
RATE="${RATE:-172}"
echo "{" > "$DATA/narration.json"
first=1
for id in $(node -e "require('$SCRIPT').scenes.forEach(s=>console.log(s.id))"); do
  text=$(node -e "console.log(require('$SCRIPT').scenes.find(s=>s.id==='$id').narration)")
  wav="$OUT/$id.wav"
  if [ -z "${SKIP_SYNTH:-}" ]; then
    say -v "$VOICE" -r "$RATE" -o "$wav" --file-format=WAVE --data-format=LEI16@48000 "$text"
  fi
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$wav")
  [ $first -eq 1 ] || echo "," >> "$DATA/narration.json"
  first=0
  printf '  "%s": { "src": "narration/%s/%s.wav", "durationInSeconds": %s }' "$id" "$SLUG" "$id" "$dur" >> "$DATA/narration.json"
  echo "$id: ${dur}s"
done
echo "" >> "$DATA/narration.json"; echo "}" >> "$DATA/narration.json"

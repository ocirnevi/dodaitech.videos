#!/usr/bin/env python3
"""Aprieta la narración de un video sin regenerar voz (gratis):
  - recorta el silencio inicial y final de cada clip (umbral −40 dBFS), dejando un colchón corto,
  - acelera la voz con atempo (sin cambiar el tono),
  - reescribe public/narration/<slug>/<id>.wav, src/data/<slug>/narration.json y words.json (tiempos desplazados y escalados).
El MP3 original de fal se conserva como fuente; correrlo dos veces es seguro porque parte siempre del MP3.
  python3 scripts/tighten-narration.py <slug> [--tempo 1.08] [--head 0.05] [--tail 0.12] [--thr -40]
Regla (Enrico, 9 nov): los videos deben sentirse rápidos pero entenderse → tempo ≤ 1.10.
"""
import argparse, json, subprocess, sys, wave
from pathlib import Path
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('slug'); ap.add_argument('--tempo', type=float, default=1.08)
ap.add_argument('--head', type=float, default=0.05); ap.add_argument('--tail', type=float, default=0.12)
ap.add_argument('--thr', type=float, default=-40.0)
a = ap.parse_args()
ROOT = Path(__file__).resolve().parent.parent
NAR = ROOT / 'public' / 'narration' / a.slug; DATA = ROOT / 'src' / 'data' / a.slug
narration = json.load(open(DATA / 'narration.json')); words = json.load(open(DATA / 'words.json'))
thr = 10 ** (a.thr / 20)
total_before = total_after = 0.0
for sid, n in narration.items():
    mp3 = NAR / f'{sid}.mp3'; wav = NAR / f'{sid}.wav'
    src = mp3 if mp3.exists() else wav
    tmp = NAR / f'{sid}.src.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(src), '-ar', '48000', '-ac', '1', str(tmp)], check=True)
    w = wave.open(str(tmp)); sr = w.getframerate(); nf = w.getnframes()
    s = np.frombuffer(w.readframes(nf), dtype=np.int16).astype(np.float32) / 32768; w.close()
    idx = np.where(np.abs(s) > thr)[0]
    dur = nf / sr
    head = max(0.0, idx[0] / sr - a.head) if len(idx) else 0.0
    end = min(dur, idx[-1] / sr + a.tail) if len(idx) else dur
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(tmp), '-af', f'atrim=start={head:.3f}:end={end:.3f},asetpts=PTS-STARTPTS,atempo={a.tempo}', '-ar', '48000', '-ac', '1', str(wav)], check=True)
    tmp.unlink()
    new_dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(wav)]).decode().strip())
    total_before += dur; total_after += new_dur
    n['durationInSeconds'] = new_dur
    for wd in words.get(sid, []):
        wd['start'] = round(max(0.0, (wd['start'] - head) / a.tempo), 3)
        wd['end'] = round(min(new_dur, max(wd['start'] + 0.05, (wd['end'] - head) / a.tempo)), 3)
    print(f'{sid:10s} {dur:5.2f} → {new_dur:5.2f} s  (recorte {head:.2f}+{dur-end:.2f}, tempo {a.tempo})')
json.dump(narration, open(DATA / 'narration.json', 'w'), indent=2, ensure_ascii=False)
json.dump(words, open(DATA / 'words.json', 'w'), indent=1, ensure_ascii=False)
print(f'total voz {total_before:.2f} → {total_after:.2f} s  (−{total_before-total_after:.2f} s)')

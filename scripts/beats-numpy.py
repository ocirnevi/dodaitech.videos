#!/usr/bin/env python3
"""BPM + grid de beats sin librosa (numpy): flujo espectral → autocorrelación → fase por peine.
  python3 scripts/beats-numpy.py public/music/<x>.mp3 [--out public/music/<x>.beats.json]
Formato igual que analyze-music.py / bed.beats.json: {bpm, beats[], downbeats[]} en segundos."""
import argparse, json, subprocess, numpy as np
ap = argparse.ArgumentParser(); ap.add_argument('audio'); ap.add_argument('--out'); ap.add_argument('--min', type=float, default=80); ap.add_argument('--max', type=float, default=170)
a = ap.parse_args()
SR, N, H = 11025, 1024, 256
raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', a.audio, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'])
y = np.frombuffer(raw, dtype=np.float32)
dur = len(y) / SR
frames = np.lib.stride_tricks.sliding_window_view(y, N)[::H] * np.hanning(N)
mag = np.abs(np.fft.rfft(frames, axis=1))
flux = np.maximum(np.diff(np.log1p(mag * 50), axis=0), 0).sum(axis=1)
flux = (flux - flux.mean()) / (flux.std() + 1e-9)
fps = SR / H
lags = np.arange(int(fps * 60 / a.max), int(fps * 60 / a.min) + 1)
ac = np.array([np.dot(flux[:-l], flux[l:]) / (len(flux) - l) for l in lags])
# refuerza octavas coherentes (lag, 2·lag) para no caer en el doble/mitad
score = ac.copy()
for i, l in enumerate(lags):
    l2 = 2 * l
    if l2 <= lags[-1]: score[i] += 0.5 * ac[int(l2 - lags[0])]
best = lags[int(np.argmax(score))]
# afinado sub-frame por parábola
i = int(np.argmax(score)); 
if 0 < i < len(score) - 1:
    d = (score[i - 1] - score[i + 1]) / (2 * (score[i - 1] - 2 * score[i] + score[i + 1]) + 1e-9); best = best + d
period_s = best / fps
bpm = 60 / period_s
# fase: desplazamiento que maximiza la suma de flujo en el peine
P = period_s * fps
phases = np.arange(0, P, 0.25)
t = np.arange(len(flux))
def comb(ph):
    idx = np.round(np.arange(ph, len(flux), P)).astype(int); idx = idx[idx < len(flux)]; return flux[idx].mean()
ph = phases[int(np.argmax([comb(p) for p in phases]))]
beats = [round(float(b), 3) for b in np.arange(ph / fps, dur, period_s)]
# compás: la fase de 4 beats con más energía
db = int(np.argmax([np.mean([flux[int(round(b * fps))] for b in beats[k::4] if int(round(b * fps)) < len(flux)]) for k in range(4)]))
out = {'bpm': round(bpm, 2), 'beats': beats, 'downbeats': beats[db::4], 'source': a.audio}
path = a.out or a.audio.rsplit('.', 1)[0] + '.beats.json'
json.dump(out, open(path, 'w'))
print(f'{a.audio}: {bpm:.2f} BPM, primer beat {beats[0]} s, {len(beats)} beats, compás desde {beats[db]} s → {path}')

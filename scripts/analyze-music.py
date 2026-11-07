#!/usr/bin/env python3
"""Verifica una cama musical: duración, BPM, grid de beats, downbeat, energía por sección, loop.
Uso: python scripts/analyze-music.py public/music/ai-iceberg/plan.wav [--bpm 120] [--sections 6,14,4,14,5,3]
Escribe <wav>.analysis.json y <wav>.beats.json (segundos) para usarlos en Remotion."""
import json, sys, os
import numpy as np, librosa

wav = sys.argv[1]
args = sys.argv[2:]
want_bpm = float(args[args.index('--bpm') + 1]) if '--bpm' in args else None
secs = [float(x) for x in (args[args.index('--sections') + 1].split(',') if '--sections' in args else [])]
y, sr = librosa.load(wav, sr=22050, mono=True)
dur = len(y) / sr
onset = librosa.onset.onset_strength(y=y, sr=sr)
tempo, beats = librosa.beat.beat_track(y=y, sr=sr, onset_envelope=onset, start_bpm=want_bpm or 120, tightness=100, units='time')
tempo = float(np.atleast_1d(tempo)[0])
# downbeat: entre los 4 primeros beats, el de mayor fuerza de onset
frames = librosa.time_to_frames(beats, sr=sr)
first4 = frames[:4]
db_idx = int(np.argmax(onset[first4])) if len(first4) else 0
downbeats = beats[db_idx::4]
# energía RMS por segundo y por sección
rms = librosa.feature.rms(y=y)[0]
t_rms = librosa.frames_to_time(np.arange(len(rms)), sr=sr)
per_sec = [float(np.mean(rms[(t_rms >= s) & (t_rms < s + 1)])) for s in range(int(dur))]
sect = []
if secs:
    t0 = 0
    for d in secs:
        m = (t_rms >= t0) & (t_rms < t0 + d)
        sect.append({'from': t0, 'to': t0 + d, 'rms_db': float(20 * np.log10(np.mean(rms[m]) + 1e-9))})
        t0 += d
# loop: similitud espectral entre el último 0.5 s y el primer 0.5 s
S = np.abs(librosa.stft(y, n_fft=2048))
head = S[:, : int(0.5 * sr / 512)].mean(axis=1); tail = S[:, -int(0.5 * sr / 512):].mean(axis=1)
loop_sim = float(np.dot(head, tail) / (np.linalg.norm(head) * np.linalg.norm(tail) + 1e-9))
# silencio inicial (la música debe arrancar en el frame 0)
start = float(librosa.frames_to_time(np.argmax(rms > rms.max() * 0.1), sr=sr))
# proporción de energía en banda vocal (300–3400 Hz) como indicio burdo de voces
freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)
voice = S[(freqs > 300) & (freqs < 3400)].sum() / S.sum()
out = {
    'file': os.path.basename(wav), 'duration_s': round(dur, 2), 'bpm_detected': round(tempo, 1), 'bpm_wanted': want_bpm,
    'frames_per_beat_30fps': round(60 / tempo * 30, 2), 'first_downbeat_s': round(float(downbeats[0]), 3) if len(downbeats) else None,
    'beats_count': int(len(beats)), 'start_energy_s': round(start, 3), 'loop_similarity_0_1': round(loop_sim, 3),
    'voice_band_ratio': round(float(voice), 3), 'rms_per_second_db': [round(20 * np.log10(v + 1e-9), 1) for v in per_sec], 'sections': sect,
}
json.dump(out, open(wav + '.analysis.json', 'w'), indent=1)
json.dump({'bpm': round(tempo, 2), 'beats': [round(float(b), 3) for b in beats], 'downbeats': [round(float(b), 3) for b in downbeats]}, open(wav + '.beats.json', 'w'))
print(json.dumps({k: v for k, v in out.items() if k != 'rms_per_second_db'}, indent=1))
print('rms/s dB:', ' '.join(f'{v:.0f}' for v in out['rms_per_second_db']))

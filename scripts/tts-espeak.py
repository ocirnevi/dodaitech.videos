#!/usr/bin/env python3
"""Voz scratch en Linux (sin `say`): espeak-ng vía ctypes, con timestamps por palabra reales
(eventos WORD del sintetizador), así no hace falta whisper para el borrador.

  python3 scripts/tts-espeak.py script/<slug>.json [--voice us-mbrola-2] [--rate 165]

Escribe public/narration/<slug>/<id>.wav (48 kHz), src/data/<slug>/narration.json y src/data/<slug>/words.json
con el mismo formato que scripts/tts.sh + scripts/align.py.
"""
import argparse, ctypes, json, os, struct, subprocess, sys, tempfile, wave

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument('script')
ap.add_argument('--voice', default=None)
ap.add_argument('--rate', type=int, default=165)
ap.add_argument('--pitch', type=int, default=48)
args = ap.parse_args()

script = json.load(open(args.script))
slug = script['id']
voice = args.voice or script.get('scratchVoiceLinux') or 'us-mbrola-2'
out_dir = os.path.join(ROOT, 'public', 'narration', slug)
data_dir = os.path.join(ROOT, 'src', 'data', slug)
os.makedirs(out_dir, exist_ok=True); os.makedirs(data_dir, exist_ok=True)

lib = ctypes.CDLL('libespeak-ng.so.1')

class ID(ctypes.Union):
    _fields_ = [('number', ctypes.c_int), ('name', ctypes.c_char_p), ('string', ctypes.c_char * 8)]
class EVENT(ctypes.Structure):
    _fields_ = [('type', ctypes.c_int), ('unique_identifier', ctypes.c_uint), ('text_position', ctypes.c_int), ('length', ctypes.c_int),
                ('audio_position', ctypes.c_int), ('sample', ctypes.c_int), ('user_data', ctypes.c_void_p), ('id', ID)]
CB = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.POINTER(ctypes.c_short), ctypes.c_int, ctypes.POINTER(EVENT))

AUDIO_OUTPUT_SYNCHRONOUS = 2
rate = lib.espeak_Initialize(AUDIO_OUTPUT_SYNCHRONOUS, 0, None, 0)
if rate <= 0: sys.exit('espeak_Initialize falló')
lib.espeak_SetVoiceByName.argtypes = [ctypes.c_char_p]
if lib.espeak_SetVoiceByName(voice.encode()) != 0: sys.exit(f'voz no encontrada: {voice}')
lib.espeak_SetParameter(1, args.rate, 0)   # espeakRATE
lib.espeak_SetParameter(3, args.pitch, 0)  # espeakPITCH
lib.espeak_SetParameter(4, 55, 0)          # espeakRANGE (entonación)

state = {'samples': bytearray(), 'events': [], 'rate': rate}
def cb(wav, n, events):
    if n > 0 and wav:
        state['samples'] += ctypes.string_at(wav, n * 2)
    i = 0
    while True:
        e = events[i]
        if e.type == 0: break
        if e.type == 8: state['rate'] = e.id.number           # SAMPLERATE (mbrola cambia a 16 kHz)
        if e.type == 1: state['events'].append((e.text_position, e.length, e.audio_position))  # WORD, ms
        i += 1
    return 0
cbp = CB(cb)
lib.espeak_SetSynthCallback(cbp)
lib.espeak_Synth.argtypes = [ctypes.c_char_p, ctypes.c_size_t, ctypes.c_uint, ctypes.c_int, ctypes.c_uint, ctypes.c_uint, ctypes.c_void_p, ctypes.c_void_p]

narration, words_out = {}, {}
for sc in script['scenes']:
    text = sc['narration']
    b = text.encode('utf-8')
    # 1) tiempos por palabra con la voz formante (mbrola no emite eventos WORD en el callback)
    lib.espeak_SetVoiceByName(b'en-us')
    lib.espeak_SetParameter(1, args.rate, 0)
    state['samples'] = bytearray(); state['events'] = []
    lib.espeak_Synth(b, len(b) + 1, 0, 1, 0, 1, None, None); lib.espeak_Synchronize()
    ref_dur = len(state['samples']) / 2 / state['rate']
    events = list(state['events'])
    # 2) audio con la voz elegida; los tiempos se escalan a su duración real
    lib.espeak_SetVoiceByName(voice.encode())
    lib.espeak_SetParameter(1, args.rate, 0); lib.espeak_SetParameter(3, args.pitch, 0)
    state['samples'] = bytearray(); state['events'] = []
    lib.espeak_Synth(b, len(b) + 1, 0, 1, 0, 1, None, None); lib.espeak_Synchronize()
    sr = state['rate']
    dur = len(state['samples']) / 2 / sr
    k_scale = dur / ref_dur if ref_dur else 1
    state['events'] = [(tp, ln, ms * k_scale) for (tp, ln, ms) in events]
    # tokens del guion (separados por espacio) ↔ eventos WORD por posición de carácter (1-based, en texto)
    tokens, pos = [], 0
    for tok in text.split():
        start = text.index(tok, pos); tokens.append((tok, start, start + len(tok))); pos = start + len(tok)
    starts = [None] * len(tokens)
    for (tp, ln, ms) in state['events']:
        ci = tp - 1
        for k, (tok, a, z) in enumerate(tokens):
            if a <= ci < z and starts[k] is None: starts[k] = ms / 1000
    # huecos: interpola entre vecinos
    for k in range(len(tokens)):
        if starts[k] is None:
            prev = next((starts[j] for j in range(k - 1, -1, -1) if starts[j] is not None), 0.0)
            nxt = next((starts[j] for j in range(k + 1, len(tokens)) if starts[j] is not None), dur)
            starts[k] = (prev + nxt) / 2
    ws = []
    for k, (tok, a, z) in enumerate(tokens):
        end = starts[k + 1] - 0.03 if k + 1 < len(tokens) else dur
        ws.append({'word': tok, 'start': round(starts[k], 3), 'end': round(max(end, starts[k] + 0.08), 3)})
    raw = os.path.join(tempfile.gettempdir(), f'{slug}-{sc["id"]}.wav')
    with wave.open(raw, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(bytes(state['samples']))
    wav = os.path.join(out_dir, f'{sc["id"]}.wav')
    # 48 kHz, un poco de aire al final, y leve compresión para que suene a narración
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'highpass=f=80,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,loudnorm=I=-18:TP=-2,apad=pad_dur=0.12',
                    '-ar', '48000', '-ac', '1', wav], check=True)
    d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav]))
    narration[sc['id']] = {'src': f'narration/{slug}/{sc["id"]}.wav', 'durationInSeconds': d}
    words_out[sc['id']] = ws
    print(f'{sc["id"]}: {d:.2f}s  ' + ' '.join(f'{w["word"]}@{w["start"]}' for w in ws))
json.dump(narration, open(os.path.join(data_dir, 'narration.json'), 'w'), indent=2)
json.dump(words_out, open(os.path.join(data_dir, 'words.json'), 'w'), indent=1)
print('voz:', voice, '→', out_dir)

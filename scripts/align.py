#!/usr/bin/env python3
"""Alinea la narración por palabra con faster-whisper (local, gratis).

Transcribe cada WAV de public/narration/ con timestamps por palabra y luego alinea
esas palabras con el TEXTO ORIGINAL del guion (whisper se equivoca en nombres como
NVIDIA o EUV; el guion no). Escribe src/words.json:
  { "<scene>": [ {"word": "Nivel", "start": 0.12, "end": 0.41}, ... ] }
Uso: ~/.pyenv/versions/3.12.13/bin/python scripts/align.py [--model medium] [--lang es]
"""
import json, os, re, sys, time, unicodedata
from difflib import SequenceMatcher

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_name, lang = "medium", "en"
args = sys.argv[1:]
script_path = next((a for a in args if a.endswith('.json')), os.path.join(ROOT, "script", "chip-supply-chain.json"))
if "--model" in args: model_name = args[args.index("--model") + 1]
if "--lang" in args: lang = args[args.index("--lang") + 1]

def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", w)

NUMS = {"200": "twohundred", "40": "forty", "1": "one", "2": "two", "3": "three", "10": "ten", "12": "twelve", "1000": "thousand", "doscientos": "doscientos"}
def norm_num(w):
    n = norm(w)
    return NUMS.get(n, n)

def align(script_words, whisper_words):
    """Devuelve una lista (misma longitud que script_words) de (start, end).
    Palabras no emparejadas se interpolan entre vecinos."""
    a = [norm_num(w) for w in script_words]
    b = [norm_num(w["word"]) for w in whisper_words]
    sm = SequenceMatcher(a=a, b=b, autojunk=False)
    times = [None] * len(a)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1):
                times[i1 + k] = (whisper_words[j1 + k]["start"], whisper_words[j1 + k]["end"])
        elif tag == "replace" and (i2 - i1) and (j2 - j1):
            # reparte el bloque de whisper entre las palabras del guion
            t0 = whisper_words[j1]["start"]; t1 = whisper_words[j2 - 1]["end"]
            n = i2 - i1
            for k in range(n):
                times[i1 + k] = (t0 + (t1 - t0) * k / n, t0 + (t1 - t0) * (k + 1) / n)
    # interpola huecos
    idx = [i for i, t in enumerate(times) if t]
    if not idx:
        raise SystemExit("sin alineación")
    for i in range(len(times)):
        if times[i]: continue
        prev = max([j for j in idx if j < i], default=None)
        nxt = min([j for j in idx if j > i], default=None)
        t0 = times[prev][1] if prev is not None else 0.0
        t1 = times[nxt][0] if nxt is not None else times[prev][1] + 0.3
        gap_words = [j for j in range(i, (nxt if nxt is not None else len(times))) if not times[j]]
        n = len(gap_words); k = gap_words.index(i)
        times[i] = (t0 + (t1 - t0) * k / n, t0 + (t1 - t0) * (k + 1) / n)
    return times

from faster_whisper import WhisperModel
script = json.load(open(script_path))
slug = script["id"]
lang = script.get("language", lang)[:2] if "--lang" not in args else lang
narration = json.load(open(os.path.join(ROOT, "src", "data", slug, "narration.json")))
t0 = time.time()
model = WhisperModel(model_name, device="cpu", compute_type="int8")
print(f"whisper {model_name} cargado en {time.time()-t0:.1f}s", file=sys.stderr)
out = {}
for scene in script["scenes"]:
    sid = scene["id"]; meta = narration[sid]
    wav = os.path.join(ROOT, "public", meta["src"])
    segments, info = model.transcribe(wav, language=lang, word_timestamps=True, vad_filter=False, beam_size=5)
    ww = [{"word": w.word.strip(), "start": w.start, "end": w.end} for s in segments for w in (s.words or [])]
    sw = scene["narration"].split()
    times = align(sw, ww)
    out[sid] = [{"word": w, "start": round(t[0], 3), "end": round(t[1], 3)} for w, t in zip(sw, times)]
    matched = sum(1 for a, b in zip([norm_num(w) for w in sw], []) )  # placeholder
    print(f"{sid}: {len(sw)} palabras guion / {len(ww)} whisper, {meta['durationInSeconds']:.1f}s", file=sys.stderr)
json.dump(out, open(os.path.join(ROOT, "src", "data", slug, "words.json"), "w"), ensure_ascii=False, indent=1)
print(f"src/data/{slug}/words.json escrito", file=sys.stderr)

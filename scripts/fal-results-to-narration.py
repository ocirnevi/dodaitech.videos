#!/usr/bin/env python3
"""Convierte el resultado de wait_for_jobs del MCP de fal (ElevenLabs TTS con timestamps) en la narración de un guion:
public/narration/<slug>/<id>.{mp3,wav,fal-timestamps.json}, src/data/<slug>/narration.json y words.json.
Los índices de los jobs siguen el orden de las escenas del guion, empezando en --start (por defecto 0).
  python3 -I scripts/fal-results-to-narration.py <resultado.json|txt> <slug> [--start 0]
Después: python3 scripts/tighten-narration.py <slug>
"""
import argparse, json, re, subprocess, unicodedata, urllib.request
from pathlib import Path

ap = argparse.ArgumentParser(); ap.add_argument('results'); ap.add_argument('slug'); ap.add_argument('--start', type=int, default=0)
a = ap.parse_args()
ROOT = Path(__file__).resolve().parent.parent
raw = open(a.results).read()
try:
    data = json.loads(raw)
except json.JSONDecodeError:
    data = json.loads(raw[raw.index('{'):raw.rindex('}') + 1])
if isinstance(data, list): data = json.loads(data[0]['text'])
if 'jobs' not in data and 'text' in data: data = json.loads(data['text'])
script = json.load(open(ROOT / 'script' / f'{a.slug}.json'))
OUT = ROOT / 'public' / 'narration' / a.slug; DATA = ROOT / 'src' / 'data' / a.slug
OUT.mkdir(parents=True, exist_ok=True); DATA.mkdir(parents=True, exist_ok=True)
norm = lambda s: re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFD', s.lower()).encode('ascii', 'ignore').decode())

def words_from(text, ts, total):
    if isinstance(ts, list) and ts and isinstance(ts[0], dict) and 'characters' in ts[0]: ts = ts[0]
    cs, st, en = ts['characters'], ts['character_start_times_seconds'], ts['character_end_times_seconds']
    items, cur = [], None
    for i, c in enumerate(cs):
        if c.isspace():
            if cur: items.append(cur)
            cur = None; continue
        if not cur: cur = {'text': '', 'start': st[i], 'end': en[i]}
        cur['text'] += c; cur['end'] = en[i]
    if cur: items.append(cur)
    out, j = [], 0
    for tok in text.split():
        target, start, end, acc = norm(tok), None, None, ''
        while j < len(items) and (len(acc) < len(target) or start is None):
            it = items[j]; j += 1; n = norm(it['text'])
            if not n: continue
            if start is None: start = it['start']
            end = it['end']; acc += n
            if len(acc) >= len(target): break
        if start is None: start = out[-1]['end'] if out else 0
        if end is None: end = start + 0.2
        out.append({'word': tok, 'start': round(start, 3), 'end': round(min(end, total), 3)})
    return out

jobs = {j['index']: j for j in data['jobs']}
narration, words = {}, {}
for k, sc in enumerate(script['scenes']):
    job = jobs[a.start + k]
    if job.get('status') != 'completed': raise SystemExit(f"job {a.start + k} ({sc['id']}): {job.get('status')}")
    r = job['result']; sid = sc['id']; mp3 = OUT / f'{sid}.mp3'; wav = OUT / f'{sid}.wav'
    urllib.request.urlretrieve(r['audio']['url'], mp3)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(mp3), '-ar', '48000', '-ac', '1', str(wav)], check=True)
    d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(wav)]).decode().strip())
    narration[sid] = {'src': f'narration/{a.slug}/{sid}.wav', 'durationInSeconds': d}
    json.dump(r['timestamps'], open(OUT / f'{sid}.fal-timestamps.json', 'w'), indent=1, ensure_ascii=False)
    words[sid] = words_from(sc['narration'], r['timestamps'], d)
json.dump(narration, open(DATA / 'narration.json', 'w'), indent=2, ensure_ascii=False)
json.dump(words, open(DATA / 'words.json', 'w'), indent=1, ensure_ascii=False)
print(f"{a.slug}: {len(narration)} clips, voz total {sum(v['durationInSeconds'] for v in narration.values()):.2f} s")

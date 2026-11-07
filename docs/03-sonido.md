# Sonido para explainers cortos generados con Remotion + ffmpeg

Verificado 7 nov 2026. **[oficial]** página del proveedor · **[secundario]** blogs · **[inferido]**.

## 1. Librerías de SFX

| Librería | Licencia (YT/TikTok monetizado) | Atribución | API / bulk | Precio | Notas |
|---|---|---|---|---|---|
| **Freesound** | CC0, CC BY o CC BY-NC por sonido; BY-NC excluye comercial [oficial] ([FAQ](https://freesound.org/help/faq/)) | CC0 no; CC BY sí | **API v2** con key: `/search/?filter=license:"Creative Commons 0"`, previews `preview-hq-mp3` sin OAuth; el WAV original exige OAuth2 ([docs](https://freesound.org/docs/api/resources_apiv2.html)) | Gratis | Calidad variable; filtrar `duration:[0 TO 2]`, `avg_rating:[4 TO *]`, `sort=rating_desc` |
| **Pixabay SFX** | Content License, comercial sin atribución ([resumen](https://pixabay.com/service/license-summary/)) | No | La API oficial **no cubre audio** ([API](https://pixabay.com/api/docs/)) | Gratis | Curada; descarga manual |
| **Mixkit** | Free License comercial, YouTube, redes ([FAQ](https://mixkit.co/free-sound-effects/)) | No | Sin API, ~1,000 SFX | Gratis | Alta para UI/whoosh |
| **Zapsplat** | Comercial; free exige crédito "Sound from Zapsplat.com" ([license](https://www.zapsplat.com/license-agreement)) | Sí en free | Sin API | Gold ~$4–5/mes | WAV solo Gold |
| **Uppbeat** | Free 3 descargas + crédito; Premium sin crédito ([pricing](https://uppbeat.io/pricing)) | Sí en free | Sin API | $67/año | SFX solo de pago |
| **Epidemic Sound** | Suscripción cubre YT/TikTok/IG | No | **API** (free tier prototipado, Partner para producción) ([help](https://help.epidemicsound.com/hc/en-us/articles/35854988839570-Getting-Started-with-the-API)); 250k SFX | $10–17/mes | Excelente |
| **Artlist** | Social: 1 canal por plataforma | No | Sin API | $10/mes | Excelente |
| **Soundly** | Free ~3k / Pro 250k, comercial | No | App de escritorio que indexa librerías locales | ~$15/mes | Profesional |
| **BBC Sound Effects** | RemArc: **no comercial** | — | — | — | Descartar |
| **Sonniss GDC** | Royalty-free, comercial, sin atribución, de por vida; prohibido revender y entrenar IA ([gameaudiogdc](https://sonniss.com/gameaudiogdc)) | No | Bundles 2015–2024 por ZIP/torrent, 9–48 GB cada uno | Gratis | Profesional WAV 24-bit |
| **YouTube Audio Library** | Monetizable en YPP; CC exige crédito ([soporte](https://support.google.com/youtube/answer/3376882)) | Solo CC | Sin API | Gratis | Correcta |
| **Envato Elements** | Por proyecto registrado | No | Sin API | $16.50/mes | Muy buena |
| **Splice** | 100 % royalty free ([plans](https://splice.com/plans)) | No | App | $13/mes | One-shots, risers, impacts excelentes |

**Top 3 para automatizar**: 1) **Sonniss GDC** (licencia más limpia, local, un script indexa los WAV; 2020 + 2024 ≈ 72 GB bastan). 2) **Freesound API con CC0** (búsqueda programática real; previews HQ sin OAuth). 3) **Epidemic Sound** si hay presupuesto. Complemento manual: Mixkit y Pixabay.

## 2. Música

Librerías: YouTube Audio Library (gratis, CC con crédito), Uppbeat, Epidemic (API gated), Artlist, Pixabay Music, [Free Music Archive](https://freemusicarchive.org/License_Guide) (CC por pista, evitar NC/ND), Musicbed, Soundstripe.

**Generación con IA programática**:

| Servicio | Precio | Derechos | Bed de 45 s a BPM fijo |
|---|---|---|---|
| **ElevenLabs Music API** | **$0.15/min** directo ([pricing](https://elevenlabs.io/pricing/api)); vía fal $0.60/min ([fal](https://fal.ai/models/fal-ai/elevenlabs/music)) | Comercial desde Starter; acuerdos Merlin/Kobalt ([docs](https://elevenlabs.io/docs/capabilities/music)) | **Sí, la mejor**: `music_length_ms=45000`, `force_instrumental=true`; sigue el BPM si pones "128 BPM" y describes "drum hit on the downbeat, no intro swell" ([best practices](https://elevenlabs.io/docs/overview/capabilities/music/best-practices)); `composition_plan` controla duración por sección ([compose](https://elevenlabs.io/docs/api-reference/music/compose)) |
| **Stable Audio 2.5** | $0.08/generación directo ([pricing](https://docs.stability.ai/pricing)); fal $0.20 ([fal](https://fal.ai/models/fal-ai/stable-audio-25/text-to-audio)) | Community License, gratis bajo $1M ingresos | Sí: `seconds_total`, `seed`; terminar el prompt con "…, 128 BPM" ([guía](https://stability.ai/guides/stable-audio-25-prompt-guide)); downbeat no garantizado → 2–3 seeds + librosa |
| Suno | $10–30/mes | Comercial solo Pro/Premier | **No**: sin API pública (programa partner curado) |
| Udio | — | En transición tras acuerdo UMG | No API |
| Google Lyria | ~$0.06/30 s | SynthID | Mal ajuste: clips fijos de 32.8 s sin BPM |
| Beatoven | ~$3/min | Perpetua no exclusiva | Parcial |

**Recomendación**: ElevenLabs Music directo ($0.15/min) para beds con BPM y duración exactas; Stable Audio 2.5 como alternativa barata. Ambos generan también SFX únicos (ElevenLabs Sound Effects API).

## 3. Kit mínimo de SFX y su timing

| # | Categoría | Uso | Timing |
|---|---|---|---|
| 1 | Whoosh corto (150–400 ms) | Entrada/salida de texto | **Pico en el frame del corte**; arranca 4–8 frames antes |
| 2 | Whoosh largo (0.6–1.2 s) | Transición entre secciones | Igual: se alinea el pico, no el inicio |
| 3 | Riser (1–3 s) | Antes de una revelación | Termina **exactamente** en el corte; recortar por el final |
| 4 | Impact / bass hit | Título, número grande | Transiente en el frame del cambio (0–1 frame antes) |
| 5 | Tick / click | Bullets, contadores | En el frame de cada ítem; variar 2–3 muestras |
| 6 | Pop | Iconos, burbujas | Frame de aparición; pitch ±2 semitonos por instancia |
| 7 | Glitch | "pero…", corrección | <300 ms sobre el glitch visual |
| 8 | UI blip | Toggles, checks | Frame del cambio |
| 9 | Shimmer | Highlight, insight | Inicio en el highlight; cola 0.5–1 s |
| 10 | Reverse swoosh | Pre-roll de un hit | Cola alineada al destino |
| 11 | Typing | Texto que se escribe | 1 tick por 1–2 caracteres; silenciar bajo VO densa |
| 12 | Shutter | Capturas, freeze | Frame del flash |
| 13 | Notificación | Alertas, CTA | 1 vez por video |
| 14 | Stinger musical (1–2 s) | Logo, cierre | Downbeat en el frame del logo |
| 15 | Drone / ambience | Cama sin música | Fade 10–20 frames, −30 dB |

**Timing con evidencia**: alinear el **transiente**, no el primer sample; "un pelo antes" lee mejor que tarde, pero 1 frame, no más ([Morphic](https://morphic.com/resources/how-to/how-to-sync-sound-effects-to-video)); umbral de desincronía ≈45 ms con audio adelantado (ITU-R BT.1359). **Regla del pipeline: hits y clicks 0–1 frame antes del visual; whooshes y risers alineados por su pico o final al corte.** En Remotion: `startFrom = cutFrame - Math.round(peakOffsetSec * fps)`.

## 4. Mezcla

- **Objetivos**: YouTube ≈ −14 LUFS integrados (solo baja, nunca sube; verificar en "Stats for nerds → content loudness"); TikTok/IG sin objetivo oficial, ≈ −14 adaptativo; **true peak −1 dBTP**; LRA 6–11 LU ([Frame.io](https://workflow.frame.io/guide/loudness-for-youtube), [Fora Soft](https://www.forasoft.com/learn/audio-for-video/articles-audio/lufs-targets-per-platform-2026)).
- **Ratios** (guías de práctica): música **18–25 dB bajo la voz** mientras habla, −10/−12 dB en huecos; SFX con picos 3–6 dB bajo la voz; un hit puede igualarla un instante ([Epidemic](https://www.epidemicsound.com/blog/audio-mixing-for-video)). Regla operativa: VO a −16 LUFS antes de mezclar; música −20 dB bajo VO con ducking; −10 dB en huecos.

**loudnorm dos pasadas a −14 LUFS / −1 dBTP** ([ffmpeg](https://ffmpeg.org/ffmpeg-filters.html#loudnorm)):
```bash
ffmpeg -i mix.wav -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null - 2> pass1.json
ffmpeg -i mix.wav -af "loudnorm=I=-14:TP=-1:LRA=11:measured_I=-18.6:measured_LRA=7.2:measured_TP=-3.4:measured_thresh=-29.1:offset=0.3:linear=true" -ar 48000 -c:a aac -b:a 192k out.m4a
```
**Ducking sidechain** ([sidechaincompress](https://ffmpeg.org/ffmpeg-filters.html#sidechaincompress)):
```bash
ffmpeg -i voz.wav -i musica.wav -i sfx.wav -filter_complex "
[0:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,asplit=2[vkey][vmix];
[1:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=-12dB[bg];
[bg][vkey]sidechaincompress=threshold=0.02:ratio=8:attack=60:release=700:knee=4:detection=rms[duck];
[vmix][duck][2:a]amix=inputs=3:duration=first:dropout_transition=0:normalize=0[out]" -map "[out]" -ar 48000 pre_master.wav
```
`threshold=0.02` ≈ −34 dBFS; ratio 8 baja el bed ~18–20 dB bajo voz; attack 60 ms no tapa el primer fonema; `normalize=0` evita que amix baje todo.
**Limitador**: `-af "alimiter=limit=0.891:attack=5:release=60:level=false"` (≈ −1 dBFS; sample-peak, usar antes de loudnorm). **Medir**: `ffmpeg -nostats -i out.m4a -af ebur128=peak=true -f null -`.

Nota: Remotion mezcla internamente; el pase de loudnorm se aplica al MP4 final con `-c:v copy`.

## 5. Beat sync

ffmpeg no detecta beats. **librosa** ([beat_track](https://librosa.org/doc/0.11.0/generated/librosa.beat.beat_track.html)):
```python
import librosa, json
y, sr = librosa.load("bed.wav", sr=22050, mono=True)
tempo, beats = librosa.beat.beat_track(y=y, sr=sr, start_bpm=125, tightness=100, units="time")
json.dump({"bpm": float(tempo[0]), "beats": beats.tolist(), "downbeats": beats[::4].tolist()}, open("beats.json","w"))
```
Si se pidió el BPM a la IA, pasarlo como `bpm=` y solo fijar la fase. **aubio** CLI: `aubiotrack -i bed.wav -T ms` ([manual](https://aubio.org/manual/latest/cli.html)).

**Frames por beat** = 60 / BPM × fps: a 30 fps, 120 BPM = 15 frames exactos, 100 = 18, 150 = 12. **Pedir BPM que den frames enteros** (90, 100, 120, 150 a 30 fps). Cortar en frases de 2/4/8 beats, reservar el corte por beat para el dato clave. **Rango para short-form: 120–140 BPM** (150+ fatiga; 90–110 tutoriales) ([RouteNote](https://licensing.routenote.com/blog/?p=8778), [Stability](https://stability.ai/guides/stable-audio-25-prompt-guide)). **Punto de partida: 120 BPM a 30 fps** (15 f/beat, 60 f/compás), cortes cada 2 beats en ritmo alto y cada 4 en bloques de explicación.

No verificables directamente: Artlist pricing, Zapsplat license, Uppbeat pricing, BBC, Soundstripe.

## Lecciones del primer uso (7 nov 2026, ElevenLabs Music vía fal)

- El `composition_plan` de fal exige `lines: []` en cada sección aunque sea instrumental (422 si falta).
- `respect_sections_durations: true` no es exacto: el modelo adelantó el giro de 20 s a 16 s y el payoff de 38 s a 32 s, y convirtió la "cola en loop" en 2 s de silencio. Mejor **generar primero y ajustar el guion a la música** que insistir en tiempos.
- La dinámica sale de estilos locales explícitos ("quiet", "sparse", "no change") y negativos ("build", "climax"). La v2 con más instrucciones salió más fuerte y plana (−10 LUFS sin arco): más texto no es más control.
- El prompt libre con `force_instrumental` loopea mejor pero no tiene arco. Para camas narrativas, plan; para loops de fondo, prompt.
- BPM pedido 120, intervalo real entre beats 0.500 s (120 exactos; el estimador global de librosa dijo 117.5, el intervalo medio es lo fiable). Primer downbeat en 1.045 s: el grid de cortes parte de ahí (`bed.beats.json`).
- Costo real por cama: $0.60 por intento; presupuestar 2–3 intentos por video.

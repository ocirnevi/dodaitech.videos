# Short · "Would you want AI to remember your entire life?" — compuertas 0 y 1

**Estado:** v4 con voz final y host mitad y mitad (`out/ai-memory/final-v4.mp4`, 56.2 s, 1080×1920, 30 fps, −14 LUFS / −1 dBTP), 8 nov.
Host: look "home studio" de Enrico (HeyGen, generado por prompt a partir de su foto; prompt e ids en `script/ai-memory.json → host.heygen` y `docs/06 §7`),
Avatar V, con el audio de Alex en el hook (3 s) y el cierre (1.8 s). Formato reel: gráficos arriba, Enrico abajo (`HostSplit`), subtítulos en la línea,
etiqueta "AI avatar". Enrico descartó la v3 (tarjeta con WebM alfa: "no se ve natural"). Clips en `public/avatar/ai-memory/*-studio.mp4`.
v2 (sin host) fue Enrico aprobó la v1
(voz scratch, 48.8 s) y pidió la voz de Alex: generada con ElevenLabs multilingual-v2 vía el MCP de fal (17 clips, 863 caracteres, $0.09;
`speed` 1.05, `previous_text`/`next_text` para continuidad). Tiempos por palabra de los timestamps de ElevenLabs (sin whisper). Música `public/music/muted-pulse.mp3`
(95.9 BPM detectados con `scripts/beats-numpy.py`), SFX Sonniss. Pendiente: revisión de la v2; decidir si se recorta a ≤45 s.

**Guion:** el de Enrico, palabra por palabra (147 palabras). Está por encima de las 120 palabras / 45 s del playbook; si hay que recortar,
candidatos: "Here's how they work." (L5) y "And suddenly, a device that helps you remember everything raises a much bigger question." → "And suddenly, that raises a much bigger question." (−8 palabras, −3 s).

## Compuerta 0 · Packaging

**Armature:** *Un aparato que recuerda todo por ti también recuerda a todos los que te rodean: la memoria perfecta no es solo tuya para elegir.*

**Momento de 5 segundos:** el anillo del colgante, que durante la primera mitad "escucha" para ti, se abre y abarca a *friends · coworkers · complete strangers*.

**Inicio = opuesto del final:** frame 1 "What if you remembered every conversation?" (deseo) → cierre "Would you actually want it to?" (duda), misma composición, loop.

**Títulos:**
- A. *Would you want AI to remember your entire life?*
- B. *The wearable that never forgets (and never asks)*
- C. *AI memory wearables: the catch nobody mentions*

**Texto del frame 1:** **"What if you remembered every conversation?"** (6 palabras)

## Compuerta 1 · Guion de 3 columnas

Protagonista visual único: **el colgante** (disco con micrófono y anillo naranja). 2D plano; Omi y Plaud como nombres en pills, sin logos.

| t | Voz (guion de Enrico) | Visual | Beat | Fuente |
|---|---|---|---|---|
| 0–3.1 | What if you could remember every conversation you've ever had? | Claro. Titular del frame 1; burbujas de chat que se acumulan. | — | — |
| 3.1–5.1 | Not with your brain. With AI. | "your brain" tachado en "brain"; "AI" en naranja en "AI". | — | — |
| 5.1–7.6 | Meet the next generation of AI memory wearables. | Oscuro. Aparece el colgante; el anillo empieza a escuchar en "wearables". | — | — |
| 7.6–12.5 | Tiny devices like Omi and Plaud that you can wear on your shirt, wrist, or around your neck. | Silueta de línea; pills Omi/Plaud en su palabra; el colgante salta a camisa → muñeca → cuello. | pills | omi.me · plaud.ai |
| 12.5–13.8 | Here's how they work. | Capítulo "How they work" + tres puntos. | — | — |
| 13.8–18.5 | They record conversations, turn speech into text, and use AI to organize what was said. | Tres pasos que entran en su palabra: onda → líneas de texto → tarjetas to-do/ideas/people. | 3 pasos | — |
| 18.5–20.7 | Forgot what your boss asked you to do? | Claro. Caja "ask your memory" donde se escribe la pregunta. | — | — |
| 20.7–22.7 | Or that brilliant idea you had over coffee? | Misma caja, otra pregunta; taza de línea. | — | — |
| 22.7–26.3 | Instead of searching through endless notes, you could ask your AI memory. | Notas que pasan cada vez más rápido → en "ask" corte a una sola barra "Ask your memory…". | — | — |
| 26.3–30.0 | And some devices are designed to capture conversations throughout your day. | Oscuro. Línea del día 7:00–23:00 que se llena de conversaciones de "capture" a "day". | — | — |
| 30.0–31.9 | Sounds incredible, right? | Claro. Frase grande. | — | — |
| 31.9–33.2 | But here's the catch. | **Re-hook.** Oscuro, glitch + submerge, "Here's the catch." | — | — |
| 33.2–35.2 | Your conversations aren't just yours. | El colgante con el anillo abierto; en "yours" aparecen cinco siluetas alrededor. | — | — |
| 35.2–38.8 | They involve friends, coworkers, and complete strangers. | Pills en su palabra; "complete strangers" en naranja; el anillo punteado se expande. | pills | — |
| 38.8–43.4 | And suddenly, a device that helps you remember everything raises a much bigger question. | Se dibuja un "?" enorme cuyo punto es el colgante; titular en "bigger". | — | — |
| 43.4–45.7 | If AI could remember your entire life… | La línea del día se vuelve línea de la vida (age 0–80) y se llena. | — | — |
| 45.7–47.3 | Would you actually want it to? | Claro. Titular espejo del frame 1 + colgante + pills yes / no. Loop. | — | — |
| 47.3–48.8 | — | Outro wordmark + dodaitech.com | — | — |

**Datos en pantalla:** ninguno numérico (no hace falta `sources[]` de cifras). Marcas: Omi y Plaud solo tipografiadas.

## Qué revisar (comentarios por `t` o `L`)
- ¿Recortar a ≤45 s (ver arriba) o dejar el guion íntegro?
- `t7.6–12.5`: ¿se entiende la silueta y los tres saltos del colgante?
- `t38.8–43.4`: el "?" con el colgante como punto es el plano de portada candidato.
- Voz scratch robótica: solo timing.

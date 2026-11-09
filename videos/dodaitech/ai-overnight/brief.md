# Short · "AI that works while you sleep" — dodaitech — compuertas 0 y 1

**Estado:** v1 final (`out/ai-overnight/final-v1.mp4`, 41.1 s, 1080×1920, −14 LUFS), 9 nov 2026.
Guion de Enrico palabra por palabra (12 escenas, 117 palabras). Voz Alex (ElevenLabs multilingual-v2 vía fal), apretada con `scripts/tighten-narration.py` (tempo 1.08) y GAP 2.
Host P2 (HeyGen, Avatar IV) mitad y mitad en hook y cierre, etiqueta "AI avatar". Composición `src/shorts/AiOvernight.tsx`.
Reglas aplicadas: ningún texto fijo repite la palabra del karaoke (titulares parafraseados; las marcas entran tras decirse), sin aire muerto, 3 bloques con energía creciente.

## Compuerta 0 · Packaging

**Armature:** *AI agents now act, not just answer: they browse, handle email and calendar, research and build files, and run on a schedule, so you can wake up to finished work.*

**Momento de 5 segundos:** el cursor naranja del agente maneja solo el navegador (teclea, pulsa, llena, envía) mientras no hay nadie.

**Inicio = opuesto del final:** luna y portátil trabajando solo ↔ sol de las 7:00 con todo terminado.

**Títulos:**
- A. *AI that works while you sleep*
- B. *Wake up to finished work*
- C. *Your AI agent's night shift*

**Texto del frame 1:** **"Your to-do list, done by morning."**

## Compuerta 1 · Guion · visual

| escena | voz | visual |
|---|---|---|
| hook | What if AI could work for you while you're sleeping? | Noche (oscuro): luna y estrellas; un portátil marca solo su lista de tareas con el cursor del agente. Titular "Your to-do list, done by morning." Host P2 abajo. |
| now | Well, now it can. | Interruptor que pasa a ON (naranja) en "now". |
| browse | AI agents can open websites, click buttons, fill out forms, and complete tasks for you. | Ventana de navegador: el cursor del agente teclea la URL, pulsa el botón, llena el formulario, envía; check. Titular "Hands off the mouse." |
| inbox | Connect your email and calendar, and they can find important messages, prepare replies, and organize your schedule. | Iconos de correo y calendario se conectan al nodo del agente; bandeja con un mensaje destacado (★), borrador de respuesta y bloques de calendario que se ordenan. |
| research | Need competitor research? They'll compare websites and build a spreadsheet. | Dos sitios "A" y "B" → flechas → hoja de cálculo que se llena celda a celda. Titular "A vs B, in rows." |
| deck | Need a presentation? They'll create one. | Tres diapositivas que se abren en abanico. Titular "Slides: handled." |
| best | And here's the best part. | Giro, claro: "Plot twist." |
| schedule | You can schedule tasks to run automatically. | Reloj girando rápido y una línea de tiempo 2 AM · 4 AM · 6 AM que se enciende en "automatically". Titular "Set it once." |
| wake | Imagine waking up to your emails summarized, your business metrics analyzed, and your reports ready. | Payoff: sale el sol (opuesto del hook); tres tarjetas con check: correo resumido, gráfica, reporte. Titular "7:00 AM". |
| tools | Tools like ChatGPT Work and Claude Cowork are making this possible. | Pills "ChatGPT Work" y "Claude Cowork" entran justo después de que la voz las nombra, unidas al nodo del agente. Titular "Already here." |
| done | AI isn't just answering questions anymore. It's getting things done. | Burbuja de chat con "?" se encoge; lista de tareas que se completa. Titular "Less talk. More action." |
| follow | Follow Dodai Tech for more tech news! | Logo + "dodaitech" tras decirse el nombre; host P2 abajo. Outro con dodaitech.com. |

**Fuentes:** sin cifras en pantalla. "Claude Cowork" es el modo de agente de escritorio de Anthropic; **"ChatGPT Work" no lo verificó Claude**: confirmar el nombre antes de publicar. Marcas como texto en pills, sin logos.

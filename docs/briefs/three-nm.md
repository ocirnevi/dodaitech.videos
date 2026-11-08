# Short de prueba · "Nothing in a 3 nm chip is 3 nm" — compuertas 0 y 1 (prueba de 10 s)

**Estado:** prueba pedida por Enrico (8 nov): un video de ~10 s, tema libre, "lo mejor que puedas". Hecho de corrido
(sin pasar compuerta por compuerta) porque era una prueba; el resultado es `out/three-nm/final-v1.mp4` (10.07 s, 1080×1920, 30 fps, −14 LUFS / −1 dBTP).
Costo fal: $0 (voz scratch espeak-ng/mbrola en Linux, música reutilizada de ai-iceberg, SFX Sonniss).

**Entorno:** se hizo en una sesión en la nube (Linux), sin `say` ni whisper. Nuevo `scripts/tts-espeak.py` sintetiza con espeak-ng
(voz `us-mbrola-2`) y saca los timestamps por palabra de los eventos del sintetizador, así los beats y subtítulos caen en su palabra sin alinear.
Es voz de borrador: la final sigue siendo Alex (ElevenLabs vía fal), ≈ 100 caracteres.

## Compuerta 0 · Packaging

**Armature:** *El "3 nm" de un chip es un nombre comercial, no una medida: nada dentro de un chip de 3 nm mide 3 nm.*

**Momento de 5 segundos:** la etiqueta "3 nm" gigante se vuelve una muesca diminuta al lado de las medidas reales (23 nm, 45 nm), dibujadas a escala.

**Inicio = opuesto del final:** arranca con la etiqueta como la vende el marketing; cierra con la misma etiqueta y un ™ (loop al frame 1).

**Títulos:**
- A. *Nothing in a 3 nm chip is 3 nm*
- B. *"3 nanometers" is a brand name*
- C. *The lie on your phone's chip* (más clickbait)

**Texto del frame 1:** **"Nothing here is 3 nanometers."** (5 palabras)

## Compuerta 1 · Guion (21 palabras, ≈ 8.6 s de voz + outro 1.4 s)

| t | Voz | Visual | Beat / dato | Fuente |
|---|---|---|---|---|
| 0–3.0 | Nothing in a 3-nanometer chip measures 3 nanometers. | Claro. Titular del frame 1 + la etiqueta "3 nm" como pill grande, "the label on your phone's chip". | — | — |
| 3.0–6.6 | Thinnest wires: 23 apart. Gates: 45. | Oscuro. Muesca "3 nm at this scale" (39 px); luego cota 23 nm con tres cables y cota 45 nm con dos compuertas, a la misma escala (13 px/nm). Contadores en su palabra. | counter 23 nm · counter 45 nm | WikiChip, TSMC N3: gate pitch 45 nm, metal pitch 23 nm |
| 6.6–8.7 | The number is a name. Not a size. | Claro. Vuelve la pill; en "name" aparece el ™; "A name. / Not a size." arriba. | callout | IEEE Spectrum (2019): los nombres de nodo ya no describen ninguna dimensión |
| 8.7–10.1 | — | Outro wordmark + dodaitech.com | — | — |

**Fuentes para la descripción:**
- WikiChip, "3 nm lithography process" (TSMC N3: CGP 45 nm, MMP 23 nm).
- IEEE Spectrum, *The Nanosheet Transistor Is the Next (and Maybe Last) Step in Moore's Law* (2019).
- Nota: "since ~1997" en la pill del cierre se refiere a cuando el nombre de nodo dejó de coincidir con el largo de compuerta (ITRS). Verificar antes de publicar o quitar.

**Hipótesis de hook:** contraste directo ("nothing here is 3 nm") sobre un objeto que todos tienen (el chip del teléfono).

## Qué revisar (comentarios por `t` o `#`)
- `t3–6.6`: ¿se entiende el diagrama sin leer las etiquetas? ¿Sobra la muesca de 3 nm o es el chiste?
- Voz scratch robótica: solo para timing; no juzgar la entonación.
- Música: es la cama de ai-iceberg (120 BPM), cortes en beat; para un video real se genera una propia.

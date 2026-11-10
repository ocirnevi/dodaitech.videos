# Short · "How Starlink beams internet from space" — dodaitech — compuertas 0 y 1

**Estado:** v1 final (`out/starlink-lasers/final-v1.mp4`, 46.0 s, 1080×1920, −14 LUFS), 10 nov 2026.
Guion de Enrico palabra por palabra (14 escenas, 136 palabras (más de 120 palabras: es tu guion completo, no lo recorté)). Voz Alex (fal), apretada con `scripts/tighten-narration.py`, GAP 2.
Host P2 (HeyGen Avatar IV) mitad y mitad en hook y cierre, subtítulos sobre el corte. Composición: `src/shorts/StarlinkLasers.tsx` sobre el kit común `src/shorts/kit.tsx` (`makeShort`).
Reglas aplicadas: ningún texto fijo repite la palabra del karaoke (titulares parafraseados; pills y cifras entran después de que la voz las dice); sin aire muerto; bloques claro/oscuro alternados.

## Compuerta 0 · Packaging

**Armature:** *Your antenna radios a satellite, which drops to a ground station; with no station nearby, satellites pass the data by laser: a network in the sky.*

**Momento de 5 segundos:** With no station in the middle of the ocean, the data packet jumps from satellite to satellite by laser and lands.

**Inicio = opuesto del final:** It opens with "without cables" and closes with a network in the sky.

**Texto del frame 1:** **"Wi-Fi from orbit."**

## Compuerta 1 · Guion · visual

Protagonista visual: **el satélite y el paquete de datos (punto naranja)**.

| escena | voz | visual |
|---|---|---|
| hook | How does SpaceX deliver internet from space without cables? | Host P2 abajo; arriba un satélite. "Wi-Fi from orbit." |
| answer | The answer is pretty incredible. | Mismo plano: el satélite gira. |
| thousands | Starlink uses thousands of satellites orbiting Earth. | Globo con la constelación; pill Starlink. |
| how | But here's how it actually works. | "Step by step." |
| antenna | When you open a website, your Starlink antenna sends a radio signal to a satellite hundreds of kilometers above you. | Casa + antena; ondas suben al satélite. "step 1 · up" |
| ground | That satellite can send the data down to a ground station connected to the internet. | Ondas bajan a una estación con cable. "step 2 · down" |
| nostation | But what if there's no ground station nearby? | Océano sin estación. "Middle of the ocean?" |
| interesting | That's where things get interesting. | Giro: "Enter: light." |
| lasers | Starlink satellites can communicate with each other using lasers! | Rayos láser entre satélites. "Linked by light." |
| speed | These invisible beams transfer data between satellites at the speed of light. | Mismo plano: el paquete corre por el haz. |
| hop | Your data can travel across space, hopping between satellites, before returning to Earth. | El paquete salta de satélite en satélite y aterriza. "Hop, hop, land." |
| fast | And all of this happens in fractions of a second. | Cronómetro que da vueltas. "Blink-fast." |
| network | SpaceX is essentially building an internet network in the sky. | Malla de satélites sobre la Tierra. "A web above the web." |
| follow | Follow Dodai Tech for more tech news! | Host P2 abajo; wordmark dodaitech arriba. |

**Fuentes (`sources[]`):**
- Guion de Enrico (10 nov 2026).
- SpaceX/Starlink: órbita baja ≈ 340–570 km; enlaces láser entre satélites; latencia ≈ 25–60 ms. Verificar antes de publicar.
- **Para revisar:** SpaceX/Starlink: órbita ≈ 340–570 km, enlaces láser, latencia ≈ 25–60 ms. El video no muestra cifras; verificar si se citan en la descripción.

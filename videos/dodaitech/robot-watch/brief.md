# Short · "Robots that learn by watching you" — dodaitech — compuertas 0 y 1

**Estado:** v1 final (`out/robot-watch/final-v1.mp4`, 47.5 s, 1080×1920, −14 LUFS), 10 nov 2026.
Guion de Enrico palabra por palabra (17 escenas, 144 palabras (más de 120 palabras: es tu guion completo, no lo recorté)). Voz Alex (fal), apretada con `scripts/tighten-narration.py`, GAP 2.
Host P2 (HeyGen Avatar IV) mitad y mitad en hook y cierre, subtítulos sobre el corte. Composición: `src/shorts/RobotWatch.tsx` sobre el kit común `src/shorts/kit.tsx` (`makeShort`).
Reglas aplicadas: ningún texto fijo repite la palabra del karaoke (titulares parafraseados; pills y cifras entran después de que la voz las dice); sin aire muerto; bloques claro/oscuro alternados.

## Compuerta 0 · Packaging

**Armature:** *Seeing is not doing: a robot has to turn pixels into its own movements and the right force, so it practices with feedback.*

**Momento de 5 segundos:** The robot squeezes the glass: too little and it slips, too much and it shatters, with the force gauge swinging between the two.

**Inicio = opuesto del final:** It opens with a person watching a glass and closes with the robot holding it, from vision to action.

**Texto del frame 1:** **"Monkey see, robot do?"**

## Compuerta 1 · Guion · visual

Protagonista visual: **la cabeza-cámara del robot y el vaso**.

| escena | voz | visual |
|---|---|---|
| hook | What if robots could learn just by watching you? | Host P2 abajo; arriba cabeza-robot y vaso. Titular "Monkey see, robot do?". |
| nvidia | Well, Nvidia is working on exactly that. | Pill NVIDIA entra después de que la voz la dice. |
| glass | Imagine watching someone pick up a glass. | Brazo humano levanta un vaso. "Easy for you." |
| instant | You instantly understand the movement. | Mismo plano: se dibuja la trayectoria. "One simple move." |
| sees | But a robot sees something completely different. | Visor del robot con el mismo vaso. "Through its eyes:" |
| pixels | Pixels. | El visor se vuelve píxeles. |
| recognize | So first, AI has to recognize the hand, the glass, and how they're moving through space. | Cajas sobre mano y vaso, flecha de movimiento. "Find it. Track it." |
| patterns | Then it learns patterns from thousands of examples. | Rejilla de miles de ejemplos que alimentan al robot. "Watch. Repeat. Learn." |
| tricky | But here's the tricky part. | Giro (claro): "Seeing ≠ doing." |
| copy | A robot can't simply copy your movements. | Brazo humano vs brazo robot, no calcan. "Not a mirror." |
| body | Its arms are different. Its joints move differently. And it needs to calculate how much force to use. | Articulaciones distintas y medidor de fuerza. "New body, new math." |
| little | Too little, and the glass slips. | Poca fuerza: el vaso resbala. |
| much | Too much, and it breaks. | Mucha fuerza: el vaso se rompe. |
| feedback | That's why robots also need to practice and adjust their movements using feedback. | Ciclo intentar → sentir → corregir. "Try. Feel. Fix." |
| research | And this is what makes Nvidia's research so interesting. | Pill "NVIDIA Research". |
| turn | We're teaching machines to turn what they see into what they can physically do. | Ojo → mano. "Vision → action." |
| follow | Follow Dodai Tech for more tech news! | Host P2 abajo; wordmark dodaitech arriba. |

**Fuentes (`sources[]`):**
- Guion de Enrico (10 nov 2026). Sin cifras en pantalla.
- NVIDIA Research en aprendizaje de robots por imitación de video humano (GR00T, DexMimicGen, 2024–2025). Verificar el proyecto concreto antes de publicar.
- **Para revisar:** NVIDIA: el guion no da proyecto ni cifras. Verificar el nombre del proyecto (GR00T / DexMimicGen) antes de citarlo en la descripción.

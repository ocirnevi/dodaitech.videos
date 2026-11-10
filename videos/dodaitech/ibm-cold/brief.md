# Short · "Why IBM freezes its quantum computers" — dodaitech — compuertas 0 y 1

**Estado:** v1 final (`out/ibm-cold/final-v1.mp4`, 50.1 s, 1080×1920, −14 LUFS), 10 nov 2026.
Guion de Enrico palabra por palabra (16 escenas, 144 palabras (más de 120 palabras: es tu guion completo, no lo recorté)). Voz Alex (fal), apretada con `scripts/tighten-narration.py`, GAP 2.
Host P2 (HeyGen Avatar IV) mitad y mitad en hook y cierre, subtítulos sobre el corte. Composición: `src/shorts/IbmCold.tsx` sobre el kit común `src/shorts/kit.tsx` (`makeShort`).
Reglas aplicadas: ningún texto fijo repite la palabra del karaoke (titulares parafraseados; pills y cifras entran después de que la voz las dice); sin aire muerto; bloques claro/oscuro alternados.

## Compuerta 0 · Packaging

**Armature:** *Qubits are so fragile that heat turns into errors, so IBM chills them to a fraction of a degree above absolute zero.*

**Momento de 5 segundos:** The fridge "chandelier" lights up plate by plate (50 K → 0.015 K) and the counter lands on −273 °C.

**Inicio = opuesto del final:** It opens with a question about the cold and closes with the irony: the most advanced computers are the coldest machines on Earth.

**Texto del frame 1:** **"−273 °C. On purpose."**

## Compuerta 1 · Guion · visual

Protagonista visual: **el candelabro del refrigerador de dilución y la esfera del qubit**.

| escena | voz | visual |
|---|---|---|
| hook | Why does IBM cool its quantum computers to almost absolute zero? | Host P2 abajo; arriba el candelabro. "−273 °C. On purpose." |
| space | We're talking colder than outer space. | Termómetro por debajo del espacio (2.7 K). "Beyond freezing." |
| why | Here's why. | Oscuro, sin titular. |
| bits | Normal computers use bits. Each bit is either a zero or a one. | Interruptor 0/1. "On or off." |
| qubits | But quantum computers use something called qubits. | Esfera de Bloch. |
| super | And thanks to quantum physics, a qubit can exist in a combination of zero and one. | La flecha apunta entre 0 y 1. "Both, at once." |
| powerful | Sounds powerful, right? | "Exponential." |
| problem | Here's the problem. | Giro: "There's a catch." |
| sensitive | Qubits are incredibly sensitive. | Qubit tembloroso. "Handle with care." |
| heat | Even tiny amounts of heat can disturb their quantum states, causing errors. | Ondas de calor desvían la flecha; errores. "Heat = noise." |
| cool | So IBM cools its superconducting quantum chips to temperatures just a fraction of a degree above absolute zero. | Candelabro con temperaturas por plato; pill "IBM Quantum". |
| minus | That's around minus 273 degrees Celsius! | Contador que baja y llega a −273 °C después de que la voz lo dice. |
| maintain | At these temperatures, the circuits can maintain the delicate quantum behavior needed for computation. | Qubit estable. "Calm qubits, clean math." |
| crazy | The crazy part? | "Irony alert." |
| coldest | We're building some of the world's most advanced computers by making them some of the coldest machines on Earth. | Chip con copo de nieve. "Brains on ice." |
| follow | Follow Dodai Tech for more tech news! | Host P2 abajo; wordmark dodaitech arriba. |

**Fuentes (`sources[]`):**
- Guion de Enrico (10 nov 2026).
- Fixsen D.J. The Temperature of the Cosmic Microwave Background. ApJ 2009;707:916 (2.7255 K).
- IBM Quantum: los procesadores superconductores operan a ≈ 15 mK en refrigeradores de dilución. Verificar cifra exacta antes de publicar.
- **Para revisar:** Fixsen 2009 (fondo cósmico 2.7255 K); IBM Quantum ≈ 15 mK (verificar cifra exacta).

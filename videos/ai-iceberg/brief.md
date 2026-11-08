# Short 1 · "The Hidden World Behind ChatGPT" — compuertas 0 y 1

**Estado:** compuerta 2 en revisión con **v3** (`storyboard-v3.png`, `animatic-v3.mp4`): iceberg completo siempre a la vista, cámara quieta, hielo blanco bajo agua oscura, la capa activa se enciende en naranja y la(s) empresa(s) de cada capa aparecen como etiquetas grandes (ChatGPT · OpenAI, DeepSeek · Microsoft, Google, Amazon · TSMC · ASML, NVIDIA). v1 (3D) y v2 (2D con cámara que baja) quedan como descartadas: Enrico pidió "fácil de absorber, que parezca iceberg".

**Logos:** uso nominativo (hablar de la empresa) es práctica normal en explainers y de bajo riesgo si no se altera el logo ni se sugiere respaldo. Pero OpenAI pidió retirar su logo de Simple Icons y NVIDIA prohíbe usar su marca sin permiso escrito, y TSMC/ASML no están en librerías CC0. Por eso la v3 usa **los nombres tipografiados** en pills (cero riesgo, igual de reconocibles). Si Enrico quiere los logos reales, se bajan de los press kits oficiales y se colocan sin modificar; la posición de la etiqueta ya está resuelta.

**Decisiones de Enrico (7 nov):** título *The Hidden World Behind ChatGPT*; hook *"OpenAI makes ChatGPT. But who makes the technology that makes ChatGPT possible?"*; música generada con ElevenLabs Music vía fal; SFX de Sonniss GDC 2026. Pendiente: iceberg 3D (recomendado) vs ilustrado.

Fuente de la idea: el diagrama "AI Iceberg" que compartiste (Applications → LLMs → Infrastructure → Supply → Production → Design).
Formato: 9:16, 1080×1920, 30 fps, objetivo **42–45 s**, inglés, voz Alex. Sin logo hasta el outro de 1.5 s.

## Compuerta 0 · Packaging

**La pregunta**: *Where does AI actually live?* (la versión infantil de la pregunta, a lo Cleo Abram).

**Armature** (una frase que todo el video demuestra): *AI feels like software, but it's a physical, fragile stack that ends in one machine, one factory, one design.*

**Momento de 5 segundos** (el payoff): la cámara llega al fondo del iceberg y revela que todo lo de arriba descansa en **una** empresa de litografía, **una** fábrica y **un** diseño. "Three companies. One failure point."

**Inicio = opuesto del final**: arriba, la app que parece vivir "en la nube, en ninguna parte".

**Tres títulos** (elige uno o mezcla):
- A. *Where does AI actually live?*
- B. *ChatGPT is not in the cloud.*
- C. *The AI iceberg nobody shows you*

**Texto del frame 1** (visible sin sonido): **"The hidden world behind ChatGPT"** (5 palabras).

**Tres hooks de voz** (elige uno):
1. Contraste: *"ChatGPT isn't in the cloud. It's in a building in Iowa that drinks a river."*
2. Familiar + único: *"Every prompt you type ends up inside a $200 million machine only one company on Earth can build."*
3. Stakes: *"If one factory in Taiwan stops, every AI app you use stops with it."*

## Compuerta 1 · Guion de 3 columnas (v2, alineado a la música, 112 palabras, 44 s)

**La música manda el reloj.** Cama generada con ElevenLabs Music (`public/music/ai-iceberg/bed.wav`, 44.2 s, 120 BPM exactos
(intervalo entre beats 0.500 s = 15 frames), grid de beats en `bed.beats.json`). Su estructura: pulso tranquilo 0–16 s · giro (riser + capa nueva) 16–20 s ·
tensión 20–30 s · respiro casi en silencio 30–32 s · payoff 32–44 s. El guion se reparte sobre esa forma y los cortes
caen en beats reales.

Metáfora visual única: **el iceberg**. Arriba del agua, papel piedra (claro); bajo el agua, banda soot (oscuro). La cámara
baja una capa por bloque. Cada capa = un número concreto que cae en su palabra + un cambio visual cada ≤3 s.

| t | Música | Voz (Alex) | Visual | Beat / dato | Fuente |
|---|---|---|---|---|---|
| 0–2 | kick en 0 | OpenAI makes ChatGPT. | Frame 1: texto "The hidden world behind ChatGPT" sobre la punta del iceberg; burbuja de chat en la punta. | — | — |
| 2–6 | pulso | But who makes the technology that makes it possible? Six layers down. | Zoom-out desde la pregunta y se queda: el iceberg entero, con aire, y el 6 cae encima. Whoosh. | counter 6 | — |
| 6–9 | pulso | Layer one: the app. Easy to build, useless alone. | Capa 1 iluminada. Icono de chat. | callout "Apps" | — |
| 9–13 | pulso | Layer two: the model. Training it costs hundreds of millions and thousands of GPUs. | Capa 2. Contador $ y GPUs apilándose. | counter 100 M+ | Epoch AI (rango) |
| 13–16 | pulso | Layer three: data centers that burn as much power as a city. | Capa 3. Línea de energía, mapa de calor. | callout "city-scale power" | IEA |
| 16–20 | **giro** | And here's the part nobody shows you. | **Re-hook**: la cámara baja de verdad, se aleja y enseña el hielo de abajo. Texto "nobody shows you this". | — | — |
| 20–25 | tensión | Layer four: the wafer. A thousand steps, people in suits. | Capa 4. Trajes de sala limpia y una oblea. Contador. | counter 1,000+ | mismo dato que el short del chip |
| 25–30 | tensión | Layer five: the factory. One company, TSMC, makes almost all advanced AI chips. | Capa 5. Oblea. Contador. | counter ~90 % | TrendForce / Reuters (verificar) |
| 30–32 | **respiro** | And the machine that draws them? | Hourglass: plano fijo, casi silencio, solo la máquina EUV apareciendo en la oscuridad. | — | — |
| 32–38 | **payoff** | Only ASML builds it. Two hundred million dollars each. Layer six: the design. NVIDIA draws it. | Impacto en 32: máquina EUV iluminada; contador $200 M; die de GPU. | counter $200 M | Reuters / ASML |
| 38–42 | payoff | So your chat rests on one machine, one factory, one design. | El iceberg sale. En pantalla solo queda 1 · 1 · 1. | callout "1 · 1 · 1" | — |
| 42–44 | cierre | Not OpenAI. | Corte al frame 1 (loop). Outro dodaitech 1.5 s sobre papel piedra. | — | — |

**Qué reutilizamos** del video anterior: oblea 3D, máquina EUV 3D, die de GPU, sistema de beats y subtítulos karaoke, SFX, voz Alex. **Qué es nuevo**: composición vertical, el iceberg como escenario (ilustración generada con fal en 2 capas + agua, ver receta en `04-herramientas-visuales.md`, ≈ $0.30), música a 120 BPM generada con ElevenLabs Music (≈ $0.15) o la pista actual.

**Decisiones que necesito de ti**
1. Título (A/B/C) y hook (1/2/3).
2. ¿Iceberg ilustrado con fal (≈ $0.30, estilo vector editorial) o iceberg 3D low-poly en Three.js (gratis, más "nuestro")? Mi recomendación: 3D low-poly con la paleta de marca, y fal solo si no convence en el storyboard.
3. Música: generada ✔ (plan v1, $1.80 en total con las pruebas; ver `out/ai-iceberg/costs.md`).
4. Cifras: confirmo cada número con fuente antes del storyboard y te las muestro en la tabla final.

Responde con `OK` o `L<n>: nota` y arranco la compuerta 2 (storyboard con voz scratch, gratis).

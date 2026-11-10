# Short · GTA director humiliation — private style test — dodaitech

**Estado:** prueba privada de capacidad. No se publica. Composición `GtaDirector` (`src/shorts/GtaDirector.tsx`).

**Voz:** Alex, archivo ya generado `public/narration/gta-director/alex-vo-v1.mp3` (68.08 s). No se volvió a llamar a fal. No se corrió `tighten-narration.py`: el atempo movería el audio y desfasaría los timestamps de ElevenLabs que vinieron con el archivo (`src/data/gta-director/words.json`, 231 palabras).

**Por qué no entra por la fábrica de shorts:** la narración es un solo mp3 con tiempos absolutos, no un clip por escena. Los planos se cortan contra esas palabras.

**Armature:** un mecánico que Nelson aprobó lo encierra y lo obliga a correr, porque Leonida está hecha de eventos no guionados.

**Texto del frame 1:** "Wrecked inside his own game" (en pantalla: WRECKED, karaoke aparte).

**Reglas aplicadas**
- 1080×1920, 30 fps, sangre a sangre (crop del trailer, sin letterbox ni blur-fill).
- Karaoke blanco, palabra activa amarilla, 1–3 palabras, desde el frame 1, zona y ≈ 1180.
- Ningún titular usa una palabra que el karaoke está mostrando en ese instante (el sello dice ✓ mientras se oye "approved"; HIMSELF entra en el plano siguiente).
- Coches en vector 2D (planta, perfil, ruedas, ventana, frente), no 3D low-poly.
- Outro dodaitech + dodaitech.com ≈ 2.1 s. Total 70.4 s.
- Cama original a 120 BPM, ducking bajo la voz. El render de Remotion queda cerca de −18 LUFS; el mp4 de entrega pasa loudnorm lineal a −14.3 LUFS / −1.1 dBTP (`ffmpeg -c:v copy -af loudnorm=I=-14:TP=-1:LRA=11:linear=true`).
- Sin foto de Rob Nelson: pastilla con el nombre sobre un plano de conducción.
- Logos: no se incrustó un archivo de press kit. El plano del logo oficial se veía ilegible al recortar a 9:16, así que "VI" va en tipografía sobre footage.

**No publicar.** El footage es de los trailers oficiales de GTA VI, solo para esta prueba.

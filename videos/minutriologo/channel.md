# Canal · Mi Nutriólogo

- **Qué es:** marca propia de Enrico, en español, distinta de Hello Nutrition AI aunque comparten identidad visual: nutrición con base científica, Shorts de 30–50 s, sin cara; la marca es el personaje.
- **Identidad:** la misma de Hello Nutrition AI (9 nov 2026, pedido de Enrico): fondo gris claro `#F4F4F6`, tinta `#0B0B0F`, gris `#6E6E73`, acento verde `#2ECC70`, modo oscuro `#0B0B0F` / `#1C1C21`, fuente **Onest**, logo manzana-corazón (copia en `public/brand/minutriologo/`).
  Tokens en `src/brands/minutriologo.ts` (extiende `hellonutrition`; solo cambian nombre y sitio).
- **Idioma:** español neutro con giros de México (es-MX). Los guiones se traducen de los de Hello Nutrition AI y se adaptan, no se calcan ("poop" → "ir al baño").
- **Voz:** **Laura** (ElevenLabs premade, multilingual-v2, `language_code: es`) a 1.05, `style` 0.3. Enrico la eligió el 9 nov entre Sarah, Laura, Jessica y Matilda escuchando el hook; es distinta de la de Hello Nutrition AI (Matilda). Las dos marcas se mantienen separadas: carpetas, tema y voz propias.
- **Outro:** logo + "Mi Nutriólogo", sin dominio (Enrico, 9 nov), 1.5 s. Cierre habitual: "¡Sigue a Mi Nutriólogo para más consejos de nutrición con respaldo científico!".
- **Duración:** el español corre más largo que el inglés con el mismo guion, y depende de la voz: el guion de kiwis dio 46.3 s de voz con Matilda y 43.5 s con Laura.
- **Datos:** toda afirmación de salud lleva estudio en `sources[]` y en la descripción.
- **Feedback de Enrico:** `videos/minutriologo/FEEDBACK.md`.

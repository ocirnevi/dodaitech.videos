# Canal · Mi Nutriólogo

- **Qué es:** el hermano en español de Hello Nutrition AI: nutrición con base científica, Shorts de 30–50 s, sin cara; la marca es el personaje.
- **Identidad:** la misma de Hello Nutrition AI (9 nov 2026, pedido de Enrico): fondo gris claro `#F4F4F6`, tinta `#0B0B0F`, gris `#6E6E73`, acento verde `#2ECC70`, modo oscuro `#0B0B0F` / `#1C1C21`, fuente **Onest**, logo manzana-corazón (copia en `public/brand/minutriologo/`).
  Tokens en `src/brands/minutriologo.ts` (extiende `hellonutrition`; solo cambian nombre y sitio).
- **Idioma:** español neutro con giros de México (es-MX). Los guiones se traducen de los de Hello Nutrition AI y se adaptan, no se calcan ("poop" → "ir al baño").
- **Voz:** Matilda (ElevenLabs premade, multilingual-v2, `language_code: es`) a 1.05, `style` 0.3. Misma voz que el canal en inglés.
- **Outro:** logo + "Mi Nutriólogo" + minutriologo.ai, 1.5 s. Cierre habitual: "¡Sigue a Mi Nutriólogo para más consejos de nutrición con respaldo científico!".
- **Duración:** el español corre ≈ 10–15 % más largo que el inglés con el mismo guion; si un video inglés está en 44 s, el español cae en ≈ 49 s.
- **Datos:** toda afirmación de salud lleva estudio en `sources[]` y en la descripción.
- **Feedback de Enrico:** `videos/minutriologo/FEEDBACK.md`.

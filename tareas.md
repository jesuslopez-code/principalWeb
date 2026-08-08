# Tareas por fases — principalWeb

Plan por **fases** con estado. Se ejecuta con `/fase <n|nombre>`. **Al terminar cada fase, PARAR**
para que Jesús pruebe y valide antes de seguir. Estados de tarea: `[ ]` pendiente · `[~]` en curso ·
`[x]` hecha.

## Fase 1 — Cerrar la limpieza

- **Objetivo:** dejar el proyecto compilando y sin enlaces muertos tras el desacople de Firebase y
  el borrado de las demos estáticas.
- **Alcance:** `src/app/layout.tsx`, la sección Projects de `src/app/page.tsx`,
  `src/lib/placeholder-images.json`, `package.json` y `README.md`.
  **Fuera de alcance:** SEO (Fase 3), rendimiento (Fase 4), contenido nuevo.
- **Entregables:** build que arranca sin errores de módulo; sección Projects sin enlaces rotos;
  dependencias sin restos de Firebase.
- **Criterios de aceptación:** `npm run build` y `npm run dev` arrancan sin errores; no queda
  ninguna referencia a `firebase` ni a `/web1` o `/web2` en `src/`; `README.md` describe el proyecto
  real y no la plantilla de Firebase Studio.
- **Dependencias:** ninguna. **Estado:** en curso — bloqueada por la pregunta abierta.
- **Notas / riesgos:** el working tree tiene la limpieza sin commitear. Los agentes **no borran
  ficheros**: si algo sobra, lo señalan y lo borra Jesús.

Tareas:
- [x] Quitar el import y el uso de `FirebaseClientProvider` en `src/app/layout.tsx`, dejando
      `{children}` y `<Toaster />` directamente en el `<body>`.
- [x] Retirar la dependencia `firebase` de `package.json` y comprobar que nada más en `src/` la
      referencia.
- [x] Restaurar `src/components/ui/label.tsx`, borrado por error y necesario para `form.tsx`
      (FIX-003).
- [x] Arreglar el script `build` de `package.json`, que no funcionaba en Windows (FIX-004).
- [ ] Quitar las dos tarjetas de proyecto que apuntan a `/web1` y `/web2` de la constante `projects`
      en `src/app/page.tsx` — **bloqueada por la pregunta abierta de abajo**.
- [ ] **PREGUNTA ABIERTA para Jesús:** decidir qué queda en la sección Projects una vez retiradas
      esas dos tarjetas. Opciones a plantear: ocultar la sección entera hasta tener casos de estudio
      reales (Fase 5), dejarla con un texto de "próximamente", o sustituirla por enlaces a
      repositorios de GitHub. **No decidirlo por cuenta propia**; el resultado condiciona la Fase 5.
- [ ] Limpiar de `src/lib/placeholder-images.json` las entradas que queden sin uso tras lo anterior
      (`project-1`, `project-2` según lo decidido, y `project-3`, cuya imagen `public/dashboard.png`
      ya no existe) — **bloqueada por la pregunta abierta**: las tres entradas dependen de qué pase
      con la sección.
- [x] Revisar las imágenes huérfanas de `public/images/` y reportarlas a Jesús. Resultado: la única
      sin usar es `2025-10-07 175434.png`. Pendiente de que Jesús decida si se borra.
- [x] Reescribir `README.md` con el proyecto real: qué es, stack, cómo levantarlo (`npm run dev` en
      el puerto 9002) y cómo se despliega.
- [ ] Revisión con `pweb-reviewer` y cierre de la fase (parar y validar).

## Fase 2 — Red de seguridad

- **Objetivo:** que un error de tipos o de lint vuelva a impedir un despliegue roto.
- **Alcance:** `next.config.ts` y los errores que afloren al reactivar las comprobaciones.
  **Fuera de alcance:** refactors que no sean necesarios para dejarlo en verde.
- **Entregables:** `next.config.ts` sin los `ignore`, o con ellos justificados por escrito si algo
  impide quitarlos.
- **Criterios de aceptación:** `npm run typecheck` y `npm run lint` en verde, y `npm run build`
  fallando de verdad si se introduce un error de tipos a propósito.
- **Dependencias:** Fase 1. **Estado:** pendiente.
- **Notas / riesgos:** al quitar `ignoreBuildErrors` pueden aflorar errores latentes de la
  plantilla original. Si son muchos, acotar y consultar antes de arreglarlos en bloque.

Tareas:
- [ ] Ejecutar `npm install` y `npm run typecheck` para inventariar los errores reales de tipos —
      `pweb-tester`.
- [ ] Quitar `typescript.ignoreBuildErrors` y `eslint.ignoreDuringBuilds` de `next.config.ts` —
      `pweb-frontend-dev`.
- [ ] Corregir los errores de tipos y de lint que afloren — `pweb-frontend-dev`.
- [ ] Revisión con `pweb-reviewer` y cierre de la fase (parar y validar).

## Fase 3 — SEO base

- **Objetivo:** que el sitio se indexe y se comparta correctamente, con metadatos completos y datos
  estructurados.
- **Alcance:** metadatos del layout y de cada ruta, `robots.ts`, `sitemap.ts`, JSON-LD, canonical.
  **Fuera de alcance:** rendimiento (Fase 4) y contenido nuevo.
- **Entregables:** `metadataBase` y OpenGraph/Twitter completos, imagen OG, `src/app/robots.ts`,
  `src/app/sitemap.ts` y JSON-LD de tipo `Person`.
- **Criterios de aceptación:** el HTML servido incluye canonical, OG y JSON-LD válidos;
  `/robots.txt` y `/sitemap.xml` responden correctamente; el JSON-LD pasa un validador de datos
  estructurados.
- **Dependencias:** Fase 1. **Estado:** pendiente.
- **Notas / riesgos:** antes de empezar hay que fijar el **dominio canónico** (con o sin `www`); sin
  esa decisión, `metadataBase` y el sitemap saldrían mal.

Tareas:
- [ ] Confirmar con Jesús el dominio canónico y el texto de título/descripción definitivos —
      `pweb-seo`.
- [ ] Completar el `export const metadata` de `src/app/layout.tsx`: `metadataBase`, `openGraph`,
      `twitter`, `alternates.canonical`, `robots` y `keywords` — `pweb-seo`.
- [ ] Crear la imagen OpenGraph y referenciarla en los metadatos — `pweb-seo` (el diseño de la
      imagen lo aporta Jesús si no vale una generada).
- [ ] Crear `src/app/robots.ts` y `src/app/sitemap.ts`, preparados para admitir las rutas futuras —
      `pweb-seo`.
- [ ] Añadir JSON-LD de tipo `Person` con perfil, enlaces sociales y ocupación — `pweb-seo`.
- [ ] Revisión con `pweb-reviewer` y cierre de la fase (parar y validar).

## Fase 4 — Rendimiento y accesibilidad

- **Objetivo:** puntuar alto en Core Web Vitals y que la página sea navegable y semántica.
- **Alcance:** carga de fuentes, imágenes, jerarquía de encabezados, `alt`, contraste y foco.
  **Fuera de alcance:** rediseño visual y animaciones (Fase 8).
- **Entregables:** fuente Inter servida con `next/font`, imágenes optimizadas y locales, HTML
  semántico revisado.
- **Criterios de aceptación:** Lighthouse con Rendimiento, Accesibilidad y SEO en verde; sin CLS
  visible al cargar; un solo `<h1>` por página y jerarquía de encabezados coherente.
- **Dependencias:** Fase 3. **Estado:** pendiente.
- **Notas / riesgos:** la imagen del hero se sirve hoy desde una URL absoluta externa
  (`https://jesuslopezweb.com/images/portada.jpeg`) mientras el resto son locales; conviene
  unificarlas en local.

Tareas:
- [ ] Sustituir el `<link>` a Google Fonts del layout por `next/font/google` con Inter —
      `pweb-seo`.
- [ ] Traer la imagen del hero a `public/images/` y actualizar `placeholder-images.json`;
      revisar si siguen haciendo falta todos los `remotePatterns` de `next.config.ts` — `pweb-seo`.
- [ ] Revisar `sizes`, `priority` y dimensiones de cada `next/image` — `pweb-seo`.
- [ ] Revisar la semántica y la accesibilidad de las secciones: `<section>`, jerarquía de
      encabezados, textos `alt` descriptivos, foco visible y contraste — `pweb-seo` define y
      `pweb-frontend-dev` aplica.
- [ ] Pasar Lighthouse y registrar el resultado — `pweb-tester`.
- [ ] Revisión con `pweb-reviewer` y cierre de la fase (parar y validar).

## Fases previstas (sin desarrollar todavía)

Anotadas para no perderlas. Su alcance, entregables y tareas se definen al abrir cada fase; hoy solo
existe la intención.

### Fase 5 — Casos de estudio

Rutas `/proyectos` y `/proyectos/[slug]` con fichas reales de proyecto (problema, solución,
tecnologías, resultados). Sustituye a la sección Projects actual y depende de lo que se decida en la
pregunta abierta de la Fase 1. Hay que elegir fuente de contenido (MDX en el repo frente a CMS) y
generar metadatos por ficha con `generateMetadata`, además de incorporar las fichas al sitemap.

### Fase 6 — Blog MDX

Ruta `/blog` con artículos en MDX: listado, artículo individual, metadatos por artículo y entradas
en el sitemap. Comparte con la Fase 5 la decisión sobre la fuente de contenido, así que conviene
resolverla una sola vez.

### Fase 7 — Tema claro/oscuro

Conmutador de tema. **Los tokens del modo claro ya existen** en el bloque `:root` de
`src/app/globals.css`, pero están sin usar porque `<html className="dark">` está fijo en el layout:
el trabajo es quitar esa clase fija, añadir el conmutador con persistencia y evitar el parpadeo en
la primera carga, no redefinir la paleta.

### Fase 8 — Animaciones

Transiciones de entrada de secciones y microinteracciones, respetando
`prefers-reduced-motion` y sin penalizar los Core Web Vitals conseguidos en la Fase 4.

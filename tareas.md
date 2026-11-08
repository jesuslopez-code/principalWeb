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
- **Dependencias:** ninguna. **Estado:** hecho.
- **Notas / riesgos:** los agentes **no borran ficheros**: si algo sobra, lo señalan y lo borra
  Jesús.

Tareas:
- [x] Quitar el import y el uso de `FirebaseClientProvider` en `src/app/layout.tsx`, dejando
      `{children}` y `<Toaster />` directamente en el `<body>`.
- [x] Retirar la dependencia `firebase` de `package.json` y comprobar que nada más en `src/` la
      referencia.
- [x] Restaurar `src/components/ui/label.tsx`, borrado por error y necesario para `form.tsx`
      (FIX-003).
- [x] Arreglar el script `build` de `package.json`, que no funcionaba en Windows (FIX-004).
- [x] Quitar las dos tarjetas de proyecto que apuntan a `/web1` y `/web2` de la constante `projects`
      en `src/app/page.tsx` (commit `cfebd1b`).
- [x] Pregunta abierta resuelta por Jesús: la sección Projects enlaza a repositorios reales de
      GitHub (`iglesia-barbate` y `pruebaTecnicaBack`) hasta que lleguen las fichas de la Fase 5.
- [x] Limpiar de `src/lib/placeholder-images.json` las entradas `project-*` sin uso: ya no queda
      ninguna referencia en `src/`.
- [x] Revisar las imágenes huérfanas de `public/images/` y reportarlas a Jesús. Resultado: la única
      sin usar es `2025-10-07 175434.png`. **Pendiente de que Jesús decida si la borra.**
- [x] Reescribir `README.md` con el proyecto real: qué es, stack, cómo levantarlo (`npm run dev` en
      el puerto 9002) y cómo se despliega.
- [x] Cierre de la fase (parar y validar). Revisión con `pweb-reviewer` omitida por
      decisión de Jesús: el cambio es pequeño y acotado.

## Fase 2 — Red de seguridad

- **Objetivo:** que un error de tipos o de lint vuelva a impedir un despliegue roto.
- **Alcance:** `next.config.ts` y los errores que afloren al reactivar las comprobaciones.
  **Fuera de alcance:** refactors que no sean necesarios para dejarlo en verde.
- **Entregables:** `next.config.ts` sin los `ignore`, o con ellos justificados por escrito si algo
  impide quitarlos.
- **Criterios de aceptación:** `npm run typecheck` y `npm run lint` en verde, y `npm run build`
  fallando de verdad si se introduce un error de tipos a propósito.
- **Dependencias:** Fase 1. **Estado:** hecho.
- **Notas / riesgos:** al quitar `ignoreBuildErrors` pueden aflorar errores latentes de la
  plantilla original. Si son muchos, acotar y consultar antes de arreglarlos en bloque.

Tareas:
- [x] Ejecutar `npm install` y `npm run typecheck` para inventariar los errores reales de tipos —
      `pweb-tester`.
- [x] Quitar `typescript.ignoreBuildErrors` y `eslint.ignoreDuringBuilds` de `next.config.ts` —
      `pweb-frontend-dev`.
- [x] Corregir los errores de tipos y de lint que afloren — `pweb-frontend-dev`.
- [x] Cierre de la fase (parar y validar). Revisión con `pweb-reviewer` omitida por
      decisión de Jesús: el cambio es pequeño y acotado.

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
- **Dependencias:** Fase 1. **Estado:** hecho.
- **Responsable IA:** Claude · agente `pweb-seo` · modelo Sonnet.
- **Notas / riesgos:** dominio canónico fijado por Jesús: `https://jesuslopezweb.com` (sin `www`).

Tareas:
- [x] Confirmar con Jesús el dominio canónico: `https://jesuslopezweb.com`, sin `www`.
- [x] Proponer título y descripción definitivos, más cortos que los actuales — `pweb-seo` (Jesús
      los valida al cerrar la fase).
- [x] Completar el `export const metadata` de `src/app/layout.tsx`: `metadataBase`, `openGraph`,
      `twitter`, `alternates.canonical`, `robots` y `keywords` — `pweb-seo`.
- [x] Crear la imagen OpenGraph y referenciarla en los metadatos — `pweb-seo` (generada con
      `next/og`; Jesús puede sustituirla por una diseñada).
- [x] Crear `src/app/robots.ts` y `src/app/sitemap.ts`, preparados para admitir las rutas futuras —
      `pweb-seo`.
- [x] Añadir JSON-LD de tipo `Person` con perfil, enlaces sociales y ocupación — `pweb-seo`.
- [x] Revisión con `pweb-reviewer`: apto con cambios; cambios aplicados (ver abajo).
- [x] Cierre de la fase: Jesús valida título y descripción (2026-11-07). Queda pendiente para tras
      el despliegue comprobar `/robots.txt`, `/sitemap.xml` y `/opengraph-image` en producción y
      pasar el JSON-LD por Rich Results Test.

Cambios tras la revisión (`pweb-seo`): canonical y `openGraph.url` salen del layout y se declaran en
`export const metadata` de `src/app/page.tsx` (openGraph redeclarado entero porque Next no lo
fusiona); LinkedIn percent-encoded en `src/lib/site.ts` (los dos literales de `page.tsx` quedan
para `pweb-frontend-dev`); `lastModified` fuera de `sitemap.ts`; `#fafafa` del OG sustituido por la
constante `HEADING`. Re-verificado desde el hilo principal: `typecheck`, `lint` (2 avisos
esperados) y `build` OK; en `.next/server/app/index.html` salen canonical y `og:url`
`https://jesuslopezweb.com`, `og:image` heredada de `opengraph-image.tsx` y JSON-LD válido. Corregido
además el slug de LinkedIn (`jes%C3%BAs-l%C3%B3pez-serrano`; la primera codificación perdía "es").

Relevo (`pweb-seo`, Sonnet):
- **Ficheros:** nuevos `src/lib/site.ts` (URL base, nombre, título, descripción, enlaces y lista
  `SITE_ROUTES`), `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/opengraph-image.tsx`;
  modificado `src/app/layout.tsx` (metadata completa + `<script ld+json>` Person al inicio del
  `<body>`).
- **Textos propuestos (Jesús valida):** título `Jesús López | Desarrollador Web Full-Stack` (41
  car.), con `title.template` `%s | Jesús López` para rutas futuras; descripción «Desarrollador
  Full-Stack especializado en .NET, C#, Angular y SQL Server. Descubre mis proyectos y ponte en
  contacto conmigo.» (~126 car.).
- **Comprobaciones:** `typecheck` OK; `lint` 0 errores y los 2 avisos esperados; `build` OK (rutas
  `/robots.txt`, `/sitemap.xml`, `/opengraph-image` generadas). El HTML prerenderizado
  (`.next/server/app/index.html`) incluye canonical `https://jesuslopezweb.com`, og:* (locale es_ES,
  type website, imagen 1200x630), twitter summary_large_image, robots y JSON-LD.
- **No verificado:** no se pudo levantar el servidor (permiso denegado a la shell), así que no se
  hizo petición HTTP real a `/robots.txt`, `/sitemap.xml` ni `/opengraph-image`, ni se pasó el
  JSON-LD por un validador (Rich Results / validator.schema.org). Pendiente de Jesús o `pweb-tester`.
- **Decisiones:** URL base solo en `SITE_URL`; `og:url`/canonical relativos a `metadataBase`;
  `og:image` sale de la convención de fichero. Añadir rutas = añadir entrada en `SITE_ROUTES` y su
  propio `metadata`.
- **Pendientes:** el JSON-LD de `Person` no lleva `image`; el aviso de fuentes es de la Fase 4.

## Fase 3B — Rediseño visual (dirección A, «Terminal editorial»)

- **Objetivo:** que la landing tenga una identidad propia y memorable en lugar de la plantilla
  genérica de tarjetas centradas.
- **Alcance:** tipografía, paleta (tokens de `globals.css`), composición del hero, Proyectos,
  Habilidades y Contacto, fondo con textura. **Fuera de alcance:** contenido nuevo, fichas de
  proyecto (Fase 5), tema claro (Fase 7) y animaciones más allá de la carga del hero (Fase 8).
- **Entregables:**
  - Tipografía: titulares en serif con carácter (*Instrument Serif* o *Fraunces*), detalles técnicos
    en mono (*JetBrains Mono* o *IBM Plex Mono*), cuerpo en *IBM Plex Sans*. Se cargan con
    `next/font` (sustituye la tarea de Inter de la Fase 4).
  - Paleta: fondo casi negro cálido, texto hueso y un único acento fuerte, todo como tokens HSL.
  - Hero asimétrico a la izquierda con el nombre en serif grande, línea en mono tipo
    `> dotnet run --project full-stack` y bloque de código decorativo en C# con el stack.
  - Proyectos como filas numeradas (`01`, `02`) a ancho completo, estilo editorial.
  - Habilidades como bloque compacto por capas (`front / back / data / tools`).
  - Fondo con grano sutil y cuadrícula de puntos tenue.
  - Mejoras transversales: quitar la barra repetida bajo cada `h2`, un CTA principal, GitHub junto a
    LinkedIn, email visible y copiable en Contacto, enlace en vivo de `iglesia-barbate`, y los
    literales de LinkedIn de `page.tsx` leídos de `SITE_LINKS` en `src/lib/site.ts`.
- **Criterios de aceptación:** sin colores literales (solo tokens); responsive en móvil y
  escritorio; un solo `<h1>`; `prefers-reduced-motion` respetado; `typecheck`, `lint` y `build` en
  verde; Jesús valida el aspecto en navegador.
- **Dependencias:** Fase 3. **Estado:** en curso.
- **Responsable IA:** Claude · agentes `pweb-seo` (fuentes) y `pweb-frontend-dev` (hero) · modelo
  Sonnet.
- **Notas / riesgos:** decisiones de Jesús (2026-11-07): dirección A, fuentes *Instrument Serif* +
  *IBM Plex Sans* + *JetBrains Mono*, prototipo solo del hero primero. Acento **ámbar** (asumido por
  el orquestador: encaja con el fondo cálido y el texto hueso; Jesús puede cambiarlo). **Sustituido
  el 2026-11-08 por la paleta B «Violeta .NET»** (ver tarea de cambio de paleta). La imagen OG
  (`opengraph-image.tsx`) replica los tokens: actualizarla si cambia la paleta.

Tareas:
- [x] Decidir el acento y las fuentes concretas — Jesús.
- [x] Cargar las tres fuentes con `next/font` y quitar el `<link>` a Google Fonts — `pweb-seo`.
  Relevo: `src/app/layout.tsx` (3 fuentes con `next/font/google`, subset latin, swap, variables
  `--font-display/body/mono` en `<html>`, `<head>` eliminado) y `tailwind.config.ts` (`font-display`,
  `font-body`, `font-mono`; alias `font-headline` -> display y `font-code` -> mono, retirables al
  migrar). Pendiente: typecheck/lint/build por el hilo principal; Inter ya no se carga.
- [x] Prototipo del hero (paleta nueva + hero) para validar la dirección — `pweb-frontend-dev`.
  **Hecho a falta de validación de Jesús** (no se ejecutó typecheck/lint/build: lo hace el hilo
  principal). Relevo:
  - Ficheros: `src/app/globals.css` (tokens `.dark` + utilidades `bg-dots`, `grain`, `hero-reveal`,
    `cursor-blink` + keyframes + `prefers-reduced-motion`), `src/app/page.tsx` (`HeroSection`
    reescrito; LinkedIn de contacto y footer ahora leen `SITE_LINKS.linkedin`). `:root` intacto.
  - Tokens `.dark` (HSL): background `30 12% 7%`, foreground `40 25% 90%`, card `30 10% 10%`,
    popover `30 10% 9%`, primary (ámbar) `38 92% 55%`, primary-foreground `30 20% 8%`, secondary
    `30 9% 12%`, muted `30 8% 14%`, muted-foreground `35 12% 62%`, accent `30 9% 15%`, accent-foreground
    `40 25% 90%`, border/input `30 8% 20%`, ring `38 92% 55%`. Contraste estimado AA de sobra
    (texto/fondo y primary-foreground/primary); sin medir con herramienta.
  - Decisiones: grid 2 columnas en `lg`, apilado en móvil; apellido en italic con acento; código C#
    `aria-hidden` tras el texto en el DOM; el grano es un SVG `feTurbulence` inline (data URI) con
    opacidad 0.06 en `::after`; escalonado vía variable CSS `--delay`; cursor y entradas sin animación
    con reduced-motion. El `<h1>` anima opacidad (delay 0.08s): si Lighthouse penaliza el LCP, quitar
    `hero-reveal` del h1.
  - Pendiente/vigilar: `opengraph-image.tsx` aún con la paleta antigua; el resto de secciones solo
    heredan tokens (barra bajo `h2`, tarjetas centradas siguen igual hasta la siguiente tarea); el
    botón `secondary` ya no se usa en el hero.
- [x] Aplicar la dirección al resto de secciones — `pweb-frontend-dev`. **Hecho a falta de
  typecheck/lint/build (hilo principal) y validación visual de Jesús.** Relevo:
  - Ficheros nuevos: `src/components/section-heading.tsx` (etiqueta mono `// 0N — x` + `h2`
    `font-display`), `copy-email.tsx` (cliente, clipboard + `useToast`, error controlado),
    `footer.tsx` (extraído de `page.tsx`, lo usa también la 404), `src/app/not-found.tsx`.
    Modificados: `page.tsx`, `header.tsx`, `globals.css`, `tailwind.config.ts`.
  - Token nuevo `--code-string` (`.dark` `100 18% 64%`, `:root` `125 30% 28%`), mapeado como
    `code-string`; usado en las cadenas de `Developer.cs`.
  - Decisiones: anclas del header con `/#...` para que funcionen desde la 404; secciones con
    `aria-labelledby`; foto con `fill` + `aspect-[4/5]`, `grayscale` + overlay `bg-primary/30
    mix-blend-multiply`; ficha de Sobre mí = array `profileFacts` (rol, stack, estado), sin ubicación
    ni idiomas; Skills = `<dl>` por capas con frase corta; Proyectos = `<ol>` con hover por borde
    izquierdo (sin saltos).
  - Ajuste posterior (Jesús): `liveUrl` de `iglesia-barbate` = `https://icelcamino.com/` (enlace «Ver
    web» visible); foto de Sobre mí reducida a 176px móvil / 224px escritorio con rejilla
    `lg:grid-cols-[14rem_1fr]` y `sizes` ajustado.
  - Ajuste posterior (Jesús): Proyectos pasa a 4 filas (Base Estelar con capturas `base-estelar-oficina`
    y `base-estelar-detalle` registradas en `placeholder-images.json`, Kit multiagente, Iglesia, API);
    campos nuevos `privateSource`, `downloadUrl`, `imageIds`, `repoLink` opcional.
  - Ajuste posterior (Jesús): Habilidades con capas `front · back · datos · herramientas`, descripciones
    largas originales recuperadas y nombre completo en `sr-only` (`fullName`).
  - Pendientes: ninguno de `liveUrl`. Sin uso en `src/`: `ui/avatar.tsx` y `ui/badge.tsx` (Card sigue
    en Contacto). Hallazgos BAJO de `pweb-reviewer` aplicados: scroll-behavior con reduced-motion,
    `hero-reveal-rise` en el h1 (sin opacidad), `aria-hidden`/sr-only en glifos, «Cerrar» en
    `sheet.tsx`, alias `headline`/`code` fuera, `--input` `.dark` a 40%, `SITE_AVAILABLE` en
    `site.ts`, limpieza del timeout en `copy-email`. `SheetTitle` añadido al menú móvil por accesibilidad de Radix.
- [x] Actualizar los colores de `opengraph-image.tsx` a la paleta nueva — `pweb-seo`.
  - Relevo (`pweb-seo`): favicon + OG actualizados. `src/app/icon.svg` (`>_` ámbar `#f6a823` sobre
    `#141210`, formas SVG sin texto), `src/app/apple-icon.tsx` (180x180, mismo dibujo) y
    `opengraph-image.tsx` con la paleta `.dark` y la línea `> dotnet run --project full-stack`.
    Sin verificar en ejecución (typecheck/render pendientes del hilo principal).
- [x] Proyectos como en el lienzo de la dirección A — `pweb-frontend-dev`. Pedido por Jesús en el chat
  (2026-11-07: «me interesa que quede reflejado una captura de la web y demás como el diseño que se
  estaba planteando»):
  - Captura de cada proyecto junto a su fila: `iglesia-barbate` con una captura real de la web en
    producción (en `public/proyectos/`, optimizada con `next/image`, con `alt`); la API, que no tiene
    web, con un diagrama de sus capas (Controller → Service → Repository → SQL Server) o un fragmento
    de código en lugar de captura.
  - Detalle técnico por fila (capas o piezas: `front`, `ui`, `ci/cd`…) desplegado en la primera y que
    se abre al pasar el ratón o al pulsar en las demás (en móvil, al pulsar; accesible con teclado).
  - Enlaces «ver web en vivo ↗» y «código ↗» por proyecto; el de la web en vivo necesita `liveUrl`
    de `iglesia-barbate` (Jesús la facilita).
  - Fuera: la ficha completa de cada proyecto, que sigue siendo la Fase 5.
- [x] Cambio de paleta: fuera el ámbar, entra la propuesta B «Violeta .NET» (decisión de Jesús,
  2026-11-08; maqueta en `.base-estelar/maquetas/t1-57ae3c/B-violeta-dotnet.html`). Fondo azul
  noche, acento violeta eléctrico, cuadrícula de líneas con halo violeta en el hero. Mismas fuentes
  y composición. Reparto: tokens `.dark` y fondo del hero — `pweb-frontend-dev`; OG, favicon y
  apple-icon — `pweb-seo`. Responsable IA: Claude · modelo Sonnet. Relevo:
  - `globals.css` `.dark`: background `232 24% 7%`, foreground `228 25% 92%`, card `232 22% 10%`,
    popover/secondary `232 22% 9%`, muted `232 18% 13%`, muted-foreground `228 12% 64%`, accent
    `232 18% 15%`, border `232 16% 20%`, input `232 12% 40%`, primary/ring `258 90% 72%`,
    primary-foreground `232 30% 8%`, code-string `168 50% 64%`, chart-* a tonos fríos. `:root` intacto.
  - Utilidad nueva `hero-bg` (cuadrícula de líneas 48px + halo radial en `::before`) en el hero de
    `page.tsx` y en `not-found.tsx`; `grain` y `bg-dots` eliminadas (el grano ensuciaba el azul).
  - Contraste calculado (sin herramienta de navegador): botón 5.83, muted sobre fondo 7.07, primary
    sobre fondo 5.89; todo AA.
  - OG, `icon.svg` y `apple-icon.tsx` con hex equivalentes (`#0e0f16`, `#9e77f8`, `#75d1bf`,
    `#e6e8f0`); el icono lleva borde `#2b2d3b`. Si cambia la paleta, actualizarlos a mano.
- [x] Proyectos: `iglesia-el-camino` registrado en `placeholder-images.json` (captura 1440x900 en
  `public/proyectos/`); con una sola imagen `ProjectImages` ocupa el ancho completo con `sizes`
  `(min-width: 1280px) 1080px, (min-width: 1024px) 840px, 100vw`. Cierra la tarea `[~]` de
  Proyectos de arriba.
- [x] Revisión con `pweb-reviewer`: apto; los dos BAJO (sizes aplicado; PNG de 803 KB pendiente de
  decisión de Jesús). Verificado desde el hilo principal: `typecheck`, `lint` (1 aviso esperado de
  `actionTypes`) y `build` OK. Pendiente: verificación en navegador (hero, fila de Iglesia, favicon a
  16/32 px) y actualizar `.claude/docs/Landing/NotasAgentes.md`, que aún describe el hero antiguo.
- [x] Prueba con `pweb-tester` (2026-11-08): todo OK a 375/768/1440 px, sin ámbar, sin scroll
  horizontal, `details` con teclado, validación en español, rutas de OG/iconos/robots/sitemap 200,
  consola sin errores. Lighthouse móvil (build de producción): Rendimiento 90–98, Accesibilidad 100,
  Buenas prácticas 100, SEO 100; LCP 1.0 s, CLS 0.001. Fallo menor FIX-005 (`sizes` de las capturas
  de Base Estelar). Sin cubrir: favicon en pestaña real y envío real del formulario.
- [x] Animación de Base Estelar en lugar de sus capturas (pedido por Jesús, 2026-11-08; maqueta
  aprobada `.base-estelar/maquetas/t1-f01a4b/B-terminal-y-plano.html`). Terminal de Base Estelar
  + botón «Plano 2D / Estación 3D»; el 2D replica el plano real (`calcularPlano`) y el 3D es la
  `EscenaEstacion` real empaquetada. Jesús acepta servir el bundle 3D (~650 KB, código privado
  minificado) desde la web. Responsable IA: Claude · agente `pweb-frontend-dev` · modelo Sonnet.
  **Relevo (implementado, pendiente de revisión):**
  - Ficheros nuevos: `src/components/base-estelar-demo.tsx` (cliente: refs, `IntersectionObserver`,
    conmutador, carga bajo demanda del bundle), `src/components/base-estelar-demo.css` (CSS de la
    maqueta y `--kp-*` acotados bajo `.base-estelar-demo`, generado con postcss prefijando selectores),
    `src/lib/base-estelar-animacion.ts` (motor imperativo portado del guion: plano SVG, muñecos,
    pizarra, terminal, bucle pausable/cancelable, versión estática con reduced-motion, `montar3D`),
    `public/base-estelar/estacion-3d.js` (líneas 469-4689 de la maqueta, sin modificar).
  - Modificados: `src/components/projects-section.tsx` (nuevo `visual: { kind: "demo" }`; Base
    Estelar deja de usar `imageIds`), `eslint.config.mjs` (ignora `public/base-estelar/**`: bundle
    minificado ajeno, daba 8 errores y 1290 avisos).
  - Comprobaciones: `typecheck` OK; `lint` 0 errores, solo el aviso `actionTypes`; `build` OK; con
    `next start`, `/` contiene la demo y el bundle (667 KB) responde 200 y NO aparece en el HTML inicial.
    NO probado en navegador (animación, 3D, reduced-motion, 375-1440 px, CLS, Lighthouse).
  - Decisiones: `--kp-*` y el resto del CSS de la maqueta van en una hoja propia, nunca en `:root`;
    el borde exterior usa `hsl(var(--border))` de la web. El bucle se pausa fuera de pantalla y se
    cancela al desmontar (timeouts, rAF, `liberar()` de la escena 3D).
  - Pendientes: probar en navegador; `public/images/base-estelar-oficina.png`,
    `base-estelar-detalle.png` y sus entradas en `placeholder-images.json` quedan sin uso (Jesús decide
    si se borran; FIX-005 sobre sus `sizes` deja de aplicar).
  - Hallazgos de `pweb-reviewer` aplicados: 3D con `enableZoom=false` y `touch-action: pan-y`; 3D pausado
    fuera de pantalla vía `visibleEnPagina`/`actualizarBucle` de la escena; botón «Pausar/Reanudar
    animación» (WCAG 2.2.2, oculto con reduced-motion, la pausa manual prevalece sobre el
    `IntersectionObserver`); `sin-webgl` fuera del `role="img"` con `role="status"`; cwd de la
    bienvenida `~/proyectos/principalWeb`; bloque `--kp-*` duplicado reducido a los 7 valores que
    difieren de `tokens.css`; `@keyframes` renombrados `kp-barrido`/`kp-parpadeo`; `espera()` no
    deja promesas colgadas si `!vivo`. Typecheck, lint y build OK; sin probar en navegador.
  - Aprobado por Jesús: FIX-006 resuelto (estado inicial pintado al construir la animación, sin
    transición); zoom 3D fijado en 1.15 (`ZOOM_3D`), comprobado con capturas a 375, 768 y 1440 px (la
    estación cabe entera); borradas `public/images/base-estelar-oficina.png` y `-detalle.png` y sus
    entradas del JSON; FIX-005 cerrado por no aplicar.
  - **Prueba en navegador (pweb-tester, 2026-11-08, build de producción en puerto 9150, Chromium 1243 vía
    playwright-core):** typecheck OK, lint 0 errores (solo `actionTypes`), build OK.
    1) 375/768/1440 px: sin scroll horizontal; 1 columna a 375 y 768, 2 columnas (520+520) a 1440; sin solapes;
    parecido a la maqueta. 2) Bucle 2D de ~21,5 s repetido 6 veces sin errores de consola: teclea `/fase 3B`,
    sale del café, post-its a Hecho, semáforo correcto, duda en Tu mesa, reinicia. 3) Bundle 3D: 0 peticiones
    en la carga inicial; 1 al pulsar «Estación 3D»; tras 2D->3D sigue 1 petición y 1 canvas; la escena se ve y
    gira arrastrando; rueda no hace zoom (la página hace scroll); en móvil `touch-action: pan-y` y un deslizamiento
    vertical sobre el canvas desplazó la página (el gesto inverso en el CDP no se registró, ni siquiera fuera del
    canvas, así que es limitación del emulador). 4) Pausa: `aria-pressed` true/false y texto cambian; 2D y 3D sin
    rAF ni avance pausados; tras scroll fuera y vuelta sigue pausada; foco visible (outline 2px) en los botones.
    5) Fuera de pantalla: rAF 0 y sin avance en 2D y 3D; al volver se reanuda. 6) `reduced-motion`: estado
    final estático, sin botón de pausa, 0 animaciones CSS, 0 rAF. 7) Terminal `aria-hidden`, visor
    `role="img"`+aria-label, botones `aria-pressed`. 8) Lighthouse móvil: ver FIX-007 (Rend. 67-81, A11y 100,
    BP 100, SEO 100, LCP 1.1 s en las pasadas templadas, CLS 0-0.001; sin demo en la misma máquina 72-85).
    9) Resto de la home: estilos globales idénticos a la línea base, anclas del header OK, validación del
    formulario en español, menú móvil abre/navega/cierra, otras filas de Proyectos intactas.
    Fallos: FIX-006 (bajo). Sin cubrir: Safari/Firefox, WebGL con GPU real (se usó SwiftShader), dispositivo
    táctil físico, envío real del formulario (no se envía a propósito), cotejo píxel a píxel con la maqueta.
- [ ] Cierre de la fase (parar y validar): Jesús revisa en navegador.

## Fase 4 — Rendimiento y accesibilidad

- **Objetivo:** puntuar alto en Core Web Vitals y que la página sea navegable y semántica.
- **Alcance:** carga de fuentes, imágenes, jerarquía de encabezados, `alt`, contraste y foco.
  **Fuera de alcance:** rediseño visual (Fase 3B) y animaciones (Fase 8).
- **Entregables:** fuentes de la dirección A servidas con `next/font`, imágenes optimizadas y
  locales, HTML semántico revisado.
- **Criterios de aceptación:** Lighthouse con Rendimiento, Accesibilidad y SEO en verde; sin CLS
  visible al cargar; un solo `<h1>` por página y jerarquía de encabezados coherente.
- **Dependencias:** Fase 3B. **Estado:** pendiente.
- **Notas / riesgos:** va después del rediseño para no auditar dos veces una estructura que cambia.

Tareas:
- [ ] Comprobar que no queda ningún `<link>` a Google Fonts y que todas las fuentes van por
      `next/font` (si la Fase 3B no lo dejó hecho) — `pweb-seo`.
- [ ] Revisar si siguen haciendo falta todos los `remotePatterns` de `next.config.ts` y quitar los
      que no se usen — `pweb-seo`.
- [ ] Revisar `sizes`, `priority` y dimensiones de cada `next/image` — `pweb-seo`.
- [ ] Revisar la semántica y la accesibilidad de las secciones: `<section>`, jerarquía de
      encabezados, textos `alt` descriptivos, foco visible y contraste — `pweb-seo` define y
      `pweb-frontend-dev` aplica.
- [ ] Pasar Lighthouse y registrar el resultado — `pweb-tester`.
- [ ] Revisión con `pweb-reviewer`.
- [ ] Cierre de la fase (parar y validar).

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

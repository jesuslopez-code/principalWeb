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
      sin usar es `2025-10-07 175434.png`. Borrada en el commit de las Fases 4, 7 y 8.
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
- **Dependencias:** Fase 3. **Estado:** hecho.
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
- [x] Cierre de la fase (parar y validar): Jesús revisa en navegador.
  - Validado por Jesús el 2026-11-09 en `next dev` (puerto 9002). Única corrección: quitar el tinte
    lila (`bg-primary/30 mix-blend-multiply`) de su foto del hero (FIX-008).

## Fase 4 — Rendimiento y accesibilidad

- **Objetivo:** puntuar alto en Core Web Vitals y que la página sea navegable y semántica.
- **Alcance:** carga de fuentes, imágenes, jerarquía de encabezados, `alt`, contraste y foco.
  **Fuera de alcance:** rediseño visual (Fase 3B) y animaciones (Fase 8).
- **Entregables:** fuentes de la dirección A servidas con `next/font`, imágenes optimizadas y
  locales, HTML semántico revisado.
- **Criterios de aceptación:** Lighthouse con Rendimiento, Accesibilidad y SEO en verde; sin CLS
  visible al cargar; un solo `<h1>` por página y jerarquía de encabezados coherente.
- **Dependencias:** Fase 3B. **Estado:** hecho.
- **Responsable IA:** Claude · agentes `pweb-seo` y `pweb-frontend-dev` · modelo Sonnet.
- **Notas / riesgos:** va después del rediseño para no auditar dos veces una estructura que cambia.

Tareas:
- [x] Comprobar que no queda ningún `<link>` a Google Fonts y que todas las fuentes van por
      `next/font` (si la Fase 3B no lo dejó hecho) — `pweb-seo`.
  - Relevo (pweb-seo): ya estaba hecho en 3B (Instrument Serif, IBM Plex Sans y JetBrains Mono por
    `next/font/google` en `layout.tsx`). HTML del build: 0 referencias a googleapis/gstatic y woff2
    autoalojados. El `Failed to fetch JetBrains Mono` de `next dev` es red: `next build` en la misma
    máquina descargó las tres sin error; en dev Next cae a la fuente de reserva. Sin cambios.
- [x] Revisar si siguen haciendo falta todos los `remotePatterns` de `next.config.ts` y quitar los
      que no se usen — `pweb-seo`.
  - Relevo (pweb-seo): ninguna imagen de `src/` es externa, así que se quitaron los cuatro
    (`placehold.co`, `unsplash`, `picsum`, `jesuslopezweb.com`). `next.config.ts` queda con
    `nextConfig = {}` y un comentario. Build en verde. Además: `viewport.themeColor` (`#0e0f16`) en
    `layout.tsx`. Pendiente de Jesús: `public/images/` tiene 4 ficheros sin referencias (`Web_1.png`,
    `web_2.png`, `Web_3.png`, `2025-10-07 175434.png`, ~420 KB) que se pueden borrar.
- [x] Revisar `sizes`, `priority` y dimensiones de cada `next/image` — `pweb-seo`.
  - Relevo (pweb-seo): hay dos `next/image`, ambas con `fill` dentro de un contenedor con `aspect-*`
    (sin CLS), `sizes` coherente con el ancho real y `loading="lazy"`; ninguna está sobre el pliegue
    (el LCP es el `<h1>`), así que no llevan `priority`. Sin cambios. Nota: `foto_profile.jpg` es en
    realidad un PNG de 971 KB; Next lo sirve optimizado, pero conviene reexportarlo (no urgente).
- [x] Revisar la semántica y la accesibilidad de las secciones: `<section>`, jerarquía de
      encabezados, textos `alt` descriptivos, foco visible y contraste — `pweb-seo` define y
      `pweb-frontend-dev` aplica.
  - Relevo (pweb-seo): auditoría hecha; semántica, `alt` y contraste de texto correctos. Falta que
    `pweb-frontend-dev` aplique la lista de cambios entregada (enlace de salto, `scroll-padding`,
    `autoComplete`, token `--input`, foco en enlaces).
  - Relevo (pweb-frontend-dev): aplicada la lista. Enlace «Saltar al contenido» en `layout.tsx` + `id="contenido"` en `<main>`; `scroll-padding-top: 4rem` en `html`; `autoComplete`, `type="email"` y `noValidate` en `contact-form.tsx` (manda zod); `--input` dark 40% a 45% L (~3,5:1 contra background); foco `ring-ring` en enlaces de header, footer, copy-email, page y projects-section; `tabIndex={-1}` en el `<pre>` del hero. Sin tocar metadatos.
- [x] Borrar las imágenes sin referencias de `public/images/` (`Web_1.png`, `web_2.png`, `Web_3.png`,
      `2025-10-07 175434.png`, ~420 KB) — autorizado por Jesús el 2026-11-09.
- Pendiente fuera de la fase (Jesús, no urgente): reexportar `public/images/foto_profile.jpg`, que
  es un PNG de 971 KB con extensión `.jpg`. Next la sirve optimizada, así que no bloquea el cierre.
- [x] Pasar Lighthouse y registrar el resultado — `pweb-tester`.
  - Relevo (pweb-tester, 2026-11-09; build de producción en copia fuera del repo, `next start` en puerto
    9160, Chromium 1243 + playwright-core + Lighthouse 13; sin cambios en el repo):
    1) `typecheck` OK; `lint` 0 errores, solo el aviso `actionTypes`; `build` OK (el primer intento falló
    por descarga de JetBrains Mono desde Google Fonts, fallo de red; el reintento pasó).
    2) 375/768/1440 px: sin scroll horizontal (scrollWidth = clientWidth), 0 peticiones >= 400, consola sin
    errores; foto con solo `grayscale(1)`, 0 elementos `mix-blend-multiply`, sin capa hermana sobre la imagen.
    3) Teclado: 1.er Tab = «Saltar al contenido» visible (16,16) con anillo; al activarlo el hash pasa a
    `#contenido` y el siguiente Tab cae en «Ver mis proyectos» (primer enlace de `<main>`); `<main>` no
    es enfocable en sí (activeElement queda en `body`, el foco secuencial arranca en `main`). 38 paradas de
    Tab: todos enlaces, botones, `summary` e inputs con `outline` 2px y `:focus-visible`; el `<pre>` no
    recibe foco.
    4) Anclas `#about/#projects/#skills/#contact` a 375 y 1440 px: título de sección siempre por debajo del
    header (57 px), `scroll-padding-top` 64 px. 5) Formulario: envío vacío y datos inválidos muestran los
    mensajes de zod en español; `noValidate` activo, sin burbuja nativa; `autocomplete` name/email, input
    `type=email`; 0 POST enviados. 6) `<meta name="theme-color" content="#0e0f16">` presente en el HTML.
    7) Lighthouse (build de producción):
    | Modo | Rend. | A11y | BP | SEO | LCP | CLS | TBT |
    |---|---|---|---|---|---|---|---|
    | Móvil 1 (en frío) | 74 | 100 | 100 | 100 | 1,1 s | 0 | 1.480 ms |
    | Móvil 2 | 99 | 100 | 100 | 100 | 1,1 s | 0,001 | 110 ms |
    | Móvil 3 | 93 | 100 | 100 | 100 | 3,0 s | 0,001 | 140 ms |
    | Escritorio 1 | 100 | 100 | 100 | 100 | 0,3 s | 0,001 | 0 ms |
    | Escritorio 2 | 100 | 100 | 100 | 100 | 0,3 s | 0,001 | 0 ms |
    Mediana móvil 93. La varianza (74-99; LCP 3,0 s en una pasada) es la ya anotada en FIX-007: la 1.ª
    pasada en frío sale peor en esta máquina. Criterio de la fase cumplido (Rend., A11y y SEO en verde,
    CLS ~0).
    Observación (no reproducible, sin FIX): en 2 de ~8 barridos rápidos, una imagen lazy de Iglesia El
    Camino figuraba `complete=false` con `w=3840` a 375/768 px (sin 404 ni petición registrada); con
    scroll lento carga `w=640` y 200. Sin cubrir: Safari/Firefox, dispositivo táctil real, lector de
    pantalla, envío real del formulario (no se envía a propósito), `next build` dentro del repo (se usó copia).
- [x] Revisión con `pweb-reviewer`.
  - 2026-11-09: sin bloqueantes; typecheck y lint OK. Dos hallazgos bajos: ubicación de FIX-008 en
    `fixes.md` (corregida) y `tabIndex={-1}` del `<pre>` del hero. Este último se mantiene a propósito:
    el `<pre>` está dentro de un bloque decorativo `aria-hidden`, así que no debe ser enfocable; el
    `tabIndex={0}` que proponía axe crearía un foco dentro de `aria-hidden`.
- [x] Cierre de la fase (parar y validar) — validada por Jesús el 2026-11-09. Fixes ✅ archivados en
      `fixes-archivo.md`.

## Fase 7 — Tema claro/oscuro

- **Objetivo:** que el visitante pueda elegir tema claro u oscuro (o seguir al sistema), con una
  paleta clara coherente con la dirección A y sin parpadeo en la primera carga.
- **Alcance:** paleta clara en `:root` de `src/app/globals.css`, quitar la clase `dark` fija de
  `layout.tsx`, conmutador en el header (escritorio y menú móvil), persistencia de la elección,
  `theme-color` por tema y revisión de contraste en los dos temas.
  **Fuera de alcance:** rediseñar el modo oscuro actual, la imagen OpenGraph y los iconos (siguen
  oscuros), nuevas rutas y animaciones (Fase 8).
- **Entregables:** paleta clara aprobada; conmutador accesible en el header; script/proveedor de tema
  sin parpadeo; `viewport.themeColor` con variante clara y oscura.
- **Criterios de aceptación:** cambiar de tema no recarga la página y la elección sobrevive a una
  recarga; sin destello del tema contrario al cargar (ni con caché vacía); sin error de hidratación en
  consola; contraste AA de texto y foco en ambos temas; Lighthouse Accesibilidad 100 en los dos;
  typecheck, lint y build en verde.
- **Dependencias:** Fase 4. **Estado:** hecho (validada y publicada el 2026-11-10, PR #6).
- **Responsable IA:** Claude · agentes `pweb-frontend-dev` y `pweb-seo` · modelo Sonnet.
- **Notas / riesgos:** la paleta clara que hay hoy en `:root` es la neutra de shadcn con el primario
  cian antiguo (`182 100% 74%`), que no pega con la dirección A y no da contraste sobre blanco: hay que
  rediseñarla, no solo activarla. La demo de Base Estelar tiene paleta propia en hex
  (`base-estelar-demo.css`) porque reproduce la app real; por defecto se queda oscura en los dos temas.

Tareas:
- [x] Paleta clara: Jesús elige la **C · Lavanda tenue** (2026-11-09). Tokens en
      `.base-estelar/maquetas/t1-6e3eec/C-lavanda-tenue.html`.
- [x] Conmutador claro / oscuro / sistema, con «sistema» por defecto; la demo de Base Estelar sigue
      oscura en los dos temas; `next-themes` como mecanismo. Demo oscura y «sistema» por defecto
      confirmados por Jesús el 2026-11-09.
- [x] Definir la paleta clara elegida en `:root` de `globals.css` y revisar los usos de opacidad sobre
      `primary` (`hero-bg`, sombras) en claro — `pweb-frontend-dev`.
      Relevo (`pweb-frontend-dev`, Sonnet): `:root` de `globals.css` con los tokens de la maqueta C;
      destructive `0 72% 42%`; charts/sidebar alineados al violeta (no se usan en la home). Variables
      nuevas `--hero-grid`, `--hero-halo`, `--shadow-glow` en `:root` (0.08/0.14/0.10) y `.dark`
      (0.07/0.16/0.05, valores previos); `.hero-bg` las usa y la sombra del terminal pasa de
      `shadow-2xl shadow-primary/5` a la utilidad `.shadow-glow` (`page.tsx`). Footer:
      `text-foreground/60` -> `text-muted-foreground` (contraste en claro). Demo Base Estelar: añadido
      `color: var(--kp-color-texto)` a su raíz para no heredar el texto oscuro del tema; solo usa
      `--border` de la web. Pendiente: validación visual de Jesús y auditoría de contraste (`pweb-seo`).
- [x] Quitar `dark` fijo del `<html>`, añadir `next-themes` (`attribute="class"`, sin parpadeo) y
      `suppressHydrationWarning` en `<html>` — `pweb-frontend-dev` (comportamiento; no toca
      `metadata`/`viewport`).
      Relevo: `npm i next-themes`; nuevo `src/components/theme-provider.tsx` (cliente); `layout.tsx`
      sin `dark`, con `suppressHydrationWarning` y `ThemeProvider attribute="class"
      defaultTheme="system" enableSystem disableTransitionOnChange` envolviendo el contenido del
      `<body>`. `metadata`/`viewport` intactos (`themeColor` sigue fijo oscuro: tarea de `pweb-seo`).
- [x] Conmutador de tema en el header y en el menú móvil, accesible por teclado y con nombre
      accesible — `pweb-frontend-dev`.
      Relevo: nuevo `src/components/theme-toggle.tsx` (grupo de 3 botones con `aria-pressed`, iconos
      `Sun/Moon/Monitor`, `aria-label` en español, foco `ring-ring`; no marca opción hasta montar para
      evitar desajuste de hidratación). `header.tsx`: compacto (solo iconos) en escritorio y con
      textos al final del Sheet móvil. Pendiente: probar en navegador (persistencia, sin destello).
      Comprobaciones: `typecheck` ok, `lint` solo el aviso `actionTypes`, `build` ok.
- [x] `viewport.themeColor` con variante por `prefers-color-scheme` — `pweb-seo`.
      Relevo (`pweb-seo`, Sonnet): `layout.tsx` -> array `{light: #f6f4fb, dark: #0e0f16}`; verificado en el
      HTML servido (dos `<meta name="theme-color" media=...>`). No se añade `colorScheme` al viewport:
      `next-themes` ya pone `style="color-scheme: light|dark"` en `<html>` según la elección real, y el meta
      seguiría al sistema y no al conmutador. Limitación: `theme-color` sigue al sistema, no a la elección
      manual. Corregida la línea de `className="dark"` en `.claude/docs/Landing/NotasAgentes.md`.
- [x] Auditoría de contraste y foco en el tema claro — `pweb-seo`.
      Relevo: ratios calculados desde `globals.css` (WCAG). CLARO sobre background/card/secondary/muted/
      accent: foreground 13,2-16,9; foreground/80 7,7-9,0; muted-foreground 5,0-6,4; primary 6,2-7,9;
      primary-foreground sobre primary 8,1 (hover /90: 6,6); code-string 4,9-6,3; destructive 4,9-6,3;
      `--input` (borde de control) 3,9 sobre background y 3,2-4,1 en el resto (>=3 OK); anillo de foco
      (primary) 7,5 sobre background. `text-foreground/60` daría 4,2-4,5 (no AA): ya no se usa.
      OSCURO sin cambios: texto >=5,6; primary 4,9-5,9; primary-foreground/primary 5,8; input 3,5.
      Lighthouse 12 en build de producción (Chrome 156, `--blink-settings=preferredColorScheme`): tema
      claro y oscuro Accesibilidad 100, Mejores prácticas 100, `color-contrast` ok en ambos. Conmutador:
      grupo con nombre, `aria-pressed`, `aria-label` en español (contiene el texto visible: 2.5.3 ok),
      botones nativos -> teclado ok, foco `ring-ring`.
      **PENDIENTE (preexistente, no es del tema claro):** en OSCURO `text-destructive` (mensajes de zod en
      `form.tsx` FormMessage/FormLabel y la tarjeta de error de `contact-form.tsx`) da **1,6-1,9:1** (falla
      AA): `.dark --destructive` (`0 62.8% 30.6%`) es un tono de fondo. Lighthouse no lo ve porque esos
      estados no se renderizan. Cambio para `pweb-frontend-dev` en `.dark` de `globals.css`:
      `--destructive: 0 84% 68%` (6,4 sobre background, 6,1 card, 5,6 muted) y
      `--destructive-foreground: 232 30% 8%` (6,3 sobre el rojo). Afecta a Button/Badge/Toast
      `destructive` (hoy fondo rojo oscuro con texto claro; pasarían a rojo claro con texto oscuro; el
      toast de error usa `bg-destructive`). Alternativa sin tocar esos: token nuevo `--destructive-text`
      solo para texto. En claro no hace falta cambio.
- [x] Revisión con `pweb-reviewer`.
      Relevo (`pweb-reviewer`, Sonnet): sin bloqueantes. `typecheck` ok; `lint` solo `actionTypes`. Sin literales
      de color nuevos en `src/` (solo hex en OG/apple-icon/`themeColor`, a propósito); `.dark` solo cambió en
      variables hero/sombra y FIX-009 (`--input` 45% es de la Fase 4); frontera seo/frontend respetada;
      `"use client"` solo en provider y conmutador; `next-themes` ok (`suppressHydrationWarning`, `mounted`
      evita desajuste); sin `�` ni imports huérfanos. Menores: (BAJO) `page.tsx` About: quitado el overlay
      `bg-primary/30 mix-blend-multiply` de la foto, sin constar en los relevos; confirmar que es intencionado.
      (BAJO) `ThemeToggle` sin opción marcada hasta montar: aceptable, pero sin estado visual en el primer
      pintado. (BAJO) `sheet.tsx` overlay `bg-black/80` literal preexistente.
- [x] Pruebas (preguntar a Jesús antes de lanzar `pweb-tester`). FIX-010 revalidado y resuelto el 2026-11-09 (ver
      «Revalidación» al final del relevo).
      Relevo (`pweb-tester`, Sonnet, 2026-11-09; build de producción en :3100, Chrome 156 + puppeteer-core):
      `typecheck` ok; `lint` solo `actionTypes`; `build` ok (el primer intento falló una vez al descargar
      JetBrains Mono de Google Fonts por red; repetido, ok). `theme-color` con las 2 variantes `media`
      (#f6f4fb / #0e0f16) en el HTML servido. Sistema claro/oscuro: `<html>` toma la clase correcta; sin
      destello con red sin limitar ni solo CPU 4x. **FALLO FIX-010:** con red limitada y SO oscuro hay un
      fotograma claro antes del oscuro (4/4 pasadas). Conmutador (escritorio y Sheet a 375 px): cambia sin
      recarga, `aria-pressed` correcto, Enter/Espacio/Tab ok, foco con anillo, persiste en localStorage,
      «sistema» sigue al SO en vivo y tras recargar. Consola sin errores ni avisos en ambos temas (solo el
      error esperado de la petición abortada a propósito). 375/768/1440 en claro y oscuro: sin scroll
      horizontal, secciones y footer legibles, demo Base Estelar oscura en ambos. Formulario: errores de zod
      en español y legibles (claro rgb(184,30,30); oscuro rgb(242,105,105)); toast de error provocado
      abortando la petición (nada enviado) legible en ambos. Lighthouse (1 pasada, tema forzado verificado
      con la captura final): oscuro móvil Rend. 97 / A11y 100 / BP 100 / SEO 100, LCP 1,1 s, CLS 0,001, TBT
      200 ms; oscuro escritorio 100/100/100/100, LCP 0,3 s; claro móvil 94/100/100/100, LCP 1,1 s, CLS 0,001,
      TBT 290 ms; claro escritorio 100/100/100/100, LCP 0,3 s. Capturas: `C:\Users\1992j\qa-tema7\shots`.
      Sin cubrir: Safari/Firefox, `theme-color` con elección manual (limitación conocida), dispositivos reales.
      **Revalidación FIX-010 (`pweb-tester`, Sonnet, 2026-11-09, build de producción :3100, Chrome 156 +
      puppeteer-core, con el telón de la Fase 8 ya integrado):** mismo método (caché off, latencia 150/200/250/300 ms,
      200 KB/s, `Page.startScreencast`, 4 pasadas, píxeles de cada fotograma). Oscuro (SO oscuro + «oscuro»
      guardado): **0 fotogramas claros** en 4/4 pasadas con `intro-vista` guardada, 0/4 en primera visita y 0/4 a
      375 px. Claro: 0 fotogramas oscuros (4+4 pasadas). **FIX-010 ✅ ARREGLADA.** Evidencia
      `C:\Users\1992j\qa-fase8\shots\b-*.png`. Regresión rápida con telón integrado: conmutador (claro/oscuro/sistema)
      ok, anclas del header ok (top=64 px), Sheet 375 px abre/navega/cierra, formulario con errores zod en español en
      ambos temas (0 envíos), consola limpia.
- [x] Cierre de la fase (parar y validar). Cerrada el 2026-11-09 tras revalidar FIX-010; FIX-009 y FIX-010
      archivados en `fixes-archivo.md`. Falta la validación de Jesús.

## Fase 8 — Animaciones (telón de entrada)

- **Objetivo:** que la primera visita se abra con un telón breve en el que el Orquestador (guardián de
  la Estación 3D) sube la pantalla, sin hacer esperar al visitante ni penalizar los Core Web Vitals.
- **Alcance:** el telón de la maqueta `.base-estelar/maquetas/t1-da20a7/C-telon-corto.html` aprobada por
  Jesús el 2026-11-09: guardián (casco, traje oro, capa, alas, panel), ≈1,7 s, en pantalla se teclea
  `> abriendo Jesús López web`, sin bocadillo ni textos de Base Estelar; se corta con cualquier clic,
  toque, rueda, scroll o tecla y con «Saltar»; solo en la primera visita de cada navegador; nunca con
  «reducir movimiento» ni para buscadores; botón «▶ ver intro» en el footer para repetirlo.
  **Fuera de alcance:** el Plano 2D de la demo de Base Estelar (se queda con el muñeco de siempre); las
  transiciones de entrada de secciones y microinteracciones del catálogo
  (`t1-6e3eec/D-catalogo-animaciones.html`), que se deciden aparte.
- **Entregables:** componente del telón; script de decisión en `<head>` (sin destello de la web antes del
  telón ni del telón cuando no toca); botón «▶ ver intro» en el footer.
- **Criterios de aceptación:** sale solo en la primera visita y con «ver intro»; no sale con
  `prefers-reduced-motion` ni para bots; cualquier gesto lo corta; sin error de hidratación ni de
  consola; el telón es `aria-hidden` y no atrapa el foco; Lighthouse sin pérdida respecto a la Fase 7
  (Rend., A11y 100, LCP y CLS); typecheck, lint y build en verde; bien entre 375 y 1440 px y en los dos
  temas.
- **Dependencias:** Fase 4. La Fase 7 queda en pausa a falta de validar FIX-010. **Estado:** hecho (validada y publicada el 2026-11-10, PR #6).
- **Responsable IA:** Claude · agentes `pweb-frontend-dev` y `pweb-seo` · modelo Sonnet.
- **Notas / riesgos:** el telón cubre la web; si su texto es el mayor elemento pintado puede pasar a ser
  el LCP. La maqueta E original dejaba al muñeco fuera de la ventana; la C ya lo corrige.

Tareas:
- [x] Componente del telón, estilos y botón «▶ ver intro» en el footer — `pweb-frontend-dev`.
  - **Relevo (Claude · pweb-frontend-dev · Sonnet):** nuevos `src/components/intro-telon.tsx` y
    `intro-telon.css` (clases `it-*`, colores propios `--it-*`/maqueta acotados a `.it-telon`),
    `src/components/ver-intro-button.tsx`, `src/lib/intro-telon-script.ts`; editados `footer.tsx`
    (botón) y `layout.tsx` (solo `<IntroTelon />` tras `<Toaster />`, dentro del ThemeProvider).
  - **Decisiones:** oculto por defecto por CSS; solo `html.intro-telon` lo muestra. Script exporta
    `introTelonScript` (+ `INTRO_TELON_STORAGE_KEY`, `INTRO_TELON_EVENT`). Bots excluidos: buscadores
    y rastreadores (`bot|crawl|spider|slurp|mediapartners|bingpreview|facebookexternalhit`);
    Lighthouse/headless NO, para medir el caso real. `aria-hidden` va en el escenario (tubo, tela,
    guardián), no en la raíz, porque «Saltar ›» es focusable y debe ser accesible. Montado en layout
    para que el botón y la clase funcionen en cualquier ruta futura. «ver intro» con reduced-motion:
    el botón se oculta (`motion-reduce:hidden`) y el evento no hace nada. `scrollTo` con
    `behavior:"instant"` por el `scroll-smooth` de `<html>`. Escucha de gestos solo mientras corre.
  - **Retoques del reviewer:** `data-intro-iniciada` en `<html>` evita que el failsafe de 6 s corte la intro; el fundido sigue absorbiendo eventos (sin `pointer-events:none`); rAF de `ver` cancelados en el cleanup; hex del CSS prefijados `--it-`.
  - **Pendiente:** `pweb-seo` debe meter `<script dangerouslySetInnerHTML={{__html: introTelonScript}} />`
    en el `<head>` (sin él el telón no sale nunca). typecheck, lint y build en verde. NO verificado
    visualmente (ni 375-1440 px, ni temas, ni cortes por gesto, ni LCP/CLS).
- [x] Script de decisión en `<head>` (primera visita, reducir movimiento, bots), integración en
      `layout.tsx` y comprobación de LCP/CLS — `pweb-seo`.
  - **Relevo (Claude · pweb-seo · Sonnet):** `layout.tsx` importa `introTelonScript` y lo emite en
    `<head>` tras `themeInitScript` (verificado en el HTML servido). Cambio en
    `src/lib/intro-telon-script.ts`: failsafe `setTimeout` de 6 s que quita `intro-telon` pase lo que
    pase (si React no hidrata, el telón no deja la web tapada). Efecto colateral menor: un «ver intro»
    pulsado en los primeros 6 s de la carga podría cortarse al final.
  - **Revisión del script:** clave `intro-vista` coincide con `INTRO_TELON_STORAGE_KEY`; reduced-motion
    y bots OK; try/catch OK; solo toca `classList` de `<html>` (ya con `suppressHydrationWarning`), sin
    mismatch. Decisión de no excluir Lighthouse/headless: validada (mide el caso real; Googlebot ya cae
    en `bot`).
  - **A11y/semántica:** escenario con `aria-hidden`, «Saltar ›» focusable y accesible, sin
    `role`/`aria-live` (no se anuncia nada), sin trampa de foco (cualquier tecla corta el telón).
    Contraste «▶ ver intro» (`text-muted-foreground` sobre `bg-background`): ≈6:1 claro y ≈7:1 oscuro
    por cálculo de tokens; Lighthouse A11y 100 en todas las pasadas.
  - **Medidas** (build de producción en :3100, Chrome 1 sola pasada salvo indicación; tema claro por
    defecto de Lighthouse; no se midió oscuro): primera visita móvil 96-100 Rend. (2 pasadas en el mismo
    Chrome: LCP 1,1 s, CLS 0,001, TBT 80/190 ms; una pasada en Chrome frío dio 96, LCP 2,0 s, CLS 0,006,
    TBT 130 ms: varianza de arranque); visita repetida móvil 100, LCP 0,7-0,9 s, CLS 0,001, TBT 60-90 ms;
    escritorio primera visita 100, LCP 0,5 s, CLS 0,003; repetida 100, LCP 0,2 s, CLS 0,001. A11y, BP y SEO
    en 100 siempre. El LCP es el `<h1>` del hero, no el telón. Frente a Fase 7 (LCP 1,1 s, CLS 0,001):
    sin pérdida; el telón añade ≈0,4 s de LCP respecto a la visita repetida. Resultados en
    `C:\Users\1992j\qa-fase8`.
  - **Failsafe 1,2 s (opción A, aprobada por Jesús):** `intro-telon-script.ts` quita `intro-telon` a los
    1200 ms si el componente no puso `data-intro-iniciada` (sin guardar `intro-vista`); el componente solo
    arranca si la clase sigue puesta (`intro-telon.tsx:133`). Puppeteer, build de producción, perfil limpio,
    móvil 390 px: red 200 KB/s + 250 ms: telón fuera a los ≈2,2 s desde el inicio de navegación (1,2 s
    tras el script), sin animarse ni guardar clave; 150 ms: ≈1,5 s igual; red normal: hidrata a 0,3 s,
    telón completo ≈2,0 s y guarda `intro-vista`; red normal con CPU 4x: no hidrata a tiempo, el telón se
    quita sin intro. Lighthouse móvil real (sin throttling de CPU en modo simulado) no medido tras el
    cambio; con CPU 4x real la intro ya no sale.
  - **Pendiente:** no verificado visualmente (375-1440 px, temas, cortes por gesto, consola).
    typecheck y build en verde; lint solo con el aviso conocido de `actionTypes`.
- [x] Revisión con `pweb-reviewer`.
  - Relevo (`pweb-reviewer`, Sonnet): sin bloqueantes. `typecheck` ok; `lint` 0 errores, solo `actionTypes`.
    Fiel a la maqueta: 600+130+120+650+200 = 1700 ms, texto `> abriendo Jesús López web`, sin bocadillo ni
    «Base Estelar»; footer sigue siendo Server Component (cliente solo `ver-intro-button` e `intro-telon`);
    colores por `--it-*` HSL y hex acotados a `.it-telon`, botón con tokens; reduced-motion cubierto en
    script, CSS, botón y `ver`; listeners (`pointerdown`, `wheel`, `touchstart`, `keydown`, `scroll`) se
    quitan en `terminar` y en el cleanup; cleanup cancela timers, animación y invalida rondas; SSR y cliente
    idénticos (sin estado), `suppressHydrationWarning` en `<html>`. Hallazgos menores (no bloquean):
    1) failsafe de 6 s puede quitar la clase a mitad de intro (hidratación tardía > 4,3 s o «ver intro»
    pulsado pasados 4,3 s en primera visita): el telón desaparece sin fundido; coherente al terminar.
    Mejora: que el componente marque `html.dataset.introIniciada` y el script no la quite si existe.
    2) `terminar` pone `pointer-events:none` al instante: en táctil el clic sintético puede caer en el
    enlace de debajo (la maqueta no lo hacía). Comprobar en móvil real.
    3) `ver` no cancela sus rAF en el cleanup (inocuo: el layout nunca se desmonta).
    4) Variables hex sin prefijo (`--oro`, `--capa`, `--blanco`...) en `intro-telon.css`: acotadas, pero
    prefijarlas con `--it-` evitaría colisiones futuras. 5) `.base-estelar/` sin commitear y sin ignorar:
    decidir si va a `.gitignore`.
- [x] Pruebas (preguntar a Jesús antes de lanzar `pweb-tester`). Cerrada el 2026-11-09: Jesús da por buena la
      opción A (failsafe 1,2 s) y acepta Lighthouse móvil como informativo (FIX-011, ruido de la máquina). **Funcional OK; sin marcar por el criterio de
      Lighthouse (ver FIX-011).**
  - Relevo (`pweb-tester`, Sonnet, 2026-11-09; build de producción :3100, Chrome 156 + puppeteer-core, perfil limpio por
    caso; capturas en `C:\Users\1992j\qa-fase8\shots`, scripts `a1/a2/a4b/b/c.mjs`): `typecheck` ok; `lint` solo
    `actionTypes`; `build` ok.
  - **Pasa:** primera visita 375/768/1440 en claro y oscuro: el telón es lo primero que se pinta (con red limitada de
    150-300 ms/200 KB/s no hay ningún fotograma de la web antes del telón), guardián sobre la web y centrado en el
    tirador, texto `> abriendo Jesús López web` completo, sin bocadillo ni «Base Estelar»; animación 1,7 s + fundido
    0,25 s: clase `intro-telon` quitada a 1,69-2,00 s del arranque (6 casos); al final web limpia, sin scroll
    bloqueado (`overflow: visible`, se puede hacer scroll), sin scroll horizontal (scrollWidth = clientWidth).
    Segunda visita (recarga y pestaña nueva): no sale. Cortes: clic, rueda, scroll, tecla A, Escape, Tab, «Saltar»
    (clic, Enter y Espacio) quitan la clase en 275-332 ms. Toque (emulación táctil 375 px) y clic de ratón sobre el CTA
    «Ver mis proyectos» durante el telón: el clic cae en el telón, no se activa el enlace (hash vacío, scrollY 0): sin
    clic fantasma. «▶ ver intro»: visible en claro y oscuro (contraste ≈6-7:1 calculado), alcanzable con un Tab desde
    el elemento previo, anillo de foco visible, Enter lo lanza; sube a 0 al instante, reproduce entera (viva a 1,3 y
    1,6 s, termina a ≈2,0-2,1 s) y se puede cortar (Escape / clic). Reduced-motion: no sale en primera visita (ni
    se guarda `intro-vista`), el botón tiene `display: none` y el evento no hace nada. Googlebot: no sale; `<h1>`
    «Jesús López» y contenido presentes en el HTML servido. Consola sin errores ni avisos (ni de hidratación) en claro
    y oscuro. Failsafe con `/_next/static/chunks/*` abortado: telón visible, desaparece a los 6,08 s y la web queda
    usable (ancla `#contact` navega). Regresión: conmutador, demo Base Estelar (Plano 2D con el muñeco original,
    40 nodos SVG; Estación 3D con `canvas` renderizado en ambos temas), formulario (3 errores zod en español, 0 POST
    enviados), anclas del header, Sheet móvil.
  - **Lighthouse (móvil / escritorio, claro y oscuro, primera visita y repetida, 4 pasadas intercaladas por tema):**
    A11y/BP/SEO 100 en todas. Escritorio 100, LCP 0,2-0,3 s, CLS 0,001-0,004. Móvil: la máquina fue entre 1 y 2,3 veces
    más lenta según la tanda (`benchmarkIndex` 1000-2400), así que las cifras no son comparables con la Fase 7 (oscuro
    97/LCP 1,1/CLS 0,001; claro 94). Intercalado a igual CPU: primera visita 80-89 (LCP 1,2 s, CLS 0-0,002) vs repetida
    84-93 (LCP 0,7-1,1 s, CLS 0,001): el telón cuesta ≈3-6 puntos y ≈0,2-0,5 s de LCP. Con CPU ≈2400 una tanda dio
    99 (oscuro, LCP 1,1 s, CLS 0,003). El elemento LCP es el `<h1>` del hero, no el telón. Ver FIX-011.
  - **Observaciones (no son fallos):** (1) «Tab llega a Saltar» no es literal: cualquier tecla, Tab incluida, corta el
    telón, y el foco queda en «Saltar al contenido»; «Saltar ›» es `tabIndex 0` y accesible solo si se enfoca antes (clic
    o `focus()`), y Enter/Espacio funcionan. (2) Con red lenta (200 KB/s) el telón se ve estático (`>_ jesús`, tirador)
    hasta que hidrata (≈3,2-3,9 s en las 4 latencias) y solo entonces corre la animación: la web queda tapada ese
    tiempo (tope 6 s por el failsafe). Con la fuente mono aún sin cargar el primer fotograma del telón usa tipografía
    de reserva (sin serifa, «jesús») y salta a JetBrains Mono. (3) El fundido de salida son 250 ms extra a los 1,7 s de
    la maqueta.
  - **Sin cubrir:** toque real en dispositivo (solo emulación), Safari/Firefox, lector de pantalla real, medición de
    Lighthouse con la máquina en reposo (cierra FIX-011 y el criterio «sin pérdida frente a la Fase 7»).
- [x] Cierre de la fase (parar y validar). Cerrada el 2026-11-09; falta la validación visual de Jesús en producción.

## Fase 5 — Casos de estudio

- **Objetivo:** que cada proyecto principal tenga su propia ficha en `/proyectos/[slug]`, con un
  listado en `/proyectos`, contando problema, arquitectura, decisiones y resultados.
- **Alcance:** datos de proyectos extraídos a `src/lib/projects.ts`; infraestructura MDX para el
  texto largo (reutilizable por la Fase 6); rutas `/proyectos` y `/proyectos/[slug]` con la dirección
  B «Expediente técnico»; fichas de Base Estelar, Kit multiagente e Iglesia El Camino; sección
  Proyectos de la home condensada a tarjetas que enlazan a las fichas; enlace del header a
  `/proyectos`; metadatos por ruta, JSON-LD y sitemap.
  **Fuera de alcance:** filtros del listado (con tres fichas no aportan; se retoman cuando haya más
  proyectos), ficha propia de la API de Productos y Clientes (queda como enlace al repositorio),
  blog (Fase 6), animaciones de entrada de sección (Fase 8, resto), capturas nuevas.
- **Entregables:** `src/lib/projects.ts`; `src/content/proyectos/<slug>.mdx` ×3; `src/app/proyectos/page.tsx`;
  `src/app/proyectos/[slug]/page.tsx`; componentes de tarjeta y de ficha; home y header actualizados;
  `generateMetadata`, JSON-LD y entradas en `sitemap.ts`.
- **Criterios de aceptación:** `/proyectos` y las tres fichas se generan estáticas y un slug
  inexistente da 404; la home enlaza a cada ficha y a `/proyectos`; la animación de Base Estelar se ve
  en pequeño en su tarjeta y en grande en la cabecera de su ficha; las fichas siguen la maqueta B
  (ficha técnica fija en escritorio, paneles numerados, tabla de decisiones legible en 375 px); cada
  ruta tiene title, description, canonical y OpenGraph propios y aparece en el sitemap; ambos temas
  correctos; sin `"use client"` nuevo salvo necesidad justificada; typecheck, lint y build en verde.
- **Dependencias:** Fase 4. **Estado:** hecho (pendiente de validar).
- **Responsable IA:** Claude · agentes `pweb-frontend-dev` y `pweb-seo` · modelo Sonnet.
- **Notas / riesgos:** la demo de Base Estelar es un componente cliente con vista 3D bajo demanda
  (~650 KB); en la tarjeta no debe disparar esa carga. La home deja de llevar el detalle técnico, que
  pasa a la ficha: revisar que no queden anclas ni enlaces apuntando a contenido retirado.

Tareas:
- [x] Decisiones previas (Jesús, 2026-11-10): dirección **B «Expediente técnico»**
      (`.base-estelar/maquetas/t1-bef069/B-expediente-tecnico.html`); datos en TypeScript y texto
      largo en MDX; listado sin filtros por ahora; animación de Base Estelar en pequeño en la tarjeta
      (como está desplegada) y en grande en la ficha; Iglesia El Camino con la captura existente
      (`public/proyectos/iglesia-el-camino.png`); textos de las fichas propuestos por el hilo principal
      y aprobados por Jesús (el de la iglesia parte del README de `iglesia-barbate`). Fechas: Iglesia
      en producción desde noviembre de 2025 con actualizaciones posteriores; Kit multiagente y Base
      Estelar desarrollados a lo largo de 2026.
- [x] Datos en `src/lib/projects.ts`, infraestructura MDX y contenido de las tres fichas —
      `pweb-frontend-dev`. Relevo (Claude, Sonnet): `src/lib/projects.ts` (tipo `Project` ampliado, 4
      proyectos, helpers `getProjects`/`getCaseStudies`/`getProjectBySlug`/`getNextProject`/
      `getSideProjects`); `src/content/proyectos/{base-estelar,kit-multiagente,iglesia-el-camino}.mdx` +
      `index.ts` (mapa slug → MDX por import estático); `src/mdx-components.tsx`; `next.config.ts`
      (`withMDX` + `pageExtensions` con mdx). Dependencias: `@next/mdx` 15.5.23, `@mdx-js/loader`,
      `@mdx-js/react`, `@types/mdx`. Decisión: el MDX lleva solo la prosa (Problema, Arquitectura,
      Resultados) dentro de `<Panel n title>`; `<Diagram />`, `<Decisions n />` y `<Metrics />` son
      componentes que la página inyecta por `components` con los datos TS del proyecto. Fase 6 puede
      reutilizar `mdx-components.tsx` y la config. Importante: `pageExtensions` debe incluir `mdx`
      aunque no haya páginas .mdx; si no, Next no aplica sus alias de React al MDX (usa el React 18 de
      node_modules) y el prerender falla con `ReactCurrentOwner`. Textos aprobados tal cual; "Separar
      `pages/`…" sin backticks en la tabla. Comprobado: typecheck, lint (solo el aviso de
      `actionTypes`) y build en verde.
- [x] Rutas `/proyectos` y `/proyectos/[slug]` (dirección B), home condensada y header —
      `pweb-frontend-dev`. Relevo (Claude, Sonnet): `src/app/proyectos/page.tsx`,
      `src/app/proyectos/[slug]/page.tsx` (`generateStaticParams` + `dynamicParams = false`; slug
      inexistente da 404, comprobado con `next start`), componentes `project-card.tsx`
      (`ProjectCard`, `SideProjectRow`), `project-flow.tsx`, `case-study.tsx` (`Panel`, `SpecSheet`,
      `DecisionsPanel`, `MetricsList`); `projects-section.tsx` reescrito (tarjetas + «ver todos los
      casos →» + fila de la API, `id="projects"` y SectionHeading 02 intactos); `header.tsx`: «02.
      proyectos» → `/proyectos`. El botón «Ver mis proyectos» del hero sigue en `#projects` (la
      sección sigue existiendo en la home). Demo en tarjeta: `BaseEstelarDemo` ganó prop `compact`
      (clase `base-estelar-demo--compacta`: solo visor, sin panel de terminal, para columna estrecha);
      el bundle 3D ya solo se pide al pulsar «Estación 3D», así que la tarjeta no lo carga; la demo
      va fuera del `Link` de la tarjeta (tiene botones propios). En la ficha, demo completa. Sin
      `"use client"` nuevo. Pendiente: no he verificado visualmente en navegador (375–1440 px, claro y
      oscuro); solo typecheck/lint/build y comprobación HTTP. La ficha no lleva panel «Capturas»
      (no hay capturas; fuera de alcance). `metadata`/`generateMetadata` son mínimos (title +
      description) para que `pweb-seo` los complete; sitemap y `SITE_ROUTES` sin tocar.
      Correcciones de la revisión: fases del Kit (8, con «estos casos de estudio»); sr-only en `SideProjectRow`; `a` de MDX bifurca interno (`next/link`) / externo; `version?` en `Project` (Base Estelar 1.7.0); demo compacta a 16/10 con `preserveAspectRatio="xMidYMid slice"` en el SVG y `.vista` con `aspect-ratio: 16/10` solo en `--compacta`.
- [x] Metadatos por ruta, JSON-LD de las fichas y sitemap — `pweb-seo`. Relevo (Claude, Sonnet):
      `src/lib/seo.ts` (nuevo: `pageMetadata`, `projectMetadata`, `projectJsonLd`, `projectsIndexJsonLd`),
      `src/components/json-ld.tsx` (nuevo), `src/app/proyectos/[slug]/opengraph-image.tsx` (nuevo, mismo
      estilo que la OG principal, estática por `generateStaticParams`), `proyectos/page.tsx` y
      `[slug]/page.tsx` (metadatos + JSON-LD; migas convertidas en `<nav aria-label="Migas de pan"><ol>`
      con `aria-current`, único ajuste semántico), `src/lib/site.ts` (`PERSON_ID`; `SITE_ROUTES` derivado de
      `getCaseStudies()`), `src/app/layout.tsx` (`@id` en la Person), `src/lib/projects.ts` (campos
      opcionales `metaDescription` y `schemaType`). Decisiones: title de ficha «X: caso de estudio» (la
      plantilla añade «| Jesús López»); un `openGraph`/`twitter` de ruta sustituye al del layout, por eso
      `pageMetadata` repite los campos comunes y `/proyectos` pasa `images: ["/opengraph-image"]` (sin eso
      perdía la imagen); JSON-LD: Base Estelar `SoftwareApplication`, Kit `CreativeWork`, Iglesia `WebSite`
      (url de icelcamino.com), autor por `@id` de la Person, `BreadcrumbList`; `/proyectos` `CollectionPage` +
      `ItemList`. Sin fechas ni datos inventados. Comprobado en HTML servido (`next start`): title, description,
      canonical, OG y Twitter con imagen por ficha, JSON-LD, sitemap con 5 URL, slug inexistente 404, home sin
      regresión (canonical, OG, Person); typecheck y build en verde, lint solo el aviso de `actionTypes`.
      Pendiente: validar JSON-LD en validator.schema.org / Rich Results (sin red desde aquí). Para
      `pweb-frontend-dev` (sin tocar): `SideProjectRow` abre pestaña nueva sin aviso `sr-only`; `og:image:alt`
      es genérico («Caso de estudio de Jesús López»). **Arreglos de revisión:** alt por ficha vía `images` en
      `projectMetadata` (generateImageMetadata rompía las metaetiquetas); `softwareVersion` desde `project.version`;
      notas del módulo SEO al día. Typecheck, lint (solo `actionTypes`) y build en verde.
- [x] Notas del módulo en `.claude/docs/CasosDeEstudio/NotasAgentes.md` y `modulos.md` al día.
      Relevo (hilo principal): creado `NotasAgentes.md` del módulo; `modulos.md` lo pasa a «Lo que ya
      existe» en 🔧.
- [x] Revisión — `pweb-reviewer`. Relevo (Claude, Sonnet): sin bloqueantes. typecheck verde; lint solo el aviso de `actionTypes`; build verde (16 páginas, 3 fichas SSG + 3 OG). Importante: métricas del Kit multiagente en `projects.ts` («8 fases», «6 pull requests») y su prosa «publicadas» no cuadran con el repo (7 fases hechas listadas, Fase 5 sin publicar, 5 merges en main): confirmar con Jesús. Menores: `SideProjectRow` sin aviso `sr-only` de pestaña nueva, `og:image:alt` genérico, `a` de `mdx-components.tsx` fuerza `_blank` también a internos (latente para el blog), `softwareVersion` derivado de `status`. Sin verificar en navegador (alto de la demo compacta en tarjeta).
      Hallazgos resueltos (hilo principal, 2026-11-10): cifras del Kit cuadradas con el estado tras publicar
      esta fase (8 fases contando casos de estudio, 6 PR); `sr-only` en `SideProjectRow`; `a` del MDX
      bifurca internos/externos; `version` propio para `softwareVersion`; alt de OG por ficha; demo
      compacta a 16/10 con `slice`. Queda la verificación visual.
- [x] Pruebas (preguntar a Jesús antes de lanzar `pweb-tester`). Jesús pide lanzar `pweb-tester` (2026-11-10).
      Relevo (Claude, Sonnet, `pweb-tester`, 2026-11-10): typecheck verde; lint solo `actionTypes`; build verde (copia en
      `C:\Users\1992j\qa-fase5\app`, servidor :3100 ya parado). Navegador 375/768/1440 × claro/oscuro: sin errores de
      consola, sin desbordes, cuadrícula 1/2/3, bundle 3D solo al pulsar «Estación 3D», header/anclas/menú móvil, 404 y
      paginador OK. HTML, JSON-LD, sitemap (5 URL) y OG 200 image/png OK. Lighthouse móvil 85-100 (home 85-92, listado
      95-99, ficha 94-96), escritorio 99-100; A11y/BP/SEO 100. Abiertos: FIX-012 (`og:image:alt` en /proyectos,
      `pweb-seo`) y FIX-013 (espaciado del diagrama, menor, `pweb-frontend-dev`); por eso sigue en [~].
- [x] Cierre de la fase (parar y validar). Cerrada el 2026-11-10 tras corregir FIX-012 y FIX-013
      (archivados); falta la validación de Jesús. El 500 visto en el dev server tras las correcciones era
      un worker de Next colgado (`Jest worker encountered 2 child process exceptions`): al reiniciar
      `next dev`, las cuatro rutas dan 200 y el slug inexistente 404.
- [x] Limpieza antes de publicar (hilo principal, 2026-11-10, a petición de Jesús): borrados
      `src/components/ui/avatar.tsx`, `src/components/ui/badge.tsx` y `src/hooks/use-mobile.tsx`, sin
      ninguna referencia en `src/`, y desinstalado `@radix-ui/react-avatar`. Typecheck verde, lint solo
      `actionTypes` y build verde (16 páginas).

## Fases previstas (sin desarrollar todavía)

Anotadas para no perderlas. Su alcance, entregables y tareas se definen al abrir cada fase; hoy solo
existe la intención.

### Fase 6 — Blog MDX

Ruta `/blog` con artículos en MDX: listado, artículo individual, metadatos por artículo y entradas
en el sitemap. Comparte con la Fase 5 la decisión sobre la fuente de contenido, así que conviene
resolverla una sola vez.

### Fase 8 — Animaciones (resto)

Abierta arriba solo con el telón de entrada. Quedan pendientes de decidir las transiciones de entrada de
secciones y las microinteracciones, respetando `prefers-reduced-motion` y sin penalizar los Core Web
Vitals conseguidos en la Fase 4.

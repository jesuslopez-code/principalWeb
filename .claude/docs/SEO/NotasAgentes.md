# Notas de agentes — SEO

Particularidades **del posicionamiento y el rendimiento** de este sitio. Es el fichero de referencia
de `pweb-seo`. Lo transversal a todo el proyecto está en `CLAUDE.md` y en los agentes `pweb-*`.

**Jerarquía (no contradecir hacia arriba):** global personal › `CLAUDE.md` › agentes `pweb-*` ›
este fichero. Si algo aquí parece chocar con un nivel superior, gana el superior. Si para una tarea
falta algo no cubierto, preguntar a Jesús.

## Qué es este módulo

El SEO técnico no es una pantalla: es una capa transversal que vive en el layout, en los metadatos
de cada ruta y en cómo se sirve el HTML. Su objetivo aquí es concreto: **que a Jesús lo encuentren
por su nombre y por su perfil técnico, y que el enlace se vea bien al compartirlo** en LinkedIn o
por mensaje.

Es el motivo de la rama `limpieza-y-seo` y el grueso de las Fases 3 y 4 de `tareas.md`.

## Rutas y ficheros clave

- `src/app/layout.tsx` — `export const metadata` (hoy solo `title` y `description`),
  `<html lang="es">` y el `<link>` a Google Fonts.
- `next.config.ts` — `remotePatterns` de imágenes y los `ignore` de TypeScript y ESLint.
- `src/lib/placeholder-images.json` — origen de todas las imágenes, con su `description` (que se usa
  como `alt`).
- **Por crear:** `src/app/robots.ts`, `src/app/sitemap.ts` y el JSON-LD (Fase 3).

## Estado de partida (verificado en código)

Lo que hay:
- `<html lang="es">` correcto.
- `title` y `description` en el layout, ambos en español y con contenido real.
- Imágenes servidas con `next/image`; el hero con `priority`.

Lo que falta:
- `metadataBase`, `openGraph`, `twitter`, `alternates.canonical` y directivas `robots`.
- Imagen OpenGraph.
- `robots.ts` y `sitemap.ts`.
- JSON-LD (objetivo: `Person`).
- La fuente Inter se carga con `<link>` a `fonts.googleapis.com` en el `<head>` en lugar de
  `next/font/google`: añade conexión a terceros y penaliza LCP y CLS.

## Patrones y comportamiento propios

- **Next completo en Vercel.** Usa la API de metadatos de App Router (`metadata`,
  `generateMetadata`) y las convenciones de fichero (`robots.ts`, `sitemap.ts`), no ficheros
  estáticos en `public/` ni etiquetas `<meta>` a mano.
- **Una sola fuente de verdad para la URL:** `metadataBase` en el layout; todo lo demás se deriva.
  Nada de URLs absolutas repartidas por el código.
- **Metadatos por ruta.** Los del layout son el valor por defecto que heredan las rutas hijas, no la
  respuesta para todas: cada ruta nueva declara los suyos, y las dinámicas usan `generateMetadata`.
- **Preparar para crecer:** están previstas `/proyectos`, `/proyectos/[slug]` y `/blog`. `sitemap.ts`
  debe escribirse de forma que añadir rutas sea añadir entradas, no rehacerlo.
- **Los `alt` salen de `placeholder-images.json`** (campo `description`), así que mejorar la
  accesibilidad de una imagen pasa por editar ese JSON, no el componente.

## Decisiones pendientes (preguntar antes de implementar)

- **Dominio canónico: ¿con `www` o sin `www`?** Bloquea `metadataBase`, el sitemap y las URLs de
  OpenGraph. Un canónico mal puesto hace más daño que no ponerlo. **No lo asumas.**
- **Título y descripción definitivos.** Los actuales son largos; conviene revisarlos con Jesús antes
  de propagarlos a OpenGraph.
- **Imagen OpenGraph:** si la diseña Jesús o se genera.

## Avisos / cosas a vigilar

- **El build no valida nada.** `next.config.ts` ignora errores de TypeScript y de ESLint, así que un
  `npm run build` en verde no prueba que los metadatos estén bien. Verifica siempre el **HTML
  servido**, no el código fuente.
- **Al añadir un host de imagen** hay que declararlo en `remotePatterns` o el build falla. Al
  contrario, al traer imágenes a local conviene **quitar** los `remotePatterns` que dejen de usarse:
  hoy hay declarados `placehold.co`, `images.unsplash.com`, `picsum.photos` y `jesuslopezweb.com`, y
  probablemente sobren varios.
- **`priority` en el hero es el LCP:** no lo quites al refactorizar.
- **Jerarquía de encabezados:** hoy hay un solo `<h1>` (el nombre, en el hero) y `<h2>` por sección.
  Al añadir rutas, mantener un `<h1>` por página.
- **La frontera con `pweb-frontend-dev`** está en `CLAUDE.md`: los cambios estructurales dentro de
  un componente los define `pweb-seo` y los aplica `pweb-frontend-dev`.
- **Registra aquí las medidas** de Lighthouse antes y después de cada cambio de rendimiento, para
  poder comparar más adelante.

---
_Este fichero lo amplían los agentes por auto-actualización con lo que aprenden en el módulo._

## Fase 4 (rendimiento y accesibilidad)

- `remotePatterns` eliminados: no hay imágenes externas. Al traer una, declarar su host.
- `next dev` puede mostrar `Failed to fetch JetBrains Mono`: es red; `next build` descarga bien.
- Con `next dev` ocupando `.next`, el build se probó en una copia del repo en `/tmp` (con junction a
  `node_modules`; retirarla con `rmdir`, nunca `rm -rf`).
- Ninguna `next/image` lleva `priority` a propósito: el LCP es el `<h1>`.
- Contraste medido (WCAG, tokens `.dark`): texto >= 5,6:1 en todos los pares (muted-foreground 6,7-7,1;
  primary 5,6-5,9; foreground/60 6,1). Único borde por debajo: `--input` 2,96:1 contra el fondo
  (pide 3:1 para controles de formulario).

## Paleta de OG e iconos (Fase 3B, violeta .NET)

`opengraph-image.tsx`, `icon.svg` y `apple-icon.tsx` no leen variables CSS: llevan hex fijos
equivalentes a los tokens `.dark` (`#0e0f16` fondo, `#e6e8f0` texto, `#989dae` apagado, `#9e77f8`
primary, `#75d1bf` code-string, `#2b2d3b` borde). Si cambia la paleta en `globals.css`, actualizar
estos tres a mano.

## Fase 7 (tema claro/oscuro)

- Tema gestionado por `next-themes` (clase `dark` en `<html>`, `defaultTheme="system"`); ya no hay `dark` fijo.
- `viewport.themeColor` por media query: claro `#f6f4fb` (= `--background` claro), oscuro `#0e0f16`. Sigue
  al sistema, no al conmutador. No se usa `viewport.colorScheme`: `next-themes` ya fija `color-scheme` inline.
- Si cambia `--background` en `globals.css`, actualizar esos dos hex en `layout.tsx` (y OG/iconos, que son oscuros).
- Para probar un tema en Chrome headless/Lighthouse: `--blink-settings=preferredColorScheme=0` (oscuro) o `=1`
  (claro). `--force-prefers-color-scheme` NO funciona en Chrome 156 headless.
- Contraste claro medido y Lighthouse A11y 100 en ambos temas (detalle en `tareas.md`, Fase 7). Salvedad:
  `text-destructive` en oscuro 1,6-1,9:1 (pendiente de `pweb-frontend-dev`).

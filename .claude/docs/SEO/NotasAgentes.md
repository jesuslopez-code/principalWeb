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

# Plan de implementación — principalWeb

Visión técnica y plan por **fases**. Es la fuente de "hacia dónde vamos"; el detalle de arquitectura
vive en `CLAUDE.md`. El estado y las tareas concretas de cada fase están en `tareas.md`.

## Objetivo

Convertir la web personal de Jesús López en un portfolio profesional sólido y bien posicionado:
limpio por dentro (sin restos de la plantilla de Firebase Studio), correcto de cara a buscadores y
redes sociales, y preparado para crecer con casos de estudio y blog. "Terminado" a alto nivel
significa: build verde, SEO completo y verificable, y una base sobre la que añadir rutas nuevas sin
rehacer nada.

## Arquitectura (resumen)

Detalle completo en `CLAUDE.md`; aquí solo la forma general.

- Frontend: Next.js 15 App Router + React 18 + TypeScript, Tailwind con tokens HSL y shadcn/ui.
- Backend: no hay backend propio, pero **el despliegue es Vercel con Next completo**, así que
  Server Components, route handlers y server actions están disponibles cuando hagan falta.
- Datos: contenido estático en el código; imágenes declaradas en `src/lib/placeholder-images.json`.
- Móvil: no aplica (responsive).
- Rutas: hoy solo `/`. Previstas `/proyectos`, `/proyectos/[slug]` y `/blog`.

## Fases

Cada fase es un hito verificable. Las primeras son de saneamiento y SEO, que es lo que bloquea todo
lo demás; después llega el crecimiento de contenido y la capa visual.

| # | Fase | Objetivo (una frase) | Estado |
|---|------|----------------------|--------|
| 1 | Cerrar la limpieza | Dejar el build verde tras el desacople de Firebase y las demos borradas | hecho |
| 2 | Red de seguridad | Recuperar typecheck y lint como barrera real antes de desplegar | hecho |
| 3 | SEO base | Metadatos completos, `robots.ts`, `sitemap.ts` y JSON-LD | pendiente |
| 4 | Rendimiento y accesibilidad | Fuentes, imágenes y semántica al nivel que exigen los Core Web Vitals | pendiente |
| 5 | Casos de estudio | Ruta `/proyectos` y `/proyectos/[slug]` con fichas de proyecto reales | pendiente |
| 6 | Blog MDX | Ruta `/blog` con artículos en MDX | pendiente |
| 7 | Tema claro/oscuro | Conmutador de tema aprovechando los tokens claros ya definidos | pendiente |
| 8 | Animaciones | Transiciones y microinteracciones sin penalizar rendimiento | pendiente |

Las fases 1 a 4 son el alcance de la rama actual `limpieza-y-seo`. De la 5 en adelante son el
crecimiento previsto: están anotadas para no perderlas de vista, **sin desarrollar todavía**; su
alcance se define al abrirlas.

## Decisiones y convenciones clave

- **Vercel con Next completo.** No se limita el proyecto a lo que permitiría un export estático.
- **El crecimiento a varias rutas es lo esperado.** La estructura de `src/app/` debe admitir rutas
  nuevas sin refactor: cada ruta con su `page.tsx` y sus propios metadatos.
- **`pweb-seo` y `pweb-frontend-dev` comparten ficheros con frontera explícita** (metadatos y
  semántica frente a contenido y comportamiento). Está descrita en `CLAUDE.md` y en ambos agentes.
- **El contenido se extrae cuando se comparte**, no antes: las constantes de la home se moverán a
  `src/lib/` o a MDX cuando las consuman varias rutas (fases 5 y 6).

## Riesgos / decisiones abiertas

- **Qué queda en la sección Projects** tras quitar las tarjetas de `/web1` y `/web2`. Es una
  pregunta abierta para Jesús, anotada como tarea en la Fase 1; no la decide un agente.
- **Dominio canónico:** hay que fijar si el canónico es con o sin `www` antes de generar `sitemap.ts`
  y las URLs de OpenGraph (Fase 3).
- **Fuente de contenido para casos de estudio y blog:** MDX en el repo frente a un CMS externo. Se
  decide al abrir la Fase 5.
- El servicio externo de formularios es una dependencia de terceros sin control ni alertas: si deja
  de funcionar, el contacto se pierde en silencio.

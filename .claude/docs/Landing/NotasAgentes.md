# Notas de agentes — Landing

Particularidades **específicas de la página principal** que los agentes deben conocer al trabajar
aquí. Lo transversal a todo el proyecto está en `CLAUDE.md` y en los agentes `pweb-*`.

**Jerarquía (no contradecir hacia arriba):** global personal › `CLAUDE.md` › agentes `pweb-*` ›
este fichero. Si algo aquí parece chocar con un nivel superior, gana el superior. Si para una tarea
falta algo no cubierto, preguntar a Jesús.

## Qué es este módulo

La página principal (`/`): la carta de presentación de Jesús como desarrollador full-stack. Vive en
`src/app/page.tsx`, que hoy contiene todas sus secciones como funciones locales.

Es la única ruta que existe hoy, pero **no será la única**: están previstas `/proyectos`,
`/proyectos/[slug]` y `/blog`. Al tocar la home, escribe pensando en que algunos de sus bloques
acabarán compartiéndose con esas rutas.

## Rutas y ficheros clave

- `src/app/page.tsx` — la página. Contiene, por este orden: las constantes `projects` y `skills`, y
  las funciones `HeroSection`, `AboutSection`, `ProjectsSection`, `SkillsSection`, `ContactSection`
  y `Footer`. El export por defecto `Home` las compone dentro de `<main>`.
- `src/app/layout.tsx` — layout raíz: `<html lang="es" className="dark">`, metadatos, fuentes y
  `<Toaster />`.
- `src/components/header.tsx` — cabecera fija con navegación por anclas y menú móvil.
- `src/lib/placeholder-images.json` + `placeholder-images.ts` — todas las imágenes del sitio.

## Patrones y comportamiento propios

- **Las secciones son funciones locales**, no componentes exportados. Es deliberado mientras solo
  las use esta página. Extrae una a `src/components/` cuando otra ruta la necesite.
- **Anclas y navegación acopladas:** los `id` de las secciones (`about`, `projects`, `skills`,
  `contact`) deben coincidir con los `navLinks` de `src/components/header.tsx`. **Si añades, quitas
  o renombras una sección, actualiza el header en el mismo cambio.** Es el fallo más fácil de
  cometer aquí.
- **Patrón de sección:** `<section id="..." className="w-full py-20 md:py-32">` con un contenedor
  `container mx-auto px-4 md:px-6` dentro.
- **Fondos alternos:** las secciones alternan `bg-background` y `bg-secondary` para separarse
  visualmente. Respeta la alternancia al insertar una sección nueva.
- **Encabezado de sección:** `<h2>` con `text-3xl font-bold tracking-tighter sm:text-4xl
  md:text-5xl`, seguido de una barra decorativa `w-24 h-1.5 bg-primary rounded-full` (centrada con
  `mx-auto` en las secciones centradas).
- **Contenido en constantes:** `projects` y `skills` están al principio del fichero, fuera de los
  componentes. Los iconos de `skills` se guardan como referencia al componente de lucide (no como
  string) y se renderizan con `<skill.icon />`.
- **Imágenes por `id`:** se resuelven con `PlaceHolderImages.find((img) => img.id === "...")` y el
  resultado se comprueba antes de renderizar (`{heroImage && ...}`), porque `find` puede devolver
  `undefined`.
- **El hero usa `fill` + `priority`** con una capa de oscurecimiento encima
  (`absolute inset-0 bg-background/80 backdrop-blur-sm`). No quites `priority`: es el LCP de la
  página.

## Avisos / cosas a vigilar

- **Enlaces rotos ahora mismo:** las dos tarjetas de `projects` apuntan a `/web1` y `/web2`, demos
  estáticas que se borraron de `public/`. Se retiran en la Fase 1 (ver `fixes.md`, FIX-002).
- **Qué queda en la sección Projects** tras retirarlas es una **pregunta abierta para Jesús**, no
  una decisión de agente. Condiciona el módulo Casos de estudio (Fase 5).
- **`project-3` en `placeholder-images.json`** está declarado pero no se usa, y su imagen
  (`public/dashboard.png`) ya no existe.
- **La imagen del hero** apunta a una URL absoluta externa
  (`https://jesuslopezweb.com/images/portada.jpeg`) mientras el resto son locales; se unifica en la
  Fase 4.
- **El año del footer** se calcula con `new Date().getFullYear()`, lo que hace dinámico ese
  componente. Tenlo en cuenta si alguna vez se fuerza renderizado estático.
- **`page.tsx` mide unas 310 líneas.** Si crece bastante más, toca extraer secciones a
  `src/components/`.

---
_Este fichero lo amplían los agentes por auto-actualización con lo que aprenden en el módulo._

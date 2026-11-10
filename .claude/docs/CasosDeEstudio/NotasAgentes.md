# Notas de agentes — Casos de estudio

Particularidades **específicas de `/proyectos` y `/proyectos/[slug]`** que los agentes deben conocer
al trabajar aquí. Lo transversal a todo el proyecto está en `CLAUDE.md` y en los agentes `pweb-*`.

**Jerarquía (no contradecir hacia arriba):** `CLAUDE.md` › global personal › agentes `pweb-*` ›
este fichero. Si algo aquí parece chocar con un nivel superior, gana el superior. Si para una tarea
falta algo no cubierto, preguntar a Jesús.

## Qué es este módulo

El listado de casos de estudio y una ficha por proyecto, con la dirección visual B «Expediente
técnico» (maqueta en `.base-estelar/maquetas/t1-bef069/B-expediente-tecnico.html`). Creado en la
Fase 5. La sección Proyectos de la home reutiliza las mismas tarjetas.

## Rutas y ficheros clave

- `src/lib/projects.ts` — fuente única de los proyectos: datos de tarjeta, ficha técnica, decisiones,
  cifras, pasos del diagrama, enlaces y campos SEO (`metaDescription`, `schemaType`). Los helpers
  (`getCaseStudies`, `getProjectBySlug`, siguiente proyecto) los usan las rutas, la home y el sitemap.
- `src/content/proyectos/<slug>.mdx` — solo la prosa (Problema, Arquitectura, Resultados) dentro de
  `<Panel n title>`. `<Diagram />`, `<Decisions n />` y `<Metrics />` los inyecta la página desde los
  datos TS: no se escriben decisiones ni cifras en el MDX.
- `src/content/proyectos/index.ts` — mapa estático slug → MDX. **Una ficha nueva se registra aquí**;
  el import dinámico con plantilla rompe el runtime de React en servidor.
- `src/mdx-components.tsx` — estilos base de la prosa MDX, reutilizable por el blog (Fase 6).
- `src/app/proyectos/page.tsx`, `src/app/proyectos/[slug]/page.tsx` (+ `opengraph-image.tsx`).
- `src/components/project-card.tsx`, `case-study.tsx`, `project-flow.tsx`; `src/lib/seo.ts` y
  `src/components/json-ld.tsx` para metadatos y JSON-LD.

## Patrones y comportamiento propios

- **Añadir un caso:** datos en `projects.ts` (con `hasCaseStudy`), su `.mdx`, registrarlo en
  `index.ts`. Sitemap, `generateStaticParams`, paginador y JSON-LD salen solos de los datos.
- **`pageExtensions` con `mdx` en `next.config.ts` es obligatorio** aunque no haya páginas `.mdx`:
  sin él Next no aplica su alias de React al MDX y el prerender falla con `ReactCurrentOwner`.
- **Demo de Base Estelar:** en la tarjeta va con `compact` (solo el visor, sin terminal) y fuera del
  `Link` de la tarjeta porque tiene botones propios; en la ficha va completa. El bundle 3D (~650 KB)
  solo se pide al pulsar «Estación 3D»: no añadir cargas anticipadas.
- **Sin filtros en el listado** por decisión de Jesús (2026-11-10): con tres fichas no aportan.
- La API de Productos y Clientes no tiene ficha: aparece como fila aparte enlazando a GitHub.
- El header enlaza «02. proyectos» a `/proyectos`; el botón del hero sigue en `/#projects`.

## Decisiones tomadas

- Textos de las fichas propuestos por el hilo principal y aprobados por Jesús el 2026-11-10; el de
  la iglesia parte del README de `iglesia-barbate`. No inventar cifras ni fechas que Jesús no haya dado.
- Tipos de JSON-LD: Base Estelar `SoftwareApplication`, Kit multiagente `CreativeWork`, Iglesia
  `WebSite`; todas con `BreadcrumbList` y autor por `@id` de la `Person` del layout.

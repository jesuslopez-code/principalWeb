Construye o amplía un módulo del backlog.

Módulo (nombre): $ARGUMENTS

Pasos:
1. **Abrir el módulo.** Búscalo en `modulos.md`. Si no tiene carpeta en `.claude/docs/<Modulo>/`,
   créala a partir de la plantilla (`.claude/_plantillas-kit/docs/MODULO/`), sustituye `<Modulo>` y
   ponlo 🔧 en `modulos.md`. Lee su `NotasAgentes.md` si ya existe.
2. **Comprobar prerrequisitos.** Los módulos de crecimiento (Casos de estudio, Blog, Tema
   claro/oscuro, Animaciones) dependen de fases previas de `tareas.md`. Si esas fases están
   pendientes, dilo antes de empezar.
3. **Definir el alcance** y presentárselo a Jesús. Espera OK antes de implementar. Si el módulo
   estrena una ruta, decide aquí su estructura en `src/app/` y de dónde sale su contenido.
4. **Implementar.** Reparte en el agente del área: `pweb-frontend-dev` para rutas, componentes,
   contenido y estilos; `pweb-seo` para los metadatos de la ruta nueva, su entrada en el sitemap y
   la semántica. Registra en el `NotasAgentes.md` del módulo las decisiones tomadas.
5. **Cerrar.** Revisión con `pweb-reviewer`. Antes de `pweb-tester`, **pregunta** si Jesús prefiere
   probarlo él. Actualiza `modulos.md` (✅) y anota incidencias en `fixes.md`. No hagas commit ni
   borres ficheros.

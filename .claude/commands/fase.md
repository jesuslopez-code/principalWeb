Ejecuta una fase del plan del proyecto.

Fase a ejecutar (número o nombre): $ARGUMENTS

Pasos:
1. Lee `plan-implementacion.md` y `tareas.md` (raíz) y `CLAUDE.md`. Localiza la fase indicada. Si no
   está definida, está entre las "fases previstas" sin desarrollar, o es ambigua, **pregunta** antes
   de actuar.
2. Reparte las tareas de la fase en el subagente del área que corresponda: contenido, componentes y
   estilos → `pweb-frontend-dev`; metadatos, semántica, rendimiento y accesibilidad → `pweb-seo`;
   documentación → `pweb-docs`. Si una tarea cruza áreas, divídela (recuerda la frontera descrita en
   `CLAUDE.md`).
3. Las tareas marcadas como **PREGUNTA ABIERTA** no las decides tú: plantéaselas a Jesús con las
   opciones y espera respuesta.
4. Marca el estado en `tareas.md` (`[~]` al empezar, `[x]` al cerrar cada tarea).
5. Cierra la fase: revisión con `pweb-reviewer`. Antes de lanzar `pweb-tester`, **pregunta** a Jesús
   si prefiere probarlo él. Anota en `fixes.md` lo que aparezca al probar.
6. **PARA al terminar la fase** y resume qué quedó hecho y cómo probarlo, para que Jesús valide
   antes de seguir. No hagas commit ni borres ficheros.

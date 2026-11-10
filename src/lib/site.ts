import { getCaseStudies } from "@/lib/projects";

export const SITE_URL = "https://jesuslopezweb.com";

// Identificador del nodo Person del JSON-LD: las fichas lo referencian como autor.
export const PERSON_ID = `${SITE_URL}/#person`;

export const SITE_NAME = "Jesús López";

export const SITE_TITLE = "Jesús López | Desarrollador Web Full-Stack";

export const SITE_DESCRIPTION =
  "Desarrollador Full-Stack especializado en .NET, C#, Angular y SQL Server. Descubre mis proyectos y ponte en contacto conmigo.";

export const SITE_LINKS = {
  linkedin: "https://www.linkedin.com/in/jes%C3%BAs-l%C3%B3pez-serrano",
  github: "https://github.com/jesuslopez-code",
  email: "contacto@jesuslopezweb.com",
};

export const SITE_AVAILABLE = true;

// Rutas indexables: home, listado y fichas (derivadas de los datos). Añadir /blog... aquí.
export const SITE_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/proyectos", priority: 0.8 },
  ...getCaseStudies().map((project) => ({ path: `/proyectos/${project.slug}`, priority: 0.7 })),
];

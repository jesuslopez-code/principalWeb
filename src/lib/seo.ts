import type { Metadata } from "next";
import { PERSON_ID, SITE_NAME, SITE_URL } from "@/lib/site";
import type { Project } from "@/lib/projects";

// Un `openGraph` o `twitter` declarado en una ruta sustituye al del layout (no se fusiona),
// así que los campos comunes se repiten aquí. En OG el título va ya completo: la plantilla
// `%s | Jesús López` solo se aplica al <title>.
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  images,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  /** Solo si la ruta no tiene su propio opengraph-image: el `openGraph` de la ruta anula el fichero heredado. */
  images?: NonNullable<Metadata["openGraph"]>["images"];
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type, locale: "es_ES", siteName: SITE_NAME, title: fullTitle, description, url: path, images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}

// El alt por ficha no se puede sacar de opengraph-image (generateImageMetadata hacía desaparecer las
// metaetiquetas de imagen en Next 15.5), así que se declara aquí apuntando a la ruta del fichero.
export function projectMetadata(project: Project): Metadata {
  const title = `${project.title}: caso de estudio`;
  return pageMetadata({
    images: [{ url: `/proyectos/${project.slug}/opengraph-image`, width: 1200, height: 630, alt: title }],
    title,
    description: project.metaDescription ?? project.lead,
    path: `/proyectos/${project.slug}`,
  });
}

const absolute = (path: string) => `${SITE_URL}${path}`;
const author = { "@id": PERSON_ID };

function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function projectJsonLd(project: Project) {
  const path = `/proyectos/${project.slug}`;
  const primaryLink = project.links.find((link) => link.primary)?.href;
  const type = project.schemaType ?? "CreativeWork";

  const thing: Record<string, unknown> = {
    "@type": type,
    name: project.title,
    description: project.metaDescription ?? project.lead,
    mainEntityOfPage: absolute(path),
    author,
    keywords: project.stack.join(", "),
  };
  if (type === "SoftwareApplication") {
    thing.applicationCategory = "DeveloperApplication";
    thing.operatingSystem = "Windows";
    if (project.version) thing.softwareVersion = project.version;
    if (primaryLink) thing.downloadUrl = primaryLink;
  }
  if (type === "WebSite" && primaryLink) thing.url = primaryLink;

  return {
    "@context": "https://schema.org",
    "@graph": [
      thing,
      breadcrumbs([
        { name: "Inicio", path: "/" },
        { name: "Proyectos", path: "/proyectos" },
        { name: project.title, path },
      ]),
    ],
  };
}

export function projectsIndexJsonLd(projects: Project[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Casos de estudio",
        url: absolute("/proyectos"),
        author,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: projects.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: project.title,
            url: absolute(`/proyectos/${project.slug}`),
          })),
        },
      },
      breadcrumbs([
        { name: "Inicio", path: "/" },
        { name: "Proyectos", path: "/proyectos" },
      ]),
    ],
  };
}

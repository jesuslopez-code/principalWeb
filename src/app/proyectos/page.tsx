import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProjectCard, SideProjectRow } from "@/components/project-card";
import { JsonLd } from "@/components/json-ld";
import { getCaseStudies, getSideProjects } from "@/lib/projects";
import { pageMetadata, projectsIndexJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Casos de estudio",
  description:
    "Casos de estudio de Jesús López: Base Estelar, el Kit multiagente y la web de Iglesia El Camino, con el problema, las decisiones tomadas y los resultados.",
  path: "/proyectos",
  images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Casos de estudio de Jesús López" }],
});

export default function ProyectosPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <JsonLd data={projectsIndexJsonLd(getCaseStudies())} />
      <Header />
      <main id="contenido" className="flex-1">
        <div className="border-b border-border">
          <div className="container mx-auto grid gap-4 px-4 py-14 md:px-6 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="font-mono text-sm text-primary">{"//"} expedientes</p>
              <h1 className="mt-3 font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
                Casos de estudio
              </h1>
            </div>
            <p className="max-w-xl text-foreground/80 md:text-lg">
              Cada proyecto con su ficha técnica: el problema, las decisiones que tomé y lo que salió de ellas.
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-10 md:px-6 md:pb-24">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getCaseStudies().map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          {getSideProjects().map((project) => (
            <SideProjectRow key={project.slug} project={project} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

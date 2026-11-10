import Link from "next/link";
import { ProjectCard, SideProjectRow } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { getCaseStudies, getSideProjects } from "@/lib/projects";

export function ProjectsSection() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="w-full py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading id="projects-title" index="02" label="proyectos">
          Proyectos
        </SectionHeading>
        <p className="mt-4 max-w-2xl text-foreground/80 md:text-lg">
          Proyectos reales: una herramienta que uso a diario para trabajar con agentes de IA, una web en producción y código abierto para ver cómo están construidos por dentro.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {getCaseStudies().map((project) => (
            <ProjectCard key={project.slug} project={project} headingLevel="h3" />
          ))}
        </div>
        {getSideProjects().map((project) => (
          <SideProjectRow key={project.slug} project={project} />
        ))}
        <Link
          href="/proyectos"
          className="mt-8 inline-block rounded-sm font-mono text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          ver todos los casos <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

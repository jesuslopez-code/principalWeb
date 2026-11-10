import { Github, Linkedin, Mail } from "lucide-react";
import { VerIntroButton } from "@/components/ver-intro-button";
import { SITE_LINKS, SITE_NAME } from "@/lib/site";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-8">
      <div className="container mx-auto flex flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="space-y-2">
          <p className="font-mono text-xs text-muted-foreground">
            hecho con Next.js · desplegado en Vercel
          </p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.
          </p>
          <VerIntroButton />
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <a
            href={SITE_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition-colors hover:text-primary rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={SITE_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-colors hover:text-primary rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href={`mailto:${SITE_LINKS.email}`}
            aria-label="Enviar un correo"
            className="transition-colors hover:text-primary rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

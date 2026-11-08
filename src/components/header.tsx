"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// Las anclas llevan "/" delante para que también funcionen desde otras rutas (404, futuras).
const navLinks = [
  { href: "/#about", label: "01. sobre mí" },
  { href: "/#projects", label: "02. proyectos" },
  { href: "/#skills", label: "03. habilidades" },
  { href: "/#contact", label: "04. contacto" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="font-mono text-sm text-foreground transition-colors hover:text-primary"
        >
          <span aria-hidden="true" className="text-primary">&gt;_</span> <span aria-hidden="true">jesús</span>
          <span className="sr-only">Jesús López, inicio</span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-6 font-mono text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú de navegación</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle className="font-mono text-sm font-normal">
              <span aria-hidden="true" className="text-primary">&gt;_</span> <span aria-hidden="true">jesús</span>
              <span className="sr-only">Jesús López, inicio</span>
            </SheetTitle>
            <SheetDescription className="sr-only">Navegación principal</SheetDescription>
            <nav aria-label="Móvil" className="mt-8 grid gap-6 font-mono text-base">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

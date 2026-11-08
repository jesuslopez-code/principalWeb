import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <Header />
      <main className="hero-bg relative flex flex-1 items-center overflow-hidden py-20">
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <p className="font-mono text-sm text-primary md:text-base">
            error 404: ruta no encontrada
          </p>
          <h1 className="mt-6 font-display text-6xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            Esta página no <span className="italic text-primary">existe</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-foreground/80 md:text-lg">
            La dirección que buscas no está aquí, o se movió a otro sitio.
          </p>
          <Link
            href="/"
            className="mt-10 inline-block font-mono text-base text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            <span aria-hidden="true">
              <span className="text-primary">&gt;</span> cd /
            </span>
            <span className="sr-only">Volver al inicio</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

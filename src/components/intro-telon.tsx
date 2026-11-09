"use client";

import { useEffect, useRef } from "react";
import "./intro-telon.css";
import { INTRO_TELON_EVENT, INTRO_TELON_STORAGE_KEY } from "@/lib/intro-telon-script";

const TEXTO = "> abriendo Jesús López web";
const GESTOS = ["pointerdown", "wheel", "touchstart", "keydown"] as const;
const espera = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function IntroTelon() {
  const raizRef = useRef<HTMLDivElement>(null);
  const pantallaRef = useRef<HTMLDivElement>(null);
  const orqRef = useRef<HTMLDivElement>(null);
  const tecleoRef = useRef<HTMLSpanElement>(null);
  const terminarRef = useRef<() => void>(() => {});

  useEffect(() => {
    const raiz = raizRef.current;
    const pantalla = pantallaRef.current;
    const orq = orqRef.current;
    const tecleo = tecleoRef.current;
    if (!raiz || !pantalla || !orq || !tecleo) return;

    const html = document.documentElement;
    let ronda = 0;
    let animEnrollar: Animation | null = null;
    let activo = false;
    let rafs: number[] = [];
    let temporizadorFundido: ReturnType<typeof setTimeout> | undefined;

    const reducirMovimiento = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Cualquier gesto del visitante manda sobre la intro: no se le hace esperar.
    const cortar = () => terminar();
    const escuchar = (alta: boolean) => {
      const metodo = alta ? "addEventListener" : "removeEventListener";
      GESTOS.forEach((tipo) => document[metodo](tipo, cortar, { passive: true }));
      window[metodo]("scroll", cortar, { passive: true });
    };

    function terminar() {
      if (!activo) return;
      activo = false;
      ronda++;
      escuchar(false);
      raiz!.classList.add("fundido");
      temporizadorFundido = setTimeout(() => {
        html.classList.remove("intro-telon");
        raiz!.classList.remove("fundido", "fuera");
        animEnrollar?.cancel();
        animEnrollar = null;
      }, 250);
    }

    async function teclear(r: number) {
      for (let i = 1; i <= TEXTO.length; i++) {
        if (r !== ronda) return;
        tecleo!.textContent = TEXTO.slice(0, i);
        await espera(14);
      }
    }

    async function reproducir() {
      clearTimeout(temporizadorFundido);
      const r = ++ronda;
      animEnrollar?.cancel();
      animEnrollar = null;
      activo = true;
      html.dataset.introIniciada = "1";
      html.classList.add("intro-telon");
      raiz!.classList.remove("fuera", "fundido");
      pantalla!.style.transition = "";
      pantalla!.style.transform = "";
      orq!.className = "it-orq";
      orq!.style.transition = "none";
      orq!.style.transform = "";
      tecleo!.textContent = "";
      void orq!.offsetWidth;
      orq!.style.transition = "";

      try {
        localStorage.setItem(INTRO_TELON_STORAGE_KEY, "1");
      } catch {
        // Sin almacenamiento la intro simplemente se podría repetir.
      }
      escuchar(true);

      void teclear(r);
      orq!.classList.add("andando");
      orq!.style.transform = "translateX(0)";
      await espera(600);
      if (r !== ronda) return;
      orq!.classList.remove("andando");

      orq!.classList.add("agarra");
      await espera(130);
      if (r !== ronda) return;
      pantalla!.style.transition = "transform .12s ease-in";
      pantalla!.style.transform = "translateY(12px)";
      await espera(120);
      if (r !== ronda) return;

      orq!.classList.add("colgado", "saluda");
      pantalla!.style.transition = "none";
      animEnrollar = pantalla!.animate(
        [{ transform: "translateY(12px)" }, { transform: "translateY(calc(-100% - 220px))" }],
        { duration: 650, easing: "cubic-bezier(.55,0,.25,1)", fill: "forwards" },
      );
      await espera(650);
      if (r !== ronda) return;

      raiz!.classList.add("fuera");
      await espera(200);
      if (r !== ronda) return;
      terminar();
    }

    // El scroll de subir arriba dispara su evento en el siguiente fotograma: se arranca después para
    // que no corte la intro. "instant" porque el html lleva scroll-smooth y generaría eventos durante rato.
    const ver = () => {
      if (reducirMovimiento()) return;
      window.scrollTo({ top: 0, behavior: "instant" });
      rafs.forEach(cancelAnimationFrame);
      rafs = [];
      rafs[0] = requestAnimationFrame(() => {
        rafs[1] = requestAnimationFrame(() => void reproducir());
      });
    };

    terminarRef.current = terminar;
    window.addEventListener(INTRO_TELON_EVENT, ver);
    if (html.classList.contains("intro-telon") && !reducirMovimiento()) {
      void reproducir();
    }

    return () => {
      window.removeEventListener(INTRO_TELON_EVENT, ver);
      escuchar(false);
      rafs.forEach(cancelAnimationFrame);
      clearTimeout(temporizadorFundido);
      animEnrollar?.cancel();
      ronda++;
      activo = false;
    };
  }, []);

  return (
    <div ref={raizRef} className="it-telon">
      <div aria-hidden="true">
        <div className="it-tubo" />
        <div ref={pantallaRef} className="it-pantalla">
          <div className="it-tela">
            <div className="it-proyeccion">
              <p className="it-marca font-mono">
                <span>&gt;_</span> jesús
              </p>
              <p className="it-linea font-mono">
                <span ref={tecleoRef} />
                <span className="it-cur" />
              </p>
            </div>
          </div>
          <div className="it-lastra" />
          <div className="it-tirador" />
          <div ref={orqRef} className="it-orq">
            <svg viewBox="-30 -42 60 75">
              <path className="ala" d="M -7 -2 Q -19 -8 -22 -18 Q -13 -16 -7 -9 Z" />
              <path className="ala" d="M 7 -2 Q 19 -8 22 -18 Q 13 -16 7 -9 Z" />
              <path className="capa" d="M -11 -6 L 11 -6 L 17 20 L -17 20 Z" />
              <path className="forro" d="M -8 -6 L 8 -6 L 11 20 L -11 20 Z" />
              <g className="pierna pierna--a">
                <rect className="traje" x="-6" y="9" width="5" height="8" rx="2" />
                <rect className="bota" x="-7" y="16" width="7" height="5" rx="1.8" />
              </g>
              <g className="pierna pierna--b">
                <rect className="traje" x="1" y="9" width="5" height="8" rx="2" />
                <rect className="bota" x="0" y="16" width="7" height="5" rx="1.8" />
              </g>
              <rect className="brazo brazo--a" x="-14.5" y="-5" width="5" height="12" rx="2.5" />
              <rect className="brazo brazo--b" x="9.5" y="-5" width="5" height="12" rx="2.5" />
              <rect className="cuerpo" x="-10" y="-6" width="20" height="18" rx="7" />
              <rect className="cinturon" x="-9.5" y="6.5" width="19" height="2.4" rx="1" />
              <circle className="estrella" cx="0" cy="7.7" r="1.6" />
              <ellipse className="galon" cx="-9" cy="-5.5" rx="3.6" ry="1.2" />
              <ellipse className="galon" cx="9" cy="-5.5" rx="3.6" ry="1.2" />
              <rect className="panel" x="-6.5" y="-3.5" width="13" height="8" rx="1.8" />
              <circle className="boton--cian" cx="-3.8" cy="0.5" r="1.3" />
              <circle className="boton--area" cx="0" cy="0.5" r="1.6" />
              <circle className="boton--blanco" cx="3.8" cy="0.5" r="1.3" />
              <circle className="cara" cx="0" cy="-18" r="9.4" />
              <path className="pelo" d="M -9.2 -19.5 A 9.4 9.4 0 0 1 9.2 -19.5 Q 0 -23 -9.2 -19.5 Z" />
              <path className="ceja" d="M -6.4 -22.2 L -2.4 -22.2 M 2.4 -22.2 L 6.4 -22.2" />
              <circle className="ojo" cx="-4" cy="-18.4" r="1.5" />
              <circle className="ojo" cx="4" cy="-18.4" r="1.5" />
              <circle className="mejilla" cx="-6.6" cy="-14.4" r="1.8" />
              <circle className="mejilla" cx="6.6" cy="-14.4" r="1.8" />
              <path className="boca" d="M -2.6 -13.8 Q 0 -11.6 2.6 -13.8" />
              <circle className="casco" cx="0" cy="-18" r="13" />
              <path className="reflejo" d="M -8.6 -23 Q -6 -27.4 -1.6 -28" />
              <ellipse className="collar" cx="0" cy="-5.6" rx="7" ry="2" />
            </svg>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          terminarRef.current();
        }}
        className="absolute bottom-4 right-4 z-[5] rounded-md border border-border bg-card/85 px-3 py-1.5 font-mono text-xs font-medium text-foreground backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Saltar ›
      </button>
    </div>
  );
}

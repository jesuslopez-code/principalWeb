"use client";

import { useEffect, useRef, useState } from "react";
import { crearAnimacion, type Animacion } from "@/lib/base-estelar-animacion";
import "./base-estelar-demo.css";

const RUTA_BUNDLE_3D = "/base-estelar/estacion-3d.js";

type Vista = "2d" | "3d";

let cargaBundle: Promise<void> | null = null;

// El bundle de Three.js pesa ~650 KB: solo se pide al pulsar «Estación 3D» y una única vez.
function cargarBundle3D(): Promise<void> {
  if (window.BaseEstelar3D) return Promise.resolve();
  cargaBundle ??= new Promise<void>((resolver, rechazar) => {
    const script = document.createElement("script");
    script.src = RUTA_BUNDLE_3D;
    script.async = true;
    script.onload = () => resolver();
    script.onerror = () => {
      script.remove();
      cargaBundle = null;
      rechazar(new Error("No se pudo cargar la vista 3D"));
    };
    document.head.appendChild(script);
  });
  return cargaBundle;
}

export function BaseEstelarDemo() {
  const raizRef = useRef<HTMLDivElement>(null);
  const planoRef = useRef<SVGSVGElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const entradaRef = useRef<HTMLSpanElement>(null);
  const vista3dRef = useRef<HTMLDivElement>(null);
  const animacionRef = useRef<Animacion | null>(null);
  const [vista, setVista] = useState<Vista>("2d");
  const [sin3D, setSin3D] = useState(false);
  const [pausada, setPausada] = useState(false);
  const [reducido, setReducido] = useState(false);

  useEffect(() => {
    const raiz = raizRef.current;
    const plano = planoRef.current;
    const log = logRef.current;
    const entrada = entradaRef.current;
    const vista3d = vista3dRef.current;
    if (!raiz || !plano || !log || !entrada) return;

    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducido(sinMovimiento);
    const animacion = crearAnimacion({ plano, log, entrada }, sinMovimiento);
    animacionRef.current = animacion;

    const observador = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) animacion.iniciar();
      animacion.fueraDePantalla(!entry.isIntersecting);
    });
    observador.observe(raiz);

    return () => {
      observador.disconnect();
      animacion.destruir();
      animacionRef.current = null;
      plano.replaceChildren();
      log.replaceChildren();
      entrada.textContent = "";
      vista3d?.replaceChildren();
    };
  }, []);

  useEffect(() => {
    if (vista !== "3d") return;
    let cancelado = false;
    cargarBundle3D()
      .then(() => {
        const raiz = raizRef.current;
        const contenedor = vista3dRef.current;
        if (cancelado || !raiz || !contenedor) return;
        animacionRef.current?.montar3D(contenedor, raiz);
        setSin3D(false);
      })
      .catch(() => {
        if (!cancelado) setSin3D(true);
      });
    return () => {
      cancelado = true;
    };
  }, [vista]);

  function alternarPausa() {
    const nueva = !pausada;
    setPausada(nueva);
    animacionRef.current?.pausaManual(nueva);
  }

  const botones: { id: Vista; texto: string }[] = [
    { id: "2d", texto: "Plano 2D" },
    { id: "3d", texto: "Estación 3D" },
  ];

  return (
    <figure className="m-0">
      <div ref={raizRef} className="base-estelar-demo">
        <div className="panel-terminal" aria-hidden="true">
          <div className="barra">
            <span className="pestana pestana--activa">
              <span className="piloto" />
              principalWeb
            </span>
            <span className="pestana">kit-panel</span>
            <span className="mas">+</span>
          </div>
          <div className="xterm">
            <div className="log" ref={logRef} />
            <div className="entrada">
              <span className="c-gris">&gt;</span> <span ref={entradaRef} />
              <span className="cur" />
            </div>
            <p className="pista">? for shortcuts</p>
          </div>
        </div>
        <div className="visor">
          <div className="controles">
            {!reducido && (
              <button type="button" className="vista-btn pausa-btn" aria-pressed={pausada} onClick={alternarPausa}>
                {pausada ? "Reanudar animación" : "Pausar animación"}
              </button>
            )}
            <div className="conmutador" role="group" aria-label="Vista de la animación">
              {botones.map((boton) => (
                <button
                  key={boton.id}
                  type="button"
                  className="vista-btn"
                  aria-pressed={vista === boton.id}
                  onClick={() => setVista(boton.id)}
                >
                  {boton.texto}
                </button>
              ))}
            </div>
          </div>
          <div className="vista-marco">
          <div
            className="vista"
            role="img"
            aria-label="Animación de Base Estelar trabajando en esta web: el orquestador llama a cada agente, que sale del café hacia su sala; la pizarra pasa las tareas a hecho y al final queda una duda para Jesús."
          >
            <svg
              ref={planoRef}
              className="oficina__plano"
              viewBox="0 0 680 752"
              aria-hidden="true"
              style={vista === "2d" ? undefined : { display: "none" }}
            />
            <div
              ref={vista3dRef}
              className="vista3d"
              style={vista === "3d" && !sin3D ? undefined : { display: "none" }}
            />
          </div>
          {vista === "3d" && sin3D && (
            <p className="sin-webgl" role="status">
              Este navegador no puede mostrar la vista 3D.
            </p>
          )}
          </div>
        </div>
      </div>
      <figcaption className="mt-2.5 font-mono text-xs text-muted-foreground">
        animación decorativa · se queda quieta con «reducir movimiento»
      </figcaption>
    </figure>
  );
}

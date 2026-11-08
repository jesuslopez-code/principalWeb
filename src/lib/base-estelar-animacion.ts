const NS = "http://www.w3.org/2000/svg";

type Punto = [number, number];
type EstadoMuneco = "libre" | "trabajando" | "esperando";
type EstadoTarea = "pendiente" | "en curso" | "hecha";
type Luz = "curso" | "hecho";

interface Sala {
  rect: [number, number, number, number];
  nombre: string;
  mesas: Punto[];
  puerta: Punto[];
  g?: SVGGElement;
  fase?: SVGTextElement;
}

interface Tarea {
  id: string;
  texto: string;
  estado: EstadoTarea;
  g?: SVGGElement;
}

interface Muneco {
  g: SVGGElement;
  pos: Punto;
  inicio: Punto;
  anchoPlaza: number;
  e?: EstadoMuneco;
  tarea?: string | null;
}

interface Escena3D {
  canvas: HTMLCanvasElement;
  camara: { zoom: number; updateProjectionMatrix: () => void };
  controles: { update: () => void; enableZoom: boolean };
  actualizar: (datos: unknown) => void;
  liberar?: () => void;
  // La escena corre su propio bucle; estos dos miembros son los que lo arrancan y lo paran.
  visibleEnPagina?: boolean;
  actualizarBucle?: () => void;
}

interface Bundle3D {
  EscenaEstacion: new (opciones: {
    contenedor: HTMLElement;
    paleta: unknown;
    reducido: boolean;
    alSeleccionar: () => void;
  }) => Escena3D;
  leerPaleta: (raiz?: Element) => unknown;
}

declare global {
  interface Window {
    BaseEstelar3D?: Bundle3D;
  }
}

export interface ElementosAnimacion {
  plano: SVGSVGElement;
  log: HTMLElement;
  entrada: HTMLElement;
}

export interface Animacion {
  iniciar: () => void;
  fueraDePantalla: (fuera: boolean) => void;
  pausaManual: (pausa: boolean) => void;
  montar3D: (contenedor: HTMLElement, raiz: HTMLElement) => void;
  destruir: () => void;
}

// Coordenadas de calcularPlano({ frontend 1, docs 1, revision 2, otros 1, café 5, pizarra 5 filas }).
const SALAS: Record<string, Sala> = {
  frontend: { rect: [10, 10, 325, 150], nombre: "Frontend", mesas: [[50.625, 92]], puerta: [[172.5, 178], [172.5, 160]] },
  docs: { rect: [345, 10, 325, 150], nombre: "Docs", mesas: [[385.625, 92]], puerta: [[507.5, 178], [507.5, 160]] },
  revision: { rect: [10, 564, 160, 178], nombre: "Revisión y pruebas", mesas: [[50, 646], [130, 646]], puerta: [[90, 546], [90, 564]] },
  otros: { rect: [180, 564, 160, 178], nombre: "Otros", mesas: [[220, 646]], puerta: [[260, 546], [260, 564]] },
};
const CAFE: Punto[] = [[416, 240], [488, 240], [560, 240], [416, 318], [488, 318]];
const ORQ: Punto = [614, 690];
const PIZ = { x: 14, y: 194, w: 332, h: 210, columnas: [22, 130, 238] };
const COL: Record<EstadoTarea, number> = { pendiente: 0, "en curso": 1, hecha: 2 };
const VEL = 260;
const ZOOM_3D = 1.15;
const TEXTO_DUDA = "Cierre de la fase 3B: revísala en el navegador";

const AGENTE: Record<string, [string, string]> = {
  fe: ["pweb-frontend-dev", "frontend"],
  seo: ["pweb-seo", "otros"],
  rev: ["pweb-reviewer", "revision"],
  test: ["pweb-tester", "revision"],
  docs: ["pweb-docs", "docs"],
};

const truncar = (t: string, max: number) =>
  t.length <= max ? t : t.slice(0, Math.max(1, max - 1)).trimEnd() + "…";

function partirTexto(texto: string, maximo: number, lineas: number): string[] {
  const palabras = texto.split(" ");
  const res: string[] = [];
  let actual = "";
  let i = 0;
  while (i < palabras.length && res.length < lineas) {
    const cand = actual ? actual + " " + palabras[i] : palabras[i];
    if (cand.length <= maximo) {
      actual = cand;
      i++;
    } else if (actual) {
      res.push(actual);
      actual = "";
    } else {
      res.push(palabras[i].slice(0, maximo));
      i++;
    }
  }
  if (actual && res.length < lineas) res.push(actual);
  if (i < palabras.length && res.length) res[res.length - 1] = truncar(res[res.length - 1] + "…", maximo);
  return res;
}

export function crearAnimacion(elementos: ElementosAnimacion, reducido: boolean): Animacion {
  const { plano, log, entrada } = elementos;

  let vivo = true;
  let pausado = true;
  let fuera = true;
  let manual = false;
  let arrancado = false;
  let rafId = 0;
  const temporizadores = new Set<ReturnType<typeof setTimeout>>();
  let reanudadores: (() => void)[] = [];
  let quitarVisibilidad: (() => void) | null = null;

  let escena3D: Escena3D | null = null;
  let sync3DPendiente = false;
  const luces: Record<string, Luz> = {};
  let semaforoOk = false;
  let dudaActual = "";

  function el<K extends keyof SVGElementTagNameMap>(
    tag: K,
    attrs: Record<string, string | number> = {},
    padre: Element = plano,
    texto?: string,
  ): SVGElementTagNameMap[K] {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
    if (texto !== undefined) n.textContent = texto;
    padre.appendChild(n);
    return n;
  }

  function sync3D() {
    if (!escena3D || sync3DPendiente) return;
    sync3DPendiente = true;
    queueMicrotask(() => {
      sync3DPendiente = false;
      escena3D?.actualizar(datos3D());
    });
  }

  function dibujarSala(id: string, s: Sala) {
    const [x, y, w, h] = s.rect;
    const g = el("g", { class: "sala sala--" + id });
    el("rect", { class: "sala__fondo", x, y, width: w, height: h, rx: 12 }, g);
    el("rect", { class: "sala__franja", x: x + 10, y, width: 28, height: 3, rx: 1.5 }, g);
    el("text", { class: "sala__nombre", x: x + 10, y: y + 17 }, g, s.nombre);
    s.fase = el("text", { class: "sala__fase", x: x + w - 10, y: y + 17, "text-anchor": "end" }, g, "");
    s.mesas.forEach(([mx, my]) => {
      el("rect", { class: "mesa__tablero", x: mx - 25, y: my + 18, width: 50, height: 12, rx: 3 }, g);
      el("rect", { class: "mesa__pantalla", x: mx + 12, y: my + 8, width: 11, height: 9, rx: 1.5 }, g);
    });
    s.g = g;
  }

  el("rect", { class: "comun__fondo", x: 10, y: 170, width: 660, height: 384, rx: 12 });
  el("text", { class: "sala__nombre sala__nombre--tenue", x: 660, y: 187, "text-anchor": "end" }, plano, "Zona común");
  Object.entries(SALAS).forEach(([id, s]) => dibujarSala(id, s));

  const tu = el("g", { class: "tu-mesa sala--orquestador" });
  el("rect", { class: "sala__fondo", x: 350, y: 564, width: 320, height: 178, rx: 12 }, tu);
  el("rect", { class: "sala__franja", x: 360, y: 564, width: 28, height: 3, rx: 1.5 }, tu);
  el("text", { class: "sala__nombre", x: 360, y: 581 }, tu, "Tu mesa");
  el("rect", { class: "mesa__tablero", x: 546, y: 708, width: 108, height: 12, rx: 3 }, tu);
  el("rect", { class: "mesa__pantalla", x: 632, y: 698, width: 12, height: 10, rx: 1.5 }, tu);

  const capaHaz = el("g");

  el("rect", { class: "pizarra__marco", x: PIZ.x, y: PIZ.y, width: PIZ.w, height: PIZ.h, rx: 6 });
  ["Pendiente", "En curso", "Hecho"].forEach((t, c) => {
    el("text", { class: "pizarra__columna", x: PIZ.columnas[c] + 2, y: PIZ.y + 15 }, plano, t);
    if (c > 0) {
      el("line", {
        class: "pizarra__linea",
        x1: PIZ.columnas[c] - 4,
        x2: PIZ.columnas[c] - 4,
        y1: PIZ.y + 6,
        y2: PIZ.y + PIZ.h - 30,
      });
    }
  });
  const tituloPizarra = el("text", { class: "pizarra__titulo", x: PIZ.x + 8, y: PIZ.y + PIZ.h - 10 });
  const TAREAS: Tarea[] = [
    { id: "fe", texto: "Tokens .dark y fondo del hero", estado: "pendiente" },
    { id: "seo", texto: "OG, favicon y apple-icon", estado: "pendiente" },
    { id: "rev", texto: "Revisión con pweb-reviewer", estado: "pendiente" },
    { id: "test", texto: "Prueba con pweb-tester", estado: "pendiente" },
    { id: "docs", texto: "Relevo en tareas.md", estado: "pendiente" },
  ];
  TAREAS.forEach((t) => {
    const g = el("g", { class: "postit" });
    t.g = g;
    el("rect", { width: 100, height: 28, rx: 2.5 }, g);
    partirTexto(t.texto, Math.floor(90 / 5.3), 2).forEach((linea, i) =>
      el("text", { x: 5, y: 11 + i * 11 }, g, linea),
    );
  });
  function pintarPizarra() {
    TAREAS.forEach((t, i) => {
      const fila = TAREAS.slice(0, i).filter((o) => o.estado === t.estado).length;
      t.g?.setAttribute("class", "postit postit--" + (t.estado === "en curso" ? "en-curso" : t.estado));
      if (t.g) t.g.style.transform = `translate(${PIZ.columnas[COL[t.estado]]}px, ${PIZ.y + 22 + fila * 32}px)`;
    });
    const hechas = TAREAS.filter((t) => t.estado === "hecha").length;
    tituloPizarra.textContent = truncar(
      `Fase 3B · Rediseño visual (dirección A) · ${hechas}/${TAREAS.length}`,
      Math.floor((PIZ.w - 16) / 5.4),
    );
  }
  function tarea(id: string, estado: EstadoTarea) {
    const t = TAREAS.find((o) => o.id === id);
    if (t) t.estado = estado;
    pintarPizarra();
    sync3D();
  }

  const cafe = el("g", { class: "cafe" });
  el("rect", { class: "cafe__cuerpo", x: 608, y: 220, width: 36, height: 54, rx: 5 }, cafe);
  el("rect", { class: "cafe__pantalla", x: 615, y: 228, width: 22, height: 12, rx: 2 }, cafe);
  el("rect", { class: "cafe__hueco", x: 619, y: 254, width: 14, height: 12, rx: 2 }, cafe);
  el("text", { class: "objeto__etiqueta", x: 626, y: 286, "text-anchor": "middle" }, cafe, "Café");
  function mueble(x: number, y: number, w: number, titulo: string, texto: string) {
    el("rect", { class: "pizarra__marco", x, y, width: w, height: 44, rx: 6 });
    el("text", { class: "mueble__titulo", x: x + 10, y: y + 17 }, plano, titulo);
    el("text", { x: x + 10, y: y + 33 }, plano, texto);
  }
  mueble(22, 494, 180, "Incidencias", "1 pendiente · FIX-005");
  mueble(212, 494, 130, "Archivador", "Aprendizajes");
  el("rect", { class: "pizarra__marco", x: 352, y: 494, width: 180, height: 44, rx: 6 });
  const semaforos = ["Tests", "Build"].map((nombre, i) => {
    const x = 352 + 16 + i * (180 / 2 - 4);
    const luz = el("circle", { class: "semaforo__luz", cx: x, cy: 509, r: 6 });
    el("text", { class: "mueble__titulo", x: x + 12, y: 513 }, plano, nombre);
    const estado = el("text", { x: x - 6, y: 530 }, plano, "desconocido");
    return { luz, estado };
  });
  function semaforo(ok: boolean) {
    semaforoOk = ok;
    sync3D();
    semaforos.forEach((l) => {
      l.luz.setAttribute("class", "semaforo__luz" + (ok ? " semaforo__luz--correcto" : ""));
      l.estado.textContent = ok ? "correcto" : "desconocido";
    });
  }
  mueble(542, 494, 120, "Vigía", "Sin deriva");

  const dudas = el("g", { class: "cola-dudas" });
  function ponerDuda(texto: string) {
    dudaActual = texto;
    sync3D();
    dudas.replaceChildren();
    if (!texto) {
      el("text", { x: 360, y: 604 }, dudas, "Sin dudas pendientes");
      return;
    }
    const d = el("g", { class: "cola-dudas__duda" }, dudas);
    el("circle", { cx: 364, cy: 600, r: 3 }, d);
    el("text", { x: 374, y: 604 }, d, truncar(texto, Math.floor(300 / 5.6) - 2));
  }
  const bandeja = el("g", { class: "bandeja" });
  el("rect", { class: "bandeja__base", x: 551, y: 704, width: 30, height: 5, rx: 1.5 }, bandeja);
  el("text", { class: "bandeja__cuenta", x: 566, y: 694, "text-anchor": "middle" }, bandeja, "Bandeja");

  const gente = el("g", { class: "gente" });
  function situar(m: Muneco, [x, y]: Punto) {
    m.pos = [x, y];
    m.g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
  }
  function crearMuneco(sala: string, nombre: string, [x, y]: Punto, anchoPlaza: number): Muneco {
    const g = el("g", { class: `muneco muneco--libre sala--${sala}` }, gente);
    // Marcado estático y sin datos externos: el único texto variable es `nombre`, de constantes de este fichero.
    g.innerHTML = `
      <rect class="muneco__pierna muneco__pierna--a" x="-6" y="9" width="5" height="12" rx="2.2"/>
      <rect class="muneco__pierna muneco__pierna--b" x="1" y="9" width="5" height="12" rx="2.2"/>
      <rect class="muneco__brazo muneco__brazo--a" x="-14.5" y="-5" width="5" height="12" rx="2.5"/>
      <rect class="muneco__brazo muneco__brazo--b" x="9.5" y="-5" width="5" height="12" rx="2.5"/>
      <rect class="muneco__cuerpo" x="-10" y="-6" width="20" height="18" rx="7"/>
      <g class="muneco__cabeza">
        <circle class="muneco__pelo" cx="0" cy="-29" r="3.4"/><circle class="muneco__cara" cx="0" cy="-17" r="11.5"/>
        <circle class="muneco__ojo" cx="-4.2" cy="-17.5" r="1.6"/><circle class="muneco__ojo" cx="4.2" cy="-17.5" r="1.6"/>
        <circle class="muneco__mejilla" cx="-7.4" cy="-13.2" r="2"/><circle class="muneco__mejilla" cx="7.4" cy="-13.2" r="2"/>
        <path class="muneco__boca" d="M -2.6 -12.6 Q 0 -10.4 2.6 -12.6"/>
      </g>
      <g class="muneco__taza">
        <path class="muneco__vapor muneco__vapor--a" d="M 17 -1 q -2 -3 0 -5"/><path class="muneco__vapor muneco__vapor--b" d="M 20.5 -1 q -2 -3 0 -5"/>
        <path class="muneco__asa" d="M 22.5 3 q 3 0.5 0 4.5"/><rect class="muneco__taza-cuerpo" x="14" y="1.5" width="9" height="8" rx="2"/>
      </g>
      <circle class="muneco__punto" cx="13" cy="-27" r="4.2"/>
      <g class="muneco__llamada"><path d="M 19 -34 q 4 5 0 10"/><path d="M 24 -38 q 7 9 0 18"/></g>
      <text class="muneco__nombre" x="0" y="42" text-anchor="middle">${truncar(nombre, 13)}</text>
      <g class="muneco__bocadillo"><rect y="-60" height="19" rx="6"/><path d="M -4 -41 L 0 -35 L 4 -41 Z"/><text x="0" y="-47" text-anchor="middle"></text></g>`;
    const m: Muneco = { g, pos: [x, y], inicio: [x, y], anchoPlaza };
    situar(m, [x, y]);
    return m;
  }
  function estado(m: Muneco, e: EstadoMuneco) {
    m.g.classList.remove("muneco--libre", "muneco--trabajando", "muneco--esperando");
    m.g.classList.add("muneco--" + e);
    m.e = e;
    sync3D();
  }
  function bocadillo(m: Muneco, texto: string) {
    const b = m.g.querySelector(".muneco__bocadillo");
    if (!b) return;
    m.tarea = texto || null;
    sync3D();
    if (!texto) {
      b.classList.remove("visible");
      return;
    }
    const max = Math.min(17, Math.floor((m.anchoPlaza - 4 - 16) / 5.6));
    const t = truncar(texto, max);
    const ancho = Math.max(48, t.length * 5.6 + 16);
    const rect = b.querySelector("rect");
    rect?.setAttribute("x", String(-ancho / 2));
    rect?.setAttribute("width", String(ancho));
    const txt = b.querySelector("text");
    if (txt) txt.textContent = t;
    b.classList.add("visible");
  }

  const orq = crearMuneco("orquestador", "Orquestador", ORQ, 120);
  estado(orq, "trabajando");
  const llamada = el("g", { class: "muneco__bocadillo muneco__bocadillo--llamada" }, orq.g);
  const llamadaRect = el("rect", { y: -64, height: 19, rx: 6 }, llamada);
  el("path", { d: "M 2 -45 L 7 -38 L 12 -45 Z" }, llamada);
  const llamadaTexto = el("text", { y: -51, "text-anchor": "middle" }, llamada);
  function llamar(texto: string) {
    orq.g.classList.toggle("muneco--llamando", !!texto);
    if (!texto) {
      llamada.classList.remove("visible");
      return;
    }
    const ancho = Math.max(60, texto.length * 5.6 + 16);
    llamadaRect.setAttribute("x", String(30 - ancho));
    llamadaRect.setAttribute("width", String(ancho));
    llamadaTexto.setAttribute("x", String(30 - ancho / 2));
    llamadaTexto.textContent = texto;
    llamada.classList.add("visible");
  }

  const AG: Record<string, Muneco> = {
    fe: crearMuneco("frontend", "frontend-dev", CAFE[0], 72),
    docs: crearMuneco("docs", "docs", CAFE[1], 72),
    rev: crearMuneco("revision", "reviewer", CAFE[2], 72),
    test: crearMuneco("revision", "tester", CAFE[3], 72),
    seo: crearMuneco("otros", "seo", CAFE[4], 72),
  };
  gente.appendChild(orq.g);

  // Espera cancelable y pausable: si la demo sale de pantalla, los pasos pendientes esperan a reanudar.
  function puerta(): Promise<void> {
    return pausado ? new Promise((r) => reanudadores.push(r)) : Promise.resolve();
  }
  function espera(ms: number): Promise<void> {
    return new Promise((resolver) => {
      if (!vivo) return;
      const id = setTimeout(() => {
        temporizadores.delete(id);
        void puerta().then(resolver);
      }, ms);
      temporizadores.add(id);
    });
  }

  function andar(m: Muneco, puntos: Punto[], haz: boolean): Promise<void> {
    return new Promise((resolver) => {
      const tramo: Punto[] = [m.pos, ...puntos];
      const largos = tramo.slice(1).map((p, i) => Math.hypot(p[0] - tramo[i][0], p[1] - tramo[i][1]));
      const total = largos.reduce((a, b) => a + b, 0);
      const linea = haz ? el("path", { class: "haz-llamada" }, capaHaz) : null;
      m.g.classList.add("muneco--andando");
      let transcurrido = 0;
      let ultimo: number | null = null;
      function paso(ahora: number) {
        if (!vivo) return;
        if (pausado) {
          ultimo = null;
          reanudadores.push(() => {
            rafId = requestAnimationFrame(paso);
          });
          return;
        }
        if (ultimo !== null) transcurrido += ahora - ultimo;
        ultimo = ahora;
        let d = Math.max(0, (transcurrido / 1000) * VEL);
        const recorrido = d;
        let i = 0;
        while (i < largos.length - 1 && d > largos[i]) {
          d -= largos[i];
          i++;
        }
        const k = Math.min(1, largos[i] ? d / largos[i] : 1);
        const a = tramo[i];
        const b = tramo[i + 1];
        situar(m, [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]);
        linea?.setAttribute("d", `M ${ORQ[0] - 10} ${ORQ[1] - 20} L ${m.pos[0]} ${m.pos[1] - 10}`);
        if (recorrido < total) {
          rafId = requestAnimationFrame(paso);
        } else {
          m.g.classList.remove("muneco--andando");
          linea?.remove();
          resolver();
        }
      }
      rafId = requestAnimationFrame(paso);
    });
  }

  function luzSala(id: string, luz: Luz | null) {
    const s = SALAS[id];
    s.g?.classList.remove("sala--fase-curso", "sala--fase-hecho");
    if (luz) s.g?.classList.add("sala--fase-" + luz);
    if (s.fase) s.fase.textContent = luz === "curso" ? "⟳" : luz === "hecho" ? "✓" : "";
    if (luz) luces[id] = luz;
    else delete luces[id];
    sync3D();
  }

  // El HTML de las líneas es siempre un literal de este fichero; nunca entrada del usuario.
  function linea(html: string): HTMLParagraphElement {
    const p = document.createElement("p");
    p.innerHTML = html;
    log.appendChild(p);
    while (log.scrollHeight > log.clientHeight && log.children.length > 2) log.children[1].remove();
    return p;
  }
  async function teclear(texto: string) {
    entrada.textContent = "";
    if (reducido) return;
    for (const c of texto) {
      entrada.textContent += c;
      await espera(45);
    }
    await espera(250);
    entrada.textContent = "";
  }
  function agenteEnMarcha(nombre: string, desc: string) {
    const cab = linea(`<span class="c-gris vivo">●</span> <span class="c-blanco">${nombre}</span>(${desc})`);
    const res = linea(`  <span class="c-gris">⎿  En marcha…</span>`);
    return (resumen: string) => {
      const punto = cab.querySelector(".vivo");
      if (punto) punto.className = "c-verde";
      res.innerHTML = `  <span class="c-gris">⎿</span>  ${resumen}`;
    };
  }

  function reiniciar() {
    log.innerHTML =
      '<div class="bienvenida"><b>✻</b> Welcome to Claude Code!<br><span class="c-gris">  cwd: ~/proyectos/principalWeb</span></div>';
    Object.values(AG).forEach((m) => {
      situar(m, m.inicio);
      estado(m, "libre");
      bocadillo(m, "");
    });
    Object.keys(SALAS).forEach((id) => luzSala(id, null));
    TAREAS.forEach((t) => (t.estado = "pendiente"));
    pintarPizarra();
    semaforo(false);
    ponerDuda("");
    llamar("");
  }

  const ida = (sala: string, mesa: number): Punto[] => [...SALAS[sala].puerta, SALAS[sala].mesas[mesa]];
  const vuelta = (sala: string, m: Muneco): Punto[] => [...[...SALAS[sala].puerta].reverse(), m.inicio];

  async function encargo(
    m: Muneco,
    sala: string,
    mesa: number,
    nombre: string,
    desc: string,
    idTarea: string,
    textoBocadillo: string,
  ) {
    llamar(nombre);
    const fin = agenteEnMarcha(nombre, desc);
    tarea(idTarea, "en curso");
    luzSala(sala, "curso");
    estado(m, "trabajando");
    await andar(m, ida(sala, mesa), true);
    llamar("");
    bocadillo(m, textoBocadillo);
    return fin;
  }
  async function terminar(
    m: Muneco,
    sala: string,
    fin: (resumen: string) => void,
    resumen: string,
    idTarea: string,
    luzFinal: Luz | null = "hecho",
  ) {
    fin(resumen);
    tarea(idTarea, "hecha");
    bocadillo(m, "");
    estado(m, "libre");
    if (luzFinal) luzSala(sala, luzFinal);
    await andar(m, vuelta(sala, m), false);
  }

  async function ciclo() {
    reiniciar();
    await espera(600);
    await teclear("/fase 3B");
    linea('<span class="c-claude">&gt;</span> /fase 3B');
    await espera(400);
    linea("<span>●</span> Abro la Fase 3B: paleta «Violeta .NET». Reparto por áreas.");
    await espera(500);

    const pFe = encargo(AG.fe, "frontend", 0, "pweb-frontend-dev", "Tokens .dark y hero", "fe", "Tokens .dark");
    await espera(700);
    const pSeo = encargo(AG.seo, "otros", 0, "pweb-seo", "OG, favicon y apple-icon", "seo", "OG e iconos");
    const [finFe, finSeo] = await Promise.all([pFe, pSeo]);
    await espera(1300);
    void terminar(AG.fe, "frontend", finFe, "Done (14 tool uses · 2m 10s)", "fe");
    await espera(500);
    void terminar(AG.seo, "otros", finSeo, "Done (9 tool uses · 1m 24s)", "seo");
    await espera(400);
    const build = linea(
      '<span class="c-gris vivo">●</span> <span class="c-blanco">Bash</span>(npm run typecheck &amp;&amp; npm run lint &amp;&amp; npm run build)',
    );
    await espera(900);
    const punto = build.querySelector(".vivo");
    if (punto) punto.className = "c-verde";
    linea('  <span class="c-gris">⎿</span>  <span class="c-verde">✓ Compiled successfully</span>');
    semaforo(true);
    await espera(500);

    const finRev = await encargo(AG.rev, "revision", 0, "pweb-reviewer", "Revisar el cambio de paleta", "rev", "Revisando");
    await espera(1100);
    void terminar(AG.rev, "revision", finRev, "Apto · 2 hallazgos BAJO", "rev", "curso");
    await espera(300);
    const finTest = await encargo(AG.test, "revision", 1, "pweb-tester", "375 · 768 · 1440 px y Lighthouse", "test", "Lighthouse");
    await espera(1100);
    void terminar(AG.test, "revision", finTest, '<span class="c-verde">Lighthouse 98 · 100 · 100 · 100</span>', "test");
    await espera(300);
    const finDocs = await encargo(AG.docs, "docs", 0, "pweb-docs", "Relevo en tareas.md", "docs", "Relevo");
    await espera(900);
    await terminar(AG.docs, "docs", finDocs, "Done (3 tool uses · 38s)", "docs");

    linea("<span>●</span> Fase 3B lista. Te dejo la duda del cierre en tu mesa.");
    ponerDuda(TEXTO_DUDA);
    estado(orq, "esperando");
    await espera(3200);
    estado(orq, "trabajando");
  }

  function muneco3D(id: string, nombre: string, nombreCorto: string, sala: string, m: Muneco, esOrquestador: boolean) {
    return {
      id,
      nombre,
      nombreCorto,
      etiqueta: null,
      sala,
      estado: m.e || "libre",
      enfadado: false,
      tarea: m.e === "trabajando" ? m.tarea || null : null,
      instancias: 1,
      visitante: false,
      esOrquestador,
      rol: "",
      modelo: null,
      fichero: null,
      aprendizajes: [],
      desde: null,
      encargo: null,
      accion: null,
      dudas: [],
    };
  }
  function datos3D() {
    const munecos = [muneco3D("orquestador", "Orquestador", "Orquestador", "orquestador", orq, true)];
    for (const [clave, [nombre, sala]] of Object.entries(AGENTE)) {
      munecos.push(muneco3D("agente:" + nombre, nombre, nombre.replace("pweb-", ""), sala, AG[clave], false));
    }
    const luz = semaforoOk ? "correcto" : "desconocido";
    return {
      munecos,
      deriva: false,
      vigia: "ausente",
      pizarra: {
        etiqueta: "Pizarra · Fase 3B",
        tareas: TAREAS.map((t, indice) => ({ estado: t.estado, texto: t.texto, indice })),
        encargos: [],
      },
      tablon: { etiqueta: "Incidencias · 5 incidencias", notas: ["hecho", "hecho", "hecho", "hecho", "pendiente"] },
      bandeja: { dudas: dudaActual ? 1 : 0, borradores: 0 },
      semaforo: { tests: luz, build: luz },
      luces: { salas: { ...luces }, orquestador: false },
    };
  }

  function pintarEstatico() {
    reiniciar();
    linea('<span class="c-claude">&gt;</span> /fase 3B');
    linea("<span>●</span> Abro la Fase 3B: paleta «Violeta .NET». Reparto por áreas.");
    [
      ["pweb-frontend-dev", "Tokens .dark y hero", "Done (14 tool uses · 2m 10s)"],
      ["pweb-seo", "OG, favicon y apple-icon", "Done (9 tool uses · 1m 24s)"],
      ["pweb-reviewer", "Revisar el cambio de paleta", "Apto · 2 hallazgos BAJO"],
      ["pweb-tester", "375 · 768 · 1440 px y Lighthouse", "Lighthouse 98 · 100 · 100 · 100"],
    ].forEach(([n, d, r]) => agenteEnMarcha(n, d)(r));
    linea("<span>●</span> Fase 3B lista. Te dejo la duda del cierre en tu mesa.");
    TAREAS.forEach((t) => (t.estado = "hecha"));
    pintarPizarra();
    ["frontend", "otros", "revision", "docs"].forEach((s) => luzSala(s, "hecho"));
    semaforo(true);
    ponerDuda(TEXTO_DUDA);
    estado(orq, "esperando");
  }

  function bucle3D() {
    if (!escena3D?.actualizarBucle) return;
    escena3D.visibleEnPagina = !pausado && document.visibilityState === "visible";
    escena3D.actualizarBucle();
  }

  function aplicarPausa() {
    const nuevo = fuera || manual;
    if (nuevo === pausado) return;
    pausado = nuevo;
    bucle3D();
    if (!pausado) {
      const pendientes = reanudadores;
      reanudadores = [];
      pendientes.forEach((r) => r());
    }
  }

  // Estado inicial ya pintado: sin esto los post-its nacen sin transform (apilados en 0,0) hasta el primer ciclo.
  reiniciar();

  async function bucle() {
    while (vivo) await ciclo();
  }

  return {
    iniciar() {
      if (arrancado) return;
      arrancado = true;
      if (reducido) {
        pintarEstatico();
        return;
      }
      fuera = false;
      aplicarPausa();
      void bucle();
    },
    fueraDePantalla(valor) {
      if (reducido || !vivo) return;
      fuera = valor;
      aplicarPausa();
    },
    pausaManual(valor) {
      if (reducido || !vivo) return;
      manual = valor;
      aplicarPausa();
    },
    montar3D(contenedor, raiz) {
      if (escena3D) return;
      const bundle = window.BaseEstelar3D;
      if (!bundle) throw new Error("Bundle 3D no cargado");
      const escena = new bundle.EscenaEstacion({
        contenedor,
        paleta: bundle.leerPaleta(raiz),
        reducido,
        alSeleccionar: () => {},
      });
      escena3D = escena;
      escena.canvas.setAttribute("aria-hidden", "true");
      escena.actualizar(datos3D());
      escena.camara.zoom = ZOOM_3D;
      escena.camara.updateProjectionMatrix();
      escena.controles.update();
      // Sin zoom con rueda/pellizco y con scroll vertical libre: el canvas no debe atrapar la página.
      escena.controles.enableZoom = false;
      escena.canvas.style.touchAction = "pan-y";
      const alCambiarVisibilidad = () => bucle3D();
      document.addEventListener("visibilitychange", alCambiarVisibilidad);
      quitarVisibilidad = () => document.removeEventListener("visibilitychange", alCambiarVisibilidad);
      bucle3D();
    },
    destruir() {
      vivo = false;
      cancelAnimationFrame(rafId);
      temporizadores.forEach(clearTimeout);
      temporizadores.clear();
      reanudadores = [];
      quitarVisibilidad?.();
      escena3D?.liberar?.();
      escena3D = null;
    },
  };
}

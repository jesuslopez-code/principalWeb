// Script inline para el <head>: decide ANTES del primer pintado si toca el telón, marcando <html> con la
// clase "intro-telon" (el CSS de intro-telon.css lo muestra solo con esa clase, así que no hay destello).
// Toca el telón si: no existe "intro-vista" en localStorage, no hay prefers-reduced-motion y el user
// agent no es un buscador/rastreador. A los 1,2 s quita la clase si el componente aún no ha marcado
// data-intro-iniciada: con conexión lenta o JS roto/bloqueado no se hace esperar al visitante con la web
// tapada, y como no se guarda "intro-vista", en otra visita más rápida sí saldrá. El componente solo
// arranca si la clase sigue puesta, así que no se anima tarde. Lighthouse y Chrome headless NO se
// excluyen a propósito: deben medir el caso real. Si localStorage falla (modo privado), no se muestra.
export const introTelonScript = `(function(){try{if(localStorage.getItem("intro-vista"))return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(/bot|crawl|spider|slurp|mediapartners|bingpreview|facebookexternalhit/i.test(navigator.userAgent))return;var h=document.documentElement;h.classList.add("intro-telon");setTimeout(function(){if(!h.dataset.introIniciada)h.classList.remove("intro-telon")},1200)}catch(e){}})()`;

export const INTRO_TELON_STORAGE_KEY = "intro-vista";
export const INTRO_TELON_EVENT = "intro-telon:ver";

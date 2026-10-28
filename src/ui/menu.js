// Subrayado del menú que sigue al cursor (solo escritorio con puntero fino).
import { MARGEN_ZONA_MENU_PX } from "../config.js";
import { $ } from "./utiles.js";

export function iniciarSubrayadoMenu() {
  const encabezado = $("inicio");
  const menu = encabezado.querySelector(".menu");
  const indicadorMenu = menu.querySelector(".menu__indicador");
  const consultaPunteroFino = window.matchMedia("(min-width: 48em) and (hover: hover) and (pointer: fine)");
  let indicadorActivo = false;
  let punteroMenu = null;
  let cuadroMenu = 0;

  function ocultarIndicadorMenu() {
    cancelAnimationFrame(cuadroMenu);
    cuadroMenu = 0;
    punteroMenu = null;
    if (!indicadorActivo) return;
    indicadorActivo = false;
    indicadorMenu.style.opacity = "0";
  }

  // Coloca el subrayado bajo el enlace más cercano en horizontal; su intensidad crece al acercarse a la barra.
  function actualizarIndicadorMenu() {
    cuadroMenu = 0;
    if (!punteroMenu) return;
    const { x, y } = punteroMenu;
    const caja = menu.getBoundingClientRect();
    let elegido = null;
    let mejor = [Infinity, Infinity];
    menu.querySelectorAll("a").forEach((enlace) => {
      const r = enlace.getBoundingClientRect();
      const distancia = x < r.left ? r.left - x : (x > r.right ? x - r.right : 0);
      const alCentro = Math.abs(x - (r.left + r.right) / 2);
      if (distancia < mejor[0] || (distancia === mejor[0] && alCentro < mejor[1])) {
        mejor = [distancia, alCentro];
        elegido = enlace;
      }
    });
    if (!elegido) return;
    const alcance = Math.max(1, encabezado.getBoundingClientRect().bottom + MARGEN_ZONA_MENU_PX - caja.bottom);
    const distanciaVertical = y < caja.top ? caja.top - y : (y > caja.bottom ? y - caja.bottom : 0);
    const cercania = Math.min(1, Math.max(0, 1 - distanciaVertical / alcance));
    const relleno = parseFloat(getComputedStyle(elegido).paddingLeft) || 0;
    const aplicar = () => {
      indicadorMenu.style.width = `${elegido.offsetWidth - 2 * relleno}px`;
      // De 2 a 4 px de grosor (escala vertical sobre 4 px) y de opacidad tenue a plena.
      indicadorMenu.style.transform = `translateX(${elegido.offsetLeft + relleno}px) scaleY(${0.5 + 0.5 * cercania})`;
      indicadorMenu.style.opacity = String(0.2 + 0.8 * cercania);
    };
    if (indicadorActivo) {
      aplicar();
    } else {
      // Al aparecer se coloca directamente bajo el enlace, sin deslizar desde la última posición.
      indicadorMenu.classList.add("menu__indicador--sin-deslizar");
      aplicar();
      void indicadorMenu.offsetWidth;
      indicadorMenu.classList.remove("menu__indicador--sin-deslizar");
      indicadorActivo = true;
    }
  }

  // Fuera de la zona (encabezado y unos 48 px debajo) no se hace ningún trabajo.
  function moverPunteroMenu(evento) {
    if (evento.pointerType === "touch") return;
    if (evento.clientY > encabezado.getBoundingClientRect().bottom + MARGEN_ZONA_MENU_PX) {
      if (indicadorActivo) ocultarIndicadorMenu();
      return;
    }
    punteroMenu = { x: evento.clientX, y: evento.clientY };
    if (!cuadroMenu) cuadroMenu = requestAnimationFrame(actualizarIndicadorMenu);
  }

  function salirDeLaVentana(evento) {
    if (!evento.relatedTarget) ocultarIndicadorMenu();
  }

  function sincronizarSubrayadoMenu() {
    document.removeEventListener("pointermove", moverPunteroMenu);
    document.removeEventListener("mouseout", salirDeLaVentana);
    ocultarIndicadorMenu();
    if (!consultaPunteroFino.matches) return;
    document.addEventListener("pointermove", moverPunteroMenu, { passive: true });
    document.addEventListener("mouseout", salirDeLaVentana);
  }

  consultaPunteroFino.addEventListener("change", sincronizarSubrayadoMenu);
  sincronizarSubrayadoMenu();
}

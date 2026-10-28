// Barra de progreso de lectura (transform: scaleX, sin recalcular el diseño).
import { $, consultaMovimiento } from "./utiles.js";

export function iniciarProgreso() {
  const barraProgreso = $("progreso-lectura");
  let cuadroProgreso = 0;

  function actualizarProgreso() {
    cuadroProgreso = 0;
    if (consultaMovimiento.matches) return; // Con movimiento reducido la barra no se muestra.
    const recorrido = document.documentElement.scrollHeight - window.innerHeight;
    const avance = recorrido > 0 ? Math.min(1, Math.max(0, window.scrollY / recorrido)) : 0;
    barraProgreso.style.transform = `scaleX(${avance})`;
  }

  function pedirProgreso() {
    if (!cuadroProgreso && !consultaMovimiento.matches) cuadroProgreso = requestAnimationFrame(actualizarProgreso);
  }

  window.addEventListener("scroll", pedirProgreso, { passive: true });
  window.addEventListener("resize", pedirProgreso);
  consultaMovimiento.addEventListener("change", actualizarProgreso);
  actualizarProgreso();
}

// Aviso de versión nueva: compara version.json (sin caché) con data-version del <html> y ofrece recargar.
import { INTERVALO_VERSION_MS } from "../config.js";
import { $ } from "./utiles.js";

export function iniciarAvisoVersion() {
  const avisoVersion = $("aviso-version");
  const botonActualizarVersion = $("boton-actualizar-version");

  // Pide version.json sin caché (con un parámetro que cambia siempre) y compara con data-version del <html>.
  // Si difieren, muestra el aviso; los errores de red o sin conexión no interrumpen la página.
  function comprobarVersionNueva() {
    if (!avisoVersion || avisoVersion.hidden === false) return; // ya se avisó: no hace falta seguir revisando
    const versionActual = document.documentElement.dataset.version;
    if (!versionActual) return;
    fetch(`version.json?t=${Date.now()}`, { cache: "no-store" })
      .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
      .then((datos) => {
        if (datos && datos.v && datos.v !== versionActual) avisoVersion.hidden = false;
      })
      .catch(() => {});
  }

  // Recarga con una URL que nunca estuvo en caché (ni la del navegador ni la del hosting), así trae de una
  // vez la versión nueva en lugar de esperar a que venza el cacheo del hosting.
  function recargarConVersionNueva() {
    const separador = window.location.search ? "&" : "?";
    window.location.href = `${window.location.pathname}${window.location.search}${separador}_=${Date.now()}`;
  }

  // Al volver a la pestaña (no solo por temporizador, para no esperar hasta 5 minutos si el visitante recién regresa) y
  // cada INTERVALO_VERSION_MS mientras la deja abierta.
  if (botonActualizarVersion) botonActualizarVersion.addEventListener("click", recargarConVersionNueva);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") comprobarVersionNueva();
  });
  window.setInterval(comprobarVersionNueva, INTERVALO_VERSION_MS);
}

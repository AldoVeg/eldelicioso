// El Delicioso (medicion): parte del código dividido en módulos.
import { CLAVE_ORIGEN } from "./config.js";
import { leerOrigenDeURL, normalizarOrigen } from "./origen.js";

/* ===== Medición neutral ===== */

// Emite un evento del documento y, solo si ya existe window.dataLayer, lo empuja allí.
// No carga ninguna herramienta ni envía datos personales (nada de fechas ni textos del pedido).
// El origen de la visita (clave permitida o null) viaja en todos los eventos; lo fija iniciar() al cargar.
let origenMedicion = null;

export function fijarOrigenMedicion(origen) {
  origenMedicion = normalizarOrigen(origen);
}

export function registrar(nombre, datos = {}) {
  try {
    const conOrigen = origenMedicion ? { origen: origenMedicion, ...datos } : datos;
    if (typeof document !== "undefined" && typeof CustomEvent === "function") {
      document.dispatchEvent(new CustomEvent("eldelicioso:evento", { detail: { nombre, ...conOrigen } }));
    }
    if (typeof window !== "undefined" && window.dataLayer && typeof window.dataLayer.push === "function") {
      window.dataLayer.push({ event: nombre, ...conOrigen });
    }
  } catch (error) {
    // La medición nunca debe romper la página.
  }
}

// Céntimos enteros a soles (número), por ejemplo 3550 -> 35.5.
export function aSoles(centimos) {
  return centimos / 100;
}

// Sugerencia de la calculadora en formato corto, por ejemplo "2x100+1x50".
export function codificarSugerencia({ paquetes }) {
  return [100, 50, 25]
    .filter((tamano) => paquetes[tamano] > 0)
    .map((tamano) => `${paquetes[tamano]}x${tamano}`)
    .join("+");
}

// Ubicación del enlace de WhatsApp: el atributo data-ubicacion o, si falta, la sección que lo contiene.
export function ubicacionWhatsApp(enlace) {
  if (enlace.dataset.ubicacion) return enlace.dataset.ubicacion;
  const seccion = enlace.closest("section[id], header[id], footer, aside[id]");
  return (seccion && seccion.id) || "otra";
}

// Origen de la visita: el de la dirección (?origen= o ?utm_source=) o, si no trae, el guardado en sessionStorage,
// así sobrevive a navegar dentro de la página. Solo claves permitidas; devuelve la clave o null.
export function resolverOrigenVisita() {
  const deLaURL = leerOrigenDeURL(window.location.search);
  try {
    if (deLaURL) {
      window.sessionStorage.setItem(CLAVE_ORIGEN, deLaURL);
      return deLaURL;
    }
    return normalizarOrigen(window.sessionStorage.getItem(CLAVE_ORIGEN));
  } catch (error) {
    return deLaURL; // sessionStorage bloqueado: al menos vale para esta carga
  }
}

export function esEnlaceWhatsApp(enlace) {
  try {
    return new URL(enlace.href).hostname === "wa.me";
  } catch (error) {
    return false;
  }
}

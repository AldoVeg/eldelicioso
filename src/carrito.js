// El Delicioso (carrito): parte del código dividido en módulos.
import { MAX_PACKS_POR_LINEA } from "./config.js";

/* ===== Funciones puras: líneas de la lista de compras (lo guardado se llama "carrito" por historia) ===== */

// Una línea de la lista es { id, tamano, packs }; el nombre y el precio salen del catálogo.
// Un combo es una sola línea { combo, dulce, salado, tamano, packs }: "tamano" es el paquete de cada mitad (25 o 50)
// y "packs" cuántos combos iguales lleva. Las listas guardadas antes de los combos no tienen ese campo y siguen igual.
export function esLineaCombo(linea) {
  return Boolean(linea && linea.combo);
}

export function claveLinea(linea) {
  return esLineaCombo(linea)
    ? `combo|${linea.combo}|${linea.salado}|${linea.dulce}|${linea.tamano}`
    : `${linea.id}|${linea.tamano}`;
}

export function agregarLinea(lineas, id, tamano) {
  const esLaLinea = (linea) => !esLineaCombo(linea) && linea.id === id && linea.tamano === tamano;
  if (!lineas.some(esLaLinea)) return [...lineas, { id, tamano, packs: 1 }];
  return lineas.map((linea) => (esLaLinea(linea)
    ? { ...linea, packs: Math.min(linea.packs + 1, MAX_PACKS_POR_LINEA) }
    : linea));
}

// Suma un combo a la lista; si ya hay uno igual (mismos productos y tamaño), sube su cantidad.
export function agregarCombo(lineas, { combo, dulce, salado, tamano }) {
  const nueva = { combo, dulce, salado, tamano, packs: 1 };
  const clave = claveLinea(nueva);
  if (!lineas.some((linea) => claveLinea(linea) === clave)) return [...lineas, nueva];
  return lineas.map((linea) => (claveLinea(linea) === clave
    ? { ...linea, packs: Math.min(linea.packs + 1, MAX_PACKS_POR_LINEA) }
    : linea));
}

export function cambiarPacks(lineas, clave, cambio) {
  return lineas.map((linea) => (claveLinea(linea) === clave
    ? { ...linea, packs: Math.min(Math.max(linea.packs + cambio, 1), MAX_PACKS_POR_LINEA) }
    : linea));
}

export function quitarLinea(lineas, clave) {
  return lineas.filter((linea) => claveLinea(linea) !== clave);
}

// El Delicioso (kekes): "El pecado más vendido", los kekes rectangulares. Una sola fuente de datos: la sección de la página,
// la cinta de la portada y los mensajes de WhatsApp salen de esta lista.
import { NEGOCIO } from "./config.js";
import { formatearMoneda } from "./dinero.js";
import { agregarLineaOrigen } from "./origen.js";

// "nombre" es el sabor real (va en el mensaje de WhatsApp); "matiz" es el apodo sutil que se ve junto al nombre y se puede
// afinar sin tocar nada más. "tono" es el color del sabor (la franja lo usa de fondo) y "precioCentimos" queda en null
// hasta tener el precio de cada versión: mientras tanto la franja dice "Consultar precio".
export const KEKES = [
  { id: "novia", nombre: "Novia", matiz: "edición especial", tono: "#C9A227", precioCentimos: null },
  { id: "pina", nombre: "Piña", matiz: "soleada", tono: "#F2C94C", precioCentimos: null },
  { id: "durazno", nombre: "Durazno", matiz: "jugoso", tono: "#F4A582", precioCentimos: null },
  { id: "arandano", nombre: "Arándano", matiz: "silvestre", tono: "#5C5AA7", precioCentimos: null },
  { id: "platano", nombre: "Plátano", matiz: "maduro", tono: "#D8B56A", precioCentimos: null },
  { id: "maracuya", nombre: "Maracuyá", matiz: "vibrante", tono: "#F59E0B", precioCentimos: null },
  { id: "fresa-arandano", nombre: "Fresa con arándano", matiz: "frutos rojos", tono: "#C2416C", precioCentimos: null },
  { id: "zanahoria", nombre: "Zanahoria", matiz: "casero", tono: "#D9742C", precioCentimos: null },
  { id: "naranja", nombre: "Naranja", matiz: "fresco", tono: "#FB8C3A", precioCentimos: null },
  { id: "chocolate", nombre: "Chocolate", matiz: "profundo", tono: "#6B3E2A", precioCentimos: null },
  { id: "marmoleado", nombre: "Marmoleado", matiz: "a dos tonos", tono: "#8C6A55", precioCentimos: null },
  { id: "chispas-chocolate", nombre: "Chispas de chocolate", matiz: "en cada bocado", tono: "#4A2C23", precioCentimos: null },
  { id: "vainilla", nombre: "Vainilla", matiz: "clásico", tono: "#E6D3A3", precioCentimos: null },
  { id: "oreo", nombre: "Oreo", matiz: "cremoso", tono: "#3B3B3B", precioCentimos: null }
];

// Colores claros llevan texto oscuro y los oscuros texto blanco (luminosidad de 0 a 255; el corte en 150 se eligió a ojo).
export function esTonoClaro(tono) {
  const n = parseInt(tono.slice(1), 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 150;
}

// Precio a mostrar: "S/ 35,00" o, sin precio todavía, "Consultar precio".
export function textoPrecioKeke(keke) {
  return keke.precioCentimos === null ? "Consultar precio" : formatearMoneda(keke.precioCentimos);
}

// Pedido de un keke por WhatsApp (con el precio si ya se conoce).
export function construirMensajeKeke(keke, negocio = NEGOCIO, origen = null) {
  const precio = keke.precioCentimos === null ? "" : ` (${formatearMoneda(keke.precioCentimos)})`;
  return agregarLineaOrigen(`Hola, ${negocio.nombre}. Quisiera pedir el keke rectangular de ${keke.nombre.toLowerCase()}${precio}. ` +
    "¿Me confirman la disponibilidad y el tiempo de entrega?", origen);
}

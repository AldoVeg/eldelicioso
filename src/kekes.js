// El Delicioso (kekes): "El pecado más vendido", los kekes rectangulares. Una sola fuente de datos: la sección de la página,
// la cinta de la portada y los mensajes de WhatsApp salen de esta lista.
import { NEGOCIO } from "./config.js";
import { formatearMoneda } from "./dinero.js";
import { agregarLineaOrigen } from "./origen.js";

// "nombre" es el sabor real (va en el mensaje de WhatsApp); "matiz" es el apodo sutil que se ve junto al nombre y se puede
// afinar sin tocar nada más. "tono" es el color del sabor (la franja lo usa de fondo) y "precioCentimos" queda en null
// hasta tener el precio de cada versión: mientras tanto la franja dice "Consultar precio".
// "foto" (opcional) la agrega `npm run fotos` al convertir las fotos de fotos-kekes/: al abrirse la franja, la foto va de fondo.
export const KEKES = [
  { id: "novia", nombre: "Novia", matiz: "edición especial", tono: "#C9A227", precioCentimos: null },
  { id: "pina", nombre: "Piña", matiz: "soleada", tono: "#F2C94C", precioCentimos: null, foto: "img/KEKES/pina.webp" },
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
  { id: "oreo", nombre: "Oreo", matiz: "cremoso", tono: "#3B3B3B", precioCentimos: null },
  { id: "coco", nombre: "Coco", matiz: "tropical", tono: "#D8D0BE", precioCentimos: null },
  { id: "frutos-secos", nombre: "Frutos secos", matiz: "crocante", tono: "#B88A5B", precioCentimos: null },
  { id: "higo", nombre: "Higo", matiz: "meloso", tono: "#7A4B6B", precioCentimos: null },
  { id: "manzana", nombre: "Manzana", matiz: "tierna", tono: "#8DB255", precioCentimos: null },
  { id: "limon", nombre: "Limón", matiz: "cítrico", tono: "#E6E34A", precioCentimos: null },
  { id: "lucuma", nombre: "Lúcuma", matiz: "andina", tono: "#DDAA3A", precioCentimos: null }
];

// Texto sobre la franja: oscuro (el de la página) o blanco, el que dé más contraste con el color del sabor (WCAG).
const TEXTO_OSCURO = "#2E1B1B";
const TEXTO_BLANCO = "#FFFFFF";

function luminancia(color) {
  const n = parseInt(color.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a, b) {
  const [claro, oscuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (oscuro + 0.05);
}

// Verdadero si el texto oscuro se lee mejor que el blanco sobre ese color.
export function esTonoClaro(tono) {
  return contraste(tono, TEXTO_OSCURO) >= contraste(tono, TEXTO_BLANCO);
}

// Contraste (de 1 a 21) del texto elegido sobre el color; las pruebas exigen al menos 4,5 para toda versión nueva.
export function contrasteDeTexto(tono) {
  return Math.max(contraste(tono, TEXTO_OSCURO), contraste(tono, TEXTO_BLANCO));
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

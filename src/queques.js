// El Delicioso (queques): "El pecado más vendido", los queques rectangulares. Una sola fuente de datos: la sección de la página,
// la cinta de la portada y los mensajes de WhatsApp salen de esta lista.
import { NEGOCIO } from "./config.js";
import { formatearMoneda } from "./dinero.js";
import { agregarLineaOrigen } from "./origen.js";

// "nombre" es el sabor real (va en el mensaje de WhatsApp); "matiz" es el apodo sutil que se ve junto al nombre y se puede
// afinar sin tocar nada más. "familia" es su grupo en la guía y "tono" el color del sabor (acento del escenario y punto de la cinta) y "precioCentimos" queda en null
// hasta tener el precio de cada versión: mientras tanto dice "Consultar precio".
// "foto" (opcional) la agrega `npm run fotos` al convertir las fotos de fotos-queques/: es la foto grande del escenario.
export const QUEQUES = [
  { id: "novia", nombre: "Novia", matiz: "edición especial", familia: "Novia", tono: "#C9A227", precioCentimos: null },
  { id: "pina", nombre: "Piña", matiz: "soleada", familia: "Frutales", tono: "#F2C94C", precioCentimos: 1300, foto: "img/QUEQUES/pina.webp" },
  { id: "durazno", nombre: "Durazno", matiz: "jugoso", familia: "Frutales", tono: "#F4A582", precioCentimos: 1300, foto: "img/QUEQUES/durazno.webp" },
  { id: "arandano", nombre: "Arándano", matiz: "silvestre", familia: "Frutales", tono: "#5C5AA7", precioCentimos: 1500, foto: "img/QUEQUES/arandano.webp" },
  { id: "platano", nombre: "Plátano", matiz: "maduro", familia: "Frutales", tono: "#D8B56A", precioCentimos: null },
  { id: "maracuya", nombre: "Maracuyá", matiz: "vibrante", familia: "Frutales", tono: "#F59E0B", precioCentimos: null },
  { id: "fresa-arandano", nombre: "Fresa con arándano", matiz: "frutos rojos", familia: "Frutales", tono: "#C2416C", precioCentimos: null },
  { id: "naranja", nombre: "Naranja", matiz: "fresco", familia: "Frutales", tono: "#FB8C3A", precioCentimos: null },
  { id: "coco", nombre: "Coco", matiz: "tropical", familia: "Frutales", tono: "#D8D0BE", precioCentimos: null },
  { id: "higo", nombre: "Higo", matiz: "meloso", familia: "Frutales", tono: "#7A4B6B", precioCentimos: null },
  { id: "manzana", nombre: "Manzana", matiz: "tierna", familia: "Frutales", tono: "#8DB255", precioCentimos: null },
  { id: "limon", nombre: "Limón", matiz: "cítrico", familia: "Frutales", tono: "#E6E34A", precioCentimos: null },
  { id: "lucuma", nombre: "Lúcuma", matiz: "andina", familia: "Frutales", tono: "#DDAA3A", precioCentimos: null },
  { id: "zanahoria", nombre: "Zanahoria", matiz: "casero", familia: "Clásicos", tono: "#D9742C", precioCentimos: null },
  { id: "marmoleado", nombre: "Marmoleado", matiz: "a dos tonos", familia: "Clásicos", tono: "#8C6A55", precioCentimos: null },
  { id: "vainilla", nombre: "Vainilla", matiz: "clásico", familia: "Clásicos", tono: "#E6D3A3", precioCentimos: null },
  { id: "frutos-secos", nombre: "Frutos secos", matiz: "crocante", familia: "Clásicos", tono: "#B88A5B", precioCentimos: null },
  { id: "chocolate", nombre: "Chocolate", matiz: "profundo", familia: "Chocolate", tono: "#6B3E2A", precioCentimos: null },
  { id: "chispas-chocolate", nombre: "Chispas de chocolate", matiz: "en cada bocado", familia: "Chocolate", tono: "#4A2C23", precioCentimos: null },
  { id: "oreo", nombre: "Oreo", matiz: "cremoso", familia: "Chocolate", tono: "#3B3B3B", precioCentimos: null }
];

// Lo que es igual para todos los queques (lo dijo el dueño): se muestra bajo el precio en el escenario.
export const DETALLES_QUEQUE = {
  datos: ["20 cm × 12 cm", "100 % casero y natural"],
  aviso: "No incluye delivery."
};

// Las familias agrupan los sabores en la guía de la sección; en QUEQUES cada familia va seguida (así la cinta y las flechas las recorren en orden).
export const FAMILIAS = ["Novia", "Frutales", "Clásicos", "Chocolate"];

// Rótulo de la guía: "Frutales · 12", o solo el nombre si la familia tiene un único sabor ("Novia").
export function rotuloFamilia(familia) {
  const cantidad = QUEQUES.filter((queque) => queque.familia === familia).length;
  return cantidad > 1 ? `${familia} · ${cantidad}` : familia;
}

// Miniatura de la foto (la cinta usa la chica y el escenario la grande): img/QUEQUES/pina.webp -> img/QUEQUES/min/pina.webp
export function miniaturaDe(queque) {
  return queque.foto ? queque.foto.replace("img/QUEQUES/", "img/QUEQUES/min/") : null;
}

// Precio a mostrar: "S/ 35,00" o, sin precio todavía, "Consultar precio".
export function textoPrecioQueque(queque) {
  return queque.precioCentimos === null ? "Consultar precio" : formatearMoneda(queque.precioCentimos);
}

// Referencia en dólares junto al precio en soles. El tipo de cambio es el de venta del 28/10/2026 (BCRP y SUNAT, soles por US$ 1);
// si cambia mucho, se corrige aquí. El resultado se redondea al medio dólar más cercano: "≈ US$ 4,50". Sin precio, no hay referencia.
const TIPO_CAMBIO_REFERENCIAL = 3.45;
export function textoPrecioDolares(queque) {
  if (queque.precioCentimos === null) return null;
  const dolares = Math.round((queque.precioCentimos / 100 / TIPO_CAMBIO_REFERENCIAL) * 2) / 2;
  return `≈ US$ ${dolares.toFixed(2).replace(".", ",")}`;
}

// Pedido de un queque por WhatsApp (con el precio si ya se conoce).
export function construirMensajeQueque(queque, negocio = NEGOCIO, origen = null) {
  const precio = queque.precioCentimos === null ? "" : ` (${formatearMoneda(queque.precioCentimos)})`;
  return agregarLineaOrigen(`Hola, ${negocio.nombre}. Quisiera pedir el queque rectangular de ${queque.nombre.toLowerCase()}${precio}. ` +
    "¿Me confirman la disponibilidad y el tiempo de entrega?", origen);
}

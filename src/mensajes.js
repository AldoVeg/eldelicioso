// El Delicioso (mensajes): parte del código dividido en módulos.
import { NEGOCIO } from "./config.js";
import { formatearMoneda } from "./dinero.js";
import { textoEventoPedido } from "./plan.js";
import { aISO, formatearFechaLarga } from "./fechas.js";
import { agregarLinea } from "./carrito.js";
import { agregarLineaOrigen } from "./origen.js";

/* ===== Funciones puras: mensaje de WhatsApp ===== */

function describirUnidades(item) {
  return item.packs === 1
    ? `${item.unidades} unidades`
    : `${item.unidades} unidades (${item.packs} x ${item.tamano})`;
}

// Líneas del mensaje de un elemento de la lista. Un combo nombra el combo, su precio ya con descuento
// (el mismo que suma el total) y, aparte, qué incluye.
function lineasMensajeItem(item) {
  if (!item.esCombo) {
    return [`- ${item.nombre}: ${describirUnidades(item)} - ${formatearMoneda(item.subtotalCentimos)}`];
  }
  const unidades = item.packs === 1
    ? `${item.unidades} unidades`
    : `${item.unidades} unidades (${item.packs} combos de ${item.tamano * 2})`;
  return [
    `- ${item.nombre}: ${unidades} - ${formatearMoneda(item.subtotalCentimos)} ` +
      `(precio promo; por separado suman ${formatearMoneda(item.precioAnteriorCentimos)})`,
    `  ${item.packs === 1 ? "Incluye" : "Cada combo incluye"}: ${item.composicion}`
  ];
}

export function construirMensajePedido({ items, totalCentimos }, fechaISO, negocio = NEGOCIO, plan = null, origen = null) {
  const lineas = items.flatMap(lineasMensajeItem);
  const evento = textoEventoPedido(plan);
  const mensaje = [
    `Hola, ${negocio.nombre}. Quisiera hacer este pedido:`,
    "",
    ...lineas,
    "",
    `Total: ${formatearMoneda(totalCentimos)}`,
    `Fecha del evento: ${formatearFechaLarga(fechaISO)}`,
    ...(evento ? [evento] : []),
    "",
    "¿Me confirman el costo del delivery y los datos de pago? Gracias."
  ].join("\n");
  return agregarLineaOrigen(mensaje, origen);
}

// Mensaje para cotizar un producto sin precio: solo lleva la cantidad, nunca datos personales.
export function construirMensajeCotizacion(cantidad, nombreProducto, negocio = NEGOCIO, origen = null) {
  return agregarLineaOrigen(`Hola, ${negocio.nombre}. Quisiera cotizar ${cantidad} unidades de ${nombreProducto.toLowerCase()}. ` +
    "¿Me indican el precio y la disponibilidad?", origen);
}

// Reserva de un producto de temporada con precio fijo (empanadas amazónicas): cantidad, precio y fecha de salida.
export function construirMensajeReserva(cantidad, nombreProducto, precioCentimos, salida, negocio = NEGOCIO, origen = null) {
  return agregarLineaOrigen(`Hola, ${negocio.nombre}. Quisiera separar ${cantidad} unidades de ${nombreProducto.toLowerCase()} ` +
    `(${formatearMoneda(precioCentimos)}) para su salida del ${salida}. ¿Me confirman la disponibilidad?`, origen);
}

// Filtra lo que se escribe en un campo numérico de la calculadora: deja solo dígitos (nada de letras, signos, puntos ni "e"),
// respeta el tope de dígitos y quita ceros a la izquierda. Si el número resultante supera el máximo, se conserva el valor
// anterior (el último válido), así no se puede escribir ni pegar un valor mayor.
export function filtrarEntradaNumerica(texto, maxDigitos, maximo, anterior = "") {
  let limpio = String(texto == null ? "" : texto).replace(/\D/g, "");
  if (limpio.length > maxDigitos) limpio = limpio.slice(0, maxDigitos);
  limpio = limpio.replace(/^0+(?=\d)/, "");
  if (limpio !== "" && Number(limpio) > maximo) return anterior;
  return limpio;
}

export function construirEnlaceWhatsApp(mensaje, negocio = NEGOCIO) {
  return `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

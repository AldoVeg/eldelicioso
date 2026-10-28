// "El pecado más vendido": dibuja una tarjeta por cada versión de keke rectangular y muestra la sección.
import { KEKES, construirMensajeKeke, textoPrecioKeke } from "../kekes.js";
import { construirEnlaceWhatsApp } from "../mensajes.js";
import { $, crear } from "./utiles.js";

// Cada tarjeta: forma de keke con el color del sabor, nombre con su matiz, precio y botón de WhatsApp. El origen de la visita
// lo suma después aplicarOrigenAEnlaces (como en los demás enlaces de WhatsApp de la página).
function crearTarjetaKeke(keke) {
  const tarjeta = crear("article", keke.especial ? "keke keke--especial" : "keke");
  tarjeta.style.setProperty("--tono", keke.tono);

  const forma = crear("div", "keke__forma");
  forma.setAttribute("aria-hidden", "true");

  const nombre = crear("h3", "keke__nombre", keke.nombre);
  nombre.append(" ", crear("span", "keke__matiz", keke.matiz));
  const precio = crear("p", keke.precioCentimos === null ? "keke__precio keke__precio--consultar" : "keke__precio", textoPrecioKeke(keke));

  const pedir = crear("a", "boton boton--secundario boton--bloque", "Pedir este");
  pedir.href = construirEnlaceWhatsApp(construirMensajeKeke(keke));
  pedir.dataset.ubicacion = `keke_${keke.id}`;
  pedir.target = "_blank";
  pedir.rel = "noopener noreferrer";
  pedir.setAttribute("aria-label", `Pedir el keke de ${keke.nombre.toLowerCase()} por WhatsApp`);

  const cuerpo = crear("div", "keke__cuerpo");
  cuerpo.append(nombre, precio, pedir);
  tarjeta.append(forma, cuerpo);
  return tarjeta;
}

export function iniciarKekes() {
  $("kekes-rejilla").replaceChildren(...KEKES.map(crearTarjetaKeke));
  $("pecado").hidden = false;
}

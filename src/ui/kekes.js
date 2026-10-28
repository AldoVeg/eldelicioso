// "El pecado más vendido": muestrario de colores. Una franja por versión de keke; la que se toca se abre y muestra su detalle
// (en escritorio las franjas son verticales y se ensanchan; en celular se apilan como un acordeón).
import { KEKES, construirMensajeKeke, esTonoClaro, textoPrecioKeke } from "../kekes.js";
import { construirEnlaceWhatsApp } from "../mensajes.js";
import { $, crear } from "./utiles.js";

// La franja es un contenedor con un botón (nombre y matiz: abre la franja, con aria-expanded) y el detalle (precio y enlace de
// WhatsApp). El enlace queda fuera del botón: un enlace dentro de un botón no es válido. El origen de la visita lo suma después
// aplicarOrigenAEnlaces, como en los demás enlaces de WhatsApp.
function crearTira(keke) {
  const tira = crear("div", esTonoClaro(keke.tono) ? "tira tira--clara" : "tira");
  tira.style.setProperty("--tono", keke.tono);
  if (keke.foto) {
    // La foto solo se pide cuando la franja se abre (la regla CSS usa --foto únicamente en la franja abierta).
    tira.classList.add("tira--foto");
    tira.style.setProperty("--foto", `url("${keke.foto}")`);
  }

  const nombre = crear("button", "tira__nombre", keke.nombre);
  nombre.type = "button";
  nombre.setAttribute("aria-expanded", "false");
  nombre.append(crear("small", "", keke.matiz));

  const detalle = crear("div", "tira__detalle");
  const pedir = crear("a", "boton boton--secundario", "Pedir este");
  pedir.href = construirEnlaceWhatsApp(construirMensajeKeke(keke));
  pedir.dataset.ubicacion = `keke_${keke.id}`;
  pedir.target = "_blank";
  pedir.rel = "noopener noreferrer";
  pedir.setAttribute("aria-label", `Pedir el keke de ${keke.nombre.toLowerCase()} por WhatsApp`);
  detalle.append(crear("span", "", textoPrecioKeke(keke)), pedir);

  tira.append(nombre, detalle);
  return tira;
}

export function iniciarKekes() {
  const contenedor = $("kekes-tiras");
  const tiras = KEKES.map(crearTira);
  // Una sola franja abierta a la vez; tocar en cualquier parte de la franja (menos en el enlace) la abre.
  const abrir = (elegida) => tiras.forEach((tira) => tira.querySelector(".tira__nombre").setAttribute("aria-expanded", String(tira === elegida)));
  tiras.forEach((tira) => tira.addEventListener("click", (evento) => { if (!evento.target.closest("a")) abrir(tira); }));
  contenedor.replaceChildren(...tiras);
  abrir(tiras[1]); // arranca con la segunda abierta (Piña), como en el diseño elegido
  $("kekes-cantidad").textContent = ` · ${KEKES.length} versiones`;
  $("pecado").hidden = false;
}

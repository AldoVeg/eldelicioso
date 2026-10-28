// "El pecado más vendido": un escenario grande con el queque elegido, flechas para recorrer los sabores en orden y una cinta
// deslizable de miniaturas donde la guía de familias (Novia, Frutales, Clásicos, Chocolate) separa los grupos.
import { DETALLES_QUEQUE, FAMILIAS, QUEQUES, construirMensajeQueque, miniaturaDe, rotuloFamilia, textoPrecioDolares, textoPrecioQueque } from "../queques.js";
import { construirEnlaceWhatsApp } from "../mensajes.js";
import { $, crear } from "./utiles.js";

// Imagen del queque: su foto, o el queque dibujado con el color del sabor si todavía no hay foto.
function crearImagen(queque, claseBase, foto) {
  const imagen = crear("div", foto ? claseBase : `${claseBase} imagen-dibujo`);
  imagen.style.setProperty("--tono", queque.tono);
  if (foto) {
    const img = crear("img");
    img.src = foto;
    img.alt = claseBase === "escenario__imagen" ? `Queque rectangular de ${queque.nombre.toLowerCase()}` : "";
    img.decoding = "async";
    if (claseBase !== "escenario__imagen") img.loading = "lazy";
    imagen.append(img);
  } else {
    imagen.setAttribute("aria-hidden", "true");
  }
  return imagen;
}

// Datos iguales para todos los queques (medidas y sello casero) y el aviso de que no incluye delivery.
function crearDetalles() {
  const detalles = crear("div", "escenario__detalles");
  const datos = crear("ul", "escenario__datos");
  DETALLES_QUEQUE.datos.forEach((dato) => datos.append(crear("li", "", dato)));
  detalles.append(datos, crear("p", "escenario__aviso", DETALLES_QUEQUE.aviso));
  return detalles;
}

// El escenario: imagen grande y, al lado (o debajo en celular), familia, nombre, matiz, precio y botón de WhatsApp. El enlace se
// crea cada vez que cambia el queque, así que lleva el origen de la visita en el mensaje (aplicarOrigenAEnlaces solo ve los fijos).
function crearEscenario(queque, origen) {
  const escenario = crear("div", "escenario");
  escenario.style.setProperty("--tono", queque.tono);
  const info = crear("div", "escenario__info");
  const pedir = crear("a", "boton boton--principal", "Pedir este");
  pedir.href = construirEnlaceWhatsApp(construirMensajeQueque(queque, undefined, origen));
  pedir.dataset.ubicacion = `queque_${queque.id}`;
  pedir.target = "_blank";
  pedir.rel = "noopener noreferrer";
  pedir.setAttribute("aria-label", `Pedir el queque de ${queque.nombre.toLowerCase()} por WhatsApp`);
  const acciones = crear("div", "escenario__acciones");
  acciones.append(pedir, crear("span", queque.precioCentimos === null ? "escenario__precio escenario__precio--consultar" : "escenario__precio", textoPrecioQueque(queque)));
  const dolares = textoPrecioDolares(queque);
  if (dolares) acciones.append(crear("span", "escenario__dolares", dolares)); // la "sombra" del precio: pequeño y tenue, junto al precio en soles
  info.append(crear("p", "escenario__familia", queque.familia === "Novia" ? "Edición especial" : queque.familia), crear("h3", "escenario__nombre", queque.nombre), crear("p", "escenario__matiz", queque.matiz), acciones, crearDetalles());
  escenario.append(crearImagen(queque, "escenario__imagen", queque.foto), info);
  return escenario;
}

export function iniciarQueques(origen) {
  const lugar = $("queques-escenario");
  const cinta = $("queques-cinta");
  const contador = $("queques-contador");
  const chips = [];
  let actual = QUEQUES.findIndex((queque) => queque.id === "pina");

  function mostrar(indice, avisar = true) {
    actual = (indice + QUEQUES.length) % QUEQUES.length;
    const queque = QUEQUES[actual];
    contador.textContent = `${rotuloFamilia(queque.familia)} · ${actual + 1} de ${QUEQUES.length}`;
    lugar.replaceChildren(crearEscenario(queque, origen));
    chips.forEach(({ boton, queque: otro }) => boton.setAttribute("aria-pressed", String(otro === queque)));
    // Centra la miniatura dentro de la cinta (sin mover la página, por eso no se usa scrollIntoView).
    const { boton } = chips[actual];
    cinta.scrollTo({ left: boton.offsetLeft - (cinta.clientWidth - boton.offsetWidth) / 2, behavior: avisar ? "smooth" : "auto" });
  }

  FAMILIAS.forEach((familia) => {
    cinta.append(crear("span", "guia", rotuloFamilia(familia)));
    QUEQUES.filter((queque) => queque.familia === familia).forEach((queque) => {
      const boton = crear("button", "queque-chip");
      boton.type = "button";
      boton.style.setProperty("--tono", queque.tono);
      boton.append(crearImagen(queque, "queque-chip__imagen", miniaturaDe(queque)), crear("span", "queque-chip__nombre", queque.nombre));
      boton.setAttribute("aria-label", `Ver el queque de ${queque.nombre.toLowerCase()}`);
      boton.addEventListener("click", () => mostrar(QUEQUES.indexOf(queque)));
      chips.push({ boton, queque });
      cinta.append(boton);
    });
  });
  $("queques-anterior").addEventListener("click", () => mostrar(actual - 1));
  $("queques-siguiente").addEventListener("click", () => mostrar(actual + 1));

  $("queques-cantidad").textContent = ` · ${QUEQUES.length} versiones`;
  $("pecado").hidden = false;
  mostrar(actual, false);
}

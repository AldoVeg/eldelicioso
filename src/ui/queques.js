// "El pecado más vendido": un escenario grande con el queque elegido, flechas para recorrer los sabores en orden y una cinta
// deslizable de miniaturas donde la guía de familias (Novia, Frutales, Clásicos, Chocolate) separa los grupos.
import { DETALLES_QUEQUE, FAMILIAS, QUEQUES, construirMensajeQueque, datosEstructurados, miniaturaDe, rotuloFamilia, textoPrecioDolares, textoPrecioQueque } from "../queques.js";
import { construirEnlaceWhatsApp } from "../mensajes.js";
import { $, consultaMovimiento, crear } from "./utiles.js";

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

// Datos estructurados para Google: un bloque JSON-LD con los queques que ya tienen precio (se dibuja con los mismos datos que la página).
function escribirDatosEstructurados() {
  const sitio = new URL(document.querySelector('link[rel="canonical"]').href).origin;
  const bloque = document.createElement("script");
  bloque.type = "application/ld+json";
  bloque.textContent = JSON.stringify(datosEstructurados(QUEQUES, sitio));
  document.head.append(bloque);
}

// Precarga la foto del queque anterior y del siguiente, para que el cambio con las flechas sea inmediato.
function precargarFoto(queque) {
  if (queque.foto) new Image().src = queque.foto;
}

export function iniciarQueques(origen) {
  const lugar = $("queques-escenario");
  const cinta = $("queques-cinta");
  const contador = $("queques-contador");
  const anuncio = $("queques-anuncio");
  const chips = [];
  const guias = new Map();
  let actual = QUEQUES.findIndex((queque) => queque.id === "pina");

  // "enfocar" mueve el foco a la miniatura activa (al usar el teclado en la cinta).
  function mostrar(indice, avisar = true, enfocar = false) {
    actual = (indice + QUEQUES.length) % QUEQUES.length;
    const queque = QUEQUES[actual];
    contador.textContent = `${rotuloFamilia(queque.familia)} · ${actual + 1} de ${QUEQUES.length}`;
    anuncio.textContent = `${queque.nombre}, ${queque.familia === "Novia" ? "edición especial" : queque.familia}, ${actual + 1} de ${QUEQUES.length}`;
    lugar.replaceChildren(crearEscenario(queque, origen));
    // Una sola parada de Tab en la cinta (la miniatura activa); el resto se alcanza con las flechas.
    chips.forEach(({ boton, queque: otro }) => {
      boton.setAttribute("aria-pressed", String(otro === queque));
      boton.tabIndex = otro === queque ? 0 : -1;
    });
    guias.forEach((guia, familia) => guia.classList.toggle("guia--activa", familia === queque.familia));
    // Centra la miniatura dentro de la cinta (sin mover la página, por eso no se usa scrollIntoView).
    const { boton } = chips[actual];
    cinta.scrollTo({ left: boton.offsetLeft - (cinta.clientWidth - boton.offsetWidth) / 2, behavior: avisar && !consultaMovimiento.matches ? "smooth" : "auto" });
    if (enfocar) boton.focus({ preventScroll: true });
    precargarFoto(QUEQUES[(actual + 1) % QUEQUES.length]);
    precargarFoto(QUEQUES[(actual - 1 + QUEQUES.length) % QUEQUES.length]);
  }

  FAMILIAS.forEach((familia) => {
    const guia = crear("span", "guia", rotuloFamilia(familia));
    guias.set(familia, guia);
    cinta.append(guia);
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
  // Teclado en la cinta: flechas, Inicio y Fin (sin vuelta: en los extremos se queda).
  cinta.addEventListener("keydown", (evento) => {
    const destinos = { ArrowRight: Math.min(actual + 1, QUEQUES.length - 1), ArrowLeft: Math.max(actual - 1, 0), Home: 0, End: QUEQUES.length - 1 };
    if (!(evento.key in destinos) || !evento.target.closest(".queque-chip")) return;
    evento.preventDefault();
    mostrar(destinos[evento.key], true, true);
  });
  $("queques-anterior").addEventListener("click", () => mostrar(actual - 1));
  $("queques-siguiente").addEventListener("click", () => mostrar(actual + 1));

  $("queques-cantidad").textContent = ` · ${QUEQUES.length} versiones`;
  escribirDatosEstructurados();
  $("pecado").hidden = false;
  mostrar(actual, false);
}

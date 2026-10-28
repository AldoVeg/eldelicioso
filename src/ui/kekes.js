// "El pecado más vendido": un escenario grande con el keke elegido, flechas para recorrer los sabores en orden y una cinta
// deslizable de miniaturas donde la guía de familias (Novia, Frutales, Clásicos, Chocolate) separa los grupos.
import { FAMILIAS, KEKES, construirMensajeKeke, miniaturaDe, rotuloFamilia, textoPrecioKeke } from "../kekes.js";
import { construirEnlaceWhatsApp } from "../mensajes.js";
import { $, crear } from "./utiles.js";

// Imagen del keke: su foto, o el keke dibujado con el color del sabor si todavía no hay foto.
function crearImagen(keke, claseBase, foto) {
  const imagen = crear("div", foto ? claseBase : `${claseBase} imagen-dibujo`);
  imagen.style.setProperty("--tono", keke.tono);
  if (foto) {
    const img = crear("img");
    img.src = foto;
    img.alt = claseBase === "escenario__imagen" ? `Keke rectangular de ${keke.nombre.toLowerCase()}` : "";
    img.decoding = "async";
    if (claseBase !== "escenario__imagen") img.loading = "lazy";
    imagen.append(img);
  } else {
    imagen.setAttribute("aria-hidden", "true");
  }
  return imagen;
}

// El escenario: imagen grande y, al lado (o debajo en celular), familia, nombre, matiz, precio y botón de WhatsApp. El enlace se
// crea cada vez que cambia el keke, así que lleva el origen de la visita en el mensaje (aplicarOrigenAEnlaces solo ve los fijos).
function crearEscenario(keke, origen) {
  const escenario = crear("div", "escenario");
  escenario.style.setProperty("--tono", keke.tono);
  const info = crear("div", "escenario__info");
  const pedir = crear("a", "boton boton--principal", "Pedir este");
  pedir.href = construirEnlaceWhatsApp(construirMensajeKeke(keke, undefined, origen));
  pedir.dataset.ubicacion = `keke_${keke.id}`;
  pedir.target = "_blank";
  pedir.rel = "noopener noreferrer";
  pedir.setAttribute("aria-label", `Pedir el keke de ${keke.nombre.toLowerCase()} por WhatsApp`);
  const acciones = crear("div", "escenario__acciones");
  acciones.append(pedir, crear("span", "escenario__precio", textoPrecioKeke(keke)));
  info.append(crear("p", "escenario__familia", keke.familia === "Novia" ? "Edición especial" : keke.familia), crear("h3", "escenario__nombre", keke.nombre), crear("p", "escenario__matiz", keke.matiz), acciones);
  escenario.append(crearImagen(keke, "escenario__imagen", keke.foto), info);
  return escenario;
}

export function iniciarKekes(origen) {
  const lugar = $("kekes-escenario");
  const cinta = $("kekes-cinta");
  const contador = $("kekes-contador");
  const chips = [];
  let actual = KEKES.findIndex((keke) => keke.id === "pina");

  function mostrar(indice, avisar = true) {
    actual = (indice + KEKES.length) % KEKES.length;
    const keke = KEKES[actual];
    contador.textContent = `${rotuloFamilia(keke.familia)} · ${actual + 1} de ${KEKES.length}`;
    lugar.replaceChildren(crearEscenario(keke, origen));
    chips.forEach(({ boton, keke: otro }) => boton.setAttribute("aria-pressed", String(otro === keke)));
    // Centra la miniatura dentro de la cinta (sin mover la página, por eso no se usa scrollIntoView).
    const { boton } = chips[actual];
    cinta.scrollTo({ left: boton.offsetLeft - (cinta.clientWidth - boton.offsetWidth) / 2, behavior: avisar ? "smooth" : "auto" });
  }

  FAMILIAS.forEach((familia) => {
    cinta.append(crear("span", "guia", rotuloFamilia(familia)));
    KEKES.filter((keke) => keke.familia === familia).forEach((keke) => {
      const boton = crear("button", "keke-chip");
      boton.type = "button";
      boton.style.setProperty("--tono", keke.tono);
      boton.append(crearImagen(keke, "keke-chip__imagen", miniaturaDe(keke)), crear("span", "keke-chip__nombre", keke.nombre));
      boton.setAttribute("aria-label", `Ver el keke de ${keke.nombre.toLowerCase()}`);
      boton.addEventListener("click", () => mostrar(KEKES.indexOf(keke)));
      chips.push({ boton, keke });
      cinta.append(boton);
    });
  });
  $("kekes-anterior").addEventListener("click", () => mostrar(actual - 1));
  $("kekes-siguiente").addEventListener("click", () => mostrar(actual + 1));

  $("kekes-cantidad").textContent = ` · ${KEKES.length} versiones`;
  $("pecado").hidden = false;
  mostrar(actual, false);
}

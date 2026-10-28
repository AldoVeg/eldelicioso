// Promos para cada ocasión: tarjetas de combos con selectores de producto y tamaño, precio en vivo y botón de agregar.
import { BOCADITOS_POR_PERSONA, COMBOS, NEGOCIO } from "../config.js";
import { formatearMoneda } from "../dinero.js";
import { agregarCombo, claveLinea } from "../carrito.js";
import { calcularPersonasCombo, calcularPrecioCombo, resumirCarrito } from "../combos.js";
import { aSoles, registrar } from "../medicion.js";
import { $, crear } from "./utiles.js";
import { sesion } from "./sesion.js";

// "servicios" los entrega main.js (catálogo y acciones de la lista); devuelve sincronizarSellos, que la lista usa al dibujarse.
export function iniciarCombos({ catalogo, guardarLineas, mostrarListaTrasAgregar, dibujarLista, rebotarContador, marcarAgregado, actualizarSello }) {
  const seccionCombos = $("promos");
  const rejillaCombos = $("promos-rejilla");
  // Una entrada por tarjeta: { definicion, tarjeta, selectDulce, selectSalado, radios, contenido, personas, ... }
  const tarjetasCombos = [];

  // Opciones del selector: los productos con precio de esa categoría, en el orden del catálogo (el especial
  // "por cotizar" no tiene precio y no entra). Los nombres y precios salen del catálogo leído del HTML.
  function crearSelectorCombo(id, categoria, elegido) {
    const select = crear("select");
    select.id = id;
    select.name = id;
    [...catalogo].filter(([, producto]) => producto.categoria === categoria).forEach(([idProducto, producto]) => {
      const opcion = crear("option", "", producto.nombre);
      opcion.value = idProducto;
      select.append(opcion);
    });
    select.value = elegido;
    return select;
  }

  function crearCampoCombo(idSelector, textoEtiqueta, select) {
    const campo = crear("div", "campo");
    const etiqueta = crear("label", "", `${textoEtiqueta} `);
    etiqueta.htmlFor = idSelector;
    const cantidad = crear("span", "campo__obligatorio");
    etiqueta.append(cantidad);
    campo.append(etiqueta, select);
    return { campo, cantidad };
  }

  // Tamaño del combo (solo "Arma el tuyo"): 50 o 100 unidades, mitad y mitad.
  function crearSelectorTamanoCombo(clave) {
    const grupo = crear("fieldset", "selector promo__tamano");
    grupo.append(crear("legend", "selector__leyenda", "Tamaño del combo"));
    const opciones = crear("div", "selector__opciones selector__opciones--dos");
    const radios = [50, 100].map((total, indice) => {
      const etiqueta = crear("label", "segmento");
      const radio = crear("input");
      radio.type = "radio";
      radio.name = `tamano-combo-${clave}`;
      radio.value = String(total);
      radio.checked = indice === 0;
      const cuerpo = crear("span", "segmento__cuerpo");
      cuerpo.append(crear("span", "segmento__cantidad", `${total} unidades`));
      etiqueta.append(radio, cuerpo);
      opciones.append(etiqueta);
      return radio;
    });
    grupo.append(opciones);
    return { grupo, radios };
  }

  // Tarjeta de una ocasión: foto decorativa oculta de fondo (aparece con hover, foco o toque) y, encima, el cuerpo
  // con título, frase, contenido, personas, "Cambiar productos" plegado, precio, botón y enlace de dudas.
  function crearTarjetaCombo(definicion) {
    const tarjeta = crear("article", "promo");
    tarjeta.dataset.combo = definicion.clave;

    const foto = crear("img", "promo__foto");
    foto.src = definicion.foto;
    foto.width = definicion.fotoAncho;
    foto.height = definicion.fotoAlto;
    foto.alt = "";
    foto.setAttribute("aria-hidden", "true");
    foto.loading = "lazy";
    foto.decoding = "async";

    // Sello de "ya agregado" (el mismo de las tarjetas del catálogo) y su aviso para lectores de pantalla.
    const sello = crear("span", "tarjeta__sello");
    sello.setAttribute("aria-hidden", "true");
    sello.addEventListener("animationend", () => sello.classList.remove("tarjeta__sello--nuevo"));
    const aviso = crear("span", "solo-lectores tarjeta__aviso");
    aviso.setAttribute("role", "status");

    const titulo = crear("h3", "promo__titulo", definicion.titulo);
    const frase = crear("p", "promo__dato", definicion.frase);
    const contenido = crear("p", "promo__dato promo__contenido");
    const personas = crear("p", "promo__dato promo__personas");
    personas.setAttribute("aria-live", "polite");

    const idBase = `combo-${definicion.clave}`;
    const selectDulce = crearSelectorCombo(`${idBase}-dulce`, "dulce", definicion.dulce);
    const selectSalado = crearSelectorCombo(`${idBase}-salado`, "salado", definicion.salado);
    const campoDulce = crearCampoCombo(selectDulce.id, "Dulce", selectDulce);
    const campoSalado = crearCampoCombo(selectSalado.id, "Salado", selectSalado);
    const campos = crear("div", "promo__campos");
    campos.append(campoSalado.campo, campoDulce.campo);
    const cambiar = crear("details", "promo__cambiar");
    cambiar.append(crear("summary", "", "Cambiar productos"), campos);

    const tamano = definicion.total ? null : crearSelectorTamanoCombo(definicion.clave);

    const precio = crear("p", "promo__precio");
    precio.setAttribute("aria-live", "polite");
    const antes = crear("s", "promo__antes");
    const ahora = crear("strong", "promo__ahora");
    const ahorro = crear("span", "promo__ahorro");
    precio.append(crear("span", "solo-lectores", "Precio por separado: "), antes, " ",
      crear("span", "solo-lectores", "Precio del combo: "), ahora, " ", ahorro);

    const boton = crear("button", "boton boton--principal boton--bloque", "Agregar a mi lista");
    boton.type = "button";
    boton.dataset.agregarCombo = "";
    boton.setAttribute("aria-label", `Agregar a mi lista: ${definicion.titulo}`);

    const dudas = crear("a", "promo__dudas", "¿Dudas? Escríbenos");
    dudas.href = `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(definicion.mensaje)}`;
    dudas.dataset.ubicacion = `promo_${definicion.clave}`;
    dudas.target = "_blank";
    dudas.rel = "noopener noreferrer";

    const cuerpo = crear("div", "promo__cuerpo");
    cuerpo.append(titulo, frase, contenido, personas, ...(tamano ? [tamano.grupo] : []), cambiar, precio, boton, dudas);
    tarjeta.append(foto, sello, aviso, cuerpo);
    return {
      definicion, tarjeta, selectDulce, selectSalado, contenido, personas, antes, ahora, ahorro, boton,
      radios: tamano ? tamano.radios : [],
      cantidades: [campoDulce.cantidad, campoSalado.cantidad]
    };
  }

  // Lo que el visitante tiene elegido en una tarjeta: { combo, dulce, salado, tamano } ("tamano" es cada mitad).
  function leerEstadoCombo(entrada) {
    const total = entrada.definicion.total || Number(entrada.radios.find((radio) => radio.checked).value);
    return {
      combo: entrada.definicion.clave,
      dulce: entrada.selectDulce.value,
      salado: entrada.selectSalado.value,
      tamano: total / 2
    };
  }

  // Precio anterior tachado y precio del combo, en vivo con los selectores.
  function actualizarTarjetaCombo(entrada) {
    const estado = leerEstadoCombo(entrada);
    const unidades = estado.tamano * 2;
    const nombreEnMinuscula = (id) => {
      const nombre = catalogo.get(id).nombre;
      return nombre.charAt(0).toLowerCase() + nombre.slice(1);
    };
    entrada.contenido.textContent =
      `${estado.tamano} ${nombreEnMinuscula(estado.salado)} + ${estado.tamano} ${nombreEnMinuscula(estado.dulce)}`;
    entrada.personas.textContent = `Para ${calcularPersonasCombo(unidades)} personas · ${BOCADITOS_POR_PERSONA} c/u`;
    entrada.cantidades.forEach((cantidad) => { cantidad.textContent = `(${estado.tamano} unidades)`; });
    const precio = calcularPrecioCombo(catalogo, estado);
    entrada.boton.disabled = !precio;
    if (precio) {
      entrada.antes.textContent = formatearMoneda(precio.anteriorCentimos);
      entrada.ahora.textContent = formatearMoneda(precio.comboCentimos);
      entrada.ahorro.textContent = "Precio promo";
    }
    sincronizarSellosCombos();
  }

  // Un combo lleva sello mientras la lista tenga uno igual (mismos productos y tamaño).
  function sincronizarSellosCombos(resumen = resumirCarrito(sesion.lineas, catalogo)) {
    const enLista = new Set(resumen.items.filter((item) => item.esCombo).map((item) => item.clave));
    tarjetasCombos.forEach((entrada) => {
      actualizarSello(entrada.tarjeta, enLista.has(claveLinea(leerEstadoCombo(entrada))));
    });
  }

  function agregarComboDesdeTarjeta(boton) {
    const entrada = tarjetasCombos.find((candidata) => candidata.tarjeta.contains(boton));
    if (!entrada) return;
    const estado = leerEstadoCombo(entrada);
    const precio = calcularPrecioCombo(catalogo, estado);
    if (!precio) return;
    sesion.lineas = agregarCombo(sesion.lineas, estado);
    registrar("agregar_combo", {
      combo: estado.combo,
      dulce_id: estado.dulce,
      salado_id: estado.salado,
      unidades: estado.tamano * 2,
      valor: aSoles(precio.comboCentimos)
    });
    guardarLineas();
    mostrarListaTrasAgregar();
    dibujarLista(claveLinea(estado));
    rebotarContador();
    marcarAgregado(boton);
  }

  // Sin productos con precio no hay promos que armar: la sección sigue oculta.
  function prepararCombos() {
    if (catalogo.size === 0) return;
    Object.values(COMBOS).forEach((definicion) => {
      const entrada = crearTarjetaCombo(definicion);
      tarjetasCombos.push(entrada);
      rejillaCombos.append(entrada.tarjeta);
      actualizarTarjetaCombo(entrada);
    });
    seccionCombos.hidden = false;
  }

  rejillaCombos.addEventListener("change", (evento) => {
    const entrada = tarjetasCombos.find((candidata) => candidata.tarjeta.contains(evento.target));
    if (entrada) actualizarTarjetaCombo(entrada);
  });
  rejillaCombos.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-agregar-combo]");
    if (boton) agregarComboDesdeTarjeta(boton);
  });

  prepararCombos();
  return { sincronizarSellos: sincronizarSellosCombos };
}

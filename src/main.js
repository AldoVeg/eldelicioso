// El Delicioso: catálogo, planificador de invitados, lista de compras y pedido por WhatsApp.
// JavaScript puro. Las funciones "puras" no tocan el DOM, así se pueden probar en Node.

import { CLAVE_ALMACENAMIENTO, CLAVE_PLAN, DURACION_AGREGADO_MS, DURACION_REBOTE_MS, MAX_PACKS_POR_LINEA, NEGOCIO, TAMANOS } from "./config.js";
import { aCentimos, formatearMoneda } from "./dinero.js";
import { tienePrecios } from "./armado.js";
import { describirLista, normalizarPlan } from "./plan.js";
import { fechaMinimaEvento, validarFechaEvento } from "./fechas.js";
import { agregarLinea, cambiarPacks, claveLinea, quitarLinea } from "./carrito.js";
import { normalizarLineas, resumirCarrito } from "./combos.js";
import { enlaceConOrigen } from "./origen.js";
import { leerAlmacenamiento, escribirAlmacenamiento } from "./ui/almacenamiento.js";
import { iniciarProteccion } from "./ui/proteccion.js";
import { iniciarSubrayadoMenu } from "./ui/menu.js";
import { iniciarProgreso } from "./ui/progreso.js";
import { iniciarAvisoVersion } from "./ui/version.js";
import { iniciarGaleria } from "./ui/galeria.js";
import { iniciarPlanificador } from "./ui/planificador.js";
import { iniciarCombos } from "./ui/combos.js";
import { iniciarKekes } from "./ui/kekes.js";
import { sesion } from "./ui/sesion.js";
import { $, crear, consultaMovimiento, ponerTexto } from "./ui/utiles.js";
import { construirEnlaceWhatsApp, construirMensajeCotizacion, construirMensajePedido, construirMensajeReserva } from "./mensajes.js";
import { aSoles, esEnlaceWhatsApp, fijarOrigenMedicion, registrar, resolverOrigenVisita, ubicacionWhatsApp } from "./medicion.js";

/* ===== Interfaz (solo en el navegador) ===== */

function iniciar() {
  const raiz = document.documentElement;
  const rejilla = $("rejilla-catalogo");
  const botonLista = $("boton-lista");
  const contador = $("contador-lista");

  // Lista de compras: lista, total y último paso del pedido (panel horizontal en escritorio, barra en móvil)
  const listaRaiz = $("lista-compras");
  const listaPestana = $("lista-pestana");
  const listaCifra = $("lista-pestana-cifra");
  const listaPestanaTotal = $("lista-pestana-total");
  const listaPestanaAccion = $("lista-pestana-accion");
  const listaTitulo = $("lista-titulo");
  const listaCerrar = $("lista-cerrar");
  const listaCamino = $("lista-camino");
  const listaAvance = $("lista-avance");
  const listaEstado = $("lista-estado");
  const listaBocaditos = $("lista-bocaditos");
  const listaPorInvitado = $("lista-por-invitado");
  const listaItems = $("lista-items");
  const listaEnlacePlanificador = $("lista-enlace-planificador");
  const listaTotal = $("lista-total");
  const listaSeguir = $("lista-seguir");
  const plantillaLista = $("plantilla-item-lista");
  const saltarLista = $("saltar-lista");
  const formPedido = $("form-pedido");
  const campoFecha = $("fecha-evento");
  const errorFecha = $("error-fecha");
  const mensajePedido = $("mensaje-pedido");

  const origenVisita = resolverOrigenVisita();
  fijarOrigenMedicion(origenVisita);
  const catalogo = leerCatalogo(rejilla);
  sesion.lineas = normalizarLineas(leerAlmacenamiento(CLAVE_ALMACENAMIENTO), catalogo);
  // La calculadora siempre arranca en blanco al abrir o actualizar la página: se descarta el plan de la visita
  // anterior (antes se restauraba y parecía que la calculadora "no se reiniciaba"). La lista de compras sí se conserva.
  sesion.plan = normalizarPlan(null);
  try { window.localStorage.removeItem(CLAVE_PLAN); } catch (error) { /* almacenamiento bloqueado: se ignora */ }
  let temporizadorRebote = 0;
  // Falso hasta terminar el arranque: así lo restaurado (la lista guardada) aparece sin animaciones.
  let arrancado = false;
  // Las promos se crean al arrancar; la lista les pide sincronizar sus sellos cada vez que se dibuja.
  let combos = null;

  // Escritorio y tablet (desde 62,5em): panel que se desliza desde "Mi lista". Móvil: barra inferior con panel.
  // En ambos casos la lista nace cerrada.
  const consultaEscritorio = window.matchMedia("(min-width: 62.5em)");
  let listaAbierta = false;
  // Verdadero mientras el visitante mantiene la lista pedida (botón "Mi lista"): así se ve aunque esté vacía.
  let listaPedida = false;
  // Elemento que abrió la lista: al cerrarla, el foco vuelve a él.
  let origenLista = null;

  /* --- Catálogo --- */

  // Solo entran al catálogo los productos con precio en todos sus tamaños; uno "por cotizar" (sin data-precio-*) se omite.
  // "data-tamanos" (opcional, por ejemplo "12,25,50") da los tamaños propios de ese producto; sin ese atributo
  // se usan los tamaños globales (TAMANOS = 25/50/100), igual que siempre.
  function leerCatalogo(contenedor) {
    const mapa = new Map();
    contenedor.querySelectorAll(".tarjeta").forEach((tarjeta) => {
      const tamanosPropios = tarjeta.getAttribute("data-tamanos");
      const tamanos = tamanosPropios ? tamanosPropios.split(",").map(Number) : TAMANOS;
      const precios = {};
      tamanos.forEach((tamano) => { precios[tamano] = aCentimos(tarjeta.getAttribute(`data-precio-${tamano}`)); });
      const producto = {
        nombre: tarjeta.querySelector(".tarjeta__nombre").textContent.trim(),
        categoria: tarjeta.dataset.categoria,
        tamanos,
        precios
      };
      if (tienePrecios(producto)) mapa.set(tarjeta.dataset.id, producto);
    });
    return mapa;
  }

  function tamanoElegido(tarjeta) {
    return Number(tarjeta.querySelector("input[type=radio]:checked").value);
  }

  function actualizarPrecioTarjeta(tarjeta) {
    const producto = catalogo.get(tarjeta.dataset.id);
    const salida = tarjeta.querySelector("[data-precio-total]");
    if (!producto || !salida) return; // Producto por cotizar: no hay precio que mostrar.
    salida.textContent = formatearMoneda(producto.precios[tamanoElegido(tarjeta)]);
  }

  // Producto especial: el enlace de WhatsApp lleva la cantidad elegida. Con precio de reserva (data-reserva-N, en soles)
  // muestra el precio y pide separarlo para su fecha de salida; sin él, pide cotizar.
  function actualizarCotizacion(tarjeta) {
    const enlace = tarjeta.querySelector("[data-solicitar]");
    if (!enlace) return;
    const nombre = tarjeta.querySelector(".tarjeta__nombre").textContent.trim();
    const cantidad = tamanoElegido(tarjeta);
    const precioReserva = aCentimos(tarjeta.getAttribute(`data-reserva-${cantidad}`));
    if (Number.isFinite(precioReserva) && precioReserva > 0) {
      const salida = tarjeta.querySelector("[data-precio-total]");
      if (salida) salida.textContent = formatearMoneda(precioReserva);
      enlace.href = construirEnlaceWhatsApp(construirMensajeReserva(cantidad, nombre, precioReserva, tarjeta.dataset.salida || "próximo jueves", NEGOCIO, origenVisita));
      return;
    }
    enlace.href = construirEnlaceWhatsApp(construirMensajeCotizacion(cantidad, nombre, NEGOCIO, origenVisita));
  }

  // "medir" es falso cuando el filtro se sincroniza solo (al elegir un camino).
  function aplicarFiltro(categoria, medir = true) {
    if (medir) registrar("filtrar_catalogo", { filtro: categoria });
    document.querySelectorAll(".filtro").forEach((boton) => {
      boton.setAttribute("aria-pressed", String(boton.dataset.filtro === categoria));
    });
    rejilla.querySelectorAll(".tarjeta").forEach((tarjeta) => {
      tarjeta.hidden = categoria !== "todos" && tarjeta.dataset.categoria !== categoria;
    });
    // El filtro, el selector de la portada, la foto y la galería son un solo estado: el grupo.
    galeria.establecerGrupo(categoria);
  }

  function marcarAgregado(boton) {
    if (!boton.dataset.textoOriginal) {
      boton.dataset.textoOriginal = boton.textContent;
      boton.dataset.etiquetaOriginal = boton.getAttribute("aria-label") || "";
    }
    // Sirve para las tarjetas del catálogo y para las de combo.
    const nombre = boton.closest(".tarjeta, .promo").querySelector(".tarjeta__nombre, .promo__titulo").textContent.trim();
    boton.textContent = "Agregado";
    boton.setAttribute("aria-label", `${nombre} agregado a la lista`);
    clearTimeout(Number(boton.dataset.temporizador));
    boton.dataset.temporizador = String(setTimeout(() => {
      boton.textContent = boton.dataset.textoOriginal;
      boton.setAttribute("aria-label", boton.dataset.etiquetaOriginal);
    }, DURACION_AGREGADO_MS));
  }

  function agregarDesdeTarjeta(boton) {
    const tarjeta = boton.closest(".tarjeta");
    if (!catalogo.has(tarjeta.dataset.id)) return; // Sin precio no se agrega a la lista.
    const tamano = tamanoElegido(tarjeta);
    sesion.lineas = agregarLinea(sesion.lineas, tarjeta.dataset.id, tamano);
    registrar("agregar_al_carrito", {
      producto_id: tarjeta.dataset.id,
      tamano,
      valor: aSoles(catalogo.get(tarjeta.dataset.id).precios[tamano])
    });
    guardarLineas();
    mostrarListaTrasAgregar();
    dibujarLista(claveLinea({ id: tarjeta.dataset.id, tamano }));
    rebotarContador();
    marcarAgregado(boton);
  }

  // En escritorio la lista se abre sola al agregar, para que el visitante la vea sumar; el foco no se mueve.
  function mostrarListaTrasAgregar() {
    if (consultaEscritorio.matches && !listaAbierta) {
      listaAbierta = true;
      origenLista = null;
      actualizarMinimoFecha();
    }
  }

  // Sello de la marca en la foto de cada producto que tenga al menos una línea en la lista (cualquier tamaño).
  // Los productos que no se agregan (empanadas amazónicas) no llevan sello.
  function prepararSellos() {
    rejilla.querySelectorAll(".tarjeta").forEach((tarjeta) => {
      if (!catalogo.has(tarjeta.dataset.id)) return;
      const foto = tarjeta.querySelector(".tarjeta__foto");
      const sello = crear("span", "tarjeta__sello");
      sello.setAttribute("aria-hidden", "true");
      sello.addEventListener("animationend", () => sello.classList.remove("tarjeta__sello--nuevo"));
      // Aviso discreto para lectores de pantalla; solo tiene texto mientras el producto está en la lista.
      const aviso = crear("span", "solo-lectores tarjeta__aviso");
      aviso.setAttribute("role", "status");
      foto.append(sello, aviso);
    });
  }

  // Muestra u oculta el sello de "ya agregado" de una tarjeta (de catálogo o de combo).
  function actualizarSello(contenedor, esta) {
    const sello = contenedor.querySelector(".tarjeta__sello");
    if (!sello) return;
    const estaba = contenedor.hasAttribute("data-en-lista");
    if (esta === estaba) return;
    contenedor.toggleAttribute("data-en-lista", esta);
    contenedor.querySelector(".tarjeta__aviso").textContent = esta ? "En tu lista" : "";
    sello.classList.remove("tarjeta__sello--nuevo");
    // Pop de aparición solo al agregar (no al restaurar la lista guardada de una visita anterior) y con movimiento permitido.
    if (esta && arrancado && !consultaMovimiento.matches) {
      void sello.offsetWidth; // Reinicia la animación.
      sello.classList.add("tarjeta__sello--nuevo");
    }
  }

  // Un producto lleva sello si está en la lista, suelto o dentro de un combo.
  function sincronizarSellos(resumen) {
    const enLista = new Set(resumen.items.flatMap((item) => item.ids));
    rejilla.querySelectorAll(".tarjeta").forEach((tarjeta) => {
      actualizarSello(tarjeta, enLista.has(tarjeta.dataset.id));
    });
    combos.sincronizarSellos(resumen);
  }

  function guardarLineas() {
    escribirAlmacenamiento(CLAVE_ALMACENAMIENTO, sesion.lineas);
  }

  /* --- Filas de la lista --- */

  function rebotarContador() {
    contador.classList.remove("rebote");
    void contador.offsetWidth; // Reinicia la animación si se agrega varias veces seguidas.
    contador.classList.add("rebote");
    clearTimeout(temporizadorRebote);
    temporizadorRebote = setTimeout(() => contador.classList.remove("rebote"), DURACION_REBOTE_MS);
  }

  // Los botones −, + y quitar de cada fila describen el producto y su tamaño.
  function configurarControles(fila, item, descripcion) {
    const unidad = item.esCombo ? "combo" : "paquete";
    const menos = fila.querySelector("[data-disminuir]");
    menos.setAttribute("aria-label", `Disminuir un ${unidad} de ${descripcion}`);
    menos.disabled = item.packs <= 1;
    const mas = fila.querySelector("[data-aumentar]");
    mas.setAttribute("aria-label", `Aumentar un ${unidad} de ${descripcion}`);
    mas.disabled = item.packs >= MAX_PACKS_POR_LINEA;
    fila.querySelector("[data-quitar]").setAttribute("aria-label", `Quitar ${descripcion}`);
  }

  // Tras redibujar se pierde el foco; este método lo devuelve al botón que se usó.
  function restaurarFoco(clave, accion) {
    const fila = listaItems.querySelector(`[data-clave="${CSS.escape(clave)}"]`);
    if (!fila) {
      const primera = listaItems.querySelector("button:not([disabled])");
      (primera || (listaRaiz.hidden ? botonLista : listaSeguir)).focus();
      return;
    }
    const boton = fila.querySelector(`[${accion}]:not([disabled])`) || fila.querySelector("[data-aumentar]:not([disabled])");
    (boton || fila.querySelector("[data-quitar]")).focus();
  }

  function manejarAccionFila(boton) {
    const clave = boton.closest("li").dataset.clave;
    if (boton.hasAttribute("data-quitar")) sesion.lineas = quitarLinea(sesion.lineas, clave);
    else if (boton.hasAttribute("data-aumentar")) sesion.lineas = cambiarPacks(sesion.lineas, clave, 1);
    else sesion.lineas = cambiarPacks(sesion.lineas, clave, -1);
    guardarLineas();
    dibujarLista();
    const accion = ["data-quitar", "data-aumentar", "data-disminuir"].find((nombre) => boton.hasAttribute(nombre));
    restaurarFoco(clave, accion);
  }

  /* --- Lista de compras --- */

  function crearFilaLista(item) {
    const fila = plantillaLista.content.firstElementChild.cloneNode(true);
    const descripcion = item.esCombo ? item.nombre : `${item.nombre}, ${item.tamano} unidades`;
    fila.dataset.clave = item.clave;
    fila.querySelector(".lista__item-nombre").textContent = item.nombre;
    fila.querySelector(".lista__item-precio").textContent = formatearMoneda(item.subtotalCentimos);
    const detalle = fila.querySelector(".lista__item-detalle");
    const descuento = fila.querySelector(".lista__item-descuento");
    if (item.esCombo) {
      // Combo: qué incluye y cuánto se ahorra (precio anterior tachado; el precio de la fila ya es el del combo).
      detalle.textContent = item.packs === 1
        ? `${item.unidades} unid.: ${item.composicion}`
        : `${item.unidades} unid.: ${item.packs} x (${item.composicion})`;
      const antes = crear("s", "", formatearMoneda(item.precioAnteriorCentimos));
      descuento.replaceChildren(crear("span", "solo-lectores", "Precio por separado: "), antes,
        " · precio promo");
      descuento.hidden = false;
    } else {
      detalle.textContent = `${item.unidades} unid.`;
    }
    fila.querySelector(".lista__packs").setAttribute("aria-label", `${item.esCombo ? "Combos" : "Paquetes"} de ${descripcion}`);
    fila.querySelector(".lista__packs-numero").textContent = item.packs;
    configurarControles(fila, item, descripcion);
    return fila;
  }

  function crearAvance(categoria) {
    const bloque = crear("div", `avance avance--${categoria.estado}`);
    const barra = crear("div", "avance__barra");
    barra.setAttribute("role", "progressbar");
    barra.setAttribute("aria-label", `Avance de ${categoria.etiqueta.toLowerCase()}`);
    barra.setAttribute("aria-valuemin", "0");
    barra.setAttribute("aria-valuemax", String(categoria.meta));
    barra.setAttribute("aria-valuenow", String(Math.min(categoria.llevas, categoria.meta)));
    barra.setAttribute("aria-valuetext", categoria.texto);
    const relleno = crear("span", "avance__relleno");
    relleno.style.width = `${categoria.porcentaje}%`;
    barra.append(relleno);
    bloque.append(crear("p", "avance__texto", categoria.texto), barra);
    return bloque;
  }

  // Cambia el texto solo si es distinto, para que el lector de pantalla no repita el aviso.

  function dibujarLista(claveNueva) {
    const resumen = resumirCarrito(sesion.lineas, catalogo);
    const modelo = describirLista(resumen, sesion.plan);
    const hayLineas = resumen.items.length > 0;
    // En escritorio el panel siempre existe (cerrado o abierto). En móvil, la barra aparece con productos,
    // con un camino elegido o cuando el visitante pidió la lista con "Mi lista".
    const visible = consultaEscritorio.matches || hayLineas || Boolean(sesion.plan.camino) || listaPedida;

    listaRaiz.hidden = !visible;
    listaRaiz.classList.toggle("lista--vacia", !hayLineas);
    saltarLista.hidden = !visible;
    raiz.classList.toggle("lista-visible", visible);

    ponerTexto(listaCamino, modelo.textoCamino);
    listaAvance.replaceChildren(...modelo.categorias.map(crearAvance));
    listaAvance.hidden = modelo.categorias.length === 0;
    ponerTexto(listaEstado, modelo.estado.texto);
    listaEstado.className = `lista__estado lista__estado--${modelo.estado.tipo}`;
    // Con un camino, las barras ya dicen cuánto llevas; el conteo solo aporta sin plan.
    ponerTexto(listaBocaditos, modelo.categorias.length > 0 ? "" : modelo.textoBocaditos);
    ponerTexto(listaPorInvitado, modelo.textoPorInvitado);
    listaItems.replaceChildren(...resumen.items.map(crearFilaLista));
    listaItems.hidden = !hayLineas;
    listaEnlacePlanificador.hidden = Boolean(sesion.plan.camino);
    listaTotal.textContent = formatearMoneda(resumen.totalCentimos);
    // El último paso solo tiene sentido con algo en la lista; el aviso del pedido anterior ya no vale.
    formPedido.hidden = !hayLineas;
    ocultarMensajePedido();

    const bocaditos = modelo.unidadesTotales;
    listaCifra.textContent = String(bocaditos);
    listaPestana.querySelector(".lista__pestana-unidad").textContent = bocaditos === 1 ? " bocadito" : " bocaditos";
    listaPestanaTotal.textContent = formatearMoneda(resumen.totalCentimos);
    contador.textContent = resumen.cantidadPacks;

    sincronizarSellos(resumen);
    if (claveNueva) resaltarFila(claveNueva);
    aplicarEstadoLista();
  }

  // La animación del resaltado solo existe en el CSS con movimiento permitido.
  function resaltarFila(clave) {
    const fila = listaItems.querySelector(`[data-clave="${CSS.escape(clave)}"]`);
    if (!fila) return;
    fila.classList.add("lista__item--nueva");
    if (listaAbierta) fila.scrollIntoView({ block: "nearest" });
  }

  function listaEstaAbierta() {
    return listaAbierta && !listaRaiz.hidden;
  }

  function aplicarEstadoLista() {
    const abierta = listaEstaAbierta();
    listaRaiz.classList.toggle("abierta", listaAbierta);
    raiz.classList.toggle("lista-abierta", abierta);
    listaPestana.setAttribute("aria-expanded", String(listaAbierta));
    botonLista.setAttribute("aria-expanded", String(abierta));
    listaPestanaAccion.textContent = listaAbierta ? "Ocultar" : "Ver lista";
  }

  // "origen" es el botón que la abre; al cerrar, el foco vuelve a él.
  function abrirLista(origen = listaPestana) {
    const resumen = resumirCarrito(sesion.lineas, catalogo);
    registrar("abrir_lista", { articulos: resumen.cantidadPacks, valor: aSoles(resumen.totalCentimos) });
    origenLista = origen;
    listaPedida = true;
    listaAbierta = true;
    actualizarMinimoFecha();
    dibujarLista();
    listaTitulo.focus({ preventScroll: true });
  }

  function cerrarLista() {
    const teniaFoco = listaRaiz.contains(document.activeElement);
    listaAbierta = false;
    listaPedida = false;
    dibujarLista(); // Vacía y sin camino, la lista desaparece del todo.
    if (teniaFoco) {
      // En escritorio no hay pestaña: el foco vuelve siempre a "Mi lista".
      const destino = consultaEscritorio.matches || origenLista === botonLista || listaRaiz.hidden ? botonLista : listaPestana;
      destino.focus();
    }
    origenLista = null;
  }

  // Botón "Mi lista" del encabezado: abre o cierra el panel, aunque esté vacío.
  function alternarLista() {
    if (listaEstaAbierta()) {
      origenLista = botonLista;
      cerrarLista();
    } else {
      abrirLista(botonLista);
    }
  }

  /* --- Pedido --- */

  function actualizarMinimoFecha() {
    campoFecha.min = fechaMinimaEvento(new Date());
  }

  function mostrarErrorFecha(mensaje) {
    errorFecha.textContent = mensaje;
    errorFecha.hidden = false;
    campoFecha.setAttribute("aria-invalid", "true");
  }

  function ocultarErrorFecha() {
    errorFecha.hidden = true;
    campoFecha.removeAttribute("aria-invalid");
  }

  function mostrarMensajePedido(texto, esError) {
    mensajePedido.textContent = texto;
    mensajePedido.className = esError ? "campo__error" : "campo__ayuda";
    mensajePedido.hidden = false;
  }

  function ocultarMensajePedido() {
    mensajePedido.hidden = true;
  }

  function abrirWhatsApp(enlace) {
    const ventana = window.open(enlace, "_blank");
    if (ventana) ventana.opener = null;
    else window.location.href = enlace; // Ventana emergente bloqueada: se abre en esta pestaña.
    return Boolean(ventana);
  }

  function enviarPedido(evento) {
    evento.preventDefault();
    ocultarMensajePedido();
    const resumen = resumirCarrito(sesion.lineas, catalogo);
    const fecha = validarFechaEvento(campoFecha.value, new Date());

    if (fecha.valida) ocultarErrorFecha();
    else mostrarErrorFecha(fecha.mensaje);

    if (resumen.items.length === 0) {
      mostrarMensajePedido("Aún no eliges nada. Pulsa «Agregar» y empieza tu lista.", true);
      return;
    }
    if (!fecha.valida) {
      campoFecha.focus();
      return;
    }

    const mensaje = construirMensajePedido(resumen, campoFecha.value, NEGOCIO, sesion.plan, origenVisita);
    registrar("enviar_pedido", {
      valor_total: aSoles(resumen.totalCentimos),
      lineas: resumen.items.length,
      unidades: resumen.items.reduce((suma, item) => suma + item.unidades, 0)
    });
    const seAbrioEnPestana = abrirWhatsApp(construirEnlaceWhatsApp(mensaje));
    if (seAbrioEnPestana) {
      mostrarMensajePedido("Abrimos WhatsApp con tu pedido. Tu lista sigue guardada por si quieres cambiar algo.", false);
    }
  }

  // Portada, selector de grupo y galería (un solo estado: el grupo activo). aplicarFiltro llama a establecerGrupo.
  const galeria = iniciarGaleria({ rejilla, aplicarFiltro, estaArrancado: () => arrancado });

  /* --- Eventos --- */

  document.querySelectorAll(".filtro").forEach((boton) => {
    boton.addEventListener("click", () => aplicarFiltro(boton.dataset.filtro));
  });

  rejilla.addEventListener("change", (evento) => {
    if (!evento.target.matches("input[type=radio]")) return;
    const tarjeta = evento.target.closest(".tarjeta");
    actualizarPrecioTarjeta(tarjeta);
    actualizarCotizacion(tarjeta);
  });

  rejilla.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-agregar]");
    if (boton) agregarDesdeTarjeta(boton);
  });

  listaItems.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button");
    if (boton) manejarAccionFila(boton);
  });

  document.addEventListener("click", (evento) => {
    const enlace = evento.target.closest("a[href]");
    if (enlace && esEnlaceWhatsApp(enlace)) registrar("clic_whatsapp", { ubicacion: ubicacionWhatsApp(enlace) });
  });

  botonLista.addEventListener("click", alternarLista);
  listaPestana.addEventListener("click", () => (listaAbierta ? cerrarLista() : abrirLista()));
  listaCerrar.addEventListener("click", cerrarLista);
  listaSeguir.addEventListener("click", cerrarLista);
  saltarLista.addEventListener("click", (evento) => {
    evento.preventDefault();
    abrirLista();
  });
  // Al pasar de móvil a escritorio (o al revés) la lista vuelve a nacer cerrada.
  consultaEscritorio.addEventListener("change", () => {
    listaAbierta = false;
    listaPedida = false;
    origenLista = null;
    dibujarLista();
  });

  // Escape cierra la lista; hacer clic en la página no la cierra.
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && listaEstaAbierta()) cerrarLista();
  });

  campoFecha.addEventListener("input", ocultarErrorFecha);
  formPedido.addEventListener("submit", enviarPedido);




  // Al volver con "atrás" el navegador puede devolver la página congelada con lo escrito antes: se recarga en blanco.
  window.addEventListener("pageshow", (evento) => { if (evento.persisted) window.location.reload(); });

  /* --- Origen de la visita en los enlaces prellenados de WhatsApp --- */

  // Los enlaces fijos del HTML (portada, promos, botón flotante) suman la línea de origen por JS, sin duplicar textos.
  // Los de cotización (data-solicitar) ya la llevan porque su mensaje se arma con construirMensajeCotizacion.
  function aplicarOrigenAEnlaces() {
    if (!origenVisita) return;
    document.querySelectorAll('a[href^="https://wa.me/"]:not([data-solicitar])').forEach((enlace) => {
      enlace.href = enlaceConOrigen(enlace.getAttribute("href"), origenVisita);
    });
  }

  /* --- Nosotros --- */

  // "Nosotros": la cantidad de sabores sale del catálogo real (las tarjetas con precio; la especial por cotizar no cuenta).
  function escribirCantidadSabores() {
    const titulo = $("nosotros-sabores");
    if (titulo && catalogo.size > 0) {
      titulo.textContent = catalogo.size === 1 ? "1 sabor para mezclar" : `${catalogo.size} sabores para mezclar`;
    }
  }

  /* --- Arranque --- */

  rejilla.querySelectorAll(".tarjeta").forEach((tarjeta) => {
    actualizarPrecioTarjeta(tarjeta);
    actualizarCotizacion(tarjeta);
  });
  prepararSellos();
  combos = iniciarCombos({ catalogo, guardarLineas, mostrarListaTrasAgregar, dibujarLista, rebotarContador, marcarAgregado, actualizarSello });
  iniciarPlanificador({ aplicarFiltro, dibujarLista });
  iniciarKekes();
  aplicarOrigenAEnlaces();
  escribirCantidadSabores();
  actualizarMinimoFecha();
  dibujarLista();
  iniciarProteccion();
  iniciarSubrayadoMenu();
  iniciarProgreso();
  iniciarAvisoVersion();
  arrancado = true;
}

if (typeof document !== "undefined") {
  iniciar();
  // Instalable y con respaldo sin conexión: el service worker prioriza la red, así los precios nunca quedan viejos.
  if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
}

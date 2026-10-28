// El Delicioso: catálogo, planificador de invitados, lista de compras y pedido por WhatsApp.
// JavaScript puro. Las funciones "puras" no tocan el DOM, así se pueden probar en Node.

import { BOCADITOS_POR_PERSONA, CLAVE_ALMACENAMIENTO, CLAVE_PLAN, COMBOS, DURACION_AGREGADO_MS, DURACION_CONTEO_MS, DURACION_REBOTE_MS, DURACION_TRANSICION_GALERIA_MS, INTERVALO_GALERIA_MS, INTERVALO_VERSION_MS, MARGEN_ZONA_MENU_PX, MAX_BOCADITOS_POR_INVITADO, MAX_INVITADOS, MAX_PACKS_POR_LINEA, NEGOCIO, PAUSA_TRAS_TOQUE_MS, TAMANOS } from "./config.js";
import { aCentimos, formatearMoneda } from "./dinero.js";
import { calcularCombinacion, mezclar, sacarDeBaraja, validarEntradaCalculadora } from "./calculadora.js";
import { CAMINOS, describirResultado, esCaminoValido, tienePrecios } from "./armado.js";
import { describirLista, normalizarPlan, textoContextoCamino } from "./plan.js";
import { fechaMinimaEvento, validarFechaEvento } from "./fechas.js";
import { agregarCombo, agregarLinea, cambiarPacks, claveLinea, quitarLinea } from "./carrito.js";
import { calcularPersonasCombo, calcularPrecioCombo, normalizarLineas, resumirCarrito } from "./combos.js";
import { enlaceConOrigen } from "./origen.js";
import { construirEnlaceWhatsApp, construirMensajeCotizacion, construirMensajePedido, construirMensajeReserva, filtrarEntradaNumerica } from "./mensajes.js";
import { aSoles, codificarSugerencia, esEnlaceWhatsApp, fijarOrigenMedicion, registrar, resolverOrigenVisita, ubicacionWhatsApp } from "./medicion.js";

/* ===== Interfaz (solo en el navegador) ===== */

function iniciar() {
  const $ = (id) => document.getElementById(id);
  const raiz = document.documentElement;
  const rejilla = $("rejilla-catalogo");
  const seccionCatalogo = $("catalogo");
  const tituloCatalogo = $("titulo-catalogo");
  const contextoCamino = $("catalogo-contexto");
  const botonLista = $("boton-lista");
  const contador = $("contador-lista");
  const formCalculadora = $("form-calculadora");
  const campoInvitados = $("invitados");
  const campoBocaditos = $("bocaditos-por-invitado");
  const resultadoCalculadora = $("resultado-calculadora");
  const caminosCalculadora = $("calculadora-caminos");
  const opcionesCalculadora = $("calculadora-opciones");
  const vacioCalculadora = $("calculadora-vacio");
  const heroCalculadora = $("calculadora-hero");
  const botonElegirCamino = $("elegir-camino");

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
  const avisoVersion = $("aviso-version");
  const botonActualizarVersion = $("boton-actualizar-version");

  const origenVisita = resolverOrigenVisita();
  fijarOrigenMedicion(origenVisita);
  const catalogo = leerCatalogo(rejilla);
  let lineas = normalizarLineas(leerAlmacenamiento(CLAVE_ALMACENAMIENTO), catalogo);
  // La calculadora siempre arranca en blanco al abrir o actualizar la página: se descarta el plan de la visita
  // anterior (antes se restauraba y parecía que la calculadora "no se reiniciaba"). La lista de compras sí se conserva.
  let plan = normalizarPlan(null);
  try { window.localStorage.removeItem(CLAVE_PLAN); } catch (error) { /* almacenamiento bloqueado: se ignora */ }
  let temporizadorRebote = 0;
  // Falso hasta terminar el arranque: así lo restaurado (la lista guardada) aparece sin animaciones.
  let arrancado = false;

  // Escritorio y tablet (desde 62,5em): panel que se desliza desde "Mi lista". Móvil: barra inferior con panel.
  // En ambos casos la lista nace cerrada.
  const consultaEscritorio = window.matchMedia("(min-width: 62.5em)");
  const consultaMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");
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
    establecerGrupo(categoria);
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
    lineas = agregarLinea(lineas, tarjeta.dataset.id, tamano);
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
    sincronizarSellosCombos(resumen);
  }

  /* --- Almacenamiento (con respaldo en memoria si el navegador lo bloquea) --- */

  function leerAlmacenamiento(clave) {
    try {
      return JSON.parse(window.localStorage.getItem(clave));
    } catch (error) {
      return null;
    }
  }

  function escribirAlmacenamiento(clave, valor) {
    try {
      window.localStorage.setItem(clave, JSON.stringify(valor));
    } catch (error) {
      // Almacenamiento bloqueado o lleno: se ignora.
    }
  }

  function guardarLineas() {
    escribirAlmacenamiento(CLAVE_ALMACENAMIENTO, lineas);
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
    if (boton.hasAttribute("data-quitar")) lineas = quitarLinea(lineas, clave);
    else if (boton.hasAttribute("data-aumentar")) lineas = cambiarPacks(lineas, clave, 1);
    else lineas = cambiarPacks(lineas, clave, -1);
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
  function ponerTexto(elemento, texto) {
    if (elemento.textContent !== texto) elemento.textContent = texto;
    elemento.hidden = texto === "";
  }

  function dibujarLista(claveNueva) {
    const resumen = resumirCarrito(lineas, catalogo);
    const modelo = describirLista(resumen, plan);
    const hayLineas = resumen.items.length > 0;
    // En escritorio el panel siempre existe (cerrado o abierto). En móvil, la barra aparece con productos,
    // con un camino elegido o cuando el visitante pidió la lista con "Mi lista".
    const visible = consultaEscritorio.matches || hayLineas || Boolean(plan.camino) || listaPedida;

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
    listaEnlacePlanificador.hidden = Boolean(plan.camino);
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
    const resumen = resumirCarrito(lineas, catalogo);
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

  /* --- Aviso de versión nueva --- */

  // Pide version.json sin caché (con un parámetro que cambia siempre) y compara con data-version del <html>.
  // Si difieren, muestra el aviso; los errores de red o sin conexión no interrumpen la página.
  function comprobarVersionNueva() {
    if (!avisoVersion || avisoVersion.hidden === false) return; // ya se avisó: no hace falta seguir revisando
    const versionActual = document.documentElement.dataset.version;
    if (!versionActual) return;
    fetch(`version.json?t=${Date.now()}`, { cache: "no-store" })
      .then((respuesta) => (respuesta.ok ? respuesta.json() : null))
      .then((datos) => {
        if (datos && datos.v && datos.v !== versionActual) avisoVersion.hidden = false;
      })
      .catch(() => {});
  }

  // Recarga con una URL que nunca estuvo en caché (ni la del navegador ni la del hosting), así trae de una
  // vez la versión nueva en lugar de esperar a que venza el cacheo del hosting.
  function recargarConVersionNueva() {
    const separador = window.location.search ? "&" : "?";
    window.location.href = `${window.location.pathname}${window.location.search}${separador}_=${Date.now()}`;
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
    const resumen = resumirCarrito(lineas, catalogo);
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

    const mensaje = construirMensajePedido(resumen, campoFecha.value, NEGOCIO, plan, origenVisita);
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

  /* --- Planificador --- */

  function crear(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto) elemento.textContent = texto;
    return elemento;
  }

  // Cada camino es una opción de radio (marca, título y reparto). Un único botón al pie lleva al catálogo con el camino marcado.
  // "previo" es el camino que el visitante tenía marcado antes de recalcular, para no perderlo.
  function crearFilaOpcion(opcion, indice, previo) {
    const fila = crear("label", `opcion opcion--${opcion.clave}`);
    const radio = crear("input", "opcion__radio");
    radio.type = "radio";
    radio.name = "camino";
    radio.value = opcion.clave;
    const deseado = previo || plan.camino;
    radio.checked = deseado ? deseado === opcion.clave : indice === 0;
    const marca = crear("span", "opcion__marca");
    marca.setAttribute("aria-hidden", "true");
    const texto = crear("span", "opcion__texto");
    texto.append(crear("span", "opcion__titulo", opcion.titulo), crear("span", "opcion__reparto", opcion.reparto));
    texto.append(crear("span", "opcion__elegido", "Elegido para tu lista"));
    fila.append(radio, marca, texto);
    return fila;
  }

  function caminoMarcado() {
    const radio = opcionesCalculadora.querySelector(".opcion__radio:checked");
    return radio ? radio.value : null;
  }

  // Marca con "Elegido para tu lista" el camino que ya está en el plan.
  function actualizarBotonCamino() {
    botonElegirCamino.disabled = !caminoMarcado();
    opcionesCalculadora.querySelectorAll(".opcion").forEach((fila) => {
      fila.classList.toggle("opcion--elegida", Boolean(plan.camino) && fila.querySelector(".opcion__radio").value === plan.camino);
    });
  }

  // Cuenta de 0 al valor en ~500 ms (con movimiento reducido, el valor final directo). Antes de contar se reserva
  // el ancho de la cifra final, así nada se mueve.
  function contarCifras(raiz) {
    if (consultaMovimiento.matches) return;
    const cifras = [...raiz.querySelectorAll(".cifra-conteo")];
    cifras.forEach((cifra) => { cifra.style.minWidth = `${cifra.getBoundingClientRect().width}px`; });
    let inicio = null;
    let terminado = false;
    function poner(suavizado) {
      cifras.forEach((cifra) => {
        if (cifra.isConnected) cifra.textContent = String(Math.round(Number(cifra.dataset.valor) * suavizado));
      });
    }
    // Siempre termina en el valor final, aunque el navegador pause los cuadros (pestaña en segundo plano).
    function terminar() {
      if (terminado) return;
      terminado = true;
      poner(1);
    }
    function cuadro(ahora) {
      if (terminado) return;
      if (inicio === null) inicio = ahora;
      const avance = Math.max(0, Math.min(1, (ahora - inicio) / DURACION_CONTEO_MS));
      poner(1 - Math.pow(1 - avance, 3));
      if (avance < 1) requestAnimationFrame(cuadro);
      else terminar();
    }
    cifras.forEach((cifra) => { cifra.textContent = "0"; });
    requestAnimationFrame(cuadro);
    setTimeout(terminar, DURACION_CONTEO_MS + 250);
  }

  // Estado del panel en vivo: sin resultado todavía (aviso inicial), con resultado o con un aviso de dato inválido.
  let resultadoVisible = false;

  function ocultarResultadoCalculadora() {
    resultadoCalculadora.classList.remove("calculadora__frase--error");
    resultadoCalculadora.textContent = "";
    heroCalculadora.hidden = true;
    opcionesCalculadora.replaceChildren();
    caminosCalculadora.hidden = true;
    vacioCalculadora.hidden = false;
    resultadoVisible = false;
  }

  // Muestra el resultado grande y los tres caminos; "contar" anima la cifra (solo la primera vez, no en cada tecla).
  function mostrarResultado(invitados, porInvitado, contar) {
    const modelo = describirResultado(invitados, porInvitado);
    const previo = caminoMarcado();
    resultadoCalculadora.classList.remove("calculadora__frase--error");
    resultadoCalculadora.classList.add("solo-lectores");
    resultadoCalculadora.textContent = modelo.frase;
    const cifra = $("calculadora-cifra");
    cifra.style.minWidth = "";
    cifra.textContent = String(modelo.necesarias);
    cifra.dataset.valor = String(modelo.necesarias);
    $("calculadora-sugerencia").textContent = modelo.sugerencia;
    heroCalculadora.hidden = false;
    opcionesCalculadora.replaceChildren(...modelo.opciones.map((opcion, indice) => crearFilaOpcion(opcion, indice, previo)));
    vacioCalculadora.hidden = true;
    caminosCalculadora.hidden = false;
    actualizarBotonCamino();
    resultadoVisible = true;
    if (contar) contarCifras(heroCalculadora);
  }

  // Un dato inválido reemplaza el resultado anterior por el aviso.
  function mostrarErrorCalculadora(mensaje) {
    resultadoCalculadora.classList.add("calculadora__frase--error");
    resultadoCalculadora.classList.remove("solo-lectores");
    resultadoCalculadora.textContent = mensaje;
    heroCalculadora.hidden = true;
    opcionesCalculadora.replaceChildren();
    vacioCalculadora.hidden = true;
    caminosCalculadora.hidden = true;
    resultadoVisible = false;
  }

  function marcarCaminoElegido() {
    const radio = [...opcionesCalculadora.querySelectorAll(".opcion__radio")].find((candidato) => candidato.value === plan.camino);
    if (radio) radio.checked = true;
    actualizarBotonCamino();
  }

  function dibujarContextoCamino() {
    ponerTexto(contextoCamino, textoContextoCamino(plan));
  }

  // Paso 2: marca (aria-pressed) el tipo de evento cuyo tramo (data-desde y data-hasta) contiene lo escrito en "Bocaditos por
  // invitado". Vacío, decimal o fuera de 3 a 20: ninguno. Al pulsar un evento se rellena el campo con su valor típico.
  const botonesEvento = [...document.querySelectorAll(".evento[data-desde]")];
  function marcarEvento() {
    const texto = campoBocaditos.value.trim();
    const valor = texto === "" ? NaN : Number(texto);
    botonesEvento.forEach((boton) => {
      const dentro = Number.isInteger(valor) && valor >= Number(boton.dataset.desde) && valor <= Number(boton.dataset.hasta);
      boton.setAttribute("aria-pressed", String(dentro));
    });
  }

  // Panel en vivo: cada vez que cambia un campo se recalcula, sin botón. Si falta un dato se vuelve al aviso inicial; un
  // dato fuera de rango muestra su aviso tras una pausa corta (así "1" camino a "15" no parpadea); el resultado se mide
  // una vez que el visitante deja de escribir.
  let temporizadorAviso = 0;
  let temporizadorMedicion = 0;
  function calcularEnVivo() {
    window.clearTimeout(temporizadorAviso);
    window.clearTimeout(temporizadorMedicion);
    campoInvitados.removeAttribute("aria-invalid");
    campoBocaditos.removeAttribute("aria-invalid");
    if (campoInvitados.value.trim() === "" || campoBocaditos.value.trim() === "") {
      ocultarResultadoCalculadora();
      return;
    }
    const validacion = validarEntradaCalculadora(campoInvitados.value, campoBocaditos.value);
    if (!validacion.valido) {
      temporizadorAviso = window.setTimeout(() => {
        if (validacion.campos.includes("invitados")) campoInvitados.setAttribute("aria-invalid", "true");
        if (validacion.campos.includes("porInvitado")) campoBocaditos.setAttribute("aria-invalid", "true");
        mostrarErrorCalculadora(validacion.mensaje);
      }, 700);
      return;
    }
    plan = { invitados: validacion.invitados, porInvitado: validacion.porInvitado, camino: plan.camino };
    mostrarResultado(plan.invitados, plan.porInvitado, !resultadoVisible);
    dibujarContextoCamino();
    dibujarLista();
    temporizadorMedicion = window.setTimeout(() => {
      registrar("usar_calculadora", {
        invitados: plan.invitados,
        bocaditos_por_invitado: plan.porInvitado,
        sugerencia: codificarSugerencia(calcularCombinacion(plan.invitados, plan.porInvitado))
      });
    }, 1200);
  }

  // Lleva al catálogo con desplazamiento suave (sin animación si el visitante prefiere menos movimiento).
  function irAlCatalogo() {
    seccionCatalogo.scrollIntoView({ behavior: consultaMovimiento.matches ? "auto" : "smooth", block: "start" });
    tituloCatalogo.focus({ preventScroll: true });
  }

  function elegirCamino(clave) {
    if (!plan.invitados || !plan.porInvitado || !esCaminoValido(clave)) return;
    plan = { invitados: plan.invitados, porInvitado: plan.porInvitado, camino: clave };
    marcarCaminoElegido();
    aplicarFiltro(CAMINOS[clave].filtro, false);
    dibujarContextoCamino();
    dibujarLista();
    registrar("elegir_camino", { camino: clave, invitados: plan.invitados, bocaditos_por_invitado: plan.porInvitado });
    irAlCatalogo();
  }

  /* --- Promo para cada ocasión (combos) --- */

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
  function sincronizarSellosCombos(resumen = resumirCarrito(lineas, catalogo)) {
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
    lineas = agregarCombo(lineas, estado);
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

  /* --- Grupo: selector de la portada, foto, filtro del catálogo y galería (un solo estado) --- */

  const selectorGrupo = $("selector-grupo");
  const opcionesGrupo = [...selectorGrupo.querySelectorAll("[role=radio]")];
  const figuraPortada = $("foto-portada").parentElement;
  const selloPortada = figuraPortada.querySelector(".portada__sello");
  // "Todo" usa la foto que ya trae el HTML; así las medidas y el texto alternativo no se duplican.
  const fotoTodos = (() => {
    const foto = $("foto-portada");
    return {
      src: foto.getAttribute("src"),
      ancho: foto.getAttribute("width"),
      alto: foto.getAttribute("height"),
      posicion: "",
      alt: foto.alt
    };
  })();
  // Dulces y Salados: foto al azar entre las tarjetas de ese grupo marcadas con data-portada (su valor es el
  // encuadre). Cada grupo tiene su baraja: no se repite ninguna hasta agotarlas ni salen dos iguales seguidas.
  const barajasPortada = { dulce: { pendientes: [], ultima: null }, salado: { pendientes: [], ultima: null } };
  function fotoAleatoriaPortada(grupo) {
    const baraja = barajasPortada[grupo];
    const aptas = fuentesGaleria.filter((fuente) => fuente.categoria === grupo && fuente.portada !== undefined);
    if (!baraja || aptas.length === 0) return null;
    const fuente = sacarDeBaraja(baraja.pendientes, aptas, baraja.ultima);
    baraja.ultima = fuente;
    return { src: fuente.src, ancho: fuente.ancho, alto: fuente.alto, posicion: fuente.portada, alt: fuente.alt };
  }
  let fotoPortada = $("foto-portada");
  let grupoActual = "todos";
  let versionFoto = 0;
  let fundidoPendiente = null;

  // Radiogroup: solo el elegido entra en el orden de tabulación.
  function marcarSelectorGrupo(grupo) {
    opcionesGrupo.forEach((opcion) => {
      const activo = opcion.dataset.grupo === grupo;
      opcion.setAttribute("aria-checked", String(activo));
      opcion.tabIndex = activo ? 0 : -1;
    });
  }

  // La foto nueva se superpone con opacidad 0, se funde y, al terminar, pasa a ser la foto principal.
  function terminarFundido() {
    if (!fundidoPendiente) return;
    const { nueva } = fundidoPendiente;
    fundidoPendiente = null;
    nueva.classList.remove("portada__foto-nueva", "portada__foto-nueva--visible");
    fotoPortada.remove();
    nueva.id = "foto-portada";
    fotoPortada = nueva;
  }

  function cambiarFotoPortada(grupo, animar) {
    terminarFundido();
    const version = ++versionFoto;
    const dato = grupo === "todos" ? fotoTodos : fotoAleatoriaPortada(grupo);
    if (!dato) return; // Sin fotos aptas en ese grupo se conserva la actual.
    if (!animar) {
      fotoPortada.src = dato.src;
      fotoPortada.width = Number(dato.ancho);
      fotoPortada.height = Number(dato.alto);
      fotoPortada.alt = dato.alt;
      fotoPortada.style.objectPosition = dato.posicion;
      return;
    }
    const nueva = document.createElement("img");
    nueva.className = "portada__foto-nueva";
    nueva.width = Number(dato.ancho);
    nueva.height = Number(dato.alto);
    nueva.alt = dato.alt;
    nueva.decoding = "async";
    nueva.style.objectPosition = dato.posicion;
    // El fundido empieza cuando la foto ya cargó; si el visitante cambia otra vez antes, esta se descarta.
    nueva.addEventListener("load", () => {
      if (version !== versionFoto) return;
      figuraPortada.insertBefore(nueva, selloPortada);
      void nueva.offsetWidth; // Fija la opacidad inicial antes de pedir la final.
      fundidoPendiente = { nueva };
      nueva.classList.add("portada__foto-nueva--visible");
      const fin = () => { if (fundidoPendiente && fundidoPendiente.nueva === nueva) terminarFundido(); };
      nueva.addEventListener("transitionend", fin, { once: true });
      setTimeout(fin, 900); // Respaldo por si la transición no llega a dispararse.
    }, { once: true });
    nueva.src = dato.src;
  }

  // Cambia de grupo: selector, foto de la portada (con fundido si hay movimiento permitido) y galería.
  // El filtro del catálogo lo aplica aplicarFiltro, que es quien llama a esta función.
  function establecerGrupo(grupo) {
    if (grupo === grupoActual || !opcionesGrupo.some((opcion) => opcion.dataset.grupo === grupo)) return;
    grupoActual = grupo;
    marcarSelectorGrupo(grupo);
    cambiarFotoPortada(grupo, arrancado && !consultaMovimiento.matches);
    dibujarGaleria(grupo);
  }

  function elegirGrupo(grupo) {
    if (grupo === grupoActual) {
      // Volver a pulsar Dulces o Salados trae otra foto de ese grupo; "Todo" conserva la portada.
      if (grupo !== "todos") cambiarFotoPortada(grupo, !consultaMovimiento.matches);
      return;
    }
    registrar("elegir_grupo", { grupo });
    aplicarFiltro(grupo, false); // Sin scroll automático; la medición ya la hace "elegir_grupo".
  }

  /* --- Galería: carrusel de imágenes grandes, en orden aleatorio --- */

  const seccionGaleria = $("galeria");
  const pistaGaleria = $("galeria-pista");
  const pausaGaleria = { cursor: false, foco: false, enPantalla: true, toqueHasta: 0 };
  let animacionGaleria = 0;
  let fundidoGaleria = null;
  // Pausa PERSISTENTE pedida con el botón (WCAG 2.2.2): distinta de las pausas automáticas de arriba (cursor, foco,
  // toque, pestaña oculta), que se levantan solas. Esta solo la levanta el visitante y no se reinicia por sí sola.
  let pausadaPorUsuario = false;
  const botonPausaGaleria = $("galeria-pausa");
  let temporizadorGaleria = 0;
  let temporizadorResalte = 0;
  let tarjetaResaltada = null;

  // Lee de las tarjetas del catálogo (id, foto y alt): no hay una lista de imágenes duplicada.
  function leerFuentesGaleria() {
    return [...rejilla.querySelectorAll(".tarjeta")].map((tarjeta) => {
      const foto = tarjeta.querySelector(".tarjeta__foto img");
      if (!foto) return null;
      return {
        id: tarjeta.dataset.id,
        categoria: tarjeta.dataset.categoria,
        nombre: tarjeta.querySelector(".tarjeta__nombre").textContent.trim(),
        src: foto.getAttribute("src"),
        alt: foto.alt,
        ancho: foto.getAttribute("width"),
        alto: foto.getAttribute("height"),
        posicion: foto.style.objectPosition,
        portada: tarjeta.dataset.portada // encuadre si la foto es apta para la portada; undefined si no
      };
    }).filter(Boolean);
  }

  const fuentesGaleria = leerFuentesGaleria();

  // Cada diapositiva es un botón con su posición y nombre; las 3 primeras cargan normal y el resto de forma diferida.
  function crearDiapositiva(fuente, indice, total) {
    const boton = crear("button", "galeria__diapo");
    boton.type = "button";
    boton.dataset.id = fuente.id;
    boton.setAttribute("aria-label", `${indice + 1} de ${total}: ${fuente.nombre}`);
    const imagen = document.createElement("img");
    imagen.src = fuente.src;
    imagen.alt = fuente.alt;
    imagen.width = Number(fuente.ancho);
    imagen.height = Number(fuente.alto);
    imagen.decoding = "async";
    if (fuente.posicion) imagen.style.objectPosition = fuente.posicion;
    if (indice >= 3) imagen.loading = "lazy";
    boton.append(imagen);
    return boton;
  }

  // Filtra por el grupo y reordena al azar (Fisher-Yates) cada vez que se dibuja.
  function dibujarGaleria(grupo) {
    cancelarAnimacionGaleria();
    const fuentes = mezclar(fuentesGaleria.filter((fuente) => grupo === "todos" || fuente.categoria === grupo));
    pistaGaleria.replaceChildren(...fuentes.map((fuente, indice) => crearDiapositiva(fuente, indice, fuentes.length)));
    pistaGaleria.scrollLeft = 0;
    seccionGaleria.hidden = fuentes.length === 0;
  }

  function cancelarAnimacionGaleria() {
    animacionGaleria += 1;
    pistaGaleria.style.scrollSnapType = "";
    if (fundidoGaleria) {
      fundidoGaleria.cancel();
      fundidoGaleria = null;
    }
  }

  // Desplazamiento de ~0,7 s con desaceleración (ease-out cúbico), sin desenfoque; sin movimiento permitido, salta directo.
  function desplazarGaleria(destino, duracion = DURACION_TRANSICION_GALERIA_MS) {
    cancelarAnimacionGaleria();
    const inicio = pistaGaleria.scrollLeft;
    if (consultaMovimiento.matches || Math.abs(destino - inicio) < 1) {
      pistaGaleria.scrollLeft = destino;
      return;
    }
    const identificador = animacionGaleria;
    const comienzo = performance.now();
    pistaGaleria.style.scrollSnapType = "none"; // El ajuste al final se restablece al terminar.
    function cuadro(ahora) {
      if (identificador !== animacionGaleria) return;
      const avance = Math.min(1, (ahora - comienzo) / duracion);
      const suavizado = 1 - (1 - avance) ** 3;
      pistaGaleria.scrollLeft = inicio + (destino - inicio) * suavizado;
      if (avance < 1) requestAnimationFrame(cuadro);
      else pistaGaleria.style.scrollSnapType = "";
    }
    requestAnimationFrame(cuadro);
  }

  // Del final al inicio (o al revés) no se recorren todas las imágenes de golpe: la pista se desvanece, salta y reaparece,
  // en el mismo tiempo que un desplazamiento normal.
  function saltarGaleriaConFundido(destino) {
    cancelarAnimacionGaleria();
    if (consultaMovimiento.matches || typeof pistaGaleria.animate !== "function") {
      pistaGaleria.scrollLeft = destino;
      return;
    }
    const identificador = animacionGaleria;
    fundidoGaleria = pistaGaleria.animate(
      [{ opacity: 1 }, { opacity: 0, offset: .4 }, { opacity: 0, offset: .5 }, { opacity: 1 }],
      { duration: DURACION_TRANSICION_GALERIA_MS, easing: "linear" }
    );
    setTimeout(() => {
      if (identificador === animacionGaleria) pistaGaleria.scrollLeft = destino;
    }, DURACION_TRANSICION_GALERIA_MS * .45);
  }

  // Avanza (o retrocede) una diapositiva; al pasar el final vuelve al inicio (y al revés) con un fundido.
  function avanzarGaleria(sentido) {
    const diapositivas = pistaGaleria.children;
    if (diapositivas.length < 2) return;
    const paso = diapositivas[1].offsetLeft - diapositivas[0].offsetLeft;
    const maximo = pistaGaleria.scrollWidth - pistaGaleria.clientWidth;
    if (maximo <= 1 || paso <= 0) return;
    const posicion = pistaGaleria.scrollLeft;
    const indice = Math.round(posicion / paso);
    if (sentido > 0 && posicion >= maximo - 2) return saltarGaleriaConFundido(0);
    if (sentido < 0 && posicion <= 2) return saltarGaleriaConFundido(maximo);
    desplazarGaleria(sentido > 0 ? Math.min((indice + 1) * paso, maximo) : Math.max((indice - 1) * paso, 0));
  }

  // El avance automático se pausa con el cursor encima, con foco dentro, al tocar o arrastrar, con la pestaña oculta
  // y, de forma persistente, cuando el visitante pulsa el botón de pausa.
  function avanceAutomaticoGaleria() {
    if (pausadaPorUsuario) return;
    if (consultaMovimiento.matches || document.hidden || seccionGaleria.hidden) return;
    if (pausaGaleria.cursor || pausaGaleria.foco || !pausaGaleria.enPantalla) return;
    if (Date.now() < pausaGaleria.toqueHasta) return;
    avanzarGaleria(1);
  }

  // Con movimiento reducido no hay avance automático; si el ajuste cambia, se enciende o apaga.
  function programarAvanceGaleria() {
    clearInterval(temporizadorGaleria);
    temporizadorGaleria = consultaMovimiento.matches ? 0 : setInterval(avanceAutomaticoGaleria, INTERVALO_GALERIA_MS);
  }

  // Botón de pausa/reproducir: aria-pressed="true" significa "en pausa" (la etiqueta no cambia). Con movimiento
  // reducido no hay avance automático, así que el botón no tiene nada que controlar y se oculta.
  function dibujarBotonPausaGaleria() {
    botonPausaGaleria.setAttribute("aria-pressed", String(pausadaPorUsuario));
    botonPausaGaleria.hidden = consultaMovimiento.matches;
  }

  function alternarPausaGaleria() {
    pausadaPorUsuario = !pausadaPorUsuario;
    // Al reproducir se levantan las pausas automáticas pendientes (el toque o el foco que dejó pulsar el propio botón):
    // quien pulsa "reproducir" espera ver avanzar la galería.
    if (!pausadaPorUsuario) {
      pausaGaleria.toqueHasta = 0;
      pausaGaleria.foco = false;
    }
    dibujarBotonPausaGaleria();
    registrar("pausar_galeria", { pausada: pausadaPorUsuario });
  }

  function tocarGaleria() {
    cancelarAnimacionGaleria();
    pausaGaleria.toqueHasta = Date.now() + PAUSA_TRAS_TOQUE_MS;
  }

  // Lleva a la tarjeta del catálogo, con un resalte breve (solo con movimiento permitido). No cambia nada más.
  function irATarjeta(id) {
    const tarjeta = rejilla.querySelector(`.tarjeta[data-id="${CSS.escape(id)}"]`);
    if (!tarjeta) return;
    if (tarjeta.hidden) aplicarFiltro("todos", false); // Si el filtro la oculta, primero se muestra todo.
    const conMovimiento = !consultaMovimiento.matches;
    tarjeta.scrollIntoView({ behavior: conMovimiento ? "smooth" : "auto", block: "center" });
    clearTimeout(temporizadorResalte);
    if (tarjetaResaltada) tarjetaResaltada.classList.remove("tarjeta--resaltada");
    if (!conMovimiento) return;
    tarjetaResaltada = tarjeta;
    tarjeta.classList.add("tarjeta--resaltada");
    temporizadorResalte = setTimeout(() => tarjeta.classList.remove("tarjeta--resaltada"), 1900);
  }

  /* --- Protección contra copia (disuasión) ---
     Importante: en una página web NO se puede impedir de verdad copiar ni hacer capturas (basta una cámara, "ver código
     fuente" o desactivar JavaScript). Esto solo dificulta la copia casual: sin selección de texto, sin clic derecho, sin
     arrastrar imágenes, atajos de copiar/guardar/imprimir/inspeccionar bloqueados, impresión vacía, portapapeles limpio con
     Impr Pant y contenido oculto al perder el foco. (La marca de agua se probó y se retiró por pedido del usuario.)
     Los campos (calculadora, fecha) siguen funcionando con normalidad. */
  const MENSAJE_PROTEGIDO = "Contenido protegido © El Delicioso";
  const esCampoEditable = (elemento) => Boolean(elemento && elemento.closest && elemento.closest("input, textarea, select"));
  const bloquearFuera = (evento) => { if (!esCampoEditable(evento.target)) evento.preventDefault(); };
  document.addEventListener("contextmenu", bloquearFuera);
  document.addEventListener("dragstart", bloquearFuera);
  document.addEventListener("selectstart", bloquearFuera);
  for (const tipo of ["copy", "cut"]) {
    document.addEventListener(tipo, (evento) => {
      if (esCampoEditable(evento.target)) return;
      evento.preventDefault();
      if (evento.clipboardData) evento.clipboardData.setData("text/plain", MENSAJE_PROTEGIDO);
    });
  }
  document.addEventListener("keydown", (evento) => {
    const tecla = evento.key ? evento.key.toLowerCase() : "";
    const control = evento.ctrlKey || evento.metaKey;
    const herramientas = evento.key === "F12" || (control && evento.shiftKey && ["i", "j", "c"].includes(tecla)) ||
      (evento.metaKey && evento.altKey && ["i", "j", "c", "u"].includes(tecla));
    const guardarVerImprimir = control && ["s", "u", "p"].includes(tecla);
    const copiarSeleccionar = control && ["c", "x", "a"].includes(tecla) && !esCampoEditable(evento.target);
    if (herramientas || guardarVerImprimir || copiarSeleccionar) evento.preventDefault();
  });
  document.addEventListener("keyup", (evento) => {
    if (evento.key !== "PrintScreen") return;
    try { navigator.clipboard.writeText(MENSAJE_PROTEGIDO); } catch (error) { /* sin permiso del portapapeles: se ignora */ }
  });
  // Al perder el foco (otra ventana, inspector, cambio de app) el contenido se oculta hasta volver.
  const alternarProteccion = (oculto) => document.documentElement.classList.toggle("protegido", oculto);
  window.addEventListener("blur", () => alternarProteccion(true));
  window.addEventListener("focus", () => alternarProteccion(false));
  document.addEventListener("visibilitychange", () => alternarProteccion(document.visibilityState === "hidden"));

  /* --- Subrayado del menú que sigue al cursor (escritorio con puntero fino) --- */

  const encabezado = $("inicio");
  const menu = encabezado.querySelector(".menu");
  const indicadorMenu = menu.querySelector(".menu__indicador");
  const consultaPunteroFino = window.matchMedia("(min-width: 48em) and (hover: hover) and (pointer: fine)");
  let indicadorActivo = false;
  let punteroMenu = null;
  let cuadroMenu = 0;

  function ocultarIndicadorMenu() {
    cancelAnimationFrame(cuadroMenu);
    cuadroMenu = 0;
    punteroMenu = null;
    if (!indicadorActivo) return;
    indicadorActivo = false;
    indicadorMenu.style.opacity = "0";
  }

  // Coloca el subrayado bajo el enlace más cercano en horizontal; su intensidad crece al acercarse a la barra.
  function actualizarIndicadorMenu() {
    cuadroMenu = 0;
    if (!punteroMenu) return;
    const { x, y } = punteroMenu;
    const caja = menu.getBoundingClientRect();
    let elegido = null;
    let mejor = [Infinity, Infinity];
    menu.querySelectorAll("a").forEach((enlace) => {
      const r = enlace.getBoundingClientRect();
      const distancia = x < r.left ? r.left - x : (x > r.right ? x - r.right : 0);
      const alCentro = Math.abs(x - (r.left + r.right) / 2);
      if (distancia < mejor[0] || (distancia === mejor[0] && alCentro < mejor[1])) {
        mejor = [distancia, alCentro];
        elegido = enlace;
      }
    });
    if (!elegido) return;
    const alcance = Math.max(1, encabezado.getBoundingClientRect().bottom + MARGEN_ZONA_MENU_PX - caja.bottom);
    const distanciaVertical = y < caja.top ? caja.top - y : (y > caja.bottom ? y - caja.bottom : 0);
    const cercania = Math.min(1, Math.max(0, 1 - distanciaVertical / alcance));
    const relleno = parseFloat(getComputedStyle(elegido).paddingLeft) || 0;
    const aplicar = () => {
      indicadorMenu.style.width = `${elegido.offsetWidth - 2 * relleno}px`;
      // De 2 a 4 px de grosor (escala vertical sobre 4 px) y de opacidad tenue a plena.
      indicadorMenu.style.transform = `translateX(${elegido.offsetLeft + relleno}px) scaleY(${0.5 + 0.5 * cercania})`;
      indicadorMenu.style.opacity = String(0.2 + 0.8 * cercania);
    };
    if (indicadorActivo) {
      aplicar();
    } else {
      // Al aparecer se coloca directamente bajo el enlace, sin deslizar desde la última posición.
      indicadorMenu.classList.add("menu__indicador--sin-deslizar");
      aplicar();
      void indicadorMenu.offsetWidth;
      indicadorMenu.classList.remove("menu__indicador--sin-deslizar");
      indicadorActivo = true;
    }
  }

  // Fuera de la zona (encabezado y unos 48 px debajo) no se hace ningún trabajo.
  function moverPunteroMenu(evento) {
    if (evento.pointerType === "touch") return;
    if (evento.clientY > encabezado.getBoundingClientRect().bottom + MARGEN_ZONA_MENU_PX) {
      if (indicadorActivo) ocultarIndicadorMenu();
      return;
    }
    punteroMenu = { x: evento.clientX, y: evento.clientY };
    if (!cuadroMenu) cuadroMenu = requestAnimationFrame(actualizarIndicadorMenu);
  }

  function salirDeLaVentana(evento) {
    if (!evento.relatedTarget) ocultarIndicadorMenu();
  }

  function sincronizarSubrayadoMenu() {
    document.removeEventListener("pointermove", moverPunteroMenu);
    document.removeEventListener("mouseout", salirDeLaVentana);
    ocultarIndicadorMenu();
    if (!consultaPunteroFino.matches) return;
    document.addEventListener("pointermove", moverPunteroMenu, { passive: true });
    document.addEventListener("mouseout", salirDeLaVentana);
  }

  /* --- Barra de progreso de lectura (transform: scaleX, sin recalcular el diseño) --- */

  const barraProgreso = $("progreso-lectura");
  let cuadroProgreso = 0;

  function actualizarProgreso() {
    cuadroProgreso = 0;
    if (consultaMovimiento.matches) return; // Con movimiento reducido la barra no se muestra.
    const recorrido = raiz.scrollHeight - window.innerHeight;
    const avance = recorrido > 0 ? Math.min(1, Math.max(0, window.scrollY / recorrido)) : 0;
    barraProgreso.style.transform = `scaleX(${avance})`;
  }

  function pedirProgreso() {
    if (!cuadroProgreso && !consultaMovimiento.matches) cuadroProgreso = requestAnimationFrame(actualizarProgreso);
  }

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
  formCalculadora.addEventListener("submit", (evento) => evento.preventDefault()); // panel en vivo: Intro no envía nada

  // Campos de la calculadora: solo dígitos, tope de dígitos y de valor (invitados hasta 1000 = 4 dígitos; bocaditos por
  // invitado hasta 20 = 2 dígitos). Son campos de texto numérico (no type="number"), así no hay flechitas, ni rueda del
  // ratón, ni incremento con las flechas del teclado; aun así se bloquean por si acaso.
  const limitesCalculadora = [[campoInvitados, 4, MAX_INVITADOS], [campoBocaditos, 2, MAX_BOCADITOS_POR_INVITADO]];
  for (const [campo, maxDigitos, maximo] of limitesCalculadora) {
    let ultimoValido = "";
    campo.addEventListener("beforeinput", (evento) => {
      if (evento.data && /\D/.test(evento.data)) evento.preventDefault(); // letras, signos, puntos y espacios no entran
    });
    campo.addEventListener("keydown", (evento) => {
      if (evento.key === "ArrowUp" || evento.key === "ArrowDown") evento.preventDefault();
    });
    campo.addEventListener("wheel", (evento) => { if (document.activeElement === campo) evento.preventDefault(); }, { passive: false });
    campo.addEventListener("input", () => {
      const filtrado = filtrarEntradaNumerica(campo.value, maxDigitos, maximo, ultimoValido);
      if (filtrado !== campo.value) campo.value = filtrado; // cubre pegar, arrastrar y autocompletar
      ultimoValido = filtrado;
    });
  }
  [campoInvitados, campoBocaditos].forEach((campo) => {
    campo.addEventListener("input", () => campo.removeAttribute("aria-invalid"));
  });
  campoBocaditos.addEventListener("input", marcarEvento);
  campoBocaditos.addEventListener("change", marcarEvento);
  [campoInvitados, campoBocaditos].forEach((campo) => campo.addEventListener("input", calcularEnVivo));
  botonesEvento.forEach((boton) => {
    boton.addEventListener("click", () => {
      campoBocaditos.value = boton.dataset.bocaditos;
      campoBocaditos.dispatchEvent(new Event("input", { bubbles: true }));
    });
  });

  rejillaCombos.addEventListener("change", (evento) => {
    const entrada = tarjetasCombos.find((candidata) => candidata.tarjeta.contains(evento.target));
    if (entrada) actualizarTarjetaCombo(entrada);
  });
  rejillaCombos.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-agregar-combo]");
    if (boton) agregarComboDesdeTarjeta(boton);
  });

  opcionesCalculadora.addEventListener("change", actualizarBotonCamino);
  botonElegirCamino.addEventListener("click", () => {
    const clave = caminoMarcado();
    if (clave) elegirCamino(clave);
  });

  // Selector de grupo: clic o flechas (Inicio y Fin también); las flechas mueven el foco y eligen.
  selectorGrupo.addEventListener("click", (evento) => {
    const opcion = evento.target.closest("[role=radio]");
    if (opcion) elegirGrupo(opcion.dataset.grupo);
  });
  selectorGrupo.addEventListener("keydown", (evento) => {
    const actual = opcionesGrupo.indexOf(document.activeElement);
    if (actual < 0) return;
    const cantidad = opcionesGrupo.length;
    let siguiente;
    if (evento.key === "ArrowRight" || evento.key === "ArrowDown") siguiente = (actual + 1) % cantidad;
    else if (evento.key === "ArrowLeft" || evento.key === "ArrowUp") siguiente = (actual - 1 + cantidad) % cantidad;
    else if (evento.key === "Home") siguiente = 0;
    else if (evento.key === "End") siguiente = cantidad - 1;
    else return;
    evento.preventDefault();
    opcionesGrupo[siguiente].focus();
    elegirGrupo(opcionesGrupo[siguiente].dataset.grupo);
  });

  // Galería
  pistaGaleria.addEventListener("click", (evento) => {
    const diapositiva = evento.target.closest(".galeria__diapo");
    if (diapositiva) irATarjeta(diapositiva.dataset.id);
  });
  $("galeria-anterior").addEventListener("click", () => avanzarGaleria(-1));
  $("galeria-siguiente").addEventListener("click", () => avanzarGaleria(1));
  botonPausaGaleria.addEventListener("click", alternarPausaGaleria);
  // El cursor pausa solo sobre las imágenes y sus flechas, no sobre el botón de pausa/reproducir: así "reproducir"
  // arranca de verdad aunque el ratón siga encima del botón.
  const marcoGaleria = seccionGaleria.querySelector(".galeria__marco");
  marcoGaleria.addEventListener("pointerenter", (evento) => {
    if (evento.pointerType !== "touch") pausaGaleria.cursor = true;
  });
  marcoGaleria.addEventListener("pointerleave", () => { pausaGaleria.cursor = false; });
  ["pointerdown", "touchstart", "wheel"].forEach((tipo) => {
    seccionGaleria.addEventListener(tipo, tocarGaleria, { passive: true });
  });
  ["pointerup", "pointercancel", "touchend"].forEach((tipo) => {
    seccionGaleria.addEventListener(tipo, () => { pausaGaleria.toqueHasta = Date.now() + PAUSA_TRAS_TOQUE_MS; });
  });
  seccionGaleria.addEventListener("focusin", () => { pausaGaleria.foco = true; });
  seccionGaleria.addEventListener("focusout", (evento) => {
    if (!seccionGaleria.contains(evento.relatedTarget)) pausaGaleria.foco = false;
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entrada]) => { pausaGaleria.enPantalla = entrada.isIntersecting; }).observe(seccionGaleria);
  }
  consultaMovimiento.addEventListener("change", () => { programarAvanceGaleria(); dibujarBotonPausaGaleria(); actualizarProgreso(); });

  // Subrayado del menú y barra de lectura
  consultaPunteroFino.addEventListener("change", sincronizarSubrayadoMenu);
  window.addEventListener("scroll", pedirProgreso, { passive: true });
  window.addEventListener("resize", pedirProgreso);

  // Aviso de versión nueva: al volver a la pestaña (no solo por temporizador, para no esperar hasta 5 minutos
  // si el visitante recién regresa) y cada INTERVALO_VERSION_MS mientras la deja abierta.
  if (botonActualizarVersion) botonActualizarVersion.addEventListener("click", recargarConVersionNueva);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") comprobarVersionNueva();
  });
  window.setInterval(comprobarVersionNueva, INTERVALO_VERSION_MS);
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
  prepararCombos();
  aplicarOrigenAEnlaces();
  escribirCantidadSabores();
  dibujarGaleria(grupoActual);
  dibujarBotonPausaGaleria();
  actualizarMinimoFecha();
  dibujarLista();
  programarAvanceGaleria();
  sincronizarSubrayadoMenu();
  actualizarProgreso();
  arrancado = true;
}

if (typeof document !== "undefined") {
  iniciar();
  // Instalable y con respaldo sin conexión: el service worker prioriza la red, así los precios nunca quedan viejos.
  if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
}

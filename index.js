// El Delicioso: catálogo, carrito, pedido por WhatsApp y calculadora de invitados.
// JavaScript puro. Las funciones "puras" no tocan el DOM, así se pueden probar en Node.

const NEGOCIO = {
  nombre: "El Delicioso",
  whatsapp: "51980592747",
  anticipacionDias: 2
};

const TAMANOS = [25, 50, 100];
const BOCADITOS_POR_INVITADO = 6;
const MAX_INVITADOS = 1000;
const MAX_PACKS_POR_LINEA = 99;
const CLAVE_ALMACENAMIENTO = "el-delicioso-carrito";
const DURACION_REBOTE_MS = 300;
const DURACION_AGREGADO_MS = 1200;

const DIAS_SEMANA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
  "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

/* ===== Funciones puras: dinero ===== */

// Los precios se manejan en céntimos enteros para evitar errores de decimales.
function aCentimos(texto) {
  return Math.round(parseFloat(texto) * 100);
}

// 3550 -> "S/ 35,50"; los miles se separan con espacio duro: "S/ 1 250,00".
function formatearMoneda(centimos) {
  const entero = Math.floor(centimos / 100);
  const decimales = String(centimos % 100).padStart(2, "0");
  const miles = String(entero).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `S/ ${miles},${decimales}`;
}

function formatearPrecioUnidad(centimosTotal, unidades) {
  return `${formatearMoneda(Math.round(centimosTotal / unidades))} c/u`;
}

/* ===== Funciones puras: calculadora de invitados ===== */

// Devuelve { valido, invitados, mensaje }; acepta texto o número.
function validarInvitados(valor) {
  const texto = String(valor ?? "").trim();
  const mensajeBase = `Escribe un número entero de invitados, de 1 a ${MAX_INVITADOS}.`;
  if (!/^\d+$/.test(texto)) return { valido: false, mensaje: mensajeBase };
  const invitados = Number(texto);
  if (invitados < 1) return { valido: false, mensaje: mensajeBase };
  if (invitados > MAX_INVITADOS) {
    return {
      valido: false,
      mensaje: `Para más de ${MAX_INVITADOS} invitados, escríbenos por WhatsApp y armamos tu pedido a medida.`
    };
  }
  return { valido: true, invitados };
}

// Hasta 16 invitados: el menor tamaño que cubra. Más: combinación de 100, 50 y 25 con el menor excedente.
function calcularCombinacion(invitados) {
  const necesarias = invitados * BOCADITOS_POR_INVITADO;
  const paquetes = { 100: 0, 50: 0, 25: 0 };

  const tamanoUnico = TAMANOS.find((tamano) => necesarias <= tamano);
  if (tamanoUnico && invitados <= 16) {
    paquetes[tamanoUnico] = 1;
  } else {
    // Todos los tamaños son múltiplos de 25, así que el menor total posible es el siguiente múltiplo de 25.
    let restante = Math.ceil(necesarias / 25) * 25;
    for (const tamano of [100, 50, 25]) {
      paquetes[tamano] = Math.floor(restante / tamano);
      restante -= paquetes[tamano] * tamano;
    }
  }

  const total = 100 * paquetes[100] + 50 * paquetes[50] + 25 * paquetes[25];
  return { necesarias, paquetes, total };
}

function describirCombinacion({ paquetes, total }) {
  const partes = [100, 50, 25]
    .filter((tamano) => paquetes[tamano] > 0)
    .map((tamano) => {
      const cantidad = paquetes[tamano];
      return `${cantidad} ${cantidad === 1 ? "paquete" : "paquetes"} de ${tamano}`;
    });
  if (partes.length === 1 && partes[0].startsWith("1 ")) return `${partes[0]} unidades`;
  const unidas = partes.length > 1
    ? `${partes.slice(0, -1).join(", ")} y ${partes[partes.length - 1]}`
    : partes[0];
  return `${unidas} (${total} unidades en total)`;
}

function textoResultadoCalculadora(invitados) {
  const combinacion = calcularCombinacion(invitados);
  return `Para ${invitados} ${invitados === 1 ? "invitado" : "invitados"} necesitas unas ${combinacion.necesarias} unidades. ` +
    `Te sugerimos ${describirCombinacion(combinacion)}.`;
}

/* ===== Funciones puras: fechas ===== */

function aISO(anio, mes, dia) {
  return `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

// Fecha local (no UTC) del objeto Date, en formato AAAA-MM-DD.
function fechaISOLocal(fecha) {
  return aISO(fecha.getFullYear(), fecha.getMonth() + 1, fecha.getDate());
}

// Devuelve { anio, mes, dia } si el texto es una fecha real AAAA-MM-DD; si no, null.
function leerFechaISO(texto) {
  const coincidencia = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  if (!coincidencia) return null;
  const [anio, mes, dia] = coincidencia.slice(1).map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  const esReal = fecha.getUTCFullYear() === anio && fecha.getUTCMonth() === mes - 1 && fecha.getUTCDate() === dia;
  return esReal ? { anio, mes, dia } : null;
}

// Se calcula en UTC para que el cambio de hora no altere el resultado.
function sumarDias(iso, dias) {
  const { anio, mes, dia } = leerFechaISO(iso);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia + dias));
  return aISO(fecha.getUTCFullYear(), fecha.getUTCMonth() + 1, fecha.getUTCDate());
}

// "2026-09-23" -> "miércoles 23 de septiembre de 2026"
function formatearFechaLarga(iso) {
  const { anio, mes, dia } = leerFechaISO(iso);
  const diaSemana = DIAS_SEMANA[new Date(Date.UTC(anio, mes - 1, dia)).getUTCDay()];
  return `${diaSemana} ${dia} de ${MESES[mes - 1]} de ${anio}`;
}

function fechaMinimaEvento(hoy, dias = NEGOCIO.anticipacionDias) {
  return sumarDias(fechaISOLocal(hoy), dias);
}

// Devuelve { valida, minimo, mensaje }.
function validarFechaEvento(valor, hoy, dias = NEGOCIO.anticipacionDias) {
  const minimo = fechaMinimaEvento(hoy, dias);
  const texto = String(valor ?? "").trim();
  if (texto === "") {
    return { valida: false, minimo, mensaje: "Elige la fecha del evento para enviar tu pedido." };
  }
  if (!leerFechaISO(texto)) {
    return { valida: false, minimo, mensaje: "La fecha no es válida. Elígela desde el calendario." };
  }
  if (texto < minimo) {
    return {
      valida: false,
      minimo,
      mensaje: `Necesitamos ${dias} días de anticipación. Elige una fecha desde el ${formatearFechaLarga(minimo)}.`
    };
  }
  return { valida: true, minimo, mensaje: "" };
}

/* ===== Funciones puras: carrito ===== */

// Una línea del carrito es { id, tamano, packs }; el nombre y el precio salen del catálogo.
function claveLinea(linea) {
  return `${linea.id}|${linea.tamano}`;
}

function agregarLinea(lineas, id, tamano) {
  const existe = lineas.some((linea) => linea.id === id && linea.tamano === tamano);
  if (!existe) return [...lineas, { id, tamano, packs: 1 }];
  return lineas.map((linea) => (linea.id === id && linea.tamano === tamano
    ? { ...linea, packs: Math.min(linea.packs + 1, MAX_PACKS_POR_LINEA) }
    : linea));
}

function cambiarPacks(lineas, clave, cambio) {
  return lineas.map((linea) => (claveLinea(linea) === clave
    ? { ...linea, packs: Math.min(Math.max(linea.packs + cambio, 1), MAX_PACKS_POR_LINEA) }
    : linea));
}

function quitarLinea(lineas, clave) {
  return lineas.filter((linea) => claveLinea(linea) !== clave);
}

// Descarta datos guardados que ya no existan en el catálogo o estén dañados.
function normalizarLineas(crudo, catalogo) {
  if (!Array.isArray(crudo)) return [];
  const vistas = new Set();
  const limpias = [];
  for (const item of crudo) {
    if (!item || !catalogo.has(item.id) || !TAMANOS.includes(item.tamano)) continue;
    if (!Number.isInteger(item.packs) || item.packs < 1) continue;
    const linea = { id: item.id, tamano: item.tamano, packs: Math.min(item.packs, MAX_PACKS_POR_LINEA) };
    if (vistas.has(claveLinea(linea))) continue;
    vistas.add(claveLinea(linea));
    limpias.push(linea);
  }
  return limpias;
}

// Añade a cada línea nombre, unidades y subtotal; y calcula total y cantidad de packs.
function resumirCarrito(lineas, catalogo) {
  const items = lineas.map((linea) => {
    const producto = catalogo.get(linea.id);
    return {
      ...linea,
      clave: claveLinea(linea),
      nombre: producto.nombre,
      unidades: linea.tamano * linea.packs,
      subtotalCentimos: producto.precios[linea.tamano] * linea.packs
    };
  });
  return {
    items,
    totalCentimos: items.reduce((suma, item) => suma + item.subtotalCentimos, 0),
    cantidadPacks: items.reduce((suma, item) => suma + item.packs, 0)
  };
}

/* ===== Funciones puras: mensaje de WhatsApp ===== */

function describirUnidades(item) {
  return item.packs === 1
    ? `${item.unidades} unidades`
    : `${item.unidades} unidades (${item.packs} x ${item.tamano})`;
}

function construirMensajePedido({ items, totalCentimos }, fechaISO, negocio = NEGOCIO) {
  const lineas = items.map((item) =>
    `- ${item.nombre}: ${describirUnidades(item)} - ${formatearMoneda(item.subtotalCentimos)}`);
  return [
    `Hola, ${negocio.nombre}. Quisiera hacer este pedido:`,
    "",
    ...lineas,
    "",
    `Total: ${formatearMoneda(totalCentimos)}`,
    `Fecha del evento: ${formatearFechaLarga(fechaISO)}`,
    "",
    "¿Me confirman el costo del delivery y los datos de pago? Gracias."
  ].join("\n");
}

function construirEnlaceWhatsApp(mensaje, negocio = NEGOCIO) {
  return `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/* ===== Medición neutral ===== */

// Emite un evento del documento y, solo si ya existe window.dataLayer, lo empuja allí.
// No carga ninguna herramienta ni envía datos personales (nada de fechas ni textos del pedido).
function registrar(nombre, datos = {}) {
  try {
    if (typeof document !== "undefined" && typeof CustomEvent === "function") {
      document.dispatchEvent(new CustomEvent("eldelicioso:evento", { detail: { nombre, ...datos } }));
    }
    if (typeof window !== "undefined" && window.dataLayer && typeof window.dataLayer.push === "function") {
      window.dataLayer.push({ event: nombre, ...datos });
    }
  } catch (error) {
    // La medición nunca debe romper la página.
  }
}

// Céntimos enteros a soles (número), por ejemplo 3550 -> 35.5.
function aSoles(centimos) {
  return centimos / 100;
}

// Sugerencia de la calculadora en formato corto, por ejemplo "2x100+1x50".
function codificarSugerencia({ paquetes }) {
  return [100, 50, 25]
    .filter((tamano) => paquetes[tamano] > 0)
    .map((tamano) => `${paquetes[tamano]}x${tamano}`)
    .join("+");
}

// Ubicación del enlace de WhatsApp: el atributo data-ubicacion o, si falta, la sección que lo contiene.
function ubicacionWhatsApp(enlace) {
  if (enlace.dataset.ubicacion) return enlace.dataset.ubicacion;
  const seccion = enlace.closest("section[id], header[id], footer, aside[id]");
  return (seccion && seccion.id) || "otra";
}

function esEnlaceWhatsApp(enlace) {
  try {
    return new URL(enlace.href).hostname === "wa.me";
  } catch (error) {
    return false;
  }
}

/* ===== Interfaz (solo en el navegador) ===== */

function iniciar() {
  const $ = (id) => document.getElementById(id);
  const rejilla = $("rejilla-catalogo");
  const botonCarrito = $("boton-carrito");
  const contador = $("contador-carrito");
  const panel = $("carrito");
  const fondo = $("carrito-fondo");
  const botonCerrar = $("cerrar-carrito");
  const lista = $("carrito-lista");
  const textoVacio = $("carrito-vacio");
  const totalSalida = $("carrito-total");
  const formPedido = $("form-pedido");
  const campoFecha = $("fecha-evento");
  const errorFecha = $("error-fecha");
  const mensajePedido = $("mensaje-pedido");
  const plantilla = $("plantilla-item-carrito");
  const formCalculadora = $("form-calculadora");
  const campoInvitados = $("invitados");
  const resultadoCalculadora = $("resultado-calculadora");

  const catalogo = leerCatalogo(rejilla);
  let lineas = normalizarLineas(leerAlmacenamiento(), catalogo);
  let temporizadorRebote = 0;

  /* --- Catálogo --- */

  function leerCatalogo(contenedor) {
    const mapa = new Map();
    contenedor.querySelectorAll(".tarjeta").forEach((tarjeta) => {
      const precios = {};
      TAMANOS.forEach((tamano) => { precios[tamano] = aCentimos(tarjeta.getAttribute(`data-precio-${tamano}`)); });
      mapa.set(tarjeta.dataset.id, {
        nombre: tarjeta.querySelector(".tarjeta__nombre").textContent.trim(),
        precios
      });
    });
    return mapa;
  }

  function tamanoElegido(tarjeta) {
    return Number(tarjeta.querySelector("input[type=radio]:checked").value);
  }

  function actualizarPrecioTarjeta(tarjeta) {
    const tamano = tamanoElegido(tarjeta);
    const total = catalogo.get(tarjeta.dataset.id).precios[tamano];
    tarjeta.querySelector("[data-precio-total]").textContent = formatearMoneda(total);
    tarjeta.querySelector("[data-precio-unidad]").textContent = formatearPrecioUnidad(total, tamano);
  }

  function aplicarFiltro(categoria) {
    registrar("filtrar_catalogo", { filtro: categoria });
    document.querySelectorAll(".filtro").forEach((boton) => {
      boton.setAttribute("aria-pressed", String(boton.dataset.filtro === categoria));
    });
    rejilla.querySelectorAll(".tarjeta").forEach((tarjeta) => {
      tarjeta.hidden = categoria !== "todos" && tarjeta.dataset.categoria !== categoria;
    });
  }

  function marcarAgregado(boton) {
    if (!boton.dataset.textoOriginal) {
      boton.dataset.textoOriginal = boton.textContent;
      boton.dataset.etiquetaOriginal = boton.getAttribute("aria-label") || "";
    }
    const nombre = boton.closest(".tarjeta").querySelector(".tarjeta__nombre").textContent.trim();
    boton.textContent = "Agregado";
    boton.setAttribute("aria-label", `${nombre} agregado al carrito`);
    clearTimeout(Number(boton.dataset.temporizador));
    boton.dataset.temporizador = String(setTimeout(() => {
      boton.textContent = boton.dataset.textoOriginal;
      boton.setAttribute("aria-label", boton.dataset.etiquetaOriginal);
    }, DURACION_AGREGADO_MS));
  }

  function agregarDesdeTarjeta(boton) {
    const tarjeta = boton.closest(".tarjeta");
    const tamano = tamanoElegido(tarjeta);
    lineas = agregarLinea(lineas, tarjeta.dataset.id, tamano);
    registrar("agregar_al_carrito", {
      producto_id: tarjeta.dataset.id,
      tamano,
      valor: aSoles(catalogo.get(tarjeta.dataset.id).precios[tamano])
    });
    guardarLineas();
    dibujarCarrito();
    rebotarContador();
    marcarAgregado(boton);
  }

  /* --- Carrito: almacenamiento --- */

  function leerAlmacenamiento() {
    try {
      return JSON.parse(window.localStorage.getItem(CLAVE_ALMACENAMIENTO));
    } catch (error) {
      return []; // Sin almacenamiento el carrito sigue funcionando en memoria.
    }
  }

  function guardarLineas() {
    try {
      window.localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(lineas));
    } catch (error) {
      // Almacenamiento bloqueado o lleno: se ignora.
    }
  }

  /* --- Carrito: dibujo --- */

  function rebotarContador() {
    contador.classList.remove("rebote");
    void contador.offsetWidth; // Reinicia la animación si se agrega varias veces seguidas.
    contador.classList.add("rebote");
    clearTimeout(temporizadorRebote);
    temporizadorRebote = setTimeout(() => contador.classList.remove("rebote"), DURACION_REBOTE_MS);
  }

  function crearFila(item) {
    const fila = plantilla.content.firstElementChild.cloneNode(true);
    const detalle = item.packs === 1
      ? `${item.unidades} unidades`
      : `${item.packs} x ${item.tamano} = ${item.unidades} unidades`;
    const descripcion = `${item.nombre}, ${item.tamano} unidades`;

    fila.dataset.clave = item.clave;
    fila.querySelector(".carrito__item-nombre").textContent = item.nombre;
    fila.querySelector(".carrito__item-detalle").textContent = detalle;
    fila.querySelector(".carrito__item-precio").textContent = formatearMoneda(item.subtotalCentimos);
    fila.querySelector(".carrito__packs").setAttribute("aria-label", `Paquetes de ${descripcion}`);
    fila.querySelector(".carrito__packs-numero").textContent = item.packs;

    const menos = fila.querySelector("[data-disminuir]");
    menos.setAttribute("aria-label", `Disminuir un paquete de ${descripcion}`);
    menos.disabled = item.packs <= 1;
    const mas = fila.querySelector("[data-aumentar]");
    mas.setAttribute("aria-label", `Aumentar un paquete de ${descripcion}`);
    mas.disabled = item.packs >= MAX_PACKS_POR_LINEA;
    fila.querySelector("[data-quitar]").setAttribute("aria-label", `Quitar ${descripcion}`);
    return fila;
  }

  function dibujarCarrito() {
    const resumen = resumirCarrito(lineas, catalogo);
    lista.replaceChildren(...resumen.items.map(crearFila));
    textoVacio.hidden = resumen.items.length > 0;
    totalSalida.textContent = formatearMoneda(resumen.totalCentimos);
    contador.textContent = resumen.cantidadPacks;
    ocultarMensajePedido();
  }

  // Tras redibujar la lista se pierde el foco; este método lo devuelve al botón que se usó.
  function restaurarFoco(clave, accion) {
    const fila = lista.querySelector(`[data-clave="${CSS.escape(clave)}"]`);
    if (!fila) {
      const primera = lista.querySelector("button:not([disabled])");
      (primera || botonCerrar).focus();
      return;
    }
    const boton = fila.querySelector(`[${accion}]:not([disabled])`) || fila.querySelector("[data-aumentar]:not([disabled])");
    (boton || fila.querySelector("[data-quitar]")).focus();
  }

  function manejarAccionFila(boton) {
    const clave = boton.closest(".carrito__item").dataset.clave;
    if (boton.hasAttribute("data-quitar")) lineas = quitarLinea(lineas, clave);
    else if (boton.hasAttribute("data-aumentar")) lineas = cambiarPacks(lineas, clave, 1);
    else lineas = cambiarPacks(lineas, clave, -1);
    guardarLineas();
    dibujarCarrito();
    const accion = ["data-quitar", "data-aumentar", "data-disminuir"].find((nombre) => boton.hasAttribute(nombre));
    restaurarFoco(clave, accion);
  }

  /* --- Carrito: panel --- */

  function carritoAbierto() {
    return panel.classList.contains("abierto");
  }

  function abrirCarrito() {
    const resumen = resumirCarrito(lineas, catalogo);
    registrar("abrir_carrito", { articulos: resumen.cantidadPacks, valor: aSoles(resumen.totalCentimos) });
    actualizarMinimoFecha();
    panel.classList.add("abierto");
    fondo.classList.add("abierto");
    botonCarrito.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("sin-scroll");
    botonCerrar.focus();
  }

  function cerrarCarrito() {
    panel.classList.remove("abierto");
    fondo.classList.remove("abierto");
    botonCarrito.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("sin-scroll");
    botonCarrito.focus();
  }

  // Mantiene el tabulador dentro del panel mientras está abierto.
  function atraparTabulador(evento) {
    const enfocables = [...panel.querySelectorAll("button:not([disabled]), input, a[href]")]
      .filter((elemento) => !elemento.hidden && elemento.offsetParent !== null);
    if (enfocables.length === 0) return;
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
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
    const resumen = resumirCarrito(lineas, catalogo);
    const fecha = validarFechaEvento(campoFecha.value, new Date());

    if (fecha.valida) ocultarErrorFecha();
    else mostrarErrorFecha(fecha.mensaje);

    if (resumen.items.length === 0) {
      mostrarMensajePedido("Tu carrito está vacío. Agrega al menos un producto para enviar el pedido.", true);
      return;
    }
    if (!fecha.valida) {
      campoFecha.focus();
      return;
    }

    const mensaje = construirMensajePedido(resumen, campoFecha.value);
    registrar("enviar_pedido", {
      valor_total: aSoles(resumen.totalCentimos),
      lineas: resumen.items.length,
      unidades: resumen.items.reduce((suma, item) => suma + item.unidades, 0)
    });
    const seAbrioEnPestana = abrirWhatsApp(construirEnlaceWhatsApp(mensaje));
    if (seAbrioEnPestana) {
      mostrarMensajePedido("Abrimos WhatsApp con tu pedido. Tu carrito sigue guardado por si quieres cambiar algo.", false);
    }
  }

  /* --- Calculadora --- */

  function calcularInvitados(evento) {
    evento.preventDefault();
    const validacion = validarInvitados(campoInvitados.value);
    resultadoCalculadora.classList.toggle("calculadora__resultado--error", !validacion.valido);
    if (!validacion.valido) {
      campoInvitados.setAttribute("aria-invalid", "true");
      resultadoCalculadora.textContent = validacion.mensaje;
      return;
    }
    campoInvitados.removeAttribute("aria-invalid");
    resultadoCalculadora.textContent = textoResultadoCalculadora(validacion.invitados);
    registrar("usar_calculadora", {
      invitados: validacion.invitados,
      sugerencia: codificarSugerencia(calcularCombinacion(validacion.invitados))
    });
  }

  /* --- Eventos --- */

  document.querySelectorAll(".filtro").forEach((boton) => {
    boton.addEventListener("click", () => aplicarFiltro(boton.dataset.filtro));
  });

  rejilla.addEventListener("change", (evento) => {
    if (evento.target.matches("input[type=radio]")) actualizarPrecioTarjeta(evento.target.closest(".tarjeta"));
  });

  rejilla.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-agregar]");
    if (boton) agregarDesdeTarjeta(boton);
  });

  lista.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button");
    if (boton) manejarAccionFila(boton);
  });

  document.addEventListener("click", (evento) => {
    const enlace = evento.target.closest("a[href]");
    if (enlace && esEnlaceWhatsApp(enlace)) registrar("clic_whatsapp", { ubicacion: ubicacionWhatsApp(enlace) });
  });

  botonCarrito.addEventListener("click", () => (carritoAbierto() ? cerrarCarrito() : abrirCarrito()));
  botonCerrar.addEventListener("click", cerrarCarrito);
  fondo.addEventListener("click", cerrarCarrito);

  document.addEventListener("keydown", (evento) => {
    if (!carritoAbierto()) return;
    if (evento.key === "Escape") cerrarCarrito();
    else if (evento.key === "Tab") atraparTabulador(evento);
  });

  campoFecha.addEventListener("input", ocultarErrorFecha);
  formPedido.addEventListener("submit", enviarPedido);
  formCalculadora.addEventListener("submit", calcularInvitados);
  campoInvitados.addEventListener("input", () => campoInvitados.removeAttribute("aria-invalid"));

  /* --- Arranque --- */

  rejilla.querySelectorAll(".tarjeta").forEach(actualizarPrecioTarjeta);
  actualizarMinimoFecha();
  dibujarCarrito();
}

if (typeof document !== "undefined") iniciar();

// Permite probar las funciones puras desde Node.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    NEGOCIO, formatearMoneda, formatearPrecioUnidad, validarInvitados, calcularCombinacion,
    describirCombinacion, textoResultadoCalculadora, validarFechaEvento, fechaMinimaEvento,
    formatearFechaLarga, agregarLinea, cambiarPacks, quitarLinea, normalizarLineas,
    resumirCarrito, construirMensajePedido, construirEnlaceWhatsApp, aCentimos,
    registrar, aSoles, codificarSugerencia
  };
}

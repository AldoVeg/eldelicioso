// El Delicioso: catálogo, planificador de invitados, lista de compras, carrito y pedido por WhatsApp.
// JavaScript puro. Las funciones "puras" no tocan el DOM, así se pueden probar en Node.

const NEGOCIO = {
  nombre: "El Delicioso",
  whatsapp: "51980592747",
  anticipacionDias: 2
};

const TAMANOS = [25, 50, 100];
// Valor por defecto del dato "bocaditos por invitado"; el visitante puede cambiarlo (de 1 a 30).
const BOCADITOS_POR_INVITADO_DEFECTO = 6;
const MIN_BOCADITOS_POR_INVITADO = 1;
const MAX_BOCADITOS_POR_INVITADO = 30;
const MAX_INVITADOS = 1000;
// Tope de unidades totales que se arman en línea; más allá se atiende por WhatsApp.
const MAX_UNIDADES = 10000;
// Máximo de líneas de producto que muestra cada categoría en la sugerencia.
const MAX_LINEAS_SUGERENCIA = 6;
const MAX_PACKS_POR_LINEA = 99;
const CLAVE_ALMACENAMIENTO = "el-delicioso-carrito";
const CLAVE_PLAN = "el-delicioso-plan";
// Desde este excedente por categoría la lista avisa que te pasas de la meta.
const UMBRAL_EXCEDIDO = 25;
// Productos que cambiaron de id al ampliar el catálogo (carritos guardados antes del cambio).
const ALIAS_IDS = { "trufas-chocolate": "mini-trufas-chocolate" };
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

// 10000 -> "10 000" (con espacio duro entre miles, igual que el dinero).
function formatearEntero(numero) {
  return String(numero).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// 7.5 -> "7,5"; 3.75 -> "3,75"; 6 -> "6" (máximo 2 decimales, coma decimal).
function formatearNumero(numero) {
  return String(Math.round(numero * 100) / 100).replace(".", ",");
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

// Devuelve { valido, porInvitado, mensaje }; vacío o ausente = valor por defecto (6).
function validarBocaditosPorInvitado(valor) {
  const texto = String(valor ?? "").trim();
  if (texto === "") return { valido: true, porInvitado: BOCADITOS_POR_INVITADO_DEFECTO };
  const mensaje = `Escribe un número entero de bocaditos por invitado, de ${MIN_BOCADITOS_POR_INVITADO} a ${MAX_BOCADITOS_POR_INVITADO}.`;
  if (!/^\d+$/.test(texto)) return { valido: false, mensaje };
  const porInvitado = Number(texto);
  if (porInvitado < MIN_BOCADITOS_POR_INVITADO || porInvitado > MAX_BOCADITOS_POR_INVITADO) {
    return { valido: false, mensaje };
  }
  return { valido: true, porInvitado };
}

// Valida los dos datos juntos y el tope de unidades.
// Devuelve { valido, invitados, porInvitado, campos, mensaje }; "campos" son los datos con problema.
function validarEntradaCalculadora(invitados, porInvitado) {
  const validacionInvitados = validarInvitados(invitados);
  if (!validacionInvitados.valido) {
    return { valido: false, campos: ["invitados"], mensaje: validacionInvitados.mensaje };
  }
  const validacionBocaditos = validarBocaditosPorInvitado(porInvitado);
  if (!validacionBocaditos.valido) {
    return { valido: false, campos: ["porInvitado"], mensaje: validacionBocaditos.mensaje };
  }
  if (validacionInvitados.invitados * validacionBocaditos.porInvitado > MAX_UNIDADES) {
    return {
      valido: false,
      campos: ["invitados", "porInvitado"],
      mensaje: `Para más de ${formatearEntero(MAX_UNIDADES)} unidades, escríbenos por WhatsApp y armamos tu pedido a medida.`
    };
  }
  return {
    valido: true,
    invitados: validacionInvitados.invitados,
    porInvitado: validacionBocaditos.porInvitado,
    campos: []
  };
}

// "1 bocadito" / "8 bocaditos"
function textoBocaditos(cantidad) {
  return `${cantidad} ${cantidad === 1 ? "bocadito" : "bocaditos"}`;
}

function totalPaquetes(paquetes) {
  return 100 * paquetes[100] + 50 * paquetes[50] + 25 * paquetes[25];
}

// Combinación de 100, 50 y 25 con el menor excedente para cubrir "necesarias" unidades.
function combinarPaquetes(necesarias) {
  const paquetes = { 100: 0, 50: 0, 25: 0 };
  // Todos los tamaños son múltiplos de 25, así que el menor total posible es el siguiente múltiplo de 25.
  let restante = Math.ceil(necesarias / 25) * 25;
  for (const tamano of [100, 50, 25]) {
    paquetes[tamano] = Math.floor(restante / tamano);
    restante -= paquetes[tamano] * tamano;
  }
  return { necesarias, paquetes, total: totalPaquetes(paquetes) };
}

// Si las unidades necesarias caben en un paquete (hasta 100): el menor tamaño que las cubra.
// Más: combinación de menor excedente.
function calcularCombinacion(invitados, porInvitado = BOCADITOS_POR_INVITADO_DEFECTO) {
  const necesarias = invitados * porInvitado;
  const tamanoUnico = TAMANOS.find((tamano) => necesarias <= tamano);
  if (tamanoUnico) {
    const paquetes = { 100: 0, 50: 0, 25: 0, [tamanoUnico]: 1 };
    return { necesarias, paquetes, total: totalPaquetes(paquetes) };
  }
  return combinarPaquetes(necesarias);
}

// ["a", "b", "c"] -> "a, b y c"
function unirLista(partes) {
  return partes.length > 1
    ? `${partes.slice(0, -1).join(", ")} y ${partes[partes.length - 1]}`
    : (partes[0] || "");
}

// { 100: 1, 50: 0, 25: 1 } -> "1 paquete de 100 y 1 paquete de 25"
function listarPaquetes(paquetes) {
  return unirLista([100, 50, 25]
    .filter((tamano) => paquetes[tamano] > 0)
    .map((tamano) => `${paquetes[tamano]} ${paquetes[tamano] === 1 ? "paquete" : "paquetes"} de ${tamano}`));
}

function describirCombinacion({ paquetes, total }) {
  const lista = listarPaquetes(paquetes);
  const tamanosUsados = TAMANOS.filter((tamano) => paquetes[tamano] > 0);
  // Un solo paquete: "1 paquete de 100 unidades" (sin repetir el total).
  if (tamanosUsados.length === 1 && paquetes[tamanosUsados[0]] === 1) return `${lista} unidades`;
  return `${lista} (${total} unidades en total)`;
}

function textoResultadoCalculadora(invitados, porInvitado = BOCADITOS_POR_INVITADO_DEFECTO) {
  const combinacion = calcularCombinacion(invitados, porInvitado);
  return `Para ${invitados} ${invitados === 1 ? "invitado" : "invitados"} necesitas unas ${combinacion.necesarias} unidades. ` +
    `Te sugerimos ${describirCombinacion(combinacion)}.`;
}

/* ===== Funciones puras: tres formas de armar el pedido ===== */

const CATEGORIAS = [
  { clave: "dulce", etiqueta: "Dulces", singular: "dulce", unidad: "dulces" },
  { clave: "salado", etiqueta: "Salados", singular: "salado", unidad: "salados" }
];

// Los tres caminos que ofrece el planificador; "filtro" es el filtro del catálogo que activan.
const CAMINOS = {
  mixto: {
    clave: "mixto",
    nombre: "Mixto",
    titulo: "Mixto (dulces y salados)",
    descripcion: "Mitad dulces, mitad salados: variedad para todos los gustos.",
    boton: "Elegir mixto",
    ayuda: "Debajo verás todos los productos",
    filtro: "todos",
    texto: "mixto"
  },
  dulces: {
    clave: "dulces",
    nombre: "Solo dulces",
    titulo: "Solo dulces",
    descripcion: "Toda la mesa para los golosos: solo opciones dulces.",
    boton: "Elegir dulces",
    ayuda: "Debajo verás las opciones dulces",
    filtro: "dulce",
    texto: "solo dulces"
  },
  salados: {
    clave: "salados",
    nombre: "Solo salados",
    titulo: "Solo salados",
    descripcion: "Una mesa salada, para picar sin parar.",
    boton: "Elegir salados",
    ayuda: "Debajo verás las opciones saladas",
    filtro: "salado",
    texto: "solo salados"
  }
};

function esCaminoValido(clave) {
  return typeof clave === "string" && Object.prototype.hasOwnProperty.call(CAMINOS, clave);
}

// El catálogo es un Map id -> { nombre, categoria, precios: { 25, 50, 100 } en céntimos }.
function productosDeCategoria(catalogo, categoria) {
  return [...catalogo.values()].filter((producto) => producto.categoria === categoria);
}

// Sugerencia concreta de una categoría: reparte los paquetes (de mayor a menor tamaño) entre productos
// DISTINTOS, recorriéndolos en el orden del catálogo y dando la vuelta si hay más paquetes que productos.
// Un mismo producto con el mismo tamaño se agrupa sumando unidades. El total sale de los precios reales.
// Devuelve { lineas: [{ nombre, tamano, unidades }], total } (total en céntimos; null sin productos).
function sugerirProductos(paquetes, productos) {
  if (productos.length === 0) return { lineas: [], total: null };
  const grupos = new Map();
  let total = 0;
  let turno = 0;
  for (const tamano of [100, 50, 25]) {
    for (let i = 0; i < paquetes[tamano]; i++) {
      const posicion = turno % productos.length;
      turno += 1;
      const producto = productos[posicion];
      total += producto.precios[tamano];
      const clave = `${posicion}|${tamano}`;
      const grupo = grupos.get(clave) || { nombre: producto.nombre, tamano, unidades: 0 };
      grupo.unidades += tamano;
      grupos.set(clave, grupo);
    }
  }
  return { lineas: [...grupos.values()], total };
}

// Líneas de texto de una sugerencia: hasta MAX_LINEAS_SUGERENCIA y, si sobran, "y n sabores más".
// Devuelve [{ texto, extra }]; "extra" marca la línea final de resumen.
function describirSugerencia({ lineas }, maximo = MAX_LINEAS_SUGERENCIA) {
  const visibles = lineas.slice(0, maximo);
  const ocultas = lineas.slice(maximo);
  const resultado = visibles.map((linea) => ({ texto: `${linea.unidades} unid. ${linea.nombre}`, extra: false }));
  if (ocultas.length > 0) {
    const vistos = new Set(visibles.map((linea) => linea.nombre));
    const sabores = new Set(ocultas.map((linea) => linea.nombre).filter((nombre) => !vistos.has(nombre)));
    // Si lo oculto son otros tamaños de sabores ya mostrados, se cuentan como paquetes.
    resultado.push({
      texto: sabores.size > 0 ? `y ${sabores.size} sabores más` : `y ${ocultas.length} paquetes más`,
      extra: true
    });
  }
  return resultado;
}

const SIN_PAQUETES = { necesarias: 0, paquetes: { 100: 0, 50: 0, 25: 0 }, total: 0 };

// Una opción reparte las unidades entre dulces y salados; cada parte es { necesarias, paquetes, total }.
// "sugerencias" trae la sugerencia de productos por categoría (null si esa categoría no lleva nada) y
// "precio" el total exacto en céntimos (null si alguna categoría no tiene productos en el catálogo).
function armarOpcion(clave, titulo, partes, invitados, catalogo) {
  const sugerencias = { dulce: null, salado: null };
  let precio = 0;
  for (const categoria of CATEGORIAS) {
    const parte = partes[categoria.clave];
    if (parte.total === 0) continue;
    const sugerencia = sugerirProductos(parte.paquetes, productosDeCategoria(catalogo, categoria.clave));
    sugerencias[categoria.clave] = sugerencia;
    precio = precio !== null && sugerencia.total !== null ? precio + sugerencia.total : null;
  }
  const unidades = partes.dulce.total + partes.salado.total;
  return {
    clave,
    titulo,
    dulce: partes.dulce,
    salado: partes.salado,
    unidades,
    porInvitado: unidades / invitados,
    sugerencias,
    precio
  };
}

// Mixto: mitad dulces y mitad salados (la mitad se redondea hacia arriba), cada una con menor excedente.
// Solo dulces o solo salados: la misma combinación que sugiere la frase principal.
function calcularOpciones(invitados, catalogo, porInvitado = BOCADITOS_POR_INVITADO_DEFECTO) {
  const necesarias = invitados * porInvitado;
  const mitad = Math.ceil(necesarias / 2);
  const completa = calcularCombinacion(invitados, porInvitado);
  return [
    armarOpcion("mixto", CAMINOS.mixto.titulo,
      { dulce: combinarPaquetes(mitad), salado: combinarPaquetes(mitad) }, invitados, catalogo),
    armarOpcion("dulces", CAMINOS.dulces.titulo, { dulce: completa, salado: SIN_PAQUETES }, invitados, catalogo),
    armarOpcion("salados", CAMINOS.salados.titulo, { dulce: SIN_PAQUETES, salado: completa }, invitados, catalogo)
  ];
}

// Texto de una categoría dentro de una opción, por ejemplo "75 unidades: 1 paquete de 50 y 1 paquete de 25".
function describirParte(parte) {
  if (parte.total === 0) return "0 unidades";
  return `${parte.total} unidades (${listarPaquetes(parte.paquetes)})`;
}

// Modelo de texto de todo el resultado; la interfaz solo lo dibuja.
// Cada opción trae "grupos": [{ etiqueta, lineas: [{ texto, extra }] }]; la etiqueta (Dulces/Salados)
// solo aparece en el mixto, donde hay dos grupos.
function describirResultado(invitados, catalogo, porInvitado = BOCADITOS_POR_INVITADO_DEFECTO) {
  const opciones = calcularOpciones(invitados, catalogo, porInvitado).map((opcion) => ({
    clave: opcion.clave,
    titulo: opcion.titulo,
    boton: CAMINOS[opcion.clave].boton,
    unidades: `${opcion.unidades} unidades`,
    reparto: opcion.clave === "mixto" ? `${opcion.dulce.total} dulces + ${opcion.salado.total} salados` : "",
    grupos: CATEGORIAS
      .filter((categoria) => opcion.sugerencias[categoria.clave])
      .map((categoria) => ({
        etiqueta: opcion.clave === "mixto" ? categoria.etiqueta : "",
        lineas: describirSugerencia(opcion.sugerencias[categoria.clave])
      })),
    precio: opcion.precio === null ? "" : `Total sugerido: ${formatearMoneda(opcion.precio)}`
  }));
  return {
    frase: textoResultadoCalculadora(invitados, porInvitado),
    regla: `Cada invitado recibe ${textoBocaditos(porInvitado)}.`,
    tituloCaminos: "Elige tu camino",
    opciones
  };
}

/* ===== Funciones puras: plan (invitados y camino) y avance de la lista ===== */

// Datos guardados del plan -> { invitados, porInvitado, camino }; descarta lo dañado o inexistente.
// Los planes viejos sin "porInvitado" (o con un valor dañado) se leen con el valor por defecto (6).
function normalizarPlan(crudo) {
  const vacio = { invitados: null, porInvitado: BOCADITOS_POR_INVITADO_DEFECTO, camino: null };
  if (!crudo || typeof crudo !== "object") return vacio;
  const porInvitadoGuardado = validarBocaditosPorInvitado(crudo.porInvitado);
  const porInvitado = porInvitadoGuardado.valido ? porInvitadoGuardado.porInvitado : BOCADITOS_POR_INVITADO_DEFECTO;
  const validacion = validarEntradaCalculadora(crudo.invitados, porInvitado);
  if (!validacion.valido) return vacio;
  return {
    invitados: validacion.invitados,
    porInvitado: validacion.porInvitado,
    camino: esCaminoValido(crudo.camino) ? crudo.camino : null
  };
}

// Bocaditos por invitado de un plan; sin el dato (planes incompletos) vale el valor por defecto.
function porInvitadoDe(plan) {
  return plan && Number.isInteger(plan.porInvitado) ? plan.porInvitado : BOCADITOS_POR_INVITADO_DEFECTO;
}

function textoInvitados(invitados) {
  return `${invitados} ${invitados === 1 ? "invitado" : "invitados"}`;
}

// Meta de unidades por categoría; null si el camino no incluye esa categoría.
// Mixto: mitad dulces y mitad salados (cada una se redondea hacia arriba).
function calcularMetas(invitados, camino, porInvitado = BOCADITOS_POR_INVITADO_DEFECTO) {
  const total = invitados * porInvitado;
  if (camino === "mixto") {
    const mitad = Math.ceil(total / 2);
    return { dulce: mitad, salado: mitad };
  }
  if (camino === "dulces") return { dulce: total, salado: null };
  if (camino === "salados") return { dulce: null, salado: total };
  return { dulce: null, salado: null };
}

// Por categoría: llevas < meta = incompleto; sobra menos de 25 = completo; sobran 25 o más = excedido.
function evaluarAvance(llevas, meta) {
  if (llevas < meta) return { estado: "incompleto", faltan: meta - llevas, sobran: 0 };
  const sobran = llevas - meta;
  return { estado: sobran >= UMBRAL_EXCEDIDO ? "excedido" : "completo", faltan: 0, sobran };
}

// "Camino: Mixto · 20 invitados · 6 bocaditos por invitado · meta: 60 dulces y 60 salados"
function textoContextoCamino(plan) {
  if (!plan || !plan.camino || !plan.invitados) return "";
  const porInvitado = porInvitadoDe(plan);
  const metas = calcularMetas(plan.invitados, plan.camino, porInvitado);
  const partes = CATEGORIAS
    .filter((categoria) => metas[categoria.clave] !== null)
    .map((categoria) => `${metas[categoria.clave]} ${categoria.unidad}`);
  return `Camino: ${CAMINOS[plan.camino].nombre} · ${textoInvitados(plan.invitados)} · ` +
    `${textoBocaditos(porInvitado)} por invitado · meta: ${partes.join(" y ")}`;
}

// "Evento: 20 invitados, 6 bocaditos por invitado, camino solo dulces" (línea del mensaje de WhatsApp);
// vacío sin camino.
function textoEventoPedido(plan) {
  if (!plan || !plan.camino || !plan.invitados) return "";
  return `Evento: ${textoInvitados(plan.invitados)}, ${textoBocaditos(porInvitadoDe(plan))} por invitado, ` +
    `camino ${CAMINOS[plan.camino].texto}`;
}

// Texto del párrafo de estado de la lista. "categorias" son las de describirLista (vacío si no hay camino).
function describirEstadoLista(hayLineas, categorias) {
  if (!hayLineas) {
    return { tipo: "vacio", texto: "Aún no eliges nada. Pulsa «Agregar» y empieza tu lista." };
  }
  if (categorias.length === 0) return { tipo: "libre", texto: "" };

  const incompletas = categorias.filter((categoria) => categoria.estado === "incompleto");
  if (incompletas.length === 1) {
    const { faltan, singular, unidad } = incompletas[0];
    return {
      tipo: "incompleto",
      texto: faltan === 1 ? `Te falta 1 ${singular}.` : `Te faltan ${faltan} ${unidad}.`
    };
  }
  if (incompletas.length > 1) {
    const faltan = incompletas.reduce((suma, categoria) => suma + categoria.faltan, 0);
    return { tipo: "incompleto", texto: `Te faltan ${faltan} unidades.` };
  }

  const sobran = categorias.filter((categoria) => categoria.estado === "excedido")
    .reduce((suma, categoria) => suma + categoria.sobran, 0);
  if (sobran > 0) {
    return { tipo: "excedido", texto: `Te pasas por ${sobran} unidades: habrá para repetir.` };
  }
  const meta = categorias.reduce((suma, categoria) => suma + categoria.meta, 0);
  return { tipo: "completo", texto: `¡Listo! Cubres las ${meta} unidades.` };
}

// Todo lo que muestra la lista de compras, a partir de las líneas del carrito (resumirCarrito) y el plan.
function describirLista({ items }, plan) {
  const llevado = { dulce: 0, salado: 0 };
  items.forEach((item) => { llevado[item.categoria] += item.unidades; });
  const unidadesTotales = items.reduce((suma, item) => suma + item.unidades, 0);
  const hayPlan = Boolean(plan && plan.camino && plan.invitados);
  const metas = hayPlan
    ? calcularMetas(plan.invitados, plan.camino, porInvitadoDe(plan))
    : { dulce: null, salado: null };

  const categorias = CATEGORIAS
    .filter((categoria) => metas[categoria.clave] !== null)
    .map((categoria) => {
      const meta = metas[categoria.clave];
      const llevas = llevado[categoria.clave];
      return {
        ...categoria,
        meta,
        llevas,
        ...evaluarAvance(llevas, meta),
        porcentaje: Math.min(100, Math.round((llevas / meta) * 100)),
        texto: `${categoria.etiqueta}: llevas ${llevas} de ${meta}`
      };
    });

  const porInvitado = plan && plan.invitados && unidadesTotales > 0 ? unidadesTotales / plan.invitados : null;
  return {
    hayLineas: items.length > 0,
    unidadesTotales,
    llevado,
    textoCamino: hayPlan
      ? `Para ${textoInvitados(plan.invitados)} necesitas unas ${plan.invitados * porInvitadoDe(plan)} unidades.`
      : "",
    categorias,
    estado: describirEstadoLista(items.length > 0, categorias),
    textoBocaditos: unidadesTotales > 0
      ? `${unidadesTotales} ${unidadesTotales === 1 ? "bocadito" : "bocaditos"} en tu lista.`
      : "",
    textoPorInvitado: porInvitado === null
      ? ""
      : (porInvitado === 1 ? "Es 1 bocadito por invitado." : `Son ${formatearNumero(porInvitado)} bocaditos por invitado.`)
  };
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
    if (!item) continue;
    const id = ALIAS_IDS[item.id] || item.id;
    if (!catalogo.has(id) || !TAMANOS.includes(item.tamano)) continue;
    if (!Number.isInteger(item.packs) || item.packs < 1) continue;
    const linea = { id, tamano: item.tamano, packs: Math.min(item.packs, MAX_PACKS_POR_LINEA) };
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
      categoria: producto.categoria,
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

function construirMensajePedido({ items, totalCentimos }, fechaISO, negocio = NEGOCIO, plan = null) {
  const lineas = items.map((item) =>
    `- ${item.nombre}: ${describirUnidades(item)} - ${formatearMoneda(item.subtotalCentimos)}`);
  const evento = textoEventoPedido(plan);
  return [
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
  const raiz = document.documentElement;
  const rejilla = $("rejilla-catalogo");
  const seccionCatalogo = $("catalogo");
  const tituloCatalogo = $("titulo-catalogo");
  const contextoCamino = $("catalogo-contexto");
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
  const campoBocaditos = $("bocaditos-por-invitado");
  const resultadoCalculadora = $("resultado-calculadora");

  // Lista de compras (resumen vivo del carrito)
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
  const listaContinuar = $("lista-continuar");
  const listaSeguir = $("lista-seguir");
  const plantillaLista = $("plantilla-item-lista");
  const saltarLista = $("saltar-lista");

  const catalogo = leerCatalogo(rejilla);
  let lineas = normalizarLineas(leerAlmacenamiento(CLAVE_ALMACENAMIENTO), catalogo);
  let plan = normalizarPlan(leerAlmacenamiento(CLAVE_PLAN));
  let temporizadorRebote = 0;

  // En pantalla ancha la lista nace abierta (columna fija); en las demás, colapsada (pestaña o barra).
  const consultaAncha = window.matchMedia("(min-width: 75em)");
  const consultaMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");
  let listaAbierta = consultaAncha.matches;

  /* --- Catálogo --- */

  function leerCatalogo(contenedor) {
    const mapa = new Map();
    contenedor.querySelectorAll(".tarjeta").forEach((tarjeta) => {
      const precios = {};
      TAMANOS.forEach((tamano) => { precios[tamano] = aCentimos(tarjeta.getAttribute(`data-precio-${tamano}`)); });
      mapa.set(tarjeta.dataset.id, {
        nombre: tarjeta.querySelector(".tarjeta__nombre").textContent.trim(),
        categoria: tarjeta.dataset.categoria,
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
  }

  // "medir" es falso cuando el filtro se sincroniza solo (al elegir un camino o al restaurar el plan).
  function aplicarFiltro(categoria, medir = true) {
    if (medir) registrar("filtrar_catalogo", { filtro: categoria });
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
    dibujarTodo(claveLinea({ id: tarjeta.dataset.id, tamano }));
    rebotarContador();
    marcarAgregado(boton);
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

  function guardarPlan() {
    escribirAlmacenamiento(CLAVE_PLAN, plan);
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
    configurarControles(fila, item, descripcion);
    return fila;
  }

  // Los botones −, + y quitar son iguales en el carrito y en la lista de compras.
  function configurarControles(fila, item, descripcion) {
    const menos = fila.querySelector("[data-disminuir]");
    menos.setAttribute("aria-label", `Disminuir un paquete de ${descripcion}`);
    menos.disabled = item.packs <= 1;
    const mas = fila.querySelector("[data-aumentar]");
    mas.setAttribute("aria-label", `Aumentar un paquete de ${descripcion}`);
    mas.disabled = item.packs >= MAX_PACKS_POR_LINEA;
    fila.querySelector("[data-quitar]").setAttribute("aria-label", `Quitar ${descripcion}`);
  }

  function dibujarCarrito() {
    const resumen = resumirCarrito(lineas, catalogo);
    lista.replaceChildren(...resumen.items.map(crearFila));
    textoVacio.hidden = resumen.items.length > 0;
    totalSalida.textContent = formatearMoneda(resumen.totalCentimos);
    contador.textContent = resumen.cantidadPacks;
    ocultarMensajePedido();
  }

  // El carrito y la lista se dibujan siempre juntos, desde las mismas líneas.
  function dibujarTodo(claveNueva) {
    dibujarCarrito();
    dibujarLista(claveNueva);
  }

  // Tras redibujar se pierde el foco; este método lo devuelve al botón que se usó.
  function restaurarFoco(contenedor, clave, accion, alternativa) {
    const fila = contenedor.querySelector(`[data-clave="${CSS.escape(clave)}"]`);
    if (!fila) {
      const primera = contenedor.querySelector("button:not([disabled])");
      (primera || alternativa()).focus();
      return;
    }
    const boton = fila.querySelector(`[${accion}]:not([disabled])`) || fila.querySelector("[data-aumentar]:not([disabled])");
    (boton || fila.querySelector("[data-quitar]")).focus();
  }

  function manejarAccionFila(boton, contenedor, alternativa) {
    const clave = boton.closest("li").dataset.clave;
    if (boton.hasAttribute("data-quitar")) lineas = quitarLinea(lineas, clave);
    else if (boton.hasAttribute("data-aumentar")) lineas = cambiarPacks(lineas, clave, 1);
    else lineas = cambiarPacks(lineas, clave, -1);
    guardarLineas();
    dibujarTodo();
    const accion = ["data-quitar", "data-aumentar", "data-disminuir"].find((nombre) => boton.hasAttribute(nombre));
    restaurarFoco(contenedor, clave, accion, alternativa);
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
    raiz.classList.add("sin-scroll");
    botonCerrar.focus();
  }

  function cerrarCarrito() {
    panel.classList.remove("abierto");
    fondo.classList.remove("abierto");
    botonCarrito.setAttribute("aria-expanded", "false");
    raiz.classList.remove("sin-scroll");
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

  /* --- Lista de compras --- */

  function crearFilaLista(item) {
    const fila = plantillaLista.content.firstElementChild.cloneNode(true);
    const descripcion = `${item.nombre}, ${item.tamano} unidades`;
    fila.dataset.clave = item.clave;
    fila.querySelector(".lista__item-nombre").textContent = item.nombre;
    fila.querySelector(".lista__item-detalle").textContent = `${item.unidades} unid.`;
    fila.querySelector(".lista__item-precio").textContent = formatearMoneda(item.subtotalCentimos);
    fila.querySelector(".lista__packs").setAttribute("aria-label", `Paquetes de ${descripcion}`);
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
    const visible = resumen.items.length > 0 || Boolean(plan.camino);

    listaRaiz.hidden = !visible;
    saltarLista.hidden = !visible;
    raiz.classList.toggle("lista-visible", visible);

    ponerTexto(listaCamino, modelo.textoCamino);
    listaAvance.replaceChildren(...modelo.categorias.map(crearAvance));
    listaAvance.hidden = modelo.categorias.length === 0;
    ponerTexto(listaEstado, modelo.estado.texto);
    listaEstado.className = `lista__estado lista__estado--${modelo.estado.tipo}`;
    ponerTexto(listaBocaditos, modelo.textoBocaditos);
    ponerTexto(listaPorInvitado, modelo.textoPorInvitado);
    listaItems.replaceChildren(...resumen.items.map(crearFilaLista));
    listaItems.hidden = resumen.items.length === 0;
    listaEnlacePlanificador.hidden = Boolean(plan.camino);
    listaTotal.textContent = formatearMoneda(resumen.totalCentimos);
    listaContinuar.disabled = resumen.items.length === 0;

    const bocaditos = modelo.unidadesTotales;
    listaCifra.textContent = String(bocaditos);
    listaPestana.querySelector(".lista__pestana-unidad").textContent = bocaditos === 1 ? " bocadito" : " bocaditos";
    listaPestanaTotal.textContent = formatearMoneda(resumen.totalCentimos);

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

  function aplicarEstadoLista() {
    const abierta = listaAbierta && !listaRaiz.hidden;
    listaRaiz.classList.toggle("abierta", listaAbierta);
    raiz.classList.toggle("lista-abierta", abierta);
    listaPestana.setAttribute("aria-expanded", String(listaAbierta));
    listaPestanaAccion.textContent = listaAbierta ? "Ocultar" : "Ver lista";
  }

  function abrirLista() {
    listaAbierta = true;
    aplicarEstadoLista();
    listaTitulo.focus({ preventScroll: true });
  }

  function cerrarLista() {
    const teniaFoco = listaRaiz.contains(document.activeElement);
    listaAbierta = false;
    aplicarEstadoLista();
    if (teniaFoco) listaPestana.focus();
  }

  function continuarAlCarrito() {
    const resumen = resumirCarrito(lineas, catalogo);
    registrar("continuar_carrito", { articulos: resumen.cantidadPacks, valor: aSoles(resumen.totalCentimos) });
    abrirCarrito();
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
      mostrarMensajePedido("Aún no eliges nada. Vuelve al planificador y agrega tus favoritos.", true);
      return;
    }
    if (!fecha.valida) {
      campoFecha.focus();
      return;
    }

    const mensaje = construirMensajePedido(resumen, campoFecha.value, NEGOCIO, plan);
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

  /* --- Planificador --- */

  function crear(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto) elemento.textContent = texto;
    return elemento;
  }

  // Un grupo es la lista de productos sugeridos de una categoría (con título Dulces/Salados solo en el mixto).
  function crearGrupoSugerencia(grupo) {
    const bloque = crear("div", "opcion__grupo");
    if (grupo.etiqueta) bloque.append(crear("p", "opcion__grupo-titulo", grupo.etiqueta));
    const filas = crear("ul", "opcion__lineas");
    grupo.lineas.forEach((linea) => {
      filas.append(crear("li", linea.extra ? "opcion__linea opcion__linea--mas" : "opcion__linea", linea.texto));
    });
    bloque.append(filas);
    return bloque;
  }

  function crearTarjetaOpcion(opcion) {
    const tarjeta = crear("article", `opcion opcion--${opcion.clave}`);
    tarjeta.append(crear("h4", "opcion__titulo", opcion.titulo), crear("p", "opcion__unidades", opcion.unidades));
    if (opcion.reparto) tarjeta.append(crear("p", "opcion__reparto", opcion.reparto));
    opcion.grupos.forEach((grupo) => tarjeta.append(crearGrupoSugerencia(grupo)));
    if (opcion.precio) tarjeta.append(crear("p", "opcion__precio", opcion.precio));

    const elegir = crear("button", "boton boton--principal boton--bloque opcion__elegir", opcion.boton);
    elegir.type = "button";
    elegir.dataset.camino = opcion.clave;
    elegir.setAttribute("aria-pressed", String(plan.camino === opcion.clave));
    tarjeta.append(elegir);
    return tarjeta;
  }

  function mostrarResultado(invitados, porInvitado) {
    const modelo = describirResultado(invitados, catalogo, porInvitado);
    const opciones = crear("div", "calculadora__opciones");
    modelo.opciones.forEach((opcion) => opciones.append(crearTarjetaOpcion(opcion)));
    resultadoCalculadora.replaceChildren(
      crear("p", "calculadora__frase", modelo.frase),
      crear("p", "calculadora__regla", modelo.regla),
      crear("h3", "calculadora__camino-titulo", modelo.tituloCaminos),
      opciones
    );
  }

  function marcarCaminoElegido() {
    resultadoCalculadora.querySelectorAll("[data-camino]").forEach((boton) => {
      boton.setAttribute("aria-pressed", String(boton.dataset.camino === plan.camino));
    });
  }

  function dibujarContextoCamino() {
    ponerTexto(contextoCamino, textoContextoCamino(plan));
  }

  function calcularInvitados(evento) {
    evento.preventDefault();
    // Un número escrito a medias (por ejemplo "6e") llega vacío; se trata como inválido, no como el valor por defecto.
    const textoBocaditosCampo = campoBocaditos.validity.badInput ? "!" : campoBocaditos.value;
    const validacion = validarEntradaCalculadora(campoInvitados.value, textoBocaditosCampo);
    resultadoCalculadora.classList.toggle("calculadora__resultado--error", !validacion.valido);
    campoInvitados.removeAttribute("aria-invalid");
    campoBocaditos.removeAttribute("aria-invalid");
    if (!validacion.valido) {
      if (validacion.campos.includes("invitados")) campoInvitados.setAttribute("aria-invalid", "true");
      if (validacion.campos.includes("porInvitado")) campoBocaditos.setAttribute("aria-invalid", "true");
      resultadoCalculadora.textContent = validacion.mensaje;
      return;
    }
    // Campo vacío = valor por defecto: se deja escrito para que se vea qué se usó.
    campoBocaditos.value = String(validacion.porInvitado);
    plan = { invitados: validacion.invitados, porInvitado: validacion.porInvitado, camino: plan.camino };
    guardarPlan();
    mostrarResultado(plan.invitados, plan.porInvitado);
    dibujarContextoCamino();
    dibujarLista();
    registrar("usar_calculadora", {
      invitados: plan.invitados,
      bocaditos_por_invitado: plan.porInvitado,
      sugerencia: codificarSugerencia(calcularCombinacion(plan.invitados, plan.porInvitado))
    });
  }

  // Lleva al catálogo con desplazamiento suave (sin animación si el visitante prefiere menos movimiento).
  function irAlCatalogo() {
    seccionCatalogo.scrollIntoView({ behavior: consultaMovimiento.matches ? "auto" : "smooth", block: "start" });
    tituloCatalogo.focus({ preventScroll: true });
  }

  function elegirCamino(clave) {
    if (!plan.invitados || !esCaminoValido(clave)) return;
    plan = { invitados: plan.invitados, porInvitado: plan.porInvitado, camino: clave };
    guardarPlan();
    marcarCaminoElegido();
    aplicarFiltro(CAMINOS[clave].filtro, false);
    dibujarContextoCamino();
    dibujarLista();
    registrar("elegir_camino", { camino: clave, invitados: plan.invitados, bocaditos_por_invitado: plan.porInvitado });
    irAlCatalogo();
  }

  // Restaura el plan guardado: el resultado, el camino elegido y el filtro del catálogo.
  function restaurarPlan() {
    if (!plan.invitados) return;
    campoInvitados.value = String(plan.invitados);
    campoBocaditos.value = String(plan.porInvitado);
    mostrarResultado(plan.invitados, plan.porInvitado);
    if (plan.camino) aplicarFiltro(CAMINOS[plan.camino].filtro, false);
    dibujarContextoCamino();
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
    if (boton) manejarAccionFila(boton, lista, () => botonCerrar);
  });

  listaItems.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button");
    if (boton) manejarAccionFila(boton, listaItems, () => (listaRaiz.hidden ? botonCarrito : listaSeguir));
  });

  document.addEventListener("click", (evento) => {
    const enlace = evento.target.closest("a[href]");
    if (enlace && esEnlaceWhatsApp(enlace)) registrar("clic_whatsapp", { ubicacion: ubicacionWhatsApp(enlace) });
  });

  botonCarrito.addEventListener("click", () => (carritoAbierto() ? cerrarCarrito() : abrirCarrito()));
  botonCerrar.addEventListener("click", cerrarCarrito);
  fondo.addEventListener("click", cerrarCarrito);

  listaPestana.addEventListener("click", () => (listaAbierta ? cerrarLista() : abrirLista()));
  listaCerrar.addEventListener("click", cerrarLista);
  listaSeguir.addEventListener("click", cerrarLista);
  listaContinuar.addEventListener("click", continuarAlCarrito);
  saltarLista.addEventListener("click", (evento) => {
    evento.preventDefault();
    abrirLista();
  });
  consultaAncha.addEventListener("change", () => {
    listaAbierta = consultaAncha.matches;
    aplicarEstadoLista();
  });

  document.addEventListener("keydown", (evento) => {
    if (carritoAbierto()) {
      if (evento.key === "Escape") cerrarCarrito();
      else if (evento.key === "Tab") atraparTabulador(evento);
      return;
    }
    // Fuera de la pantalla ancha la lista es un cajón o una barra: Escape la colapsa.
    if (evento.key === "Escape" && listaAbierta && !listaRaiz.hidden && !consultaAncha.matches) cerrarLista();
  });

  campoFecha.addEventListener("input", ocultarErrorFecha);
  formPedido.addEventListener("submit", enviarPedido);
  formCalculadora.addEventListener("submit", calcularInvitados);
  [campoInvitados, campoBocaditos].forEach((campo) => {
    campo.addEventListener("input", () => campo.removeAttribute("aria-invalid"));
  });

  resultadoCalculadora.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-camino]");
    if (boton) elegirCamino(boton.dataset.camino);
  });

  /* --- Arranque --- */

  rejilla.querySelectorAll(".tarjeta").forEach(actualizarPrecioTarjeta);
  actualizarMinimoFecha();
  restaurarPlan();
  dibujarTodo();
}

if (typeof document !== "undefined") iniciar();

// Permite probar las funciones puras desde Node.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    NEGOCIO, formatearMoneda, formatearNumero, validarInvitados, validarBocaditosPorInvitado,
    validarEntradaCalculadora, calcularCombinacion, combinarPaquetes,
    describirCombinacion, textoResultadoCalculadora, calcularOpciones, describirResultado,
    sugerirProductos, describirSugerencia, productosDeCategoria, validarFechaEvento, fechaMinimaEvento,
    formatearFechaLarga, agregarLinea, cambiarPacks, quitarLinea, normalizarLineas,
    resumirCarrito, construirMensajePedido, construirEnlaceWhatsApp, aCentimos,
    registrar, aSoles, codificarSugerencia,
    CAMINOS, calcularMetas, evaluarAvance, describirEstadoLista, describirLista, normalizarPlan,
    textoContextoCamino, textoEventoPedido
  };
}

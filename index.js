// El Delicioso: catálogo, planificador de invitados, lista de compras y pedido por WhatsApp.
// JavaScript puro. Las funciones "puras" no tocan el DOM, así se pueden probar en Node.

const NEGOCIO = {
  nombre: "El Delicioso",
  whatsapp: "51980592747",
  anticipacionDias: 2
};

const TAMANOS = [25, 50, 100];
// "Bocaditos por invitado" no tiene valor inicial: el visitante lo escribe siempre (de 3 a 10).
const MIN_BOCADITOS_POR_INVITADO = 3;
const MAX_BOCADITOS_POR_INVITADO = 10;
const MAX_INVITADOS = 1000;
// Tope de unidades totales que se arman en línea; más allá se atiende por WhatsApp.
const MAX_UNIDADES = 10000;
// Máximo de líneas de producto que muestra cada categoría en la sugerencia.
const MAX_LINEAS_SUGERENCIA = 6;
const MAX_PACKS_POR_LINEA = 99;
// La clave conserva su nombre original para no perder las listas que los visitantes ya guardaron.
const CLAVE_ALMACENAMIENTO = "el-delicioso-carrito";
const CLAVE_PLAN = "el-delicioso-plan";
// Desde este excedente por categoría la lista avisa que te pasas de la meta.
const UMBRAL_EXCEDIDO = 25;
// Productos que cambiaron de id al ampliar el catálogo (listas guardadas antes del cambio).
const ALIAS_IDS = { "trufas-chocolate": "mini-trufas-chocolate" };
const DURACION_REBOTE_MS = 300;
const DURACION_AGREGADO_MS = 1200;

// Origen de la visita (?origen= o ?utm_source=): solo se aceptan estos valores (clave -> texto para el mensaje).
// Nunca se copia texto libre de la dirección al mensaje de WhatsApp.
const ORIGENES_PERMITIDOS = {
  qr: "QR",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  google: "Google"
};
// Formas cortas habituales que se reconducen a un origen permitido.
const ALIAS_ORIGEN = { ig: "instagram", insta: "instagram", fb: "facebook", "tik-tok": "tiktok" };
const CLAVE_ORIGEN = "el-delicioso-origen"; // sessionStorage: sobrevive mientras se navega dentro de la página

// Combos por ocasión: precio promo = suma de los precios del catálogo de cada mitad menos un ahorro fijo (en céntimos).
// Aquí solo viven los ids de los productos por defecto y los textos; los precios salen siempre del catálogo real.
const DESCUENTO_COMBO_CENTIMOS = 100; // S/ 1,00 menos que sumando los productos sueltos
// Bocaditos que se cuentan por persona para decir "para cuántas personas alcanza".
const BOCADITOS_POR_PERSONA = 3;
// Cada combo se reparte mitad y mitad: la mitad es un paquete del catálogo (25 o 50 unidades).
const MITADES_COMBO = [25, 50];
const COMBOS = {
  cumpleanos: {
    clave: "cumpleanos", titulo: "Cumpleaños", nombreLista: "Combo Cumpleaños", total: 50,
    salado: "pettit-pollo", dulce: "mini-alfajores-coco",
    frase: "Que los invitados vuelvan por más.",
    foto: "img/OCASIONES/cumpleanos-grande.webp", fotoAncho: 1600, fotoAlto: 621,
    // Mensaje prellenado de "¿Dudas? Escríbenos" (el origen de la visita se suma después)
    mensaje: "Hola, El Delicioso. Celebro un cumpleaños y quiero que me ayuden a elegir bocaditos."
  },
  "baby-shower": {
    clave: "baby-shower", titulo: "Baby shower", nombreLista: "Combo Baby shower", total: 50,
    salado: "mini-empanaditas-pollo", dulce: "mini-pay-limon",
    frase: "Una bienvenida dulce (y salada) para el bebé.",
    foto: "img/OCASIONES/baby-shower-grande.webp", fotoAncho: 1600, fotoAlto: 628,
    // Mensaje prellenado de "¿Dudas? Escríbenos" (el origen de la visita se suma después)
    mensaje: "Hola, El Delicioso. Organizo un baby shower y quiero que me ayuden a elegir bocaditos."
  },
  "reunion-trabajo": {
    clave: "reunion-trabajo", titulo: "Reunión de trabajo", nombreLista: "Combo Reunión de trabajo", total: 50,
    salado: "mini-causitas-atun", dulce: "mini-alfachips",
    frase: "Un detalle para que la pausa sepa mejor.",
    foto: "img/OCASIONES/reunion-trabajo-grande.webp", fotoAncho: 1600, fotoAlto: 732,
    // Mensaje prellenado de "¿Dudas? Escríbenos" (el origen de la visita se suma después)
    mensaje: "Hola, El Delicioso. Tengo una reunión de trabajo y quiero que me ayuden a elegir bocaditos."
  },
  "colegio-iglesia": {
    clave: "colegio-iglesia", titulo: "Colegio o iglesia", nombreLista: "Combo Colegio o iglesia", total: 100,
    salado: "mini-empanaditas-pollo", dulce: "mini-alfajores-coco",
    frase: "Para compartir con todos, en cantidad.",
    foto: "img/OCASIONES/colegio-iglesia-grande.webp", fotoAncho: 1600, fotoAlto: 621,
    // Mensaje prellenado de "¿Dudas? Escríbenos" (el origen de la visita se suma después)
    mensaje: "Hola, El Delicioso. Organizo un evento en un colegio o iglesia y quiero que me ayuden a elegir bocaditos."
  },
  // Sin total fijo: el visitante elige 50 o 100 unidades (mitad y mitad).
  personalizado: {
    clave: "personalizado", titulo: "Arma el tuyo", nombreLista: "Combo personalizado", total: null,
    salado: "pettit-pollo", dulce: "mini-alfajores-coco",
    frase: "Tu plan, tus sabores: tú eliges.",
    foto: "img/OCASIONES/otro-evento-grande.webp", fotoAncho: 1600, fotoAlto: 619,
    // Mensaje prellenado de "¿Dudas? Escríbenos" (el origen de la visita se suma después)
    mensaje: "Hola, El Delicioso. Tengo otro plan y quiero que me ayuden a elegir bocaditos."
  }
};

// Galería: tiempos del carrusel (avance automático muy suave) y del conteo de las tarjetas de camino.
const INTERVALO_GALERIA_MS = 4000;
// Transición entre imágenes: ~0,7 s con curva de desaceleración (ease-out), sin desenfoque.
const DURACION_TRANSICION_GALERIA_MS = 700;
const PAUSA_TRAS_TOQUE_MS = 8000;
const DURACION_CONTEO_MS = 500;
// Zona superior activa del subrayado del menú: el encabezado y estos píxeles debajo.
const MARGEN_ZONA_MENU_PX = 48;

// GitHub Pages cachea toda la página (HTML incluido) 10 minutos sin que se pueda cambiar desde el hosting; una
// pestaña que quedó abierta antes de publicar una actualización no la vería sola. Cada tanto se revisa
// version.json (pedido siempre sin caché) y, si cambió frente a data-version del <html>, se avisa para recargar.
const INTERVALO_VERSION_MS = 5 * 60 * 1000;

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

// Devuelve { valido, porInvitado, mensaje }; el dato es obligatorio (vacío o ausente no vale).
function validarBocaditosPorInvitado(valor) {
  const texto = String(valor ?? "").trim();
  if (texto === "") {
    return {
      valido: false,
      mensaje: `Indica cuántos bocaditos por invitado, de ${MIN_BOCADITOS_POR_INVITADO} a ${MAX_BOCADITOS_POR_INVITADO}.`
    };
  }
  const mensaje = `Escribe un número entero de ${MIN_BOCADITOS_POR_INVITADO} a ${MAX_BOCADITOS_POR_INVITADO} bocaditos por invitado. ` +
    "Para más, escríbenos por WhatsApp.";
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
function calcularCombinacion(invitados, porInvitado) {
  const necesarias = invitados * porInvitado;
  const tamanoUnico = TAMANOS.find((tamano) => necesarias <= tamano);
  if (tamanoUnico) {
    const paquetes = { 100: 0, 50: 0, 25: 0, [tamanoUnico]: 1 };
    return { necesarias, paquetes, total: totalPaquetes(paquetes) };
  }
  return combinarPaquetes(necesarias);
}

// Fisher-Yates: devuelve una copia en orden aleatorio; "aleatorio" devuelve un número en [0, 1).
function mezclar(lista, aleatorio = Math.random) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Baraja y reparte: cada elemento sale una vez antes de que se repita ninguno y, al rebarajar, el primero
// nunca es el último que salió. "baraja" es la lista de pendientes (se modifica); devuelve el siguiente.
function sacarDeBaraja(baraja, elementos, ultimo, aleatorio = Math.random) {
  if (baraja.length === 0) {
    baraja.push(...mezclar(elementos, aleatorio));
    if (baraja.length > 1 && baraja[0] === ultimo) baraja.push(baraja.shift());
  }
  return baraja.shift();
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

function textoResultadoCalculadora(invitados, porInvitado) {
  const combinacion = calcularCombinacion(invitados, porInvitado);
  return `Para ${invitados} ${invitados === 1 ? "invitado" : "invitados"} necesitas unas ${combinacion.necesarias} unidades. ` +
    `Te sugerimos ${describirCombinacion(combinacion)}.`;
}

// "Sobra 1 bocadito" / "Sobran 5 bocaditos"; "sustantivo" es [singular, plural].
function textoSobran(cantidad, sustantivo) {
  return cantidad === 1 ? `Sobra 1 ${sustantivo[0]}` : `Sobran ${cantidad} ${sustantivo[1]}`;
}

// Línea de equidad de la frase principal: lo que sobra del total sugerido y cuánto tocaría a cada invitado.
function textoSobrantesEquidad(invitados, porInvitado) {
  const { necesarias, total } = calcularCombinacion(invitados, porInvitado);
  const sobran = total - necesarias;
  if (sobran === 0) return `Reparto exacto: cada invitado recibe ${textoBocaditos(porInvitado)}.`;
  return `${textoSobran(sobran, ["bocadito", "bocaditos"])}: ` +
    `${sobran === 1 ? "repartido" : "repartidos"} por igual, cada invitado recibiría ${formatearNumero(total / invitados)}.`;
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
    titulo: "Mixto",
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
// Un producto "por cotizar" no tiene precios: no se suma, no se sugiere y no se puede agregar a la lista.
function tienePrecios(producto) {
  return Boolean(producto && producto.precios && TAMANOS.every((tamano) => Number.isFinite(producto.precios[tamano])));
}

function productosDeCategoria(catalogo, categoria) {
  return [...catalogo.values()].filter((producto) => producto.categoria === categoria && tienePrecios(producto));
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
  // Sobrantes por categoría: lo que pasa de la meta de esa categoría.
  const sobran = { dulce: partes.dulce.total - partes.dulce.necesarias, salado: partes.salado.total - partes.salado.necesarias };
  return {
    clave,
    titulo,
    dulce: partes.dulce,
    salado: partes.salado,
    unidades,
    sobran,
    porInvitado: unidades / invitados,
    sugerencias,
    precio
  };
}

// Mixto: mitad dulces y mitad salados (la mitad se redondea hacia arriba), cada una con menor excedente.
// Solo dulces o solo salados: la misma combinación que sugiere la frase principal.
function calcularOpciones(invitados, catalogo, porInvitado) {
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

// Sobrantes de una opción: "Reparto exacto", "Sobran 5 unidades" o, en el mixto, "Sobran 30: 15 dulces y 15 salados".
function textoSobrantesOpcion(opcion) {
  const total = opcion.sobran.dulce + opcion.sobran.salado;
  if (total === 0) return "Reparto exacto";
  if (opcion.clave !== "mixto") return textoSobran(total, ["unidad", "unidades"]);
  const partes = CATEGORIAS
    .filter((categoria) => opcion.sobran[categoria.clave] > 0)
    .map((categoria) => `${opcion.sobran[categoria.clave]} ${opcion.sobran[categoria.clave] === 1 ? categoria.singular : categoria.unidad}`);
  return `${total === 1 ? "Sobra" : "Sobran"} ${total}: ${unirLista(partes)}`;
}

// Modelo de texto de todo el resultado; la interfaz solo lo dibuja.
// Cada opción trae "grupos": [{ etiqueta, lineas: [{ texto, extra }] }]; la etiqueta (Dulces/Salados)
// solo aparece en el mixto, donde hay dos grupos.
function describirResultado(invitados, catalogo, porInvitado) {
  const opciones = calcularOpciones(invitados, catalogo, porInvitado).map((opcion) => ({
    clave: opcion.clave,
    titulo: opcion.titulo,
    boton: CAMINOS[opcion.clave].boton,
    unidades: `${opcion.unidades} unidades`,
    reparto: opcion.clave === "mixto" ? `${opcion.dulce.total} dulces + ${opcion.salado.total} salados` : "",
    sobrantes: textoSobrantesOpcion(opcion),
    grupos: CATEGORIAS
      .filter((categoria) => opcion.sugerencias[categoria.clave])
      .map((categoria) => ({
        etiqueta: opcion.clave === "mixto" ? categoria.etiqueta : "",
        lineas: describirSugerencia(opcion.sugerencias[categoria.clave])
      }))
  }));
  return {
    frase: textoResultadoCalculadora(invitados, porInvitado),
    sobrantes: textoSobrantesEquidad(invitados, porInvitado),
    tituloCaminos: "Elige tu camino",
    opciones
  };
}

/* ===== Funciones puras: plan (invitados y camino) y avance de la lista ===== */

// Datos guardados del plan -> { invitados, porInvitado, camino }; descarta lo dañado o inexistente.
// Los planes viejos sin "porInvitado" válido (ausente o fuera de 3 a 10) conservan los invitados si son
// válidos, dejan "porInvitado" en null y pierden el camino: sin ese dato no se puede calcular la meta.
function normalizarPlan(crudo) {
  const vacio = { invitados: null, porInvitado: null, camino: null };
  if (!crudo || typeof crudo !== "object") return vacio;
  const invitadosGuardados = validarInvitados(crudo.invitados);
  if (!invitadosGuardados.valido) return vacio;
  const porInvitadoGuardado = validarBocaditosPorInvitado(crudo.porInvitado);
  if (!porInvitadoGuardado.valido) {
    return { invitados: invitadosGuardados.invitados, porInvitado: null, camino: null };
  }
  const validacion = validarEntradaCalculadora(crudo.invitados, porInvitadoGuardado.porInvitado);
  if (!validacion.valido) return vacio;
  return {
    invitados: validacion.invitados,
    porInvitado: validacion.porInvitado,
    camino: esCaminoValido(crudo.camino) ? crudo.camino : null
  };
}

// Un plan sirve para calcular metas solo con los tres datos: invitados, bocaditos por invitado y camino.
function planCompleto(plan) {
  return Boolean(plan && plan.camino && plan.invitados && Number.isInteger(plan.porInvitado));
}

function textoInvitados(invitados) {
  return `${invitados} ${invitados === 1 ? "invitado" : "invitados"}`;
}

// Meta de unidades por categoría; null si el camino no incluye esa categoría.
// Mixto: mitad dulces y mitad salados (cada una se redondea hacia arriba).
function calcularMetas(invitados, camino, porInvitado) {
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
  if (!planCompleto(plan)) return "";
  const porInvitado = plan.porInvitado;
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
  if (!planCompleto(plan)) return "";
  return `Evento: ${textoInvitados(plan.invitados)}, ${textoBocaditos(plan.porInvitado)} por invitado, ` +
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
  // Aquí ninguna categoría llega a 25 de excedente; se avisa lo que sobra, si algo sobra.
  const sobranPoco = categorias.reduce((suma, categoria) => suma + categoria.sobran, 0);
  if (sobranPoco > 0) {
    return {
      tipo: "completo",
      texto: `Cubres las ${meta} unidades y ${sobranPoco === 1 ? "sobra 1" : `sobran ${sobranPoco}`}.`
    };
  }
  return { tipo: "completo", texto: `¡Listo! Cubres las ${meta} unidades.` };
}

// Todo lo que muestra la lista de compras, a partir de las líneas de la lista (resumirCarrito) y el plan.
function describirLista({ items }, plan) {
  const llevado = { dulce: 0, salado: 0 };
  // Un combo suma la mitad a dulces y la mitad a salados; una línea normal, todo a su categoría.
  items.forEach((item) => {
    const reparto = item.porCategoria || { [item.categoria]: item.unidades };
    llevado.dulce += reparto.dulce || 0;
    llevado.salado += reparto.salado || 0;
  });
  const unidadesTotales = items.reduce((suma, item) => suma + item.unidades, 0);
  const hayPlan = planCompleto(plan);
  const metas = hayPlan
    ? calcularMetas(plan.invitados, plan.camino, plan.porInvitado)
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
      ? `Para ${textoInvitados(plan.invitados)} necesitas unas ${plan.invitados * plan.porInvitado} unidades.`
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

/* ===== Funciones puras: líneas de la lista de compras (lo guardado se llama "carrito" por historia) ===== */

// Una línea de la lista es { id, tamano, packs }; el nombre y el precio salen del catálogo.
// Un combo es una sola línea { combo, dulce, salado, tamano, packs }: "tamano" es el paquete de cada mitad (25 o 50)
// y "packs" cuántos combos iguales lleva. Las listas guardadas antes de los combos no tienen ese campo y siguen igual.
function esLineaCombo(linea) {
  return Boolean(linea && linea.combo);
}

function claveLinea(linea) {
  return esLineaCombo(linea)
    ? `combo|${linea.combo}|${linea.salado}|${linea.dulce}|${linea.tamano}`
    : `${linea.id}|${linea.tamano}`;
}

function agregarLinea(lineas, id, tamano) {
  const esLaLinea = (linea) => !esLineaCombo(linea) && linea.id === id && linea.tamano === tamano;
  if (!lineas.some(esLaLinea)) return [...lineas, { id, tamano, packs: 1 }];
  return lineas.map((linea) => (esLaLinea(linea)
    ? { ...linea, packs: Math.min(linea.packs + 1, MAX_PACKS_POR_LINEA) }
    : linea));
}

// Suma un combo a la lista; si ya hay uno igual (mismos productos y tamaño), sube su cantidad.
function agregarCombo(lineas, { combo, dulce, salado, tamano }) {
  const nueva = { combo, dulce, salado, tamano, packs: 1 };
  const clave = claveLinea(nueva);
  if (!lineas.some((linea) => claveLinea(linea) === clave)) return [...lineas, nueva];
  return lineas.map((linea) => (claveLinea(linea) === clave
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

/* ===== Funciones puras: combos por ocasión ===== */

function esComboValido(clave) {
  return typeof clave === "string" && Object.prototype.hasOwnProperty.call(COMBOS, clave);
}

// Precio de UN combo: suma de los precios de catálogo de cada mitad (paquete "tamano") menos DESCUENTO_COMBO_CENTIMOS.
// Todo en céntimos. Devuelve null si algún dato no vale (producto sin precio, categoría
// cambiada o tamaño no permitido). Ejemplo: 35,00 + 28,00 = 63,00 -> S/ 62,00.
function calcularPrecioCombo(catalogo, { dulce, salado, tamano }) {
  const productoDulce = catalogo.get(dulce);
  const productoSalado = catalogo.get(salado);
  if (!tienePrecios(productoDulce) || !tienePrecios(productoSalado)) return null;
  if (productoDulce.categoria !== "dulce" || productoSalado.categoria !== "salado") return null;
  if (!MITADES_COMBO.includes(tamano)) return null;
  const anteriorCentimos = productoDulce.precios[tamano] + productoSalado.precios[tamano];
  // Todo con enteros (céntimos) para no depender de decimales binarios; el precio nunca baja de cero.
  const comboCentimos = Math.max(anteriorCentimos - DESCUENTO_COMBO_CENTIMOS, 0);
  return { anteriorCentimos, comboCentimos, ahorroCentimos: anteriorCentimos - comboCentimos };
}

// Para cuántas personas alcanza un combo contando BOCADITOS_POR_PERSONA por cabeza (solo personas completas).
function calcularPersonasCombo(unidades) {
  if (!Number.isInteger(unidades) || unidades < 0) return 0;
  return Math.floor(unidades / BOCADITOS_POR_PERSONA);
}

// Devuelve la línea limpia de un combo guardado o null si está dañado, ya no existe o no coincide con su definición.
function normalizarLineaCombo(item, catalogo) {
  if (!esComboValido(item.combo)) return null;
  const definicion = COMBOS[item.combo];
  const dulce = ALIAS_IDS[item.dulce] || item.dulce;
  const salado = ALIAS_IDS[item.salado] || item.salado;
  const tamanoPermitido = definicion.total ? item.tamano === definicion.total / 2 : MITADES_COMBO.includes(item.tamano);
  if (!tamanoPermitido || !Number.isInteger(item.packs) || item.packs < 1) return null;
  if (!calcularPrecioCombo(catalogo, { dulce, salado, tamano: item.tamano })) return null;
  return { combo: item.combo, dulce, salado, tamano: item.tamano, packs: Math.min(item.packs, MAX_PACKS_POR_LINEA) };
}

// Descarta datos guardados que ya no existan en el catálogo o estén dañados.
function normalizarLineas(crudo, catalogo) {
  if (!Array.isArray(crudo)) return [];
  const vistas = new Set();
  const limpias = [];
  for (const item of crudo) {
    if (!item) continue;
    if (item.combo) {
      const combo = normalizarLineaCombo(item, catalogo);
      if (combo && !vistas.has(claveLinea(combo))) {
        vistas.add(claveLinea(combo));
        limpias.push(combo);
      }
      continue;
    }
    const id = ALIAS_IDS[item.id] || item.id;
    if (!tienePrecios(catalogo.get(id)) || !TAMANOS.includes(item.tamano)) continue;
    if (!Number.isInteger(item.packs) || item.packs < 1) continue;
    const linea = { id, tamano: item.tamano, packs: Math.min(item.packs, MAX_PACKS_POR_LINEA) };
    if (vistas.has(claveLinea(linea))) continue;
    vistas.add(claveLinea(linea));
    limpias.push(linea);
  }
  return limpias;
}

// Línea de combo con todo lo que muestran la lista y el mensaje. El subtotal YA lleva el descuento
// (precio de un combo x cantidad), así el total de la lista y el del mensaje son siempre el mismo número.
function resumirCombo(linea, catalogo) {
  const definicion = COMBOS[linea.combo];
  const precio = calcularPrecioCombo(catalogo, linea);
  const nombreSalado = catalogo.get(linea.salado).nombre;
  const nombreDulce = catalogo.get(linea.dulce).nombre;
  const porMitad = linea.tamano * linea.packs;
  return {
    ...linea,
    clave: claveLinea(linea),
    esCombo: true,
    nombre: definicion.nombreLista,
    categoria: "combo",
    ids: [linea.salado, linea.dulce],
    unidades: porMitad * 2,
    porCategoria: { dulce: porMitad, salado: porMitad },
    composicion: `${linea.tamano} ${nombreSalado} + ${linea.tamano} ${nombreDulce}`,
    precioAnteriorCentimos: precio.anteriorCentimos * linea.packs,
    ahorroCentimos: precio.ahorroCentimos * linea.packs,
    subtotalCentimos: precio.comboCentimos * linea.packs
  };
}

// Añade a cada línea nombre, unidades y subtotal; y calcula total y cantidad de packs.
function resumirCarrito(lineas, catalogo) {
  const items = lineas.map((linea) => {
    if (esLineaCombo(linea)) return resumirCombo(linea, catalogo);
    const producto = catalogo.get(linea.id);
    const unidades = linea.tamano * linea.packs;
    return {
      ...linea,
      clave: claveLinea(linea),
      nombre: producto.nombre,
      categoria: producto.categoria,
      ids: [linea.id],
      unidades,
      porCategoria: { [producto.categoria]: unidades },
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

// Líneas del mensaje de un elemento de la lista. Un combo nombra el combo, su precio ya con descuento
// (el mismo que suma el total) y, aparte, qué incluye.
function lineasMensajeItem(item) {
  if (!item.esCombo) {
    return [`- ${item.nombre}: ${describirUnidades(item)} - ${formatearMoneda(item.subtotalCentimos)}`];
  }
  const unidades = item.packs === 1
    ? `${item.unidades} unidades`
    : `${item.unidades} unidades (${item.packs} combos de ${item.tamano * 2})`;
  return [
    `- ${item.nombre}: ${unidades} - ${formatearMoneda(item.subtotalCentimos)} ` +
      `(precio promo; por separado suman ${formatearMoneda(item.precioAnteriorCentimos)})`,
    `  ${item.packs === 1 ? "Incluye" : "Cada combo incluye"}: ${item.composicion}`
  ];
}

/* ===== Funciones puras: origen de la visita ===== */

// Texto libre -> clave permitida ("qr", "instagram", ...) o null. Ignora mayúsculas y espacios; lo desconocido se descarta.
function normalizarOrigen(valor) {
  if (typeof valor !== "string") return null;
  const limpio = valor.trim().toLowerCase();
  const clave = Object.prototype.hasOwnProperty.call(ALIAS_ORIGEN, limpio) ? ALIAS_ORIGEN[limpio] : limpio;
  return Object.prototype.hasOwnProperty.call(ORIGENES_PERMITIDOS, clave) ? clave : null;
}

// Lee ?origen= y, si no sirve, ?utm_source= de la cadena de consulta (por ejemplo "?origen=qr"). Devuelve la clave o null.
function leerOrigenDeURL(cadenaConsulta) {
  let parametros;
  try {
    parametros = new URLSearchParams(cadenaConsulta || "");
  } catch (error) {
    return null;
  }
  return normalizarOrigen(parametros.get("origen")) || normalizarOrigen(parametros.get("utm_source"));
}

// "(Vi la web por: QR)"; vacío si no hay un origen permitido.
function textoOrigen(origen) {
  const clave = normalizarOrigen(origen);
  return clave ? `(Vi la web por: ${ORIGENES_PERMITIDOS[clave]})` : "";
}

// Añade al final del mensaje una línea discreta con el origen; sin origen devuelve el mensaje intacto.
function agregarLineaOrigen(mensaje, origen) {
  const linea = textoOrigen(origen);
  return linea ? `${mensaje}\n\n${linea}` : mensaje;
}

// Enlace wa.me prellenado -> el mismo enlace con la línea de origen sumada a su texto. Sin origen o sin texto, igual.
function enlaceConOrigen(enlace, origen) {
  if (!textoOrigen(origen)) return enlace;
  try {
    const url = new URL(enlace);
    const texto = url.searchParams.get("text");
    if (texto === null) return enlace;
    url.searchParams.set("text", agregarLineaOrigen(texto, origen));
    url.search = url.search.replace(/\+/g, "%20"); // los espacios viajan como %20, igual que en el resto de enlaces
    return url.toString();
  } catch (error) {
    return enlace;
  }
}

function construirMensajePedido({ items, totalCentimos }, fechaISO, negocio = NEGOCIO, plan = null, origen = null) {
  const lineas = items.flatMap(lineasMensajeItem);
  const evento = textoEventoPedido(plan);
  const mensaje = [
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
  return agregarLineaOrigen(mensaje, origen);
}

// Mensaje para cotizar un producto sin precio: solo lleva la cantidad, nunca datos personales.
function construirMensajeCotizacion(cantidad, nombreProducto, negocio = NEGOCIO, origen = null) {
  return agregarLineaOrigen(`Hola, ${negocio.nombre}. Quisiera cotizar ${cantidad} unidades de ${nombreProducto.toLowerCase()}. ` +
    "¿Me indican el precio y la disponibilidad?", origen);
}

// Reserva de un producto de temporada con precio fijo (empanadas amazónicas): cantidad, precio y fecha de salida.
function construirMensajeReserva(cantidad, nombreProducto, precioCentimos, salida, negocio = NEGOCIO, origen = null) {
  return agregarLineaOrigen(`Hola, ${negocio.nombre}. Quisiera separar ${cantidad} unidades de ${nombreProducto.toLowerCase()} ` +
    `(${formatearMoneda(precioCentimos)}) para su salida del ${salida}. ¿Me confirman la disponibilidad?`, origen);
}

// Cuenta regresiva: parte una diferencia de milisegundos en días, horas, minutos y segundos (sin negativos).
function calcularCuentaRegresiva(ahoraMs, objetivoMs) {
  const restante = Math.floor((objetivoMs - ahoraMs) / 1000);
  if (!Number.isFinite(restante) || restante <= 0) return { vencida: true, dias: 0, horas: 0, minutos: 0, segundos: 0 };
  return {
    vencida: false,
    dias: Math.floor(restante / 86400),
    horas: Math.floor((restante % 86400) / 3600),
    minutos: Math.floor((restante % 3600) / 60),
    segundos: restante % 60
  };
}

function construirEnlaceWhatsApp(mensaje, negocio = NEGOCIO) {
  return `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/* ===== Medición neutral ===== */

// Emite un evento del documento y, solo si ya existe window.dataLayer, lo empuja allí.
// No carga ninguna herramienta ni envía datos personales (nada de fechas ni textos del pedido).
// El origen de la visita (clave permitida o null) viaja en todos los eventos; lo fija iniciar() al cargar.
let origenMedicion = null;

function fijarOrigenMedicion(origen) {
  origenMedicion = normalizarOrigen(origen);
}

function registrar(nombre, datos = {}) {
  try {
    const conOrigen = origenMedicion ? { origen: origenMedicion, ...datos } : datos;
    if (typeof document !== "undefined" && typeof CustomEvent === "function") {
      document.dispatchEvent(new CustomEvent("eldelicioso:evento", { detail: { nombre, ...conOrigen } }));
    }
    if (typeof window !== "undefined" && window.dataLayer && typeof window.dataLayer.push === "function") {
      window.dataLayer.push({ event: nombre, ...conOrigen });
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

// Origen de la visita: el de la dirección (?origen= o ?utm_source=) o, si no trae, el guardado en sessionStorage,
// así sobrevive a navegar dentro de la página. Solo claves permitidas; devuelve la clave o null.
function resolverOrigenVisita() {
  const deLaURL = leerOrigenDeURL(window.location.search);
  try {
    if (deLaURL) {
      window.sessionStorage.setItem(CLAVE_ORIGEN, deLaURL);
      return deLaURL;
    }
    return normalizarOrigen(window.sessionStorage.getItem(CLAVE_ORIGEN));
  } catch (error) {
    return deLaURL; // sessionStorage bloqueado: al menos vale para esta carga
  }
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
  const botonLista = $("boton-lista");
  const contador = $("contador-lista");
  const formCalculadora = $("form-calculadora");
  const campoInvitados = $("invitados");
  const campoBocaditos = $("bocaditos-por-invitado");
  const resultadoCalculadora = $("resultado-calculadora");
  const sobrantesCalculadora = $("calculadora-sobrantes");
  const caminosCalculadora = $("calculadora-caminos");
  const opcionesCalculadora = $("calculadora-opciones");

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
  // Falso hasta terminar el arranque: así lo restaurado (lista, filtro guardado) aparece sin animaciones.
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

  // Solo entran al catálogo los productos con los tres precios; uno "por cotizar" (sin data-precio-*) se omite.
  function leerCatalogo(contenedor) {
    const mapa = new Map();
    contenedor.querySelectorAll(".tarjeta").forEach((tarjeta) => {
      const precios = {};
      TAMANOS.forEach((tamano) => { precios[tamano] = aCentimos(tarjeta.getAttribute(`data-precio-${tamano}`)); });
      const producto = {
        nombre: tarjeta.querySelector(".tarjeta__nombre").textContent.trim(),
        categoria: tarjeta.dataset.categoria,
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
    enlace.href = construirEnlaceWhatsApp(construirMensajeCotizacion(tamanoElegido(tarjeta), nombre, NEGOCIO, origenVisita));
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
    // Pop de aparición solo al agregar (no al restaurar la lista guardada) y con movimiento permitido.
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

  function guardarPlan() {
    escribirAlmacenamiento(CLAVE_PLAN, plan);
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

  // Recarga con una URL que nunca estuvo en caché (ni la del navegador ni la de GitHub Pages), así trae de una
  // vez la versión nueva en lugar de esperar a que venza el cacheo de 10 minutos.
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

  // "150 unidades": la cifra va en su propio tramo para poder contarla de 0 al valor. Lo animado queda oculto
  // para lectores de pantalla, que leen el texto final una sola vez.
  function crearUnidades(texto) {
    const parte = /^(\d+)(.*)$/.exec(texto);
    const p = crear("p", "opcion__unidades");
    if (!parte) {
      p.textContent = texto;
      return p;
    }
    const visible = crear("span");
    visible.setAttribute("aria-hidden", "true");
    const cifra = crear("span", "opcion__cifra", parte[1]);
    cifra.dataset.valor = parte[1];
    visible.append(cifra, parte[2]);
    p.append(visible, crear("span", "solo-lectores", texto));
    return p;
  }

  // Cada camino es una tarjeta: resumen (título, unidades, reparto y sobrantes), sugerencia por grupo y botón al pie.
  function crearFilaOpcion(opcion) {
    const fila = crear("article", `opcion opcion--${opcion.clave}`);
    const resumen = crear("div", "opcion__resumen");
    resumen.append(crear("h4", "opcion__titulo", opcion.titulo), crearUnidades(opcion.unidades));
    if (opcion.reparto) resumen.append(crear("p", "opcion__reparto", opcion.reparto));
    resumen.append(crear("p", "opcion__sobrantes", opcion.sobrantes));

    const detalle = crear("div", "opcion__detalle");
    opcion.grupos.forEach((grupo) => detalle.append(crearGrupoSugerencia(grupo)));
    const elegir = crear("button", "boton boton--principal boton--bloque opcion__elegir", opcion.boton);
    elegir.type = "button";
    elegir.dataset.camino = opcion.clave;
    elegir.setAttribute("aria-pressed", String(plan.camino === opcion.clave));

    fila.append(resumen, detalle, elegir);
    return fila;
  }

  // Cuenta de 0 al valor en ~500 ms (con movimiento reducido, el valor final directo). Antes de contar se reserva
  // el ancho de la cifra final, así nada se mueve.
  function contarCifras(raiz) {
    if (consultaMovimiento.matches) return;
    const cifras = [...raiz.querySelectorAll(".opcion__cifra")];
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

  // Muestra la frase, el reparto y los tres caminos; "contar" anima las cifras (no al restaurar el plan guardado).
  function mostrarResultado(invitados, porInvitado, contar = false) {
    const modelo = describirResultado(invitados, catalogo, porInvitado);
    resultadoCalculadora.classList.remove("calculadora__frase--error");
    resultadoCalculadora.textContent = modelo.frase;
    ponerTexto(sobrantesCalculadora, modelo.sobrantes);
    opcionesCalculadora.replaceChildren(...modelo.opciones.map(crearFilaOpcion));
    caminosCalculadora.hidden = false;
    if (contar) contarCifras(opcionesCalculadora);
  }

  // Un dato inválido reemplaza el resultado anterior por el aviso.
  function mostrarErrorCalculadora(mensaje) {
    resultadoCalculadora.classList.add("calculadora__frase--error");
    resultadoCalculadora.textContent = mensaje;
    ponerTexto(sobrantesCalculadora, "");
    opcionesCalculadora.replaceChildren();
    caminosCalculadora.hidden = true;
  }

  function marcarCaminoElegido() {
    opcionesCalculadora.querySelectorAll("[data-camino]").forEach((boton) => {
      boton.setAttribute("aria-pressed", String(boton.dataset.camino === plan.camino));
    });
  }

  function dibujarContextoCamino() {
    ponerTexto(contextoCamino, textoContextoCamino(plan));
  }

  // Datos a considerar: resalta el tramo (data-desde y data-hasta) que contiene lo escrito en "Bocaditos por invitado".
  // Vacío, decimal o fuera de 3 a 10: ninguno. No cambia ni rellena el campo.
  const itemsConsiderar = [...document.querySelectorAll(".considerar__item[data-desde]")];
  function resaltarTramo() {
    const texto = campoBocaditos.validity.badInput ? "" : campoBocaditos.value.trim();
    const valor = texto === "" ? NaN : Number(texto);
    itemsConsiderar.forEach((item) => {
      const dentro = Number.isInteger(valor) && valor >= Number(item.dataset.desde) && valor <= Number(item.dataset.hasta);
      if (dentro) item.setAttribute("aria-current", "true");
      else item.removeAttribute("aria-current");
    });
  }

  function calcularInvitados(evento) {
    evento.preventDefault();
    // Un número escrito a medias (por ejemplo "6e") llega vacío; se trata como inválido, no como dato que falta.
    const textoBocaditosCampo = campoBocaditos.validity.badInput ? "!" : campoBocaditos.value;
    const validacion = validarEntradaCalculadora(campoInvitados.value, textoBocaditosCampo);
    campoInvitados.removeAttribute("aria-invalid");
    campoBocaditos.removeAttribute("aria-invalid");
    if (!validacion.valido) {
      if (validacion.campos.includes("invitados")) campoInvitados.setAttribute("aria-invalid", "true");
      if (validacion.campos.includes("porInvitado")) campoBocaditos.setAttribute("aria-invalid", "true");
      mostrarErrorCalculadora(validacion.mensaje);
      (validacion.campos.includes("invitados") ? campoInvitados : campoBocaditos).focus();
      return;
    }
    plan = { invitados: validacion.invitados, porInvitado: validacion.porInvitado, camino: plan.camino };
    guardarPlan();
    resaltarTramo();
    mostrarResultado(plan.invitados, plan.porInvitado, true);
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
    if (!plan.invitados || !plan.porInvitado || !esCaminoValido(clave)) return;
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
  // Si falta alguno de los dos datos, se rellena el que hay y no se calcula nada.
  function restaurarPlan() {
    if (!plan.invitados) return;
    campoInvitados.value = String(plan.invitados);
    if (!plan.porInvitado) return;
    campoBocaditos.value = String(plan.porInvitado);
    resaltarTramo();
    mostrarResultado(plan.invitados, plan.porInvitado);
    if (plan.camino) aplicarFiltro(CAMINOS[plan.camino].filtro, false);
    dibujarContextoCamino();
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

  // Ventana flotante de novedad: sale al poco de cargar, no bloquea la página y SOLO se cierra con su X (sin Escape ni clic
  // fuera, por pedido del usuario). Reaparece en CADA carga o actualización de la página (más frecuencia informativa, a
  // pedido del usuario); pasada su fecha (data-hasta) deja de aparecer.
  const ventanaAviso = $("ventana-aviso");
  if (ventanaAviso) {
    const hasta = new Date(`${ventanaAviso.dataset.hasta}T23:59:59`);
    const vigente = Number.isNaN(hasta.getTime()) || new Date() <= hasta;
    if (vigente) {
      window.setTimeout(() => {
        ventanaAviso.hidden = false;
        $("ventana-aviso-cerrar").focus({ preventScroll: true });
      }, 700);
    }
    $("ventana-aviso-cerrar").addEventListener("click", () => {
      ventanaAviso.hidden = true;
    });
    for (const id of ["ventana-aviso-enlace", "ventana-aviso-enlace-texto"]) {
      $(id).addEventListener("click", (evento) => {
        evento.preventDefault(); // lleva a la tarjeta; la ventana sigue abierta hasta que se pulse la X
        irATarjeta("empanadas-amazonicas");
      });
    }
  }

  // Cuenta regresiva permanente y sutil (pegada al encabezado, sin botón de cierre). Se actualiza cada segundo con la pestaña
  // visible; los lectores de pantalla reciben un resumen solo cuando cambia el minuto. Se retira sola pasado data-hasta
  // (con 2026-10-01 desaparece el 2 de octubre) y entonces el encabezado recupera su altura normal.
  const cuentaMini = $("cuenta-mini");
  if (cuentaMini) {
    const hastaCuenta = new Date(`${cuentaMini.dataset.hasta}T23:59:59`);
    const objetivo = new Date(cuentaMini.dataset.objetivo).getTime();
    const caducada = !Number.isNaN(hastaCuenta.getTime()) && new Date() > hastaCuenta;
    if (caducada || Number.isNaN(objetivo)) {
      cuentaMini.hidden = true;
      document.documentElement.classList.remove("con-cuenta");
    } else {
      const campos = Object.fromEntries([...cuentaMini.querySelectorAll("[data-cuenta]")].map((el) => [el.dataset.cuenta, el]));
      let minutoAnunciado = -1;
      let temporizadorCuenta = 0;
      const dosCifras = (n) => String(n).padStart(2, "0");
      const pintarCuenta = () => {
        if (document.visibilityState === "hidden") return;
        const t = calcularCuentaRegresiva(Date.now(), objetivo);
        if (t.vencida) {
          $("cuenta-mini-frase").textContent = "¡Hoy salen las empanadas amazónicas!";
          $("cuenta-reloj").hidden = true;
          $("cuenta-resumen").textContent = "Hoy salen las empanadas amazónicas.";
          window.clearInterval(temporizadorCuenta);
          return;
        }
        campos.dias.textContent = dosCifras(t.dias);
        campos.horas.textContent = dosCifras(t.horas);
        campos.minutos.textContent = dosCifras(t.minutos);
        campos.segundos.textContent = dosCifras(t.segundos);
        const minutoTotal = t.dias * 1440 + t.horas * 60 + t.minutos;
        if (minutoTotal !== minutoAnunciado) {
          minutoAnunciado = minutoTotal;
          $("cuenta-resumen").textContent = `El sabor de la selva llega en ${t.dias} días, ${t.horas} horas y ${t.minutos} minutos.`;
        }
      };
      pintarCuenta();
      temporizadorCuenta = window.setInterval(pintarCuenta, 1000);
      document.addEventListener("visibilitychange", pintarCuenta);
      $("cuenta-mini-enlace").addEventListener("click", (evento) => {
        evento.preventDefault();
        irATarjeta("empanadas-amazonicas");
      });
    }
  }

  /* --- Protección contra copia (disuasión) ---
     Importante: en una página web NO se puede impedir de verdad copiar ni hacer capturas (basta una cámara, "ver código
     fuente" o desactivar JavaScript). Esto solo dificulta la copia casual: sin selección de texto, sin clic derecho, sin
     arrastrar imágenes, atajos de copiar/guardar/imprimir/inspeccionar bloqueados, impresión vacía, portapapeles limpio con
     Impr Pant y contenido oculto al perder el foco. La marca de agua (CSS) es la defensa más real ante una captura.
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
  formCalculadora.addEventListener("submit", calcularInvitados);
  [campoInvitados, campoBocaditos].forEach((campo) => {
    campo.addEventListener("input", () => campo.removeAttribute("aria-invalid"));
  });
  campoBocaditos.addEventListener("input", resaltarTramo);
  campoBocaditos.addEventListener("change", resaltarTramo);

  rejillaCombos.addEventListener("change", (evento) => {
    const entrada = tarjetasCombos.find((candidata) => candidata.tarjeta.contains(evento.target));
    if (entrada) actualizarTarjetaCombo(entrada);
  });
  rejillaCombos.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-agregar-combo]");
    if (boton) agregarComboDesdeTarjeta(boton);
  });

  opcionesCalculadora.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-camino]");
    if (boton) elegirCamino(boton.dataset.camino);
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
  restaurarPlan();
  dibujarLista();
  programarAvanceGaleria();
  sincronizarSubrayadoMenu();
  actualizarProgreso();
  arrancado = true;
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
    resumirCarrito, construirMensajePedido, construirMensajeCotizacion, construirMensajeReserva, calcularCuentaRegresiva, construirEnlaceWhatsApp, aCentimos, tienePrecios,
    registrar, aSoles, codificarSugerencia,
    CAMINOS, calcularMetas, evaluarAvance, describirEstadoLista, describirLista, normalizarPlan,
    textoContextoCamino, textoEventoPedido, textoSobrantesEquidad, textoSobrantesOpcion, planCompleto, mezclar, sacarDeBaraja,
    COMBOS, DESCUENTO_COMBO_CENTIMOS, BOCADITOS_POR_PERSONA, calcularPersonasCombo, calcularPrecioCombo, agregarCombo, normalizarLineaCombo, claveLinea, esLineaCombo,
    ORIGENES_PERMITIDOS, normalizarOrigen, leerOrigenDeURL, textoOrigen, agregarLineaOrigen, enlaceConOrigen,
    fijarOrigenMedicion
  };
}

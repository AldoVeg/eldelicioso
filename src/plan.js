// El Delicioso (plan): parte del código dividido en módulos.
import { UMBRAL_EXCEDIDO } from "./config.js";
import { formatearNumero } from "./dinero.js";
import { textoBocaditos, validarBocaditosPorInvitado, validarEntradaCalculadora, validarInvitados } from "./calculadora.js";
import { CAMINOS, CATEGORIAS, esCaminoValido } from "./armado.js";

/* ===== Funciones puras: plan (invitados y camino) y avance de la lista ===== */

// Datos guardados del plan -> { invitados, porInvitado, camino }; descarta lo dañado o inexistente.
// Los planes viejos sin "porInvitado" válido (ausente o fuera de 3 a 20) conservan los invitados si son
// válidos, dejan "porInvitado" en null y pierden el camino: sin ese dato no se puede calcular la meta.
export function normalizarPlan(crudo) {
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
export function textoContextoCamino(plan) {
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
export function textoEventoPedido(plan) {
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
export function describirLista({ items }, plan) {
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

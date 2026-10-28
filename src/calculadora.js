// El Delicioso (calculadora): parte del código dividido en módulos.
import { MAX_BOCADITOS_POR_INVITADO, MAX_INVITADOS, MAX_UNIDADES, MIN_BOCADITOS_POR_INVITADO, TAMANOS } from "./config.js";
import { formatearEntero, formatearNumero } from "./dinero.js";

/* ===== Funciones puras: calculadora de invitados ===== */

// Devuelve { valido, invitados, mensaje }; acepta texto o número.
export function validarInvitados(valor) {
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
export function validarBocaditosPorInvitado(valor) {
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
export function validarEntradaCalculadora(invitados, porInvitado) {
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
export function textoBocaditos(cantidad) {
  return `${cantidad} ${cantidad === 1 ? "bocadito" : "bocaditos"}`;
}

function totalPaquetes(paquetes) {
  return 100 * paquetes[100] + 50 * paquetes[50] + 25 * paquetes[25];
}

// Combinación de 100, 50 y 25 con el menor excedente para cubrir "necesarias" unidades.
export function combinarPaquetes(necesarias) {
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
export function calcularCombinacion(invitados, porInvitado) {
  const necesarias = invitados * porInvitado;
  const tamanoUnico = TAMANOS.find((tamano) => necesarias <= tamano);
  if (tamanoUnico) {
    const paquetes = { 100: 0, 50: 0, 25: 0, [tamanoUnico]: 1 };
    return { necesarias, paquetes, total: totalPaquetes(paquetes) };
  }
  return combinarPaquetes(necesarias);
}

// Fisher-Yates: devuelve una copia en orden aleatorio; "aleatorio" devuelve un número en [0, 1).
export function mezclar(lista, aleatorio = Math.random) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Baraja y reparte: cada elemento sale una vez antes de que se repita ninguno y, al rebarajar, el primero
// nunca es el último que salió. "baraja" es la lista de pendientes (se modifica); devuelve el siguiente.
export function sacarDeBaraja(baraja, elementos, ultimo, aleatorio = Math.random) {
  if (baraja.length === 0) {
    baraja.push(...mezclar(elementos, aleatorio));
    if (baraja.length > 1 && baraja[0] === ultimo) baraja.push(baraja.shift());
  }
  return baraja.shift();
}

// ["a", "b", "c"] -> "a, b y c"
export function unirLista(partes) {
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

export function textoResultadoCalculadora(invitados, porInvitado) {
  const combinacion = calcularCombinacion(invitados, porInvitado);
  return `Para ${invitados} ${invitados === 1 ? "invitado" : "invitados"} necesitas unas ${combinacion.necesarias} unidades. ` +
    textoSugerenciaPaquetes(invitados, porInvitado);
}

// "Te sugerimos 2 paquetes de 100 (200 unidades en total)."
export function textoSugerenciaPaquetes(invitados, porInvitado) {
  return `Te sugerimos ${describirCombinacion(calcularCombinacion(invitados, porInvitado))}.`;
}

// "Sobra 1 bocadito" / "Sobran 5 bocaditos"; "sustantivo" es [singular, plural].
export function textoSobran(cantidad, sustantivo) {
  return cantidad === 1 ? `Sobra 1 ${sustantivo[0]}` : `Sobran ${cantidad} ${sustantivo[1]}`;
}

// Línea de equidad de la frase principal: lo que sobra del total sugerido y cuánto tocaría a cada invitado.
export function textoSobrantesEquidad(invitados, porInvitado) {
  const { necesarias, total } = calcularCombinacion(invitados, porInvitado);
  const sobran = total - necesarias;
  if (sobran === 0) return `Reparto exacto: cada invitado recibe ${textoBocaditos(porInvitado)}.`;
  return `${textoSobran(sobran, ["bocadito", "bocaditos"])}: ` +
    `${sobran === 1 ? "repartido" : "repartidos"} por igual, cada invitado recibiría ${formatearNumero(total / invitados)}.`;
}

// El Delicioso (fechas): parte del código dividido en módulos.
import { DIAS_SEMANA, MESES, NEGOCIO } from "./config.js";

/* ===== Funciones puras: fechas ===== */

export function aISO(anio, mes, dia) {
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
export function formatearFechaLarga(iso) {
  const { anio, mes, dia } = leerFechaISO(iso);
  const diaSemana = DIAS_SEMANA[new Date(Date.UTC(anio, mes - 1, dia)).getUTCDay()];
  return `${diaSemana} ${dia} de ${MESES[mes - 1]} de ${anio}`;
}

export function fechaMinimaEvento(hoy, dias = NEGOCIO.anticipacionDias) {
  return sumarDias(fechaISOLocal(hoy), dias);
}

// Devuelve { valida, minimo, mensaje }.
export function validarFechaEvento(valor, hoy, dias = NEGOCIO.anticipacionDias) {
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

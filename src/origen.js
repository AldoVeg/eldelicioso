// El Delicioso (origen): parte del código dividido en módulos.
import { ALIAS_ORIGEN, ORIGENES_PERMITIDOS } from "./config.js";

/* ===== Funciones puras: origen de la visita ===== */

// Texto libre -> clave permitida ("qr", "instagram", ...) o null. Ignora mayúsculas y espacios; lo desconocido se descarta.
export function normalizarOrigen(valor) {
  if (typeof valor !== "string") return null;
  const limpio = valor.trim().toLowerCase();
  const clave = Object.prototype.hasOwnProperty.call(ALIAS_ORIGEN, limpio) ? ALIAS_ORIGEN[limpio] : limpio;
  return Object.prototype.hasOwnProperty.call(ORIGENES_PERMITIDOS, clave) ? clave : null;
}

// Lee ?origen= y, si no sirve, ?utm_source= de la cadena de consulta (por ejemplo "?origen=qr"). Devuelve la clave o null.
export function leerOrigenDeURL(cadenaConsulta) {
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
export function agregarLineaOrigen(mensaje, origen) {
  const linea = textoOrigen(origen);
  return linea ? `${mensaje}\n\n${linea}` : mensaje;
}

// Enlace wa.me prellenado -> el mismo enlace con la línea de origen sumada a su texto. Sin origen o sin texto, igual.
export function enlaceConOrigen(enlace, origen) {
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

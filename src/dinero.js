// El Delicioso (dinero): parte del código dividido en módulos.

/* ===== Funciones puras: dinero ===== */

// Los precios se manejan en céntimos enteros para evitar errores de decimales.
export function aCentimos(texto) {
  return Math.round(parseFloat(texto) * 100);
}

// 3550 -> "S/ 35,50"; los miles se separan con espacio duro: "S/ 1 250,00".
export function formatearMoneda(centimos) {
  const entero = Math.floor(centimos / 100);
  const decimales = String(centimos % 100).padStart(2, "0");
  const miles = String(entero).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `S/ ${miles},${decimales}`;
}

// 10000 -> "10 000" (con espacio duro entre miles, igual que el dinero).
export function formatearEntero(numero) {
  return String(numero).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// 7.5 -> "7,5"; 3.75 -> "3,75"; 6 -> "6" (máximo 2 decimales, coma decimal).
export function formatearNumero(numero) {
  return String(Math.round(numero * 100) / 100).replace(".", ",");
}

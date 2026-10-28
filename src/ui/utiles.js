// Utilidades compartidas por la interfaz (solo se cargan en el navegador).
export const $ = (id) => document.getElementById(id);

// Crea un elemento con clase y texto opcionales.
export function crear(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto) elemento.textContent = texto;
  return elemento;
}

export function ponerTexto(elemento, texto) {
  if (elemento.textContent !== texto) elemento.textContent = texto;
  elemento.hidden = texto === "";
}

// Preferencia del visitante por menos movimiento; con ella no hay animaciones ni avance automático.
export const consultaMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

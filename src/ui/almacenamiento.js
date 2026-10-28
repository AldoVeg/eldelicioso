// Lectura y escritura en localStorage; si el navegador lo bloquea, no se rompe nada.
export function leerAlmacenamiento(clave) {
  try {
    return JSON.parse(window.localStorage.getItem(clave));
  } catch (error) {
    return null;
  }
}

export function escribirAlmacenamiento(clave, valor) {
  try {
    window.localStorage.setItem(clave, JSON.stringify(valor));
  } catch (error) {
    // Almacenamiento bloqueado o lleno: se ignora.
  }
}

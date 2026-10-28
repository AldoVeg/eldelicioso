// Disuasión contra la copia casual (ver el comentario de abajo). Se activa una sola vez al arrancar.
export function iniciarProteccion() {
  /*
     Importante: en una página web NO se puede impedir de verdad copiar ni hacer capturas (basta una cámara, "ver código
     fuente" o desactivar JavaScript). Esto solo dificulta la copia casual: sin selección de texto, sin clic derecho, sin
     arrastrar imágenes, atajos de copiar/guardar/imprimir/inspeccionar bloqueados, impresión vacía, portapapeles limpio con
     Impr Pant y contenido oculto al perder el foco. (La marca de agua se probó y se retiró por pedido del usuario.)
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
}

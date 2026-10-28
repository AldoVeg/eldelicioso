// Portada, selector de grupo (Todo, Dulces, Salados) y galería de imágenes grandes: comparten un solo estado, el grupo activo.
import { DURACION_TRANSICION_GALERIA_MS, INTERVALO_GALERIA_MS, PAUSA_TRAS_TOQUE_MS } from "../config.js";
import { mezclar, sacarDeBaraja } from "../calculadora.js";
import { registrar } from "../medicion.js";
import { $, crear, consultaMovimiento } from "./utiles.js";

// "aplicarFiltro" (catálogo) y "estaArrancado" los entrega main.js; devuelve establecerGrupo, que aplicarFiltro necesita.
export function iniciarGaleria({ rejilla, aplicarFiltro, estaArrancado }) {
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
    cambiarFotoPortada(grupo, estaArrancado() && !consultaMovimiento.matches);
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
  consultaMovimiento.addEventListener("change", () => { programarAvanceGaleria(); dibujarBotonPausaGaleria(); });

  dibujarGaleria(grupoActual);
  dibujarBotonPausaGaleria();
  programarAvanceGaleria();

  return { establecerGrupo };
}

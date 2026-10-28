// Planificador de eventos en vivo: invitados y tipo de evento a la izquierda; resultado y tres caminos a la derecha.
import { DURACION_CONTEO_MS, MAX_BOCADITOS_POR_INVITADO, MAX_INVITADOS } from "../config.js";
import { calcularCombinacion, validarEntradaCalculadora } from "../calculadora.js";
import { CAMINOS, describirResultado, esCaminoValido } from "../armado.js";
import { textoContextoCamino } from "../plan.js";
import { filtrarEntradaNumerica } from "../mensajes.js";
import { codificarSugerencia, registrar } from "../medicion.js";
import { $, crear, consultaMovimiento, ponerTexto } from "./utiles.js";
import { sesion } from "./sesion.js";

// "aplicarFiltro" y "dibujarLista" los entrega main.js: elegir un camino filtra el catálogo y actualiza la lista.
export function iniciarPlanificador({ aplicarFiltro, dibujarLista }) {
  const seccionCatalogo = $("catalogo");
  const tituloCatalogo = $("titulo-catalogo");
  const contextoCamino = $("catalogo-contexto");
  const formCalculadora = $("form-calculadora");
  const campoInvitados = $("invitados");
  const campoBocaditos = $("bocaditos-por-invitado");
  const resultadoCalculadora = $("resultado-calculadora");
  const caminosCalculadora = $("calculadora-caminos");
  const opcionesCalculadora = $("calculadora-opciones");
  const vacioCalculadora = $("calculadora-vacio");
  const heroCalculadora = $("calculadora-hero");
  const botonElegirCamino = $("elegir-camino");

  // Cada camino es una opción de radio (marca, título y reparto). Un único botón al pie lleva al catálogo con el camino marcado.
  // "previo" es el camino que el visitante tenía marcado antes de recalcular, para no perderlo.
  function crearFilaOpcion(opcion, indice, previo) {
    const fila = crear("label", `opcion opcion--${opcion.clave}`);
    const radio = crear("input", "opcion__radio");
    radio.type = "radio";
    radio.name = "camino";
    radio.value = opcion.clave;
    const deseado = previo || sesion.plan.camino;
    radio.checked = deseado ? deseado === opcion.clave : indice === 0;
    const marca = crear("span", "opcion__marca");
    marca.setAttribute("aria-hidden", "true");
    const texto = crear("span", "opcion__texto");
    texto.append(crear("span", "opcion__titulo", opcion.titulo), crear("span", "opcion__reparto", opcion.reparto));
    texto.append(crear("span", "opcion__elegido", "Elegido para tu lista"));
    fila.append(radio, marca, texto);
    return fila;
  }

  function caminoMarcado() {
    const radio = opcionesCalculadora.querySelector(".opcion__radio:checked");
    return radio ? radio.value : null;
  }

  // Marca con "Elegido para tu lista" el camino que ya está en el plan.
  function actualizarBotonCamino() {
    botonElegirCamino.disabled = !caminoMarcado();
    opcionesCalculadora.querySelectorAll(".opcion").forEach((fila) => {
      fila.classList.toggle("opcion--elegida", Boolean(sesion.plan.camino) && fila.querySelector(".opcion__radio").value === sesion.plan.camino);
    });
  }

  // Cuenta de 0 al valor en ~500 ms (con movimiento reducido, el valor final directo). Antes de contar se reserva
  // el ancho de la cifra final, así nada se mueve.
  function contarCifras(raiz) {
    if (consultaMovimiento.matches) return;
    const cifras = [...raiz.querySelectorAll(".cifra-conteo")];
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

  // Estado del panel en vivo: sin resultado todavía (aviso inicial), con resultado o con un aviso de dato inválido.
  let resultadoVisible = false;

  function ocultarResultadoCalculadora() {
    resultadoCalculadora.classList.remove("calculadora__frase--error");
    resultadoCalculadora.textContent = "";
    heroCalculadora.hidden = true;
    opcionesCalculadora.replaceChildren();
    caminosCalculadora.hidden = true;
    vacioCalculadora.hidden = false;
    resultadoVisible = false;
  }

  // Muestra el resultado grande y los tres caminos; "contar" anima la cifra (solo la primera vez, no en cada tecla).
  function mostrarResultado(invitados, porInvitado, contar) {
    const modelo = describirResultado(invitados, porInvitado);
    const previo = caminoMarcado();
    resultadoCalculadora.classList.remove("calculadora__frase--error");
    resultadoCalculadora.classList.add("solo-lectores");
    resultadoCalculadora.textContent = modelo.frase;
    const cifra = $("calculadora-cifra");
    cifra.style.minWidth = "";
    cifra.textContent = String(modelo.necesarias);
    cifra.dataset.valor = String(modelo.necesarias);
    $("calculadora-sugerencia").textContent = modelo.sugerencia;
    heroCalculadora.hidden = false;
    opcionesCalculadora.replaceChildren(...modelo.opciones.map((opcion, indice) => crearFilaOpcion(opcion, indice, previo)));
    vacioCalculadora.hidden = true;
    caminosCalculadora.hidden = false;
    actualizarBotonCamino();
    resultadoVisible = true;
    if (contar) contarCifras(heroCalculadora);
  }

  // Un dato inválido reemplaza el resultado anterior por el aviso.
  function mostrarErrorCalculadora(mensaje) {
    resultadoCalculadora.classList.add("calculadora__frase--error");
    resultadoCalculadora.classList.remove("solo-lectores");
    resultadoCalculadora.textContent = mensaje;
    heroCalculadora.hidden = true;
    opcionesCalculadora.replaceChildren();
    vacioCalculadora.hidden = true;
    caminosCalculadora.hidden = true;
    resultadoVisible = false;
  }

  function marcarCaminoElegido() {
    const radio = [...opcionesCalculadora.querySelectorAll(".opcion__radio")].find((candidato) => candidato.value === sesion.plan.camino);
    if (radio) radio.checked = true;
    actualizarBotonCamino();
  }

  function dibujarContextoCamino() {
    ponerTexto(contextoCamino, textoContextoCamino(sesion.plan));
  }

  // Paso 2: marca (aria-pressed) el tipo de evento cuyo tramo (data-desde y data-hasta) contiene lo escrito en "Bocaditos por
  // invitado". Vacío, decimal o fuera de 3 a 20: ninguno. Al pulsar un evento se rellena el campo con su valor típico.
  const botonesEvento = [...document.querySelectorAll(".evento[data-desde]")];
  function marcarEvento() {
    const texto = campoBocaditos.value.trim();
    const valor = texto === "" ? NaN : Number(texto);
    botonesEvento.forEach((boton) => {
      const dentro = Number.isInteger(valor) && valor >= Number(boton.dataset.desde) && valor <= Number(boton.dataset.hasta);
      boton.setAttribute("aria-pressed", String(dentro));
    });
  }

  // Panel en vivo: cada vez que cambia un campo se recalcula, sin botón. Si falta un dato se vuelve al aviso inicial; un
  // dato fuera de rango muestra su aviso tras una pausa corta (así "1" camino a "15" no parpadea); el resultado se mide
  // una vez que el visitante deja de escribir.
  let temporizadorAviso = 0;
  let temporizadorMedicion = 0;
  function calcularEnVivo() {
    window.clearTimeout(temporizadorAviso);
    window.clearTimeout(temporizadorMedicion);
    campoInvitados.removeAttribute("aria-invalid");
    campoBocaditos.removeAttribute("aria-invalid");
    if (campoInvitados.value.trim() === "" || campoBocaditos.value.trim() === "") {
      ocultarResultadoCalculadora();
      return;
    }
    const validacion = validarEntradaCalculadora(campoInvitados.value, campoBocaditos.value);
    if (!validacion.valido) {
      temporizadorAviso = window.setTimeout(() => {
        if (validacion.campos.includes("invitados")) campoInvitados.setAttribute("aria-invalid", "true");
        if (validacion.campos.includes("porInvitado")) campoBocaditos.setAttribute("aria-invalid", "true");
        mostrarErrorCalculadora(validacion.mensaje);
      }, 700);
      return;
    }
    sesion.plan = { invitados: validacion.invitados, porInvitado: validacion.porInvitado, camino: sesion.plan.camino };
    mostrarResultado(sesion.plan.invitados, sesion.plan.porInvitado, !resultadoVisible);
    dibujarContextoCamino();
    dibujarLista();
    temporizadorMedicion = window.setTimeout(() => {
      registrar("usar_calculadora", {
        invitados: sesion.plan.invitados,
        bocaditos_por_invitado: sesion.plan.porInvitado,
        sugerencia: codificarSugerencia(calcularCombinacion(sesion.plan.invitados, sesion.plan.porInvitado))
      });
    }, 1200);
  }

  // Lleva al catálogo con desplazamiento suave (sin animación si el visitante prefiere menos movimiento).
  function irAlCatalogo() {
    seccionCatalogo.scrollIntoView({ behavior: consultaMovimiento.matches ? "auto" : "smooth", block: "start" });
    tituloCatalogo.focus({ preventScroll: true });
  }

  function elegirCamino(clave) {
    if (!sesion.plan.invitados || !sesion.plan.porInvitado || !esCaminoValido(clave)) return;
    sesion.plan = { invitados: sesion.plan.invitados, porInvitado: sesion.plan.porInvitado, camino: clave };
    marcarCaminoElegido();
    aplicarFiltro(CAMINOS[clave].filtro, false);
    dibujarContextoCamino();
    dibujarLista();
    registrar("elegir_camino", { camino: clave, invitados: sesion.plan.invitados, bocaditos_por_invitado: sesion.plan.porInvitado });
    irAlCatalogo();
  }

  formCalculadora.addEventListener("submit", (evento) => evento.preventDefault()); // panel en vivo: Intro no envía nada

  // Campos de la calculadora: solo dígitos, tope de dígitos y de valor (invitados hasta 1000 = 4 dígitos; bocaditos por
  // invitado hasta 20 = 2 dígitos). Son campos de texto numérico (no type="number"), así no hay flechitas, ni rueda del
  // ratón, ni incremento con las flechas del teclado; aun así se bloquean por si acaso.
  const limitesCalculadora = [[campoInvitados, 4, MAX_INVITADOS], [campoBocaditos, 2, MAX_BOCADITOS_POR_INVITADO]];
  for (const [campo, maxDigitos, maximo] of limitesCalculadora) {
    let ultimoValido = "";
    campo.addEventListener("beforeinput", (evento) => {
      if (evento.data && /\D/.test(evento.data)) evento.preventDefault(); // letras, signos, puntos y espacios no entran
    });
    campo.addEventListener("keydown", (evento) => {
      if (evento.key === "ArrowUp" || evento.key === "ArrowDown") evento.preventDefault();
    });
    campo.addEventListener("wheel", (evento) => { if (document.activeElement === campo) evento.preventDefault(); }, { passive: false });
    campo.addEventListener("input", () => {
      const filtrado = filtrarEntradaNumerica(campo.value, maxDigitos, maximo, ultimoValido);
      if (filtrado !== campo.value) campo.value = filtrado; // cubre pegar, arrastrar y autocompletar
      ultimoValido = filtrado;
    });
  }
  [campoInvitados, campoBocaditos].forEach((campo) => {
    campo.addEventListener("input", () => campo.removeAttribute("aria-invalid"));
  });
  campoBocaditos.addEventListener("input", marcarEvento);
  campoBocaditos.addEventListener("change", marcarEvento);
  [campoInvitados, campoBocaditos].forEach((campo) => campo.addEventListener("input", calcularEnVivo));
  botonesEvento.forEach((boton) => {
    boton.addEventListener("click", () => {
      campoBocaditos.value = boton.dataset.bocaditos;
      campoBocaditos.dispatchEvent(new Event("input", { bubbles: true }));
    });
  });

  opcionesCalculadora.addEventListener("change", actualizarBotonCamino);
  botonElegirCamino.addEventListener("click", () => {
    const clave = caminoMarcado();
    if (clave) elegirCamino(clave);
  });
}

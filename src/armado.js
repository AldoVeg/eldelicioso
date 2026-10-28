// El Delicioso (armado): parte del código dividido en módulos.
import { TAMANOS } from "./config.js";
import { calcularCombinacion, combinarPaquetes, textoResultadoCalculadora, textoSugerenciaPaquetes } from "./calculadora.js";

/* ===== Funciones puras: tres formas de armar el pedido ===== */

export const CATEGORIAS = [
  { clave: "dulce", etiqueta: "Dulces", singular: "dulce", unidad: "dulces" },
  { clave: "salado", etiqueta: "Salados", singular: "salado", unidad: "salados" }
];

// Los tres caminos que ofrece el planificador; "filtro" es el filtro del catálogo que activan.
export const CAMINOS = {
  mixto: {
    clave: "mixto",
    nombre: "Mixto",
    titulo: "Mixto",
    filtro: "todos",
    texto: "mixto"
  },
  dulces: {
    clave: "dulces",
    nombre: "Solo dulces",
    titulo: "Solo dulces",
    filtro: "dulce",
    texto: "solo dulces"
  },
  salados: {
    clave: "salados",
    nombre: "Solo salados",
    titulo: "Solo salados",
    filtro: "salado",
    texto: "solo salados"
  }
};

export function esCaminoValido(clave) {
  return typeof clave === "string" && Object.prototype.hasOwnProperty.call(CAMINOS, clave);
}

// El catálogo es un Map id -> { nombre, categoria, tamanos: [25, 50, 100], precios: { 25, 50, 100 } en céntimos }.
// "tamanos" son los paquetes que vende ESE producto; la mayoría usa TAMANOS (25/50/100), pero alguno puede
// declarar su propio conjunto (hoy los vasitos: 12/25/50) mediante data-tamanos en el HTML (ver leerCatalogo).
// Un producto "por cotizar" no tiene precios: no se suma, no se sugiere y no se puede agregar a la lista.
export function tienePrecios(producto) {
  return Boolean(producto && producto.precios
    && (producto.tamanos || TAMANOS).every((tamano) => Number.isFinite(producto.precios[tamano])));
}

const SIN_PAQUETES = { necesarias: 0, paquetes: { 100: 0, 50: 0, 25: 0 }, total: 0 };

// Una opción reparte las unidades entre dulces y salados; cada parte es { necesarias, paquetes, total }.
function armarOpcion(clave, titulo, partes) {
  return { clave, titulo, dulce: partes.dulce, salado: partes.salado, unidades: partes.dulce.total + partes.salado.total };
}

// Mixto: mitad dulces y mitad salados (la mitad se redondea hacia arriba), cada una con menor excedente.
// Solo dulces o solo salados: la misma combinación que sugiere la frase principal.
function calcularOpciones(invitados, porInvitado) {
  const mitad = Math.ceil((invitados * porInvitado) / 2);
  const completa = calcularCombinacion(invitados, porInvitado);
  return [
    armarOpcion("mixto", CAMINOS.mixto.titulo, { dulce: combinarPaquetes(mitad), salado: combinarPaquetes(mitad) }),
    armarOpcion("dulces", CAMINOS.dulces.titulo, { dulce: completa, salado: SIN_PAQUETES }),
    armarOpcion("salados", CAMINOS.salados.titulo, { dulce: SIN_PAQUETES, salado: completa })
  ];
}

// Modelo de texto del resultado; la interfaz solo lo dibuja. "reparto" de cada opción: "100 dulces + 100 salados" en el
// mixto y "200 dulces" o "200 salados" en los otros dos.
export function describirResultado(invitados, porInvitado) {
  const opciones = calcularOpciones(invitados, porInvitado).map((opcion) => ({
    clave: opcion.clave,
    titulo: opcion.titulo,
    reparto: opcion.clave === "mixto" ? `${opcion.dulce.total} dulces + ${opcion.salado.total} salados` : `${opcion.unidades} ${opcion.clave}`
  }));
  return {
    frase: textoResultadoCalculadora(invitados, porInvitado),
    necesarias: calcularCombinacion(invitados, porInvitado).necesarias,
    sugerencia: textoSugerenciaPaquetes(invitados, porInvitado),
    opciones
  };
}

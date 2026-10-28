// El Delicioso (armado): parte del código dividido en módulos.
import { MAX_LINEAS_SUGERENCIA, TAMANOS } from "./config.js";
import { calcularCombinacion, combinarPaquetes, textoResultadoCalculadora, textoSobran, textoSobrantesEquidad, unirLista } from "./calculadora.js";

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
    descripcion: "Mitad dulces, mitad salados: variedad para todos los gustos.",
    boton: "Elegir mixto",
    ayuda: "Debajo verás todos los productos",
    filtro: "todos",
    texto: "mixto"
  },
  dulces: {
    clave: "dulces",
    nombre: "Solo dulces",
    titulo: "Solo dulces",
    descripcion: "Toda la mesa para los golosos: solo opciones dulces.",
    boton: "Elegir dulces",
    ayuda: "Debajo verás las opciones dulces",
    filtro: "dulce",
    texto: "solo dulces"
  },
  salados: {
    clave: "salados",
    nombre: "Solo salados",
    titulo: "Solo salados",
    descripcion: "Una mesa salada, para picar sin parar.",
    boton: "Elegir salados",
    ayuda: "Debajo verás las opciones saladas",
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

function productosDeCategoria(catalogo, categoria) {
  return [...catalogo.values()].filter((producto) => producto.categoria === categoria && tienePrecios(producto));
}

// Sugerencia concreta de una categoría: reparte los paquetes (de mayor a menor tamaño) entre productos
// DISTINTOS, recorriéndolos en el orden del catálogo y dando la vuelta si hay más paquetes que productos.
// Cada tamaño solo se reparte entre los productos que de verdad lo venden (producto.tamanos lo incluye);
// así un producto sin paquete de 100 (por ejemplo los vasitos, que solo venden 12/25/50) nunca recibe uno.
// Un mismo producto con el mismo tamaño se agrupa sumando unidades. El total sale de los precios reales.
// Devuelve { lineas: [{ nombre, tamano, unidades }], total } (total en céntimos; null sin productos).
function sugerirProductos(paquetes, productos) {
  if (productos.length === 0) return { lineas: [], total: null };
  const grupos = new Map();
  let total = 0;
  let turno = 0;
  for (const tamano of [100, 50, 25]) {
    const productosDelTamano = productos.filter((producto) => (producto.tamanos || TAMANOS).includes(tamano));
    if (productosDelTamano.length === 0) continue; // ningún producto de esta categoría vende este tamaño
    for (let i = 0; i < paquetes[tamano]; i++) {
      const posicion = turno % productosDelTamano.length;
      turno += 1;
      const producto = productosDelTamano[posicion];
      total += producto.precios[tamano];
      const clave = `${producto.nombre}|${tamano}`;
      const grupo = grupos.get(clave) || { nombre: producto.nombre, tamano, unidades: 0 };
      grupo.unidades += tamano;
      grupos.set(clave, grupo);
    }
  }
  return { lineas: [...grupos.values()], total };
}

// Líneas de texto de una sugerencia: hasta MAX_LINEAS_SUGERENCIA y, si sobran, "y n sabores más".
// Devuelve [{ texto, extra }]; "extra" marca la línea final de resumen.
function describirSugerencia({ lineas }, maximo = MAX_LINEAS_SUGERENCIA) {
  const visibles = lineas.slice(0, maximo);
  const ocultas = lineas.slice(maximo);
  const resultado = visibles.map((linea) => ({ texto: `${linea.unidades} unid. ${linea.nombre}`, extra: false }));
  if (ocultas.length > 0) {
    const vistos = new Set(visibles.map((linea) => linea.nombre));
    const sabores = new Set(ocultas.map((linea) => linea.nombre).filter((nombre) => !vistos.has(nombre)));
    // Si lo oculto son otros tamaños de sabores ya mostrados, se cuentan como paquetes.
    resultado.push({
      texto: sabores.size > 0 ? `y ${sabores.size} sabores más` : `y ${ocultas.length} paquetes más`,
      extra: true
    });
  }
  return resultado;
}

const SIN_PAQUETES = { necesarias: 0, paquetes: { 100: 0, 50: 0, 25: 0 }, total: 0 };

// Una opción reparte las unidades entre dulces y salados; cada parte es { necesarias, paquetes, total }.
// "sugerencias" trae la sugerencia de productos por categoría (null si esa categoría no lleva nada) y
// "precio" el total exacto en céntimos (null si alguna categoría no tiene productos en el catálogo).
function armarOpcion(clave, titulo, partes, invitados, catalogo) {
  const sugerencias = { dulce: null, salado: null };
  let precio = 0;
  for (const categoria of CATEGORIAS) {
    const parte = partes[categoria.clave];
    if (parte.total === 0) continue;
    const sugerencia = sugerirProductos(parte.paquetes, productosDeCategoria(catalogo, categoria.clave));
    sugerencias[categoria.clave] = sugerencia;
    precio = precio !== null && sugerencia.total !== null ? precio + sugerencia.total : null;
  }
  const unidades = partes.dulce.total + partes.salado.total;
  // Sobrantes por categoría: lo que pasa de la meta de esa categoría.
  const sobran = { dulce: partes.dulce.total - partes.dulce.necesarias, salado: partes.salado.total - partes.salado.necesarias };
  return {
    clave,
    titulo,
    dulce: partes.dulce,
    salado: partes.salado,
    unidades,
    sobran,
    porInvitado: unidades / invitados,
    sugerencias,
    precio
  };
}

// Mixto: mitad dulces y mitad salados (la mitad se redondea hacia arriba), cada una con menor excedente.
// Solo dulces o solo salados: la misma combinación que sugiere la frase principal.
function calcularOpciones(invitados, catalogo, porInvitado) {
  const necesarias = invitados * porInvitado;
  const mitad = Math.ceil(necesarias / 2);
  const completa = calcularCombinacion(invitados, porInvitado);
  return [
    armarOpcion("mixto", CAMINOS.mixto.titulo,
      { dulce: combinarPaquetes(mitad), salado: combinarPaquetes(mitad) }, invitados, catalogo),
    armarOpcion("dulces", CAMINOS.dulces.titulo, { dulce: completa, salado: SIN_PAQUETES }, invitados, catalogo),
    armarOpcion("salados", CAMINOS.salados.titulo, { dulce: SIN_PAQUETES, salado: completa }, invitados, catalogo)
  ];
}

// Sobrantes de una opción: "Reparto exacto", "Sobran 5 unidades" o, en el mixto, "Sobran 30: 15 dulces y 15 salados".
function textoSobrantesOpcion(opcion) {
  const total = opcion.sobran.dulce + opcion.sobran.salado;
  if (total === 0) return "Reparto exacto";
  if (opcion.clave !== "mixto") return textoSobran(total, ["unidad", "unidades"]);
  const partes = CATEGORIAS
    .filter((categoria) => opcion.sobran[categoria.clave] > 0)
    .map((categoria) => `${opcion.sobran[categoria.clave]} ${opcion.sobran[categoria.clave] === 1 ? categoria.singular : categoria.unidad}`);
  return `${total === 1 ? "Sobra" : "Sobran"} ${total}: ${unirLista(partes)}`;
}

// Modelo de texto de todo el resultado; la interfaz solo lo dibuja.
// Cada opción trae "grupos": [{ etiqueta, lineas: [{ texto, extra }] }]; la etiqueta (Dulces/Salados)
// solo aparece en el mixto, donde hay dos grupos.
export function describirResultado(invitados, catalogo, porInvitado) {
  const opciones = calcularOpciones(invitados, catalogo, porInvitado).map((opcion) => ({
    clave: opcion.clave,
    titulo: opcion.titulo,
    boton: CAMINOS[opcion.clave].boton,
    unidades: `${opcion.unidades} unidades`,
    reparto: opcion.clave === "mixto" ? `${opcion.dulce.total} dulces + ${opcion.salado.total} salados` : "",
    sobrantes: textoSobrantesOpcion(opcion),
    grupos: CATEGORIAS
      .filter((categoria) => opcion.sugerencias[categoria.clave])
      .map((categoria) => ({
        etiqueta: opcion.clave === "mixto" ? categoria.etiqueta : "",
        lineas: describirSugerencia(opcion.sugerencias[categoria.clave])
      }))
  }));
  return {
    frase: textoResultadoCalculadora(invitados, porInvitado),
    sobrantes: textoSobrantesEquidad(invitados, porInvitado),
    tituloCaminos: "Elige tu camino",
    opciones
  };
}

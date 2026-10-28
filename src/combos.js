// El Delicioso (combos): parte del código dividido en módulos.
import { ALIAS_IDS, BOCADITOS_POR_PERSONA, COMBOS, DESCUENTO_COMBO_CENTIMOS, MAX_PACKS_POR_LINEA, MITADES_COMBO, TAMANOS } from "./config.js";
import { tienePrecios } from "./armado.js";
import { claveLinea, esLineaCombo } from "./carrito.js";

/* ===== Funciones puras: combos por ocasión ===== */

function esComboValido(clave) {
  return typeof clave === "string" && Object.prototype.hasOwnProperty.call(COMBOS, clave);
}

// Precio de UN combo: suma de los precios de catálogo de cada mitad (paquete "tamano") menos DESCUENTO_COMBO_CENTIMOS.
// Todo en céntimos. Devuelve null si algún dato no vale (producto sin precio, categoría
// cambiada o tamaño no permitido). Ejemplo: 35,00 + 28,00 = 63,00 -> S/ 62,00.
export function calcularPrecioCombo(catalogo, { dulce, salado, tamano }) {
  const productoDulce = catalogo.get(dulce);
  const productoSalado = catalogo.get(salado);
  if (!tienePrecios(productoDulce) || !tienePrecios(productoSalado)) return null;
  if (productoDulce.categoria !== "dulce" || productoSalado.categoria !== "salado") return null;
  if (!MITADES_COMBO.includes(tamano)) return null;
  const anteriorCentimos = productoDulce.precios[tamano] + productoSalado.precios[tamano];
  // Todo con enteros (céntimos) para no depender de decimales binarios; el precio nunca baja de cero.
  const comboCentimos = Math.max(anteriorCentimos - DESCUENTO_COMBO_CENTIMOS, 0);
  return { anteriorCentimos, comboCentimos, ahorroCentimos: anteriorCentimos - comboCentimos };
}

// Para cuántas personas alcanza un combo contando BOCADITOS_POR_PERSONA por cabeza (solo personas completas).
export function calcularPersonasCombo(unidades) {
  if (!Number.isInteger(unidades) || unidades < 0) return 0;
  return Math.floor(unidades / BOCADITOS_POR_PERSONA);
}

// Devuelve la línea limpia de un combo guardado o null si está dañado, ya no existe o no coincide con su definición.
function normalizarLineaCombo(item, catalogo) {
  if (!esComboValido(item.combo)) return null;
  const definicion = COMBOS[item.combo];
  const dulce = ALIAS_IDS[item.dulce] || item.dulce;
  const salado = ALIAS_IDS[item.salado] || item.salado;
  const tamanoPermitido = definicion.total ? item.tamano === definicion.total / 2 : MITADES_COMBO.includes(item.tamano);
  if (!tamanoPermitido || !Number.isInteger(item.packs) || item.packs < 1) return null;
  if (!calcularPrecioCombo(catalogo, { dulce, salado, tamano: item.tamano })) return null;
  return { combo: item.combo, dulce, salado, tamano: item.tamano, packs: Math.min(item.packs, MAX_PACKS_POR_LINEA) };
}

// Descarta datos guardados que ya no existan en el catálogo o estén dañados.
export function normalizarLineas(crudo, catalogo) {
  if (!Array.isArray(crudo)) return [];
  const vistas = new Set();
  const limpias = [];
  for (const item of crudo) {
    if (!item) continue;
    if (item.combo) {
      const combo = normalizarLineaCombo(item, catalogo);
      if (combo && !vistas.has(claveLinea(combo))) {
        vistas.add(claveLinea(combo));
        limpias.push(combo);
      }
      continue;
    }
    const id = ALIAS_IDS[item.id] || item.id;
    const producto = catalogo.get(id);
    if (!tienePrecios(producto) || !(producto.tamanos || TAMANOS).includes(item.tamano)) continue;
    if (!Number.isInteger(item.packs) || item.packs < 1) continue;
    const linea = { id, tamano: item.tamano, packs: Math.min(item.packs, MAX_PACKS_POR_LINEA) };
    if (vistas.has(claveLinea(linea))) continue;
    vistas.add(claveLinea(linea));
    limpias.push(linea);
  }
  return limpias;
}

// Línea de combo con todo lo que muestran la lista y el mensaje. El subtotal YA lleva el descuento
// (precio de un combo x cantidad), así el total de la lista y el del mensaje son siempre el mismo número.
function resumirCombo(linea, catalogo) {
  const definicion = COMBOS[linea.combo];
  const precio = calcularPrecioCombo(catalogo, linea);
  const nombreSalado = catalogo.get(linea.salado).nombre;
  const nombreDulce = catalogo.get(linea.dulce).nombre;
  const porMitad = linea.tamano * linea.packs;
  return {
    ...linea,
    clave: claveLinea(linea),
    esCombo: true,
    nombre: definicion.nombreLista,
    categoria: "combo",
    ids: [linea.salado, linea.dulce],
    unidades: porMitad * 2,
    porCategoria: { dulce: porMitad, salado: porMitad },
    composicion: `${linea.tamano} ${nombreSalado} + ${linea.tamano} ${nombreDulce}`,
    precioAnteriorCentimos: precio.anteriorCentimos * linea.packs,
    ahorroCentimos: precio.ahorroCentimos * linea.packs,
    subtotalCentimos: precio.comboCentimos * linea.packs
  };
}

// Añade a cada línea nombre, unidades y subtotal; y calcula total y cantidad de packs.
export function resumirCarrito(lineas, catalogo) {
  const items = lineas.map((linea) => {
    if (esLineaCombo(linea)) return resumirCombo(linea, catalogo);
    const producto = catalogo.get(linea.id);
    const unidades = linea.tamano * linea.packs;
    return {
      ...linea,
      clave: claveLinea(linea),
      nombre: producto.nombre,
      categoria: producto.categoria,
      ids: [linea.id],
      unidades,
      porCategoria: { [producto.categoria]: unidades },
      subtotalCentimos: producto.precios[linea.tamano] * linea.packs
    };
  });
  return {
    items,
    totalCentimos: items.reduce((suma, item) => suma + item.subtotalCentimos, 0),
    cantidadPacks: items.reduce((suma, item) => suma + item.packs, 0)
  };
}

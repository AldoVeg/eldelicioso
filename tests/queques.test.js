// Pruebas de "El pecado más vendido" (queques rectangulares): datos, mensaje y coherencia con el HTML.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DETALLES_QUEQUE, FAMILIAS, QUEQUES, datosEstructurados, construirMensajeQueque, miniaturaDe, rotuloFamilia, textoPrecioDolares, textoPrecioQueque } from "../src/queques.js";

const html = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "index.html"), "utf8");

test("las versiones de queque tienen id único, nombre, matiz y color válido", () => {
  assert.equal(new Set(QUEQUES.map((k) => k.id)).size, QUEQUES.length);
  for (const k of QUEQUES) {
    assert.ok(k.nombre && k.matiz, `${k.id} sin nombre o matiz`);
    assert.match(k.tono, /^#[0-9A-Fa-f]{6}$/, `${k.id}: color inválido`);
    assert.ok(k.precioCentimos === null || Number.isInteger(k.precioCentimos), `${k.id}: precio inválido`);
  }
});

test("el precio muestra 'Consultar precio' mientras no se conoce y el mensaje incluye el sabor", () => {
  const sinPrecio = QUEQUES.find((k) => k.id === "oreo");
  assert.equal(textoPrecioQueque(sinPrecio), "Consultar precio");
  assert.match(construirMensajeQueque(sinPrecio), /queque rectangular de oreo\./);
  const conPrecio = { ...sinPrecio, precioCentimos: 3500 };
  assert.equal(textoPrecioQueque(conPrecio), "S/ 35,00");
  assert.match(construirMensajeQueque(conPrecio), /de oreo \(S\/ 35,00\)/);
});

test("precios confirmados por el dueño: piña y durazno S/ 13, arándano S/ 15", () => {
  const precio = (id) => QUEQUES.find((k) => k.id === id).precioCentimos;
  assert.deepEqual([precio("pina"), precio("durazno"), precio("arandano")], [1300, 1300, 1500]);
  assert.equal(textoPrecioQueque(QUEQUES.find((k) => k.id === "arandano")), "S/ 15,00");
});

test("los datos comunes de los queques incluyen medidas, sello casero y el aviso de delivery", () => {
  assert.ok(DETALLES_QUEQUE.datos.includes("20 cm × 12 cm"));
  assert.ok(DETALLES_QUEQUE.datos.some((d) => d.includes("casero")));
  assert.match(DETALLES_QUEQUE.aviso, /No incluye delivery/);
});

test("el HTML no escribe la cantidad de versiones a mano: la pone el script al dibujar", () => {
  assert.doesNotMatch(html, /\d+ versiones/);
  assert.ok(html.includes('id="queques-cantidad"'));
});

test("cada sabor tiene una familia de la guía y las familias van seguidas en la lista", () => {
  assert.ok(QUEQUES.every((k) => FAMILIAS.includes(k.familia)), "hay un sabor sin familia válida");
  const orden = QUEQUES.map((k) => k.familia).filter((f, i, todas) => f !== todas[i - 1]);
  assert.deepEqual(orden, FAMILIAS.filter((f) => QUEQUES.some((k) => k.familia === f)), "las familias no van agrupadas ni en el orden de la guía");
});

test("el rótulo de la guía cuenta los sabores y omite el número si hay uno solo", () => {
  assert.equal(rotuloFamilia("Novia"), "Novia");
  assert.equal(rotuloFamilia("Chocolate"), "Chocolate · 3");
  assert.equal(rotuloFamilia("Frutales"), `Frutales · ${QUEQUES.filter((k) => k.familia === "Frutales").length}`);
});

test("la miniatura sale de la ruta de la foto y solo existe si hay foto", () => {
  assert.equal(miniaturaDe({ foto: "img/QUEQUES/pina.webp" }), "img/QUEQUES/min/pina.webp");
  assert.equal(miniaturaDe({}), null);
});

test("la referencia en dólares redondea al medio dólar y no aparece sin precio", () => {
  const por = (id) => QUEQUES.find((q) => q.id === id);
  assert.equal(textoPrecioDolares(por("pina")), "≈ US$ 4,00"); // S/ 13 a 3,45 = 3,77
  assert.equal(textoPrecioDolares(por("arandano")), "≈ US$ 4,50"); // S/ 15 a 3,45 = 4,35
  assert.equal(textoPrecioDolares(por("oreo")), null);
});

test("los datos estructurados incluyen solo los queques con precio, en soles y con su foto", () => {
  const datos = datosEstructurados(QUEQUES, "https://eldelicioso.vercel.app");
  const items = datos.itemListElement.map((e) => e.item);
  assert.equal(items.length, QUEQUES.filter((q) => q.precioCentimos !== null).length);
  assert.ok(items.every((i) => i.offers.priceCurrency === "PEN" && /^\d+\.\d{2}$/.test(i.offers.price)));
  const pina = items.find((i) => i.name === "Queque rectangular de piña");
  assert.equal(pina.offers.price, "13.00");
  assert.equal(pina.image, "https://eldelicioso.vercel.app/img/QUEQUES/pina.webp");
  assert.ok(!JSON.stringify(datos).includes("aggregateRating"), "no se inventan valoraciones");
});

test("el HTML anuncia los queques en el título y en el rango de precios", () => {
  assert.match(html, /<title>[^<]*queques[^<]*<\/title>/i);
  assert.ok(html.includes('"priceRange": "S/ 13 - S/ 255"'));
});

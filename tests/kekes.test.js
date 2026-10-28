// Pruebas de "El pecado más vendido" (kekes rectangulares): datos, mensaje y coherencia con el HTML.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DETALLES_KEKE, FAMILIAS, KEKES, construirMensajeKeke, miniaturaDe, rotuloFamilia, textoPrecioKeke } from "../src/kekes.js";

const html = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "index.html"), "utf8");

test("las versiones de keke tienen id único, nombre, matiz y color válido", () => {
  assert.equal(new Set(KEKES.map((k) => k.id)).size, KEKES.length);
  for (const k of KEKES) {
    assert.ok(k.nombre && k.matiz, `${k.id} sin nombre o matiz`);
    assert.match(k.tono, /^#[0-9A-Fa-f]{6}$/, `${k.id}: color inválido`);
    assert.ok(k.precioCentimos === null || Number.isInteger(k.precioCentimos), `${k.id}: precio inválido`);
  }
});

test("el precio muestra 'Consultar precio' mientras no se conoce y el mensaje incluye el sabor", () => {
  const sinPrecio = KEKES.find((k) => k.id === "oreo");
  assert.equal(textoPrecioKeke(sinPrecio), "Consultar precio");
  assert.match(construirMensajeKeke(sinPrecio), /keke rectangular de oreo\./);
  const conPrecio = { ...sinPrecio, precioCentimos: 3500 };
  assert.equal(textoPrecioKeke(conPrecio), "S/ 35,00");
  assert.match(construirMensajeKeke(conPrecio), /de oreo \(S\/ 35,00\)/);
});

test("precios confirmados por el dueño: piña y durazno S/ 13, arándano S/ 15", () => {
  const precio = (id) => KEKES.find((k) => k.id === id).precioCentimos;
  assert.deepEqual([precio("pina"), precio("durazno"), precio("arandano")], [1300, 1300, 1500]);
  assert.equal(textoPrecioKeke(KEKES.find((k) => k.id === "arandano")), "S/ 15,00");
});

test("los datos comunes de los kekes incluyen medidas, sello casero y el aviso de delivery", () => {
  assert.ok(DETALLES_KEKE.datos.includes("20 cm × 12 cm"));
  assert.ok(DETALLES_KEKE.datos.some((d) => d.includes("casero")));
  assert.match(DETALLES_KEKE.aviso, /No incluye delivery/);
});

test("el HTML no escribe la cantidad de versiones a mano: la pone el script al dibujar", () => {
  assert.doesNotMatch(html, /\d+ versiones/);
  assert.ok(html.includes('id="kekes-cantidad"'));
});

test("cada sabor tiene una familia de la guía y las familias van seguidas en la lista", () => {
  assert.ok(KEKES.every((k) => FAMILIAS.includes(k.familia)), "hay un sabor sin familia válida");
  const orden = KEKES.map((k) => k.familia).filter((f, i, todas) => f !== todas[i - 1]);
  assert.deepEqual(orden, FAMILIAS.filter((f) => KEKES.some((k) => k.familia === f)), "las familias no van agrupadas ni en el orden de la guía");
});

test("el rótulo de la guía cuenta los sabores y omite el número si hay uno solo", () => {
  assert.equal(rotuloFamilia("Novia"), "Novia");
  assert.equal(rotuloFamilia("Chocolate"), "Chocolate · 3");
  assert.equal(rotuloFamilia("Frutales"), `Frutales · ${KEKES.filter((k) => k.familia === "Frutales").length}`);
});

test("la miniatura sale de la ruta de la foto y solo existe si hay foto", () => {
  assert.equal(miniaturaDe({ foto: "img/KEKES/pina.webp" }), "img/KEKES/min/pina.webp");
  assert.equal(miniaturaDe({}), null);
});

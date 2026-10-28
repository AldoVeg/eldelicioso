// Pruebas de "El pecado más vendido" (kekes rectangulares): datos, mensaje y coherencia con el HTML.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { KEKES, construirMensajeKeke, textoPrecioKeke } from "../src/kekes.js";

const html = fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "index.html"), "utf8");

test("las versiones de keke tienen id único, nombre, matiz y color válido", () => {
  assert.equal(new Set(KEKES.map((k) => k.id)).size, KEKES.length);
  for (const k of KEKES) {
    assert.ok(k.nombre && k.matiz, `${k.id} sin nombre o matiz`);
    assert.match(k.tono, /^#[0-9A-Fa-f]{6}$/, `${k.id}: color inválido`);
    assert.ok(k.precioCentimos === null || Number.isInteger(k.precioCentimos), `${k.id}: precio inválido`);
  }
  assert.equal(KEKES.filter((k) => k.especial).length, 1, "solo el de Novia es especial");
});

test("el precio muestra 'Consultar precio' mientras no se conoce y el mensaje incluye el sabor", () => {
  const sinPrecio = KEKES.find((k) => k.id === "pina");
  assert.equal(textoPrecioKeke(sinPrecio), "Consultar precio");
  assert.match(construirMensajeKeke(sinPrecio), /keke rectangular de piña\./);
  const conPrecio = { ...sinPrecio, precioCentimos: 3500 };
  assert.equal(textoPrecioKeke(conPrecio), "S/ 35,00");
  assert.match(construirMensajeKeke(conPrecio), /de piña \(S\/ 35,00\)/);
});

test("el HTML dice la cantidad correcta de versiones (cinta de la portada y sección)", () => {
  const menciones = [...html.matchAll(/(\d+) versiones/g)].map((m) => Number(m[1]));
  assert.equal(menciones.length, 2);
  assert.ok(menciones.every((n) => n === KEKES.length), `el HTML dice ${menciones} y hay ${KEKES.length}`);
});

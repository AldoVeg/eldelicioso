// Pruebas de "El pecado más vendido" (kekes rectangulares): datos, mensaje y coherencia con el HTML.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { KEKES, construirMensajeKeke, esTonoClaro, textoPrecioKeke } from "../src/kekes.js";

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
  const sinPrecio = KEKES.find((k) => k.id === "pina");
  assert.equal(textoPrecioKeke(sinPrecio), "Consultar precio");
  assert.match(construirMensajeKeke(sinPrecio), /keke rectangular de piña\./);
  const conPrecio = { ...sinPrecio, precioCentimos: 3500 };
  assert.equal(textoPrecioKeke(conPrecio), "S/ 35,00");
  assert.match(construirMensajeKeke(conPrecio), /de piña \(S\/ 35,00\)/);
});

test("el HTML dice la cantidad correcta de versiones (cinta de la portada)", () => {
  const menciones = [...html.matchAll(/(\d+) versiones/g)].map((m) => Number(m[1]));
  assert.equal(menciones.length, 1);
  assert.equal(menciones[0], KEKES.length, `el HTML dice ${menciones[0]} y hay ${KEKES.length}`);
});

test("los colores claros llevan texto oscuro y los oscuros texto blanco", () => {
  assert.equal(esTonoClaro("#E6D3A3"), true); // vainilla
  assert.equal(esTonoClaro("#F2C94C"), true); // piña
  assert.equal(esTonoClaro("#3B3B3B"), false); // oreo
  assert.equal(esTonoClaro("#5C5AA7"), false); // arándano
});

// Pruebas del proceso de fotos de los kekes (nombres de archivo y conexión con src/kekes.js).
import test from "node:test";
import assert from "node:assert/strict";
import { buscarKeke, conFoto, normalizarNombre } from "../tools/fotos-kekes.js";
import { KEKES } from "../src/kekes.js";

test("los nombres de archivo se normalizan sin tildes, mayúsculas ni espacios", () => {
  assert.equal(normalizarNombre("Fresa con Arándano.JPG"), "fresa-con-arandano");
  assert.equal(normalizarNombre("piña.jpg"), "pina");
  assert.equal(normalizarNombre("  Chispas_de chocolate (1).png"), "chispas-de-chocolate-1");
});

test("una foto se asocia al sabor por su id o por su nombre", () => {
  assert.equal(buscarKeke("Piña.jpg", KEKES).id, "pina");
  assert.equal(buscarKeke("fresa-arandano.webp", KEKES).id, "fresa-arandano");
  assert.equal(buscarKeke("Fresa con arándano.jpg", KEKES).id, "fresa-arandano");
  assert.equal(buscarKeke("Lúcuma.JPG", KEKES).id, "lucuma");
  assert.equal(buscarKeke("keke Piña.jpg", KEKES).id, "pina");
  assert.equal(buscarKeke("Keke de chocolate (2).png", KEKES).id, "chocolate");
  assert.equal(buscarKeke("torta tres leches.jpg", KEKES), null);
});

test("conFoto agrega y luego reemplaza el campo foto solo en la línea de ese sabor", () => {
  const base = `  { id: "pina", nombre: "Piña", precioCentimos: null },\n  { id: "oreo", nombre: "Oreo", precioCentimos: null }\n`;
  const una = conFoto(base, "pina", "img/KEKES/pina.webp");
  assert.match(una, /precioCentimos: null, foto: "img\/KEKES\/pina\.webp" \},/);
  assert.ok(!una.split("\n")[1].includes("foto"));
  const dos = conFoto(una, "pina", "img/KEKES/pina-2.webp");
  assert.equal(dos.match(/foto:/g).length, 1);
  assert.throws(() => conFoto(base, "novia", "x"), /novia/);
});

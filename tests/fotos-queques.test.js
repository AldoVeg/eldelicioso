// Pruebas del proceso de fotos de los queques (nombres de archivo y conexión con src/queques.js).
import test from "node:test";
import assert from "node:assert/strict";
import { buscarQueque, conFoto, normalizarNombre } from "../tools/fotos-queques.js";
import { QUEQUES } from "../src/queques.js";

test("los nombres de archivo se normalizan sin tildes, mayúsculas ni espacios", () => {
  assert.equal(normalizarNombre("Fresa con Arándano.JPG"), "fresa-con-arandano");
  assert.equal(normalizarNombre("piña.jpg"), "pina");
  assert.equal(normalizarNombre("  Chispas_de chocolate (1).png"), "chispas-de-chocolate-1");
});

test("una foto se asocia al sabor por su id o por su nombre", () => {
  assert.equal(buscarQueque("Piña.jpg", QUEQUES).id, "pina");
  assert.equal(buscarQueque("fresa-arandano.webp", QUEQUES).id, "fresa-arandano");
  assert.equal(buscarQueque("Fresa con arándano.jpg", QUEQUES).id, "fresa-arandano");
  assert.equal(buscarQueque("Lúcuma.JPG", QUEQUES).id, "lucuma");
  assert.equal(buscarQueque("queque Piña.jpg", QUEQUES).id, "pina");
  assert.equal(buscarQueque("keke Piña.jpg", QUEQUES).id, "pina"); // el nombre antiguo sigue valiendo
  assert.equal(buscarQueque("Queque de chocolate (2).png", QUEQUES).id, "chocolate");
  assert.equal(buscarQueque("torta tres leches.jpg", QUEQUES), null);
});

test("conFoto agrega y luego reemplaza el campo foto solo en la línea de ese sabor", () => {
  const base = `  { id: "pina", nombre: "Piña", precioCentimos: null },\n  { id: "oreo", nombre: "Oreo", precioCentimos: null }\n`;
  const una = conFoto(base, "pina", "img/QUEQUES/pina.webp");
  assert.match(una, /precioCentimos: null, foto: "img\/QUEQUES\/pina\.webp" \},/);
  assert.ok(!una.split("\n")[1].includes("foto"));
  const dos = conFoto(una, "pina", "img/QUEQUES/pina-2.webp");
  assert.equal(dos.match(/foto:/g).length, 1);
  assert.throws(() => conFoto(base, "novia", "x"), /novia/);
});

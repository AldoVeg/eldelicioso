// Guardianes contra duplicados y restos sin uso: si algo se acumula, npm test falla y dice qué.
import test from "node:test";
import assert from "node:assert/strict";
import { selectoresRepetidos, cuerposIdenticos, clasesCssSinUso, declaracionesSinUso, recursosHuerfanos } from "../tools/auditoria.js";

// Clases que el JS arma por plantilla (`avance avance--${estado}`, `lista__estado--${tipo}`): no se ven escritas completas.
const DINAMICAS = ["avance--", "lista__estado--"];

test("no hay selectores CSS repetidos en el mismo contexto (se funden en una sola regla)", () => {
  assert.deepEqual(selectoresRepetidos(), []);
});

test("no hay reglas CSS con el mismo cuerpo (se agrupan con coma)", () => {
  assert.deepEqual(cuerposIdenticos(), []);
});

test("no hay clases CSS sin uso", () => {
  assert.deepEqual(clasesCssSinUso(DINAMICAS), []);
});

test("no hay funciones ni constantes sin uso en src/", () => {
  assert.deepEqual(declaracionesSinUso(), []);
});

test("no hay imágenes ni fuentes huérfanas", () => {
  assert.deepEqual(recursosHuerfanos(), []);
});

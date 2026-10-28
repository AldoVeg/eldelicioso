// Pruebas de las funciones puras de src/ (precios, mensajes y enlaces). Se ejecutan con: npm test
import test from "node:test";
import assert from "node:assert/strict";
import * as m from "../src/indice.js";

test("aCentimos y formatearMoneda mantienen los precios exactos", () => {
  assert.equal(m.aCentimos("35.50"), 3550);
  assert.equal(m.aCentimos("0.1") + m.aCentimos("0.2"), 30);
  assert.equal(m.formatearMoneda(3550), "S/ 35,50");
  assert.equal(m.formatearMoneda(125000), "S/ 1 250,00");
  assert.equal(m.formatearMoneda(5), "S/ 0,05");
});

test("filtrarEntradaNumerica deja solo dígitos, respeta tope y conserva el último valor válido", () => {
  assert.equal(m.filtrarEntradaNumerica("12ab3", 4, 9999), "123");
  assert.equal(m.filtrarEntradaNumerica("007", 4, 9999), "7");
  assert.equal(m.filtrarEntradaNumerica("12345", 3, 999), "123");
  assert.equal(m.filtrarEntradaNumerica("1000", 4, 500, "499"), "499");
  assert.equal(m.filtrarEntradaNumerica(null, 4, 500), "");
});

test("construirMensajeReserva incluye cantidad, producto, precio y salida", () => {
  const texto = m.construirMensajeReserva(12, "Empanadas", 5000, "jueves 1 de octubre");
  assert.match(texto, /12 unidades de empanadas/);
  assert.match(texto, /S\/ 50,00/);
  assert.match(texto, /jueves 1 de octubre/);
});

test("construirEnlaceWhatsApp codifica el mensaje y apunta a wa.me", () => {
  const url = m.construirEnlaceWhatsApp("Hola & ¿qué tal?");
  assert.match(url, /^https:\/\/wa\.me\/\d+\?text=/);
  assert.ok(url.includes(encodeURIComponent("Hola & ¿qué tal?")));
});

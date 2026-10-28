// Revisa la publicación: que todo recurso local referenciado exista y que los tres sellos de versión coincidan.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const leer = (f) => fs.readFileSync(path.join(raiz, f), "utf8");

test("todo recurso local referenciado en HTML, CSS y JS existe", () => {
  const faltan = [];
  for (const archivo of ["index.html", "index.css", "manifest.webmanifest", ...fs.readdirSync(path.join(raiz, "src")).map((f) => `src/${f}`)]) {
    for (const [, ruta] of leer(archivo).matchAll(/(?:img|fonts)\/[A-Za-z0-9_\-/.]+\.(?:webp|jpg|png|ico|woff2)/g).map((m) => [m[0], m[0]])) {
      if (!fs.existsSync(path.join(raiz, ruta))) faltan.push(`${archivo}: ${ruta}`);
    }
  }
  assert.deepEqual(faltan, []);
});

test("el sello de versión coincide en index.html (3 lugares) y version.json", () => {
  const html = leer("index.html");
  const sello = JSON.parse(leer("version.json")).v;
  assert.match(sello, /^\d{12}$/);
  assert.ok(html.includes(`data-version="${sello}"`), "data-version distinto");
  assert.ok(html.includes(`index.css?v=${sello}`), "?v= de index.css distinto");
  assert.ok(html.includes(`src/main.js?v=${sello}`), "?v= de src/main.js distinto");
});

test("la política de seguridad ya no depende de Google Fonts", () => {
  const csp = JSON.stringify(JSON.parse(leer("vercel.json")).headers);
  assert.ok(!csp.includes("fonts.googleapis.com") && !csp.includes("fonts.gstatic.com"));
});

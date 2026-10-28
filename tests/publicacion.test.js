// Revisa la publicación: que todo recurso local referenciado exista y que los tres sellos de versión coincidan.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fuentesJs } from "../tools/auditoria.js";

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const leer = (f) => fs.readFileSync(path.join(raiz, f), "utf8");

test("todo recurso local referenciado en HTML, CSS y JS existe", () => {
  const faltan = [];
  for (const archivo of ["index.html", "index.css", "manifest.webmanifest", ...fuentesJs()]) {
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

test("la caché del service worker lleva el sello de versión (así cada versión borra la anterior)", () => {
  const sello = JSON.parse(leer("version.json")).v;
  assert.ok(leer("sw.js").includes(`const CACHE = "el-delicioso-${sello}";`), "el nombre de la caché de sw.js no coincide con version.json");
});

test("el código y la hoja de estilos se revalidan siempre (precios nunca viejos)", () => {
  const cabeceras = JSON.parse(leer("vercel.json")).headers;
  for (const fuente of ["/src/(.*)", "/index.css"]) {
    const regla = cabeceras.find((h) => h.source === fuente);
    assert.ok(regla && regla.headers.some((c) => c.key === "Cache-Control" && c.value.includes("must-revalidate")), `falta la regla de caché para ${fuente}`);
  }
});

test("la política de seguridad ya no depende de Google Fonts", () => {
  const csp = JSON.stringify(JSON.parse(leer("vercel.json")).headers);
  assert.ok(!csp.includes("fonts.googleapis.com") && !csp.includes("fonts.gstatic.com"));
});

test("todo id que busca la interfaz con $(...) existe en index.html", () => {
  const html = leer("index.html");
  const ids = new Set([...leer("src/main.js").matchAll(/\$\("([\w-]+)"\)/g)].map((m) => m[1]));
  const faltan = [...ids].filter((id) => !html.includes(`id="${id}"`));
  assert.deepEqual(faltan, []);
});

test("los tipos de evento del planificador cubren de 3 a 20 bocaditos sin huecos", () => {
  const tramos = [...leer("index.html").matchAll(/class="evento"[^>]*data-bocaditos="(\d+)" data-desde="(\d+)" data-hasta="(\d+)"/g)].map((m) => m.slice(1).map(Number));
  assert.equal(tramos.length, 3);
  assert.equal(tramos[0][1], 3);
  assert.equal(tramos[2][2], 20);
  tramos.forEach(([medio, desde, hasta], i) => {
    assert.ok(medio >= desde && medio <= hasta, "el valor típico cae dentro de su tramo");
    if (i > 0) assert.equal(desde, tramos[i - 1][2] + 1);
  });
});

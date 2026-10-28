// Sube el sello de versión en todos los lugares a la vez (data-version, ?v= de index.css, ?v= de src/main.js, version.json y el nombre de la caché de sw.js).
// Uso: npm run sellar   (después de cambiar index.html, index.css o cualquier archivo de src/ y antes de publicar)
import fs from "node:fs";
import path from "node:path";
import { raiz } from "./auditoria.js";

const ahora = new Date();
const dos = (n) => String(n).padStart(2, "0");
const sello = `${ahora.getFullYear()}${dos(ahora.getMonth() + 1)}${dos(ahora.getDate())}${dos(ahora.getHours())}${dos(ahora.getMinutes())}`;

const rutaHtml = path.join(raiz, "index.html");
let html = fs.readFileSync(rutaHtml, "utf8");
const antes = html;
html = html
  .replace(/data-version="\d{12}"/, `data-version="${sello}"`)
  .replace(/index\.css\?v=\d{12}/, `index.css?v=${sello}`)
  .replace(/src\/main\.js\?v=\d{12}/, `src/main.js?v=${sello}`);
if (html === antes && !antes.includes(sello)) throw new Error("No encontré los sellos en index.html");
fs.writeFileSync(rutaHtml, html);
const rutaSw = path.join(raiz, "sw.js");
const sw = fs.readFileSync(rutaSw, "utf8");
if (!/const CACHE = "el-delicioso-\d{12}";/.test(sw)) throw new Error("No encontré el nombre de la caché en sw.js");
fs.writeFileSync(rutaSw, sw.replace(/const CACHE = "el-delicioso-\d{12}";/, `const CACHE = "el-delicioso-${sello}";`));
fs.writeFileSync(path.join(raiz, "version.json"), `{"v": "${sello}"}\n`);
console.log(`Sello de versión: ${sello}`);

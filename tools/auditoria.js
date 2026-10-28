// Auditoría interna del sitio: detecta duplicados y restos sin uso para que no se acumulen. La usan las pruebas
// (tests/auditoria.test.js, parte de `npm test`) y se puede ver el detalle con `npm run auditar`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const leer = (ruta) => fs.readFileSync(path.join(raiz, ruta), "utf8");
const listar = (carpeta) => fs.readdirSync(path.join(raiz, carpeta)).map((f) => `${carpeta}/${f}`);

// Todos los .js de src/ y de sus subcarpetas (src/ui/).
export function fuentesJs(carpeta = "src") {
  return fs.readdirSync(path.join(raiz, carpeta), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? fuentesJs(`${carpeta}/${e.name}`) : e.name.endsWith(".js") ? [`${carpeta}/${e.name}`] : []);
}

function sinComentarios(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

// Recorre el CSS y devuelve las reglas planas: { contexto, selector, cuerpo }. El contexto es la cadena de @media/@supports
// que la envuelve, así una regla repetida dentro de otro @media no cuenta como duplicado.
export function reglasCss(css = leer("index.css")) {
  const texto = sinComentarios(css);
  const reglas = [];
  const pila = [];
  let cabecera = "";
  let inicioCuerpo = -1;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (c === "{") {
      const nombre = cabecera.trim();
      if (nombre.startsWith("@") && !/^@(font-face|keyframes|-webkit-keyframes)/.test(nombre)) {
        pila.push(nombre);
      } else {
        pila.push(null);
        inicioCuerpo = i + 1;
        reglas.push({ contexto: pila.filter(Boolean).join(" > "), selector: nombre, cuerpo: "", _i: inicioCuerpo });
      }
      cabecera = "";
    } else if (c === "}") {
      const abierto = pila.pop();
      if (abierto === null) {
        const regla = reglas[reglas.length - 1];
        regla.cuerpo = texto.slice(regla._i, i).replace(/\s+/g, " ").trim();
      }
      cabecera = "";
    } else if (c === ";" && pila.length === 0) {
      cabecera = ""; // @import o @charset
    } else {
      cabecera += c;
    }
  }
  return reglas.filter((r) => r.selector && !/^(from|to|\d+%)/.test(r.selector) && !r.selector.startsWith("@"));
}

// Mismo selector repetido en el mismo contexto: se debe fundir en una sola regla.
export function selectoresRepetidos() {
  const vistos = new Map();
  for (const r of reglasCss()) {
    const clave = `${r.contexto}||${r.selector.replace(/\s+/g, " ")}`;
    vistos.set(clave, (vistos.get(clave) || 0) + 1);
  }
  return [...vistos].filter(([, n]) => n > 1).map(([clave, n]) => `${clave.replace("||", " | ")} (×${n})`);
}

// Cuerpos idénticos en selectores distintos del mismo contexto: se pueden agrupar con una coma.
export function cuerposIdenticos() {
  const vistos = new Map();
  for (const r of reglasCss()) {
    if (r.cuerpo.length < 60) continue;
    const clave = `${r.contexto}||${r.cuerpo}`;
    vistos.set(clave, [...(vistos.get(clave) || []), r.selector]);
  }
  return [...vistos.values()].filter((s) => new Set(s).size > 1).map((s) => [...new Set(s)].join("  y  "));
}

// Clases dichas en el CSS que ni el HTML ni el JS mencionan. Las que el JS arma por plantilla se declaran en `dinamicas`.
export function clasesCssSinUso(dinamicas = []) {
  const css = sinComentarios(leer("index.css"));
  const fuente = leer("index.html") + fuentesJs().map(leer).join("\n");
  const clases = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]));
  return [...clases].filter((c) => !fuente.includes(c) && !dinamicas.some((d) => c.startsWith(d)) && !/^woff2?$/.test(c));
}

// Funciones y constantes de nivel superior (o de iniciar) que solo aparecen una vez en todo el código y las pruebas.
export function declaracionesSinUso() {
  const codigo = fuentesJs().map(leer).join("\n") + listar("tests").map(leer).join("\n");
  const nombres = new Set([...codigo.matchAll(/^\s*(?:export\s+)?(?:function|const|let)\s+([A-Za-z_]\w*)/gm)].map((m) => m[1]));
  return [...nombres].filter((n) => (codigo.match(new RegExp(`\\b${n}\\b`, "g")) || []).length < 2);
}

// Importaciones de más (un nombre importado que el archivo no usa) o de menos (usa algo exportado por otro módulo sin importarlo).
export function importacionesIncorrectas() {
  const archivos = fuentesJs().filter((f) => !f.endsWith("indice.js"));
  const exportados = new Map();
  for (const f of archivos) for (const m of leer(f).matchAll(/^export (?:function|const|let) ([A-Za-z_]\w*)/gm)) exportados.set(m[1], f);
  const problemas = [];
  for (const f of archivos) {
    const importados = [];
    const cuerpo = leer(f).replace(/^import \{([^}]*)\} from "[^"]*";\n/gm, (s, lista) => {
      lista.split(",").map((x) => x.trim()).filter(Boolean).forEach((n) => importados.push(n));
      return "";
    });
    // Sin comentarios ni textos entre comillas simples o dobles (una palabra dentro de un texto no cuenta como uso).
    const codigo = cuerpo
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:])\/\/[^\n]*/g, "$1")
      .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
      .replace(/`((?:[^`\\]|\\.)*)`/g, (s, texto) => [...texto.matchAll(/\$\{([^}]*)\}/g)].map((m) => m[1]).join(" ; "));
    const usa = (n) => new RegExp(`(?<![\\w$.])${n}(?![\\w$])`).test(codigo);
    const locales = new Set([...codigo.matchAll(/(?:function|const|let)\s+([A-Za-z_]\w*)/g)].map((m) => m[1]));
    importados.filter((n) => !usa(n)).forEach((n) => problemas.push(`${f}: importa ${n} y no lo usa`));
    for (const [n, dueno] of exportados) {
      if (dueno !== f && !importados.includes(n) && !locales.has(n) && usa(n)) problemas.push(`${f}: usa ${n} sin importarlo de ${dueno}`);
    }
  }
  return problemas;
}

// Imágenes y fuentes de las carpetas img/ y fonts/ que nadie referencia (HTML, CSS, JS, manifiesto, sitemap).
export function recursosHuerfanos() {
  const uso = [leer("index.html"), leer("index.css"), leer("manifest.webmanifest"), leer("sitemap.xml"), leer("github-pages-redirect/index.html"), ...fuentesJs().map(leer)].join("\n");
  const todos = [];
  const recorrer = (carpeta) => {
    for (const e of fs.readdirSync(path.join(raiz, carpeta), { withFileTypes: true })) {
      if (e.isDirectory()) recorrer(`${carpeta}/${e.name}`);
      else todos.push(`${carpeta}/${e.name}`);
    }
  };
  recorrer("img");
  recorrer("fonts");
  const ignorados = leer(".vercelignore").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  // Lo que ya no se publica (.vercelignore) es material de marca guardado a propósito: no cuenta como huérfano.
  return todos.filter((r) => !uso.includes(r) && !ignorados.includes(r));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const informe = {
    "Selectores CSS repetidos (fundir)": selectoresRepetidos(),
    "Cuerpos CSS idénticos (agrupar)": cuerposIdenticos(),
    "Clases CSS sin uso": clasesCssSinUso(),
    "Declaraciones JS sin uso": declaracionesSinUso(),
    "Importaciones incorrectas": importacionesIncorrectas(),
    "Recursos huérfanos": recursosHuerfanos()
  };
  for (const [titulo, lista] of Object.entries(informe)) {
    console.log(`\n${titulo}: ${lista.length}`);
    lista.forEach((x) => console.log("  - " + x));
  }
}

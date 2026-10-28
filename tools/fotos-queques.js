// Convierte las fotos de fotos-queques/ en WebP liviano dentro de img/QUEQUES/ (y una miniatura cuadrada en img/QUEQUES/min/) y las conecta con src/queques.js (campo "foto").
// Uso:  npm run fotos             procesa lo que haya y termina
//       npm run fotos -- --vigilar espera fotos nuevas, las procesa en lote y termina (así quien lo lanzó puede publicar)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { raiz } from "./auditoria.js";

const CARPETA = path.join(raiz, "fotos-queques");
const SALIDA = path.join(raiz, "img", "QUEQUES");
const SALIDA_MIN = path.join(SALIDA, "min");
const RUTA_DATOS = path.join(raiz, "src", "queques.js");
const EXTENSIONES = /\.(jpe?g|png|webp|avif|tiff?)$/i;
const LADO_MAXIMO = 1400;
const LADO_MINIATURA = 240;

// Sin tildes, en minúscula y con guiones: "Fresa con Arándano.JPG" -> "fresa-con-arandano".
export function normalizarNombre(nombreArchivo) {
  return nombreArchivo
    .replace(EXTENSIONES, "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Busca el queque de una foto por su id o por su nombre ("fresa-arandano" y "fresa con arándano" sirven los dos).
// Tolera lo que suele acompañar al sabor: "queque Piña", "keke Piña", "queques de piña", "Piña (2)", "piña-copia".
export function buscarQueque(nombreArchivo, queques) {
  const base = normalizarNombre(nombreArchivo);
  const limpia = base.replace(/^(queque|queques|keke|kekes|cake)-(de-)?/, "").replace(/-(copia|final|foto|\d+)$/g, "");
  for (const clave of [base, limpia]) {
    const queque = queques.find((k) => k.id === clave || normalizarNombre(k.nombre) === clave);
    if (queque) return queque;
  }
  return null;
}

// Pone (o reemplaza) el campo foto en la línea del queque dentro de src/queques.js.
export function conFoto(fuente, id, ruta) {
  const linea = new RegExp(`(\\{ id: "${id}",[^\\n]*?)(, foto: "[^"]*")?( \\})`);
  if (!linea.test(fuente)) throw new Error(`No encuentro el sabor "${id}" en src/queques.js`);
  return fuente.replace(linea, (s, a, b, c) => `${a}, foto: "${ruta}"${c}`);
}

async function cargarQueques() {
  const modulo = await import(`${pathToFileURL(RUTA_DATOS).href}?t=${Date.now()}`);
  return modulo.QUEQUES;
}

export async function procesar() {
  const { default: sharp } = await import("sharp");
  const queques = await cargarQueques();
  fs.mkdirSync(SALIDA_MIN, { recursive: true });
  const archivos = fs.readdirSync(CARPETA).filter((f) => EXTENSIONES.test(f))
    .map((f) => ({ f, t: fs.statSync(path.join(CARPETA, f)).mtimeMs }))
    .sort((a, b) => a.t - b.t); // la más reciente va al final: si se repite un sabor, gana
  const resultado = { nuevas: [], sinCoincidencia: [], sinCambios: 0 };
  let datos = fs.readFileSync(RUTA_DATOS, "utf8");
  for (const { f, t } of archivos) {
    const queque = buscarQueque(f, queques);
    if (!queque) { resultado.sinCoincidencia.push(f); continue; }
    const destino = path.join(SALIDA, `${queque.id}.webp`);
    const miniatura = path.join(SALIDA_MIN, `${queque.id}.webp`);
    if (fs.existsSync(destino) && fs.existsSync(miniatura) && fs.statSync(destino).mtimeMs >= t && queque.foto) { resultado.sinCambios++; continue; }
    await sharp(path.join(CARPETA, f))
      .rotate()
      .resize({ width: LADO_MAXIMO, height: LADO_MAXIMO, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80, effort: 5 })
      .toFile(destino);
    await sharp(path.join(CARPETA, f)).rotate().resize({ width: LADO_MINIATURA, height: LADO_MINIATURA, fit: "cover" }).webp({ quality: 75, effort: 5 }).toFile(miniatura);
    datos = conFoto(datos, queque.id, `img/QUEQUES/${queque.id}.webp`);
    resultado.nuevas.push(`${queque.nombre} (${Math.round(fs.statSync(destino).size / 1024)} KB)`);
  }
  if (datos !== fs.readFileSync(RUTA_DATOS, "utf8")) fs.writeFileSync(RUTA_DATOS, datos);
  return resultado;
}

function informar(r) {
  if (r.nuevas.length) console.log("Fotos conectadas: " + r.nuevas.join(", "));
  if (r.sinCambios) console.log(`Sin cambios: ${r.sinCambios} foto(s) ya estaban al día`);
  r.sinCoincidencia.forEach((f) => console.log(`Sin coincidencia: "${f}" no se parece a ningún sabor de src/queques.js (¿es un sabor nuevo?)`));
  if (!r.nuevas.length && !r.sinCoincidencia.length && !r.sinCambios) console.log("No hay fotos en fotos-queques/ todavía.");
}

// Espera a que aparezca algo nuevo (o a que una foto termine de copiarse) y procesa el lote.
async function vigilar() {
  console.log("Vigilando fotos-queques/ ... (termina al procesar el siguiente lote)");
  const yaConocidas = new Set((await procesar()).sinCoincidencia); // lo que ya estaba sin coincidencia no cuenta como novedad
  let temporizador = null;
  const intentar = async () => {
    const tamanos = fs.readdirSync(CARPETA).filter((f) => EXTENSIONES.test(f)).map((f) => fs.statSync(path.join(CARPETA, f)).size);
    await new Promise((r) => setTimeout(r, 1500));
    const despues = fs.readdirSync(CARPETA).filter((f) => EXTENSIONES.test(f)).map((f) => fs.statSync(path.join(CARPETA, f)).size);
    if (tamanos.join() !== despues.join()) return programar(); // todavía se está copiando
    const r = await procesar();
    r.sinCoincidencia = r.sinCoincidencia.filter((f) => !yaConocidas.has(f));
    if (r.nuevas.length || r.sinCoincidencia.length) { informar(r); process.exit(0); }
  };
  const programar = () => { clearTimeout(temporizador); temporizador = setTimeout(intentar, 2500); };
  fs.watch(CARPETA, programar);
  programar();
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--vigilar")) vigilar();
  else procesar().then(informar);
}

// El Delicioso: service worker ligero. Prioridad: que NUNCA se vean precios viejos.
// - Páginas, scripts, estilos y datos: primero la red; el caché solo responde si no hay conexión.
// - Fotos y fuentes (no cambian de contenido a menudo): primero el caché y se refrescan en segundo plano.
// - version.json y todo lo que no sea GET del mismo sitio: siempre la red, sin tocarlo.
const CACHE = "el-delicioso-202610281621"; // el número lo cambia `npm run sellar`: cada versión estrena caché y borra las anteriores
const BASICOS = ["./", "index.html", "index.css", "manifest.webmanifest"];

self.addEventListener("install", (evento) => {
  evento.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASICOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((c) => c !== CACHE).map((c) => caches.delete(c))))
      .then(() => self.clients.claim())
  );
});

function guardar(peticion, respuesta) {
  if (respuesta && respuesta.ok && respuesta.type === "basic") {
    const copia = respuesta.clone();
    caches.open(CACHE).then((c) => c.put(peticion, copia));
  }
  return respuesta;
}

self.addEventListener("fetch", (evento) => {
  const peticion = evento.request;
  const url = new URL(peticion.url);
  if (peticion.method !== "GET" || url.origin !== self.location.origin || url.pathname.endsWith("/version.json")) return;

  const esRecursoEstable = /\/(img|fonts)\//.test(url.pathname);
  if (esRecursoEstable) {
    evento.respondWith(
      caches.match(peticion).then((guardada) => {
        const red = fetch(peticion).then((r) => guardar(peticion, r)).catch(() => guardada);
        return guardada || red;
      })
    );
    return;
  }

  evento.respondWith(
    fetch(peticion)
      .then((r) => guardar(peticion, r))
      .catch(() => caches.match(peticion).then((g) => g || (peticion.mode === "navigate" ? caches.match("index.html") : Response.error())))
  );
});

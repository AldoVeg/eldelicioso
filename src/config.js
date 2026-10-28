// El Delicioso (config): parte del código dividido en módulos.

export const NEGOCIO = {
  nombre: "El Delicioso",
  whatsapp: "51980592747",
  anticipacionDias: 2
};

export const TAMANOS = [25, 50, 100];
// "Bocaditos por invitado" no tiene valor inicial: el visitante lo escribe siempre (de 3 a 20).
export const MIN_BOCADITOS_POR_INVITADO = 3;
export const MAX_BOCADITOS_POR_INVITADO = 20;
export const MAX_INVITADOS = 1000;
// Tope de unidades totales que se arman en línea; más allá se atiende por WhatsApp.
export const MAX_UNIDADES = 20000;
// Máximo de líneas de producto que muestra cada categoría en la sugerencia.
export const MAX_LINEAS_SUGERENCIA = 6;
export const MAX_PACKS_POR_LINEA = 99;
// La clave conserva su nombre original para no perder las listas que los visitantes ya guardaron.
export const CLAVE_ALMACENAMIENTO = "el-delicioso-carrito";
export const CLAVE_PLAN = "el-delicioso-plan";
// Desde este excedente por categoría la lista avisa que te pasas de la meta.
export const UMBRAL_EXCEDIDO = 25;
// Productos que cambiaron de id al ampliar el catálogo (listas guardadas antes del cambio).
export const ALIAS_IDS = { "trufas-chocolate": "mini-trufas-chocolate" };
export const DURACION_REBOTE_MS = 300;
export const DURACION_AGREGADO_MS = 1200;

// Origen de la visita (?origen= o ?utm_source=): solo se aceptan estos valores (clave -> texto para el mensaje).
// Nunca se copia texto libre de la dirección al mensaje de WhatsApp.
export const ORIGENES_PERMITIDOS = {
  qr: "QR",
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  google: "Google"
};
// Formas cortas habituales que se reconducen a un origen permitido.
export const ALIAS_ORIGEN = { ig: "instagram", insta: "instagram", fb: "facebook", "tik-tok": "tiktok" };
export const CLAVE_ORIGEN = "el-delicioso-origen"; // sessionStorage: sobrevive mientras se navega dentro de la página

// Combos por ocasión: precio promo = suma de los precios del catálogo de cada mitad menos un ahorro fijo (en céntimos).
// Aquí solo viven los ids de los productos por defecto y los textos; los precios salen siempre del catálogo real.
export const DESCUENTO_COMBO_CENTIMOS = 100; // S/ 1,00 menos que sumando los productos sueltos
// Bocaditos que se cuentan por persona para decir "para cuántas personas alcanza".
export const BOCADITOS_POR_PERSONA = 3;
// Cada combo se reparte mitad y mitad: la mitad es un paquete del catálogo (25 o 50 unidades).
export const MITADES_COMBO = [25, 50];
export const COMBOS = {
  cumpleanos: {
    clave: "cumpleanos", titulo: "Cumpleaños", nombreLista: "Combo Cumpleaños", total: 50,
    salado: "pettit-pollo", dulce: "mini-alfajores-coco",
    frase: "Que los invitados vuelvan por más.",
    foto: "img/OCASIONES/cumpleanos-grande.webp", fotoAncho: 1600, fotoAlto: 621,
    // Mensaje prellenado de "¿Dudas? Escríbenos" (el origen de la visita se suma después)
    mensaje: "Hola, El Delicioso. Celebro un cumpleaños y quiero que me ayuden a elegir bocaditos."
  },
  "baby-shower": {
    clave: "baby-shower", titulo: "Baby shower", nombreLista: "Combo Baby shower", total: 50,
    salado: "mini-empanaditas-pollo", dulce: "mini-pay-limon",
    frase: "Una bienvenida dulce (y salada) para el bebé.",
    foto: "img/OCASIONES/baby-shower-grande.webp", fotoAncho: 1600, fotoAlto: 628,
    // Mensaje prellenado de "¿Dudas? Escríbenos" (el origen de la visita se suma después)
    mensaje: "Hola, El Delicioso. Organizo un baby shower y quiero que me ayuden a elegir bocaditos."
  },
  "reunion-trabajo": {
    clave: "reunion-trabajo", titulo: "Reunión de trabajo", nombreLista: "Combo Reunión de trabajo", total: 50,
    salado: "mini-causitas-atun", dulce: "mini-alfachips",
    frase: "Un detalle para que la pausa sepa mejor.",
    foto: "img/OCASIONES/reunion-trabajo-grande.webp", fotoAncho: 1600, fotoAlto: 732,
    // Mensaje prellenado de "¿Dudas? Escríbenos" (el origen de la visita se suma después)
    mensaje: "Hola, El Delicioso. Tengo una reunión de trabajo y quiero que me ayuden a elegir bocaditos."
  },
  "colegio-iglesia": {
    clave: "colegio-iglesia", titulo: "Colegio o iglesia", nombreLista: "Combo Colegio o iglesia", total: 100,
    salado: "mini-empanaditas-pollo", dulce: "mini-alfajores-coco",
    frase: "Para compartir con todos, en cantidad.",
    foto: "img/OCASIONES/colegio-iglesia-grande.webp", fotoAncho: 1600, fotoAlto: 621,
    // Mensaje prellenado de "¿Dudas? Escríbenos" (el origen de la visita se suma después)
    mensaje: "Hola, El Delicioso. Organizo un evento en un colegio o iglesia y quiero que me ayuden a elegir bocaditos."
  },
  // Sin total fijo: el visitante elige 50 o 100 unidades (mitad y mitad).
  personalizado: {
    clave: "personalizado", titulo: "Arma el tuyo", nombreLista: "Combo personalizado", total: null,
    salado: "pettit-pollo", dulce: "mini-alfajores-coco",
    frase: "Tu plan, tus sabores: tú eliges.",
    foto: "img/OCASIONES/otro-evento-grande.webp", fotoAncho: 1600, fotoAlto: 619,
    // Mensaje prellenado de "¿Dudas? Escríbenos" (el origen de la visita se suma después)
    mensaje: "Hola, El Delicioso. Tengo otro plan y quiero que me ayuden a elegir bocaditos."
  }
};

// Galería: tiempos del carrusel (avance automático muy suave) y del conteo de las tarjetas de camino.
export const INTERVALO_GALERIA_MS = 4000;
// Transición entre imágenes: ~0,7 s con curva de desaceleración (ease-out), sin desenfoque.
export const DURACION_TRANSICION_GALERIA_MS = 700;
export const PAUSA_TRAS_TOQUE_MS = 8000;
export const DURACION_CONTEO_MS = 500;
// Zona superior activa del subrayado del menú: el encabezado y estos píxeles debajo.
export const MARGEN_ZONA_MENU_PX = 48;

// El hosting puede cachear la página (HTML incluido) durante un rato sin que se pueda cambiar desde aquí; una
// pestaña que quedó abierta antes de publicar una actualización no la vería sola. Cada tanto se revisa
// version.json (pedido siempre sin caché) y, si cambió frente a data-version del <html>, se avisa para recargar.
export const INTERVALO_VERSION_MS = 5 * 60 * 1000;

export const DIAS_SEMANA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
export const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
  "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

# Registro de avance - El Delicioso

Actualizado: 28/10/2026

## Estado actual del código (28/10/2026)

Lo de abajo (objetivo, catálogo, decisiones y grupos) es el registro histórico de construcción; los nombres `index.js` que aparecen allí hoy son los módulos de `src/`.

| Dónde | Qué hay |
|---|---|
| `index.html`, `index.css` | Página y estilos (fuentes propias en `fonts/`, fotos en WebP en `img/`) |
| `src/*.js` | Lógica pura sin DOM, probable en Node: config, dinero, calculadora, armado, plan, fechas, carrito, combos, origen, mensajes, medicion (`indice.js` las reúne para las pruebas) |
| `src/main.js` | Orquestador: catálogo, lista de compras y pedido; arranca los módulos de interfaz |
| `src/ui/*.js` | Interfaz por módulos: planificador, combos, galería (portada, grupo y carrusel), menú, progreso, protección, aviso de versión, almacenamiento, utilidades y `sesion` (lista y plan compartidos) |
| `tools/`, `tests/` | Auditoría de duplicados y sello de versión; pruebas con `npm test` |
| `sw.js`, `manifest.webmanifest` | Web instalable y respaldo sin conexión (la red va primero, así los precios no quedan viejos) |
| `propuestas/`, `archivo/` | Material de diseño y historial archivado; no se publican |

**Cierre de cada cambio:** editar, `npm test` (incluye los guardianes de duplicados, código y recursos sin uso), `npm run sellar`, commit y push; comprobar la versión en vivo.

## Objetivo

Página web comercial de postres caseros, con 4 partes: `index.html`, `index.css`, `index.js` y este archivo (`avance.md`).

## Datos confirmados por el usuario

- Nombre del negocio: El Delicioso
- Productos: postres caseros
- WhatsApp: 980592747, con código de país +51 (enlace: 51980592747)
- Delivery: sí hay
- Anticipación del pedido: 2 días, según la cantidad
- Formas de pago: todas (efectivo, Yape, Plin, transferencia)
- Fotos y detalle de productos: vendrán en un PDF que el usuario adjuntará

## Catálogo extraído del PDF (`EL DELICIOSO.pdf`)

Portada: "El Delicioso - Catálogo de bocaditos". Pedidos: 980592747. Redes: @ELDELICIOSO. Cada producto se vende por cantidad, en soles (S/).

| Producto | 25 unid. | 50 unid. | 100 unid. |
|---|---|---|---|
| Pettit pan con pollo | 35.00 | 68.00 | 135.00 |
| Pettit pan con pollo y apio | 35.50 (*) | 70.00 | 136.00 |
| Pettit pan con pollo y durazno | 38.00 | 75.00 | 150.00 |
| Mini alfajores con coco | 26.00 | 50.00 | 98.00 |
| Mini alfachips | 27.00 | 52.00 | 100.00 |
| Mini alfajores con chocolate | 28.00 | 55.00 | 105.00 |
| Mini tartaleta de fresa/durazno | 32.00 | 60.00 | 116.00 |
| Mini pay de limón | 32.00 | 60.00 | 116.00 |
| Mini pay de manzana | 33.00 | 66.00 | 130.00 |
| Mini empanaditas de pollo | 30.00 | 60.00 | 120.00 |
| Mini empanaditas mixtas | 35.00 | 68.00 | 135.00 |
| Trufas de chocolate | 33.00 | 65.00 | 125.00 |

(*) El PDF muestra "35. 50" con un espacio; el usuario confirmó que es S/ 35.50.

Observaciones:
- El catálogo mezcla bocaditos salados (pettit pan, empanaditas) y dulces (alfajores, tartaletas, pays, trufas).
- Las páginas 2 a 5 traen fotografías incrustadas de los productos; su extracción para la web corresponde al grupo 2.
- El nombre correcto es "Mini pay de manzana" (el PDF dice "pye"; el usuario pidió corregirlo).

## Valores por defecto asumidos (ajustables)

- Estilo: cálido y dulce, tonos rosados y cremas
- Venta: catálogo con carrito que envía el pedido por WhatsApp
- Idioma: todo en español

## Equipo de agentes

Carpeta `C:\Users\User\.claude\agents\`: arquitecto-web, marketing-web, disenador-web, programador-web, redactor-comercial, director-arte-visual, gestor-redes.

## Estrategia de marketing (marketing-web)

- **Público:** anfitriones de fiestas familiares (cumpleaños, baby showers, bautizos), organizadores de reuniones de trabajo, colegios e iglesias, y emprendedores o planificadores de eventos.
- **Propuesta de valor:** "Bocaditos caseros, dulces y salados, por 25, 50 o 100 unidades, listos para tu celebración y pedidos en un solo mensaje por WhatsApp."
- **Pilares:** sabor casero; cantidades para eventos con precios claros; pedido simple.
- **Tono:** cálido, cercano, goloso, confiable, festivo. Evitar lenguaje corporativo y promesas no verificables ("los mejores del Perú", "100% naturales").
- **Palabras clave SEO** (añadir "en [ciudad]" cuando se confirme; validar volumen en Google Keyword Planner): bocaditos para cumpleaños, bocaditos para baby shower, pettit pan de pollo, pettit pan por mayor, mini alfajores por mayor, bocaditos salados y dulces para eventos, mini empanaditas para fiestas, trufas de chocolate para eventos, tartaletas de fresa por encargo.
- **Conversión:** que el visitante envíe un pedido o consulta por WhatsApp. Métricas: clics en "Pedir por WhatsApp", pedidos enviados desde el carrito, productos y tamaños más elegidos.
- **Ideas diferenciadoras:** mensaje de WhatsApp prellenado por producto y cantidad; sección "Para tu ocasión"; fecha del evento en el pedido. Para más adelante y por validar: calculadora de invitados y cajas surtidas.

> Nota: la paleta y las tipografías de las secciones "Grupo 2" (burdeos, Fraunces) quedaron reemplazadas por el rediseño descrito en "Rediseño según el ejemplo de diseño".

## Estructura del sitio (arquitecto-web)

Una sola página larga (`index.html`) con estas secciones en orden:

| # | Sección | Objetivo | Produce |
|---|---|---|---|
| 1 | Encabezado | Logo, menú y contador del carrito | disenador-web, programador-web |
| 2 | Portada | Propuesta de valor en 5 segundos, botones "Ver catálogo" y "Pedir por WhatsApp" | redactor-comercial, director-arte-visual |
| 3 | Ventajas | Los 3 pilares | redactor-comercial, disenador-web |
| 4 | Catálogo | Filtros Todos/Dulces/Salados, 12 tarjetas con selector 25/50/100 y precio del paquete | programador-web, disenador-web |
| 5 | Para tu ocasión | Tamaño sugerido según el evento (cantidades por validar) | redactor-comercial |
| 6 | Cómo pedir | 4 pasos: elige, indica fecha del evento, envía por WhatsApp, confirma | redactor-comercial |
| 7 | Nosotros | Historia breve y sencilla (la completa el dueño) | redactor-comercial |
| 8 | Contacto | WhatsApp, @ELDELICIOSO, zona y horario | programador-web |
| 9 | Carrito (panel lateral) | Lista, total, fecha del evento y botón de envío | programador-web |
| 10 | Botón flotante de WhatsApp | Conversión permanente | programador-web |

**Recorrido del cliente:** llega y entiende la propuesta, filtra el catálogo y compara tamaños, agrega productos, revisa el carrito e indica la fecha del evento, y envía el pedido por WhatsApp con el mensaje ya redactado.

**Datos del catálogo para `index.js`:** cada producto tendrá `id`, `nombre`, `categoria` ("dulce" o "salado"), `precios` (por 25, 50 y 100), `foto`, `fotoAlt`, `descripcion` y `porConfirmar`.
**Marcadores visibles hasta tener el dato real:** código de país del WhatsApp, precio del pettit pan con pollo y apio, nombre del pay de manzana, ciudad o distrito, delivery, anticipación mínima, formas de pago, horario, historia del negocio, descripciones y fotos pendientes.

## Decisiones del usuario

1. **Calculadora de invitados:** incluida en la primera versión, con **6 bocaditos por invitado**. Se redondea hacia arriba a 25, 50 o 100 unidades.
2. **Cajas surtidas:** **por evaluar**. No se implementan hasta que el usuario decida; mientras tanto se permite mezclar productos en el carrito.
3. **Categorías:** dos filtros, Dulces y Salados.
4. **Fecha del evento:** campo obligatorio en el carrito.
5. **Nombre y textos:** en lugar de una categoría ("bocaditos" o "postres"), el usuario pidió **frases súper cortas que representen y hagan resaltar los postres**. El redactor-comercial propondrá opciones en el grupo 2 y el usuario elegirá con un clic.

## Preguntas pendientes para el dueño

- Ciudad y distrito; zonas de entrega o solo recojo; costo de delivery.
- Anticipación mínima del pedido y capacidad máxima por día.
- Formas de pago (Yape, Plin, transferencia, efectivo) y si pide adelanto.
- Si vende solo bocaditos o también postres grandes (tortas, etc.).
- Si se pueden pedir cantidades distintas de 25/50/100 y mezclar sabores.
- Horario de atención, facturación, alérgenos y días de conservación.

## Grupo 2: identidad y contenido

### Identidad visual (disenador-web) - propuesta inicial

**Nota:** el usuario eligió la variante sobria; los valores vigentes están en la subsección "Ajustes tras las elecciones del usuario" más abajo. De esta propuesta inicial siguen vigentes las escalas de tipografía, el espaciado, los componentes (con los cambios indicados abajo) y las microinteracciones.

Minimalismo cálido y goloso: mucho crema, fotos grandes como protagonistas y un solo acento frambuesa para todo lo pulsable. Rosa frambuesa apagado (no chicle) para combinar con las fotos doradas. Estructura tipo bento en el catálogo y en "Para tu ocasión".

Paleta lista para `:root` (contrastes AA verificados por el diseñador):

| Variable | Valor | Uso |
|---|---|---|
| `--fondo` | `#FFF8F1` | Crema, fondo general |
| `--fondo-rosado` | `#FDE7EA` | Bloques alternos |
| `--superficie` | `#FFFFFF` | Tarjetas y panel |
| `--texto` | `#3A2427` | Cacao (13.7:1 sobre fondo) |
| `--texto-suave` | `#6E5459` | Texto secundario (6.5:1) |
| `--acento` | `#B8325A` | Botones, precios, enlaces (blanco encima 5.8:1) |
| `--acento-hover` | `#9E2649` | Estado hover |
| `--acento-2` | `#D98E3F` | Caramelo, insignias (texto oscuro encima 5.4:1) |
| `--borde` | `#EBD9D0` | Divisores decorativos |
| `--borde-campo` | `#A38A86` | Bordes de campos y selector (3.2:1) |
| `--whatsapp` | `#0F7A3E` | Botón WhatsApp (blanco encima 5.4:1); no usar `#25D366` con texto blanco |
| `--foco` | `#3A2427` | Contorno de foco |

- **Tipografías:** Fraunces 600 para títulos (alternativa Georgia) y DM Sans 400/500/700 para texto (alternativa system-ui), con `display=swap`. Escala fluida con `clamp` desde `--t-xs` (.8125rem) hasta `--t-hero` (hasta 5rem).
- **Espaciado** (base 4 px): 4, 8, 12, 16, 24, 32, 48, 72, 112. **Radios:** 10, 16, 28 px y píldora. **Sombras:** rosadas y difusas.
- **Componentes:** botón principal (píldora, 48 px de alto), botón WhatsApp con icono (el flotante, circular de 60 px), tarjeta de producto (foto 4:5, insignia Dulce/Salado, precio grande del paquete), selector 25/50/100 (radios reales tipo segmento), panel lateral del carrito (400 px máx., campo de fecha obligatorio, botón fijo al pie) y calculadora de invitados (bloque rosado).
- **Microinteracciones** (solo con `prefers-reduced-motion: no-preference`): rebote del contador del carrito al agregar, zoom suave de la foto al pasar el cursor, aparición suave de secciones al desplazar.
- **Indicaciones para el programador:** móvil primero (probar a 400 px), `aria-live` en el contador, foco visible, fotos con `width`/`height` y `loading="lazy"`.

### Textos (redactor-comercial)

- **Eslogan:** el usuario eligió el suyo propio: **"El placer de pecar."** (ver ajustes más abajo; la portada y las frases marcadas allí reemplazan a las de esta lista).
- **Portada (propuesta inicial, reemplazada):** titular "Chiquitos que roban la fiesta".
- **Ventajas:** "Sabor casero: Hechos en casa, para que tu mesa sepa a hogar." / "Precios claros: Elige 25, 50 o 100 unidades y mira el precio al instante." / "Un solo mensaje: Elige, indica la fecha y envía tu pedido por WhatsApp."
- **Frases de producto:**
  1. Pettit pan con pollo: "El clásico salado que nunca falta en la mesa."
  2. Pettit pan con pollo y apio: "Pollo y apio: un salado con toque fresco."
  3. Pettit pan con pollo y durazno: "Pollo con durazno, salado y dulce en un bocado."
  4. Mini alfajores con coco: "Alfajor chiquito con coco, ideal para repetir."
  5. Mini alfachips: "Dulce, mini y difícil de dejar en el plato."
  6. Mini alfajores con chocolate: "Chocolate en formato mini, para los golosos."
  7. Mini tartaleta de fresa/durazno: "Fresa o durazno en una tartaleta de un bocado."
  8. Mini pay de limón: "El toque de limón que siempre pide otro."
  9. Mini pay de manzana: "Manzana en mini pay, con sabor a postre de casa."
  10. Mini empanaditas de pollo: "Pollo en empanadita mini, salado para picar."
  11. Mini empanaditas mixtas: "Para quien no sabe elegir solo un sabor."
  12. Trufas de chocolate: "Chocolate hecho trufa: el final dulce de la fiesta."
- **Para tu ocasión** ("Cuéntanos qué celebras y te ayudamos a elegir."): Cumpleaños "Que los invitados vuelvan por más."; Baby shower "Una bienvenida dulce (y salada) para el bebé."; Reunión de trabajo "Un detalle para que la pausa sepa mejor."; Colegio o iglesia "Para compartir con todos, en cantidad."; Otro evento "¿Tienes otro plan? Escríbenos y lo armamos contigo."
- **Calculadora** ("¿Cuántos bocaditos necesito?"): "Calculamos 6 por invitado y redondeamos a 25, 50 o 100." Campo "Número de invitados", botón "Calcular", resultado "Para [n] invitados necesitas unas [x] unidades. Te sugerimos [25/50/100]." Tramos: hasta 4 invitados = 25; hasta 8 = 50; hasta 16 = 100. Más de 16 invitados: por decidir.
- **Cómo pedir:** 1) Elige tus favoritos y la cantidad. 2) Indica la fecha del evento (pide con 2 días de anticipación, según la cantidad). 3) Envía por WhatsApp, en un solo mensaje ya redactado. 4) Confirma y paga con efectivo, Yape, Plin o transferencia. Nota: "Hay delivery en [ciudad o distrito], costo: [costo del delivery]. Atendemos [horario]."
- **SEO:** título "El Delicioso | Bocaditos dulces y salados para eventos" (54 caracteres). Metadescripción: "Bocaditos caseros dulces y salados para cumpleaños, baby showers y reuniones. Pide 25, 50 o 100 unidades por WhatsApp con 2 días de anticipación." (146 caracteres).

### Ajustes tras las elecciones del usuario

Elecciones: eslogan propio "El placer de pecar."; estilo **más sobrio y elegante**; calculadora con combinación de tamaños para más de 16 invitados; fotos del PDF provisionales (algunas no son propias y se reemplazarán).

**Paleta vigente** (crema, cacao y burdeos apagado; mismos nombres de variable):

```css
--fondo:#FAF4EA; --fondo-rosado:#F3E6E1; --superficie:#FFFFFF;
--texto:#2B1A14; --texto-suave:#6B5750;
--acento:#7A2033; --acento-hover:#5F1727; --acento-2:#B5813A;
--borde:#E4D5C7; --borde-campo:#8C7B70;
--whatsapp:#0F7A3E; --foco:#2B1A14;
--sombra:0 8px 24px rgba(43,26,20,.08);
```

Contrastes: texto/fondo 15,2:1; texto-suave/fondo 6,2:1; blanco/acento 10,1:1; acento/fondo 9,2:1; texto/acento-2 4,9:1; blanco/whatsapp 5,4:1; borde-campo/superficie 4,1:1. `--acento-2` solo con texto oscuro encima o como filete decorativo (sobre el fondo da 3,1:1, nunca como texto). `--fondo-rosado` es ahora un nude empolvado.

**Tipografías:** se mantienen Fraunces (ahora en 400/500 y cursiva 400 para el eslogan) y DM Sans. Enlace: `https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=DM+Sans:wght@400;500;700&display=swap`

**Componentes (cambios):** radios de 6, 10 y 14 px (se elimina el de 28 px); botones rectangulares de 6 px con DM Sans 500 en mayúsculas y espaciado .06em; tarjeta con borde de 1 px y `--sombra` solo al pasar el cursor; insignia Dulce/Salado sin relleno, con borde y mayúsculas; selector con el elegido en cacao y texto crema; carrito de fondo blanco sin radio en el borde de pantalla; calculadora en nude con radio de 14 px.

**Portada:** línea pequeña en mayúsculas espaciadas "El Delicioso" con un filete de `--acento-2` de 40 px; `h1` "El placer de pecar." en Fraunces 400 (`--t-hero`), con "pecar." en cursiva y burdeos; subtítulo en DM Sans y los dos botones. *Decisión de integración (ajustable):* el titular alternativo del redactor ("Pequeños placeres, hechos en casa") no se usa para no recargar la portada, y la línea pequeña no incluye la palabra "postres".

**Textos vigentes de la portada y ajustes (redactor-comercial):**
- Subtítulo: "Bocaditos caseros, dulces y salados, para mesas que se recuerdan. Por 25, 50 o 100."
- Botones: "Descubrir el catálogo" y "Pedir por WhatsApp".
- Ventaja "Sabor casero": "Hechos en casa, con un sabor que se recuerda." (las otras dos ventajas quedan igual).
- Frases de producto nuevas: 4 Mini alfajores con coco "Alfajor en miniatura, con coco y tentación asegurada."; 5 Mini alfachips "Pequeño, dulce y difícil de resistir."; 8 Mini pay de limón "Limón suave y fresco, con final dulce."; 11 Mini empanaditas mixtas "Para quien no quiere elegir solo un sabor." (el usuario eligió la frase neutra por no saber ahora qué lleva); 12 Trufas de chocolate "Chocolate en su forma más tentadora." Las frases 1, 2, 3, 6, 7, 9 y 10 quedan como estaban.
- "Para tu ocasión": título "Dinos qué celebras y elegimos contigo."; "Otro evento": "¿Otro plan? Escríbenos y lo armamos contigo."
- Calculadora: explicación "Calculamos 6 por invitado y ajustamos a 25, 50 o 100."
- SEO: título "El Delicioso: bocaditos dulces y salados para eventos" (53 caracteres); metadescripción "El placer de pecar en formato mini. Bocaditos dulces y salados para eventos, hechos en casa. Pide 25, 50 o 100 por WhatsApp." (unos 124 caracteres). Añadir "en [ciudad]" cuando se confirme.

**Calculadora, más de 16 invitados:** resultado "Para [n] invitados necesitas unas [x] unidades. Te sugerimos [combinación]." Regla para el programador: `x = invitados × 6`; la combinación cubre al menos `x` con paquetes de 100, 50 y 25, con el menor excedente. Ejemplo: 40 invitados = 240 unidades = 2 de 100 y 1 de 50 (suma 250). Línea opcional: "Puedes mezclar sabores al armar tu pedido."

### Fotos (director-arte-visual)

13 fotos copiadas a `img/` (originales sin optimizar; el programador generará WebP a 800 px, 1600 px la portada, y `srcset`).

| Archivo | Producto | Calidad | Nota |
|---|---|---|---|
| portada.jpg | Portada (tartaleta con fresa) | buena | 4:5 en móvil, 16:9 en escritorio |
| pettit-pollo.jpg | Pettit pan con pollo | buena | |
| pettit-pollo-apio.jpg | Pettit pan con pollo y apio | débil | No se distingue el apio |
| pettit-pollo-durazno.jpg | Pettit pan con pollo y durazno | débil, por confirmar | No se ve el durazno |
| mini-alfajores-coco.jpg | Mini alfajores con coco | buena | |
| mini-alfachips.jpg | Mini alfachips | aceptable | |
| mini-alfajores-chocolate.jpg | Mini alfajores con chocolate | buena | Parece imagen de banco o generada |
| mini-tartaleta-fresa-durazno.jpg | Mini tartaleta de fresa/durazno | buena | |
| mini-pay-limon.jpg | Mini pay de limón | aceptable | |
| mini-pay-manzana.jpg | Mini pay de manzana | débil, por confirmar | 403x403, borrosa |
| mini-empanaditas-pollo.jpg | Mini empanaditas de pollo | aceptable, por confirmar | Podría estar intercambiada con la mixta |
| mini-empanaditas-mixtas.jpg | Mini empanaditas mixtas | aceptable, por confirmar | |
| trufas-chocolate.jpg | Trufas de chocolate | buena | Parece imagen de banco o generada |

Dirección visual: tarjetas en 4:5 con `object-fit: cover`, producto centrado, mismo brillo y temperatura cálida, sin retoques que cambien el producto, texto alternativo tipo "Producto + rasgo visible + contexto". Faltan fotos propias de calidad para pettit de apio y durazno y pay de manzana; conviene una foto de ambiente y otra del proceso artesanal para "Nosotros" y las redes.

## Grupo 3: maquetación (programador-web)

`index.html` e `index.css` reescritos con la paleta sobria, las tipografías, los textos y las 13 fotos. Se ve completa y elegante sin JavaScript. Revisado con capturas reales en Edge a 1280 px y a 400 px: sin desbordamiento horizontal y con los 12 precios coincidentes con el catálogo.

- **Estructura:** encabezado fijo con menú y carrito, portada, ventajas, catálogo (filtros y 12 tarjetas en HTML estático), "Para tu ocasión" con calculadora, "Cómo pedir", "Nosotros", contacto, panel del carrito (cerrado) y botón flotante de WhatsApp.
- **Diseño:** bento moderado (3 tarjetas destacadas de 2 columnas desde 1000 px: pettit con pollo, tartaleta y trufas); menú horizontal desplazable en móvil; precios visibles en cada segmento del selector; aparición suave con `animation-timeline: view()` solo si `prefers-reduced-motion` lo permite.
- **Iconos:** sprite SVG en línea; el de WhatsApp es un globo de chat genérico, no el logo oficial.
- **Marcadores visibles:** `[ciudad o distrito]`, `[costo del delivery]`, `[horario]`, `[historia del negocio]`.
- **Faltan para el grupo 5:** `og:image`, `og:url` y datos estructurados JSON-LD (necesitan URL absoluta y datos del negocio).
- **Falta para el grupo 4:** conversión de fotos a WebP con `srcset` (hoy son JPG originales).
- **Observación visual:** las fotos de trufas, pettit con pollo y tartaleta se ven ampliadas en las tarjetas destacadas por su baja resolución; conviene reemplazarlas por fotos propias.

**Contrato para `index.js` (grupo 4):**
- Ids: `#boton-carrito` (con `aria-expanded`), `#contador-carrito`, `#carrito`, `#carrito-fondo`, `#cerrar-carrito`, `#carrito-lista`, `#carrito-vacio`, `#carrito-total`, `#form-pedido`, `#fecha-evento`, `#error-fecha`, `#enviar-pedido`, `#form-calculadora`, `#invitados`, `#resultado-calculadora`, `#rejilla-catalogo`, `#plantilla-item-carrito`.
- Abrir el carrito: clase `abierto` en `#carrito` y `#carrito-fondo`. Rebote del contador: clase `rebote` en `#contador-carrito`.
- Filtros: botones `.filtro[data-filtro=todos|dulce|salado]` con `aria-pressed`; se filtra con el atributo `hidden` en las `.tarjeta`.
- Tarjeta: `.tarjeta[data-id][data-categoria][data-precio-25|50|100]`; radios `name="cantidad-{id}"`; textos a actualizar `[data-precio-total]` y `[data-precio-unidad]`; botón `[data-agregar]`; nombre en `.tarjeta__nombre`.
- Los enlaces de WhatsApp de la portada, ocasiones, contacto y el botón flotante ya están armados con `https://wa.me/51980592747`.

## Grupo 4: funcionalidad (programador-web)

`index.js` completo, en JavaScript puro y sin librerías (sintaxis verificada).

- **Catálogo:** filtros Todos/Dulces/Salados; selector 25/50/100 que actualiza el precio del paquete ("S/ 35,00"). Los precios se leen de los `data-precio-*` del HTML, sin tabla duplicada.
- **Carrito:** cada combinación producto + tamaño es una línea; botones para aumentar, disminuir y quitar; contador con rebote de 300 ms y botón "Agregado" 1,2 s; total; se guarda en `localStorage` (con respaldo si falla); panel con Escape, clic en el fondo, foco atrapado y sin scroll del fondo.
- **Fecha del evento:** obligatoria y con mínimo de hoy + 2 días; mensajes de error claros.
- **Pedido:** abre `https://wa.me/51980592747` con el mensaje prellenado (saludo, líneas con unidades y subtotal, total, fecha y pregunta por delivery y forma de pago). El carrito no se vacía al enviar.
- **Calculadora:** 6 bocaditos por invitado. Hasta 16 invitados sugiere un solo tamaño (9 invitados = 100, aunque 75 alcanzaría); desde 17, una combinación de 100, 50 y 25 con el menor excedente (40 invitados = 2 de 100 y 1 de 50). Acepta de 1 a 1000 invitados.
- **Ajustes mínimos:** en `index.html` botones −/+ en la plantilla del carrito y el aviso `#mensaje-pedido`; en `index.css` estilos de esos elementos, bloqueo de scroll y rebote de .3 s.
- **Pruebas:** casos en Node (1, 4, 5, 8, 9, 16, 17, 40 y 1000 invitados; fechas de hoy, mañana, pasado mañana y vacía) y unas 40 comprobaciones en Edge sin ventana, sin errores de script.
- **Sin verificar:** el envío real a WhatsApp (se simuló `window.open`), lectores de pantalla y Safari/iOS.

Ejemplo de mensaje generado:

```
Hola, El Delicioso. Quisiera hacer este pedido:

- Pettit pan con pollo: 100 unidades (2 x 50) - S/ 136,00
- Trufas de chocolate: 25 unidades - S/ 33,00
- Mini tartaleta de fresa/durazno: 100 unidades - S/ 116,00

Total: S/ 285,00
Fecha del evento: sábado 26 de septiembre de 2026

¿Me confirman si hay delivery y cómo puedo pagar? Gracias.
```

## Grupo 5: posicionamiento y redes

Datos nuevos del usuario: ciudad **Lima** (distrito sin definir), publicación en **GitHub Pages** (URL aún desconocida), redes @ELDELICIOSO **por evaluar**.

### SEO aplicado (marketing-web y programador-web)

- **Título:** "Bocaditos para eventos en Lima | El Delicioso". **Metadescripción:** "El placer de pecar. Bocaditos caseros dulces y salados para eventos en Lima. Pide 25, 50 o 100 por WhatsApp con 2 días de anticipación." (`og:title` y `og:description` iguales).
- **Delivery:** "Hay delivery en Lima. El costo te lo confirmamos por WhatsApp antes de pagar." (el usuario confirmó que hay delivery; el costo sigue por definir y el texto lo resuelve por WhatsApp). Zona en Contacto: Lima.
- **JSON-LD `Bakery`** en el head, sin marcadores y solo con datos reales: nombre, descripción, eslogan, teléfono +51980592747, zona de servicio Lima, dirección parcial (Lima, PE), tipo de cocina, formas de pago, moneda PEN y rango de precios "S/ 26 - S/ 150". No incluye `url`, `image`, `sameAs`, `openingHours`, `streetAddress`, `geo`, `email`, valoraciones ni reseñas hasta tener el dato real. Sin dirección completa, Google no mostrará resultado enriquecido de negocio local.
- **Palabras clave con Lima** (validar volumen en Keyword Planner; cada una aparece una vez y de forma natural): bocaditos para eventos en Lima, bocaditos para cumpleaños en Lima, bocaditos para baby shower en Lima, pettit pan de pollo en Lima, mini alfajores por mayor en Lima, mini empanaditas para fiestas en Lima, trufas de chocolate para eventos en Lima, tartaletas de fresa por encargo en Lima. Variantes por distrito quedan para cuando el dueño defina el distrito.

### Medición neutral (`registrar()` en `index.js`)

No instala herramientas ni envía datos personales (ni la fecha ni el texto del pedido). Emite un `CustomEvent` "eldelicioso:evento" y empuja a `window.dataLayer` solo si ya existe.

| Evento | Cuándo | Datos |
|---|---|---|
| `clic_whatsapp` | Clic en cualquier enlace a wa.me | `ubicacion`: portada, ocasion_cumpleanos, ocasion_baby, ocasion_trabajo, ocasion_colegio, ocasion_otro, contacto_boton, contacto_dato, flotante |
| `agregar_al_carrito` | Botón "Agregar" | producto_id, tamano, valor |
| `abrir_carrito` | Se abre el panel | articulos, valor |
| `enviar_pedido` | Se abre WhatsApp con fecha válida y carrito con contenido | valor_total, lineas, unidades |
| `usar_calculadora` | Se envía la calculadora | invitados, sugerencia (por ejemplo "2x100+1x50") |
| `filtrar_catalogo` | Clic en un filtro | filtro |

`enviar_pedido` mide intención de pedido, no venta confirmada. Herramienta gratuita para conectar después: Google Analytics 4 mediante Google Tag Manager, o Microsoft Clarity para mapas de calor; al activarla hay que añadir un aviso de privacidad. Pruebas: 16 eventos esperados emitidos en Edge sin ventana, sin errores de script y sin regresiones en el carrito.

### Después de publicar en GitHub Pages

1. Con la URL real: añadir `canonical`, `og:url`, `og:image` (1200x630, absoluta) y `url`/`image` en el JSON-LD.
2. Search Console con propiedad de prefijo de URL, verificación por etiqueta meta, envío de `sitemap.xml` y solicitud de indexación.
3. Google Business Profile como negocio con área de servicio en Lima (dirección oculta), con teléfono, web, fotos propias y verificación.
4. `robots.txt` solo funciona en la raíz del dominio, no en `/repo/`; un dominio propio ayudaría al SEO local.

### Plan de redes (gestor-redes; cuentas por evaluar)

- **Dónde empezar:** Instagram primero (visual, reels, enlace en la biografía); Facebook después con el mismo contenido; TikTok solo si se sostiene el ritmo. Si no hay ninguna cuenta: Instagram `@eldelicioso` (alternativas `@eldelicioso.lima`, `@eldelicioso.pe`) y luego página de Facebook.
- **Biografía (132 caracteres):** "El placer de pecar. Bocaditos caseros dulces y salados en Lima. 25, 50 o 100 unid. Pedidos por WhatsApp con 2 días de anticipación." Foto de perfil: el nombre "El Delicioso" en burdeos #7A2033 sobre crema #FAF4EA, en Fraunces (sin foto de producto).
- **Calendario de 4 semanas** (martes, jueves y sábado):
  1. Semana 1: presentación con la tartaleta (foto); cómo pedir en 4 pasos (carrusel); pettit pan con pollo (foto).
  2. Semana 2: mini alfajores con coco (video, guion 1); calculadora de invitados con ejemplos de 8 y 40 (carrusel); mini pay de limón (foto).
  3. Semana 3: "¿Tu evento es pronto?" pedido en 20 segundos (video, guion 2); Para tu ocasión (carrusel); mini alfachips (foto).
  4. Semana 4: trufas de chocolate (video, guion 3); proceso casero (foto); pedido mixto de dulces y salados (foto).
- **Guiones de video vertical (15 a 20 s):** 1) alfajores con coco: mordida en primer plano con texto "Uno solo no basta.", manos espolvoreando coco, bandeja con "25, 50 o 100.", cierre "Pide por WhatsApp. El placer de pecar."; 2) pedido en 20 segundos: grabación de pantalla del catálogo, la fecha y el envío, con "Elige, fecha, envía." y "2 días de anticipación. Delivery en Lima."; 3) trufas: plato con una sola trufa y texto "El final dulce.", se suman hasta llenar la bandeja, cierre "Escríbenos y reserva tu fecha."
- **Hashtags** (usar de 4 a 6 por publicación, al final del texto, con ubicación Lima): #BocaditosLima #BocaditosParaEventos #BocaditosCaseros #PettitPan #MiniAlfajores #BabyShowerLima #CumpleañosLima #PostresLima #DeliveryLima #ElPlacerDePecar
- **Tráfico y métricas:** enlace en la biografía, adhesivo de enlace en historias y botón de mensaje; enlaces con `?utm_source=instagram&utm_medium=bio` (o facebook, tiktok). Mirar cada semana: alcance, clics al enlace y mensajes de WhatsApp recibidos (preguntar a cada cliente cómo los conoció).
- **Fotos y videos propios que hay que tomar:** pettit con apio (cortado, con el apio visible), pettit con durazno, mini pay de manzana nítido, empanaditas de pollo y mixtas juntas para confirmar cuál es cuál; trufas y alfajores de chocolate propios; tartaleta y pettit con pollo en mayor resolución; una mesa armada y una foto del proceso con manos; videos crudos de 10 a 15 s (manos rellenando o espolvoreando, bandeja terminada, empaque o entrega). Luz de ventana, fondo neutro, fotos verticales 4:5 de al menos 1080 px.

## Grupo 6: revisión final

**Comprobaciones técnicas** (script de Node y capturas en Edge): sin ids duplicados ni anclas rotas; las 13 imágenes existen, todas se usan y pesan 1,40 MB en total; todas con `alt`, `width` y `height`; un solo `h1`; enlaces externos con `noopener`; JSON-LD válido; 12 tarjetas; `index.html` 43 KB, `index.css` 22 KB e `index.js` 24 KB; sin librerías (solo Google Fonts y wa.me como hosts externos); `node --check` correcto.

**Auditoría de coherencia (arquitecto-web):** las decisiones del usuario, los 12 productos, y sus 36 precios coinciden con el catálogo; ninguna caja surtida implementada, como se decidió.

**Correcciones aplicadas tras la auditoría:**
- Se quitó "Atendemos [horario]" y se dejó "Te respondemos por WhatsApp para confirmar tu pedido."
- "Nosotros" muestra ahora un texto neutro ("El Delicioso prepara bocaditos caseros, dulces y salados, para eventos en Lima.") y la historia del negocio queda oculta con `hidden` hasta tener el dato.
- Las filas "Redes" (@ELDELICIOSO, cuentas por evaluar) y "Horario" en Contacto quedan ocultas con `hidden`; se muestran quitando ese atributo en `index.html`.
- El mensaje de WhatsApp ya no pregunta si hay delivery: "¿Me confirman el costo del delivery y los datos de pago? Gracias."
- Los textos `alt` ya no afirman rellenos o ingredientes no confirmados (manjar, lechuga, arándanos).

**Pendientes de una segunda versión** (no bloquean publicar):
- "2 días, según la cantidad" es ambiguo y el código exige siempre hoy + 2; definir la regla real con el dueño.
- El pettit de durazno figura como salado y su foto no muestra durazno.
- Las fotos de trufas y alfajores de chocolate parecen de banco de imágenes: reemplazarlas por fotos propias, junto con las débiles (pettit de apio y de durazno, pay de manzana).
- Cajas surtidas (por evaluar), horario, historia del negocio, distrito, costo del delivery y redes reales.
- Tras publicar en GitHub Pages: `canonical`, `og:url`, `og:image`, `sitemap.xml` y campos omitidos del JSON-LD.

**Veredicto del arquitecto:** se puede publicar con las correcciones mínimas, ya aplicadas.

## Rediseño según el "ejemplo de diseño" (posterior al grupo 6)

El usuario pidió adecuar a la página el lenguaje visual de la carpeta `ejemplo de diseño` (moderno y fresco), con **fondos claros y detalles rojizos "pasión"**, matizando los detalles con los tonos de las imágenes. Esto **reemplaza la variante sobria burdeos**: el estilo pasa de "sobrio y elegante" a "fresco, moderno y apasionado", limpio y sin caer en lo infantil. No se copió contenido del ejemplo (era una promoción de un curso universitario), solo su lenguaje visual.

**Paleta vigente** (mismos nombres de variable):

| Variable | Valor | Uso |
|---|---|---|
| `--fondo` | `#FFFBF6` | Fondo general muy claro |
| `--fondo-rosado` | `#FCEDEA` | Bloques alternos |
| `--superficie` | `#FFFFFF` | Tarjetas y panel |
| `--texto` / `--texto-suave` | `#2E1B1B` / `#6B5253` | Texto |
| `--acento` / `--acento-hover` | `#BE1E3C` / `#9E1630` | Rojo pasión matizado (botones, precios, "pecar.") |
| `--acento-2` | `#E0A24A` | Dorado caramelo |
| `--borde` / `--borde-campo` | `#F0DDD3` / `#957B78` | Bordes |
| `--whatsapp` | `#0F7A3E` | Verde accesible |
| `--dorado-texto`, `--chocolate`, `--rosa-fresa` | `#8A5A0F`, `#6B3E2A`, `#E9798A` | Detalles derivados de las fotos (la rosa fresa solo decorativa) |

Contrastes calculados a mano por el diseñador (conviene una segunda comprobación): texto/fondo 15,8:1; blanco/acento 6,1:1; acento/fondo 5,9:1; acento/tinte rosado 5,4:1; blanco/whatsapp 5,4:1; borde de campo/superficie 3,9:1. El dorado no lleva texto encima en rojo (2,2:1): solo filetes.

**Tomado del ejemplo:** tipografías Baloo 2 (títulos), Work Sans (texto) y Space Mono (etiquetas pequeñas); radios de 20, 16 y 12 px y botones en píldora; barra fija translúcida con desenfoque; etiqueta "eyebrow" en píldora; "pecar." resaltado en rojo con subrayado dorado; tarjetas con borde superior de color en Ventajas y Cómo pedir; barra degradada rojo a dorado en el carrito y la calculadora; cuadrícula sutil y símbolos ✦ + ○ en la portada; chips de filtro con borde rojo (Dulces) y dorado (Salados); elevación al pasar el cursor; pulso suave solo en el botón de WhatsApp de la portada (con `prefers-reduced-motion: no-preference`).

**Matices de las fotos:** insignia Dulce/Salado y filete bajo cada foto en rosa fresa o caramelo según la categoría; sombras cálidas; marco con radio y `filter: saturate(1.04) contrast(1.02)` uniforme.

**Cambios técnicos:** `index.css` reescrito; en `index.html` solo el enlace de Google Fonts y `theme-color` (#FFFBF6). No se tocaron textos, precios, ids, `data-*`, JSON-LD, SEO ni `index.js`; las clases que usa el script (`abierto`, `rebote`, `sin-scroll`, etc.) se conservan. Revisado con capturas en Edge a 1280 px y a 400 px, sin desbordamiento; el flujo del carrito no se volvió a probar tras el rediseño (solo se confirmaron sus clases en el CSS).

**Nota:** la carpeta `ejemplo de diseño` incluye `.github/workflows/static.yml`, un flujo que publica el sitio en GitHub Pages; puede reutilizarse al publicar. La carpeta no debe subirse al repositorio de la página (contiene nombres y un correo de otro proyecto).

## Correcciones posteriores (21/09/2026)

1. **Subrayado de "pecar.":** el rectángulo desalineado bajo la palabra lo causaba un fondo degradado (`linear-gradient(transparent 68%, dorado 68%)`) que cubría toda la caja de la fuente Baloo 2, con un descendente muy alto, y caía por debajo de la línea base. Ahora es un subrayado real (`text-decoration`) dorado caramelo de unos 6 a 7 px, pegado a la base de las letras y del ancho exacto de la palabra.
2. **Precios por unidad eliminados:** se quitaron todos los "S/ x,xx c/u" (tarjetas, código y textos). Solo se muestra el precio del paquete (25, 50 o 100). El subtítulo del catálogo ahora dice "Elige 25, 50 o 100 unidades de cada sabor y puedes mezclar sabores en un mismo pedido."
3. **Calculadora ampliada:** además de la frase "Para N invitados necesitas unas X unidades. Te sugerimos ...", muestra cuántos bocaditos recibe cada invitado (6) y tres formas de armar el pedido con datos reales del catálogo:
   - **Mixto (dulces y salados):** se reparte la necesidad en mitad dulces y mitad salados y cada mitad se cubre con la combinación de menor excedente; indica el total real y los bocaditos por invitado que resultan.
   - **Solo dulces** y **Solo salados:** la misma combinación de la frase principal.
   - Cada opción muestra unidades por categoría, paquetes por tamaño, bocaditos por invitado y un rango "Desde S/ X hasta S/ Y" (el producto más barato y el más caro de la categoría en cada tamaño), con el aviso "Depende de los sabores que elijas."; debajo, la lista de productos dulces y salados con los enlaces "Ver dulces" y "Ver salados", que aplican el filtro del catálogo.
   - **Ejemplo para 20 invitados:** mixto = 60 dulces y 60 salados, cada mitad 1 paquete de 50 y 1 de 25 (75), total 150 unidades, desde S/ 166,00 hasta S/ 212,00; solo dulces = 125 unidades, desde S/ 124,00 hasta S/ 163,00; solo salados = 125 unidades, desde S/ 150,00 hasta S/ 188,00.
   - Probado en Node (1, 4, 8, 16, 17, 20, 40 y 1000 invitados) y en Edge sin errores de script; capturas revisadas a 1280 px y a 400 px.
   - **Por validar con el usuario:** con pocos invitados el mixto se pasa mucho de 6 por invitado (por ejemplo, 1 invitado = 50 unidades), y de 9 a 12 invitados "Solo dulces/salados" sugiere un paquete de 100 en lugar de 50 + 25 por la regla de un solo tamaño hasta 16 invitados.
   - **Publicación:** estos tres cambios están solo en la carpeta local; falta subirlos al repositorio `AldoVeg/zegel`.

## Actualización con `incluir.pdf` (21/09/2026)

**Regla del usuario (para todo el proyecto):** lo que llega en "incluir" FORTALECE y ACTUALIZA; no reemplaza ni quita lo existente. Por eso se conservaron los pays. Única sustitución: la tartaleta "fresa/durazno" se separó en dos productos, como en el nuevo catálogo.

### Catálogo vigente: 23 productos (precios del paquete de 25 / 50 / 100 unidades, en soles)

| Producto | Tipo | 25 | 50 | 100 | Foto |
|---|---|---|---|---|---|
| Pettit pan con pollo | salado | 35,00 | 68,00 | 135,00 | pettit-pollo.jpg |
| Pettit pan con pollo y apio | salado | 35,50 | 70,00 | 136,00 | pettit-pollo-apio-nueva.jpg |
| Pettit pan con pollo y durazno | salado | 38,00 | 75,00 | 150,00 | pettit-pollo-durazno-nueva.jpg |
| Mini empanaditas de pollo | salado | 30,00 | 60,00 | 120,00 | mini-empanaditas-pollo-nueva.jpg |
| Mini empanaditas mixtas | salado | 35,00 | 68,00 | 135,00 | mini-empanaditas-mixtas-nueva.jpg |
| Mini empanaditas de carne (nuevo) | salado | 33,00 | 65,00 | 125,00 | mini-empanaditas-carne.jpg |
| Mini causitas (nuevo) | salado | 30,00 | 59,00 | 118,00 | mini-causitas.jpg |
| Mini causitas de pollo (nuevo) | salado | 35,00 | 68,00 | 134,00 | mini-causitas-pollo.jpg |
| Mini causitas de atún (nuevo) | salado | 33,00 | 65,00 | 125,00 | mini-causitas-atun.jpg |
| Mini alfajores con coco (precio actualizado) | dulce | 28,00 | 55,00 | 105,00 | mini-alfajores-coco.jpg |
| Mini alfachips (precio actualizado) | dulce | 30,00 | 59,00 | 115,00 | mini-alfachips.jpg |
| Mini alfajores con chocolate (precio actualizado) | dulce | 32,00 | 63,00 | 125,00 | mini-alfajores-chocolate.jpg |
| Mini tartaleta de fresa (nuevo) | dulce | 32,00 | 60,00 | 116,00 | mini-tartaleta-fresa.jpg |
| Mini tartaleta de durazno (nuevo) | dulce | 32,00 | 60,00 | 116,00 | mini-tartaleta-durazno.jpg |
| Mini tartaleta de maracuyá (nuevo) | dulce | 35,00 | 68,00 | 132,00 | mini-tartaleta-maracuya.jpg |
| Mini pay de limón (se conserva, precio anterior) | dulce | 32,00 | 60,00 | 116,00 | mini-pay-limon.jpg |
| Mini pay de manzana (se conserva, precio anterior) | dulce | 33,00 | 66,00 | 130,00 | mini-pay-manzana.jpg |
| Vasitos de maracuyá (nuevo) | dulce | 62,50 | 124,00 | 245,00 | vasitos-maracuya.jpg |
| Vasitos de durazno (nuevo) | dulce | 63,50 | 126,00 | 250,00 | vasitos-durazno.jpg |
| Vasitos de fresa (nuevo) | dulce | 64,50 | 128,00 | 255,00 | vasitos-fresa.jpg |
| Brownies de chocolate (nuevo) | dulce | 30,00 | 59,00 | 115,00 | brownies-chocolate.jpg |
| Mini trufas de chocolate (precio igual) | dulce | 33,00 | 65,00 | 125,00 | trufas-chocolate-nueva.jpg |
| Niditos de amor (nuevo) | dulce | 32,00 | 62,00 | 120,00 | niditos-de-amor.jpg |

Notas: en la p. 6 del PDF el tercer producto decía "Mini tartaleta de maracuyá" pero la foto y los precios corresponden a un vasito de fresa; el usuario confirmó **Vasitos de fresa**. El PDF traía "245.0" para el vasito de maracuyá (100 unidades); se tomó como 245,00. "Mini causitas" (sin relleno en el nombre) se conserva tal cual. `priceRange` del JSON-LD: "S/ 28 - S/ 255". Destacadas (2 columnas): alfajores con chocolate, tartaleta de maracuyá y brownies.

### Fotos (director-arte-visual)

- Se copiaron 17 fotos nuevas a `img/` sin borrar ni sobrescribir nada. Para 5 productos se usa la versión "-nueva" (pettit con apio y con durazno, empanaditas de pollo y mixtas, trufas), por mostrar el relleno o ser más nítidas; los originales quedan sin uso en `img/` junto con `mini-tartaleta-fresa-durazno.jpg`.
- Cada tarjeta lleva un `object-position` propio para ocultar placas o la estrella de Gemini; las dos destacadas horizontales usan `--posicion-horizontal`.
- **Avisos:** muchas fotos nuevas son generadas por IA (llevan la estrella de Gemini o el sello "El Delicioso") y no son el producto real; las de alfajor de coco, pays y tartaletas parecen de banco de imágenes. La foto de los niditos lleva una marca ajena ("Epa") y el usuario decidió usarla igualmente. Conviene sustituirlas poco a poco por fotos propias.
- **Débiles:** mini-alfachips (475 px, captura de Instagram), mini-pay-manzana (403 px), mini-pay-limon (540 px), niditos de amor y pettit con durazno (texto propio en la imagen).

### Nuevo orden y flujo de compra (programador-web)

- **Orden:** encabezado, portada, **planificador** (la calculadora sube aquí, con "Planifica" en el menú), catálogo pegado justo debajo, ventajas, ocasiones (solo tarjetas), cómo pedir, nosotros y contacto.
- **Planificador:** título "Planifica tu evento en un minuto". Tras calcular, muestra la frase de siempre, "Cada invitado recibe 6 bocaditos" y "Elige tu camino" con tres opciones (Mixto, Solo dulces, Solo salados), cada una con unidades, paquetes, rango de precio calculado con los 23 productos y su botón "Elegir ...".
- **Al elegir un camino:** se guarda (localStorage), el catálogo se filtra (mixto = 23 productos, dulces = 14, salados = 9), aparece la línea "Camino: Mixto · 20 invitados · meta: 60 dulces y 60 salados", se desplaza suave al catálogo y el foco pasa a su título. Evento `elegir_camino`.
- **Columna flotante "Tu lista de compras"** (derecha en escritorio desde 75 em, cajón lateral entre 62,5 y 75 em, barra inferior en móvil): se llena al pulsar "Agregar", con el objetivo, el avance por categoría con barra ("Dulces: llevas 75 de 120"), los estados (vacío, incompleto, completo, excedido), los bocaditos por invitado, la lista con − / + y quitar, el total y los botones "Ver carrito y continuar" y "Seguir eligiendo". Usa las mismas líneas del carrito.
- **Metas:** mixto = mitad dulces y mitad salados (redondeo hacia arriba de invitados × 6 / 2); solo dulces o solo salados = invitados × 6. Regla de estado por categoría: llevas < meta = incompleto; llevas ≥ meta y sobran < 25 = completo; sobran ≥ 25 = excedido.
- **Carrito = paso final:** título "Último paso: tu pedido", con fecha obligatoria (2 días de anticipación) y envío por WhatsApp; el mensaje añade la línea "Evento: N invitados, camino ...". Evento `continuar_carrito`.
- **Pruebas:** `node --check`; 188 comprobaciones en Node (metas, excedentes 24/25/49/50, rangos, 1 a 1000 invitados); 110 en Edge sin ventana a 1280, 1100 y 400 px, sin errores de script ni desbordamiento; capturas revisadas. No verificado: lectores de pantalla, Safari/iOS y el envío real a WhatsApp.
- **Ajustes pedidos después:** (1) en los cuadros de cantidad 25/50/100 se quitó el precio pequeño bajo cada número, porque repetía el precio grande de la tarjeta (que se actualiza al elegir); (2) los cuadros de "Elige tu camino" quedaron concretos: título, unidades (en mixto, el reparto "75 dulces + 75 salados"), rango "Desde S/ X hasta S/ Y" y botón; se quitaron descripciones, listas de paquetes, "por invitado", avisos y textos de ayuda.
- **Más ajustes pedidos (21/09/2026):**
  1. **Bocaditos por invitado como dato de cálculo:** el planificador tiene un segundo campo `#bocaditos-por-invitado` (por defecto 6, entero de 1 a 30; vacío = 6). Recorre todo el cálculo: unidades necesarias, combinación de paquetes, tres caminos, metas y textos de la lista flotante, plan guardado en localStorage (los planes viejos sin el campo se leen como 6), contexto del catálogo y mensaje de WhatsApp ("Evento: N invitados, X bocaditos por invitado, camino ..."). Regla del tamaño único generalizada: si las unidades necesarias son ≤ 100 se sugiere el menor paquete que las cubra; si son más, la combinación de menor excedente (con 6 por invitado el resultado es idéntico al anterior: verificado de 1 a 1000 invitados). Tope de 10 000 unidades en línea; más se atiende por WhatsApp.
  2. **Cuadros de "Elige tu camino" con datos específicos:** en lugar del rango de precio, cada cuadro muestra una **sugerencia concreta con nombres de productos** y total exacto. Regla: por categoría se ordenan los paquetes de mayor a menor y se asignan productos distintos en el orden del catálogo (dando la vuelta si hace falta), agrupando repetidos y mostrando como máximo 6 líneas por categoría y "y n sabores más". Ejemplo con 20 invitados y 6 por invitado: Mixto = 150 unidades (75 dulces + 75 salados), 50 Mini alfajores con coco + 25 Mini alfachips + 50 Pettit pan con pollo + 25 Pettit pan con pollo y apio, total sugerido S/ 188,50; Solo dulces = 125 unidades, 100 Mini alfajores con coco + 25 Mini alfachips, S/ 135,00; Solo salados = 125 unidades, 100 Pettit pan con pollo + 25 Pettit pan con pollo y apio, S/ 170,50. Con 8 por invitado (160 unidades): mixto 200 unidades, S/ 240,00.
  3. **Textos de "ventajas" (abajo del catálogo):** 01 "Sabor a casa" ("Hechos en casa, con el sabor de siempre."); 02 "Variedad para elegir" ("23 sabores, dulces y salados, para armar tu mesa."; se eligió la diversidad, que es verificable, en vez de "ingredientes de calidad", que no está confirmada); 03 "Pídelo a un solo clic" ("Elige, pon la fecha y envíalo por WhatsApp."). Si el catálogo cambia de tamaño, hay que actualizar el "23".
- **Cambios posteriores (21/09/2026, tarde):**
  1. **Sin cantidad por defecto y rango de 3 a 10:** el campo "Bocaditos por invitado" empieza vacío y es obligatorio (entero de 3 a 10; para más, WhatsApp). Ya no existe el valor 6 por defecto en el código; los planes guardados sin ese dato conservan los invitados, dejan el campo vacío y descartan el camino. La guía de uso social (Lima 2026) es: 3 a 4 con almuerzo o cena, 5 a 7 en picoteo o cumpleaños con torta, 8 a 10 si los bocaditos son la comida.
  2. **Proporción y sobrantes:** las unidades necesarias son invitados × bocaditos por invitado; como los paquetes son de 25, 50 y 100, se avisa cuántas sobran. Bajo la frase principal: "Sobran 5 bocaditos: repartidos por igual, cada invitado recibiría 6,25." (o "Reparto exacto: cada invitado recibe N bocaditos."). Cada cuadro de camino lleva su línea ("Sobran 30: 15 dulces y 15 salados") y la lista dice "Cubres las 120 unidades y sobran 5." (desde 25 de sobra: "Te pasas por N unidades: habrá para repetir."). Verificado sin diferencias en 60 casos frente a la versión anterior.
  3. **Leyenda "Datos a considerar":** las guías salieron de la ayuda bajo los campos y pasaron a un bloque dentro de la tarjeta del planificador, con cuatro ítems separados (3 a 4, 5 a 7, 8 a 10 por invitado y "Paquetes de 25, 50 o 100"). Las ayudas de los campos quedaron en "De 1 a 1000." y "De 3 a 10.".
  4. **La lista de compras reemplaza al carrito:** se eliminó el panel y el fondo del carrito. El botón del encabezado es "Mi lista" (abre o colapsa la columna derecha aunque esté vacía). El **último paso baja al pie de la lista**: "Último paso: tu pedido" con la fecha obligatoria (hoy + 2 días) y el botón verde "Enviar pedido por WhatsApp"; "Seguir eligiendo" queda debajo. Eventos: `abrir_lista` reemplaza a `abrir_carrito`; `continuar_carrito` desaparece. En el código quedan por compatibilidad la clave de localStorage `el-delicioso-carrito`, `resumirCarrito` y el evento `agregar_al_carrito`.
  5. **Producto especial "Empanadas amazónicas"** (foto `img/selva.png`): sale en Todos y en Salados (24 productos: 24 en Todos, 14 dulces y 10 salados) con las etiquetas "Salado" y "Especial", **"Precio por cotizar"** y el botón verde **"Solicitar por WhatsApp"** en vez de "Agregar"; el selector 25/50/100 solo indica la cantidad a cotizar y el mensaje sale como "Quisiera cotizar N unidades de empanadas amazónicas...". No cuenta para totales, metas, sugerencias ni precios. Evento `clic_whatsapp` con ubicación `cotizacion_empanadas-amazonicas`. La ventaja 02 ahora dice "24 sabores". Las fotos de `mini-empanaditas-carne.jpg`, `mini-empanaditas-mixtas-nueva.jpg` y `mini-pay-manzana.jpg` fueron reemplazadas por el usuario después de la primera entrega.
  - **Pruebas:** `node --check`; 221 comprobaciones en Node (regresión idéntica con 3, 6 y 10 bocaditos por invitado en 1 a 1000 invitados); Edge sin ventana a 1280, 1100 y 400 px sin errores de script ni desbordamiento; capturas revisadas. No verificado: envío real a WhatsApp, lectores de pantalla ni Safari.
- **Rediseño según la maqueta del usuario (21/09/2026, noche):** maqueta en `images/1.png` de la sesión.
  1. **Planificador minimalista:** arriba a la izquierda título y una sola línea ("Calcula cuántos bocaditos necesitas."), a la derecha los dos campos y "Calcular"; barra ancha con la frase del resultado; debajo, dos columnas: a la izquierda la línea de reparto/sobrantes y "Datos a considerar" (el ítem de paquetes ahora es "Paquetes de 25, 50, 100 y más": "Se combinan para cubrir tu cantidad; si no encaja exacto, te decimos cuántas sobran."), a la derecha "Elige tu camino" en tres filas (resumen a la izquierda: título, unidades, reparto y sobrantes; detalle a la derecha: productos sugeridos y botón "Elegir ..."). Se quitó el "Total sugerido" de las filas porque la maqueta no lo muestra (el precio se ve en la lista); el mixto se titula solo "Mixto". Antes de calcular solo se ven título, campos y datos. En móvil todo va apilado.
  2. **Lista en un panel horizontal desplegable:** ya no hay columna vertical fija a la derecha ni desplazamiento del contenido. El botón "Mi lista" abre, debajo del encabezado y alineado con él, un panel de ancho min(64rem, 100% − 2rem), máximo 70vh, con tres columnas (resumen y avance; líneas de la lista; total, "Último paso: tu pedido" con fecha y botón verde de WhatsApp, y "Seguir eligiendo"). Se desliza hacia abajo (sin movimiento con `prefers-reduced-motion`), se abre solo al agregar un producto y se cierra con la X, "Seguir eligiendo", Escape o "Mi lista"; un clic en la página no lo cierra. En móvil se mantiene la barra inferior con panel; allí agregar un producto no lo abre.
  3. **Empanadas amazónicas:** se eliminó la línea "Precio por cotizar"; quedan las etiquetas Salado y Especial, la frase, el selector de cantidad a cotizar y el botón verde "Solicitar por WhatsApp".
  - **Pruebas:** regresión en Node de 56 casos (11 valores de invitados × 5 de bocaditos): resultados idénticos salvo el título del mixto; Edge sin ventana a 400, 800, 1000, 1100 y 1280 px sin errores de script, ids duplicados ni desbordamiento. Falta el envío real a WhatsApp, lectores de pantalla y Safari.
- **Detalles a revisar:** en mixto con dos categorías incompletas el estado dice "Te faltan N unidades."; los rangos "Desde/hasta" son amplios porque los vasitos cuestan más del doble que el resto; el encabezado no cede ancho a la columna flotante en escritorio (solo el contenido).

## Plan por grupos (cada uno se valida antes de continuar)

| Grupo | Estado |
|---|---|
| 1. Base y estrategia | Terminado y validado |
| 2. Identidad y contenido | Terminado y validado (portada aprobada) |
| 3. Maquetación | Terminado y validado |
| 4. Funcionalidad | Terminado y validado |
| 5. Posicionamiento y redes | Terminado y validado |
| 6. Revisión final | Terminado, a la espera de validación del usuario |

## Pendientes

- [x] Leer el PDF con productos y precios (hecho).
- [x] Confirmados: código de país +51, precio 35.50, nombre "pay de manzana", delivery sí, anticipación de 2 días, pagos todos.
- [x] Ciudad: Lima. Delivery: sí, en Lima.
- [ ] Faltan: distrito, costo del delivery, horario de atención, historia del negocio, redes reales (por evaluar) y fotos propias.
- [ ] Al publicar en GitHub Pages: URL, `canonical`, `og:url`, `og:image`, `sitemap.xml` y campos omitidos del JSON-LD.
- [x] Definir estrategia y mapa del sitio (marketing-web y arquitecto-web) con los datos del PDF.
- [x] Validación del grupo 1 por parte del usuario (decisiones registradas arriba).
- [ ] Decidir cómo funcionan las cajas surtidas (por evaluar).

## Historial

> Entradas del 21/09/2026 al 01/10/2026 archivadas en [`archivo/avance-historial-2026-09.md`](archivo/avance-historial-2026-09.md) (55 entradas con su detalle de decisiones, catálogo, vasitos, hosting y stikers).

- 28/10/2026: **escaneo total con el equipo, limpieza y refresco.** Auditaron programador-web (código muerto), seguridad-web (cabeceras, DOM, datos, rendimiento) y arquitecto-web (mejoras tecnológicas). Seguridad: sin hallazgos críticos ni altos. Con validación del usuario se hizo: 1) se borraron 10 imágenes sustituidas o sin uso (variantes antiguas de empanaditas y petit, 5 JPG de ocasiones, una tartaleta y el banner `encabezado-empanadas.webp`); 2) los originales (Encabezado.png, STIKERS.jpg, DELICIOSO.jpg, logo.jpg, marca original y QR) siguen en git pero ya no se publican (`.vercelignore`); 3) se retiró de HTML, CSS y JS la ventana de aviso y la cuenta regresiva de las empanadas (vencidas el 1/10) junto con `calcularCuentaRegresiva`, y la tarjeta de empanadas se conserva; 4) se quitó la función muerta `describirParte` y tres clases sin uso. Versión nueva: 202610280824. Se mantienen `github-pages-redirect/` y el workflow mientras circulen los stikers con el QR viejo.
- 28/10/2026: **potenciación engranada, primera tanda.** 1) Pruebas automáticas en `tests/puras.test.js` (dinero, filtro numérico, mensaje de reserva y enlace de WhatsApp) con `npm test`, sin dependencias; 4 pruebas en verde. Sirven de red de seguridad para lo que sigue. 2) `vercel.json`: caché de imágenes de 1 día con revalidación en segundo plano y HTML y `version.json` siempre revalidados (no se usó `immutable` porque las fotos no llevan hash en el nombre). 3) `index.css`: movimiento sutil al final del archivo, todo dentro de `prefers-reduced-motion: no-preference`: botones que se hunden al pulsar y entrada suave de la fila nueva de la lista. Se descartó animar las opciones del planificador (se redibujan y repetirían el movimiento) y subrayar el menú (ya existe el indicador que sigue al cursor). Pendiente de la cadena: fuentes propias (cambia la política de seguridad, requiere validar), imágenes WebP/AVIF, Vite y módulos.
- 28/10/2026: **potenciación engranada, segunda tanda y cierre.** 1) Fuentes propias: carpeta `fonts/` con WOFF2 latinos (Baloo 2 y Work Sans variables, Space Mono 400 y 700; unos 150 KB), `@font-face` al inicio de `index.css` con `font-display: swap`, sin `preconnect` ni hoja de Google, y la política de seguridad de `vercel.json` ahora es `style-src 'self' 'unsafe-inline'; font-src 'self'` (ya no abre orígenes de terceros). Las fuentes llevan caché de un año (`immutable`, porque no cambian de nombre). 2) Imágenes en WebP calidad 80: 26 fotos (productos, portada, selva y logo) pasaron de 3,38 MB a 1,38 MB (-59 %), con las mismas dimensiones; se borraron los JPG/PNG sustituidos y se conserva `og-portada.jpg` porque las redes sociales piden JPG. 3) Pruebas nuevas en `tests/publicacion.test.js`: todo recurso local referenciado existe, los tres sellos de versión coinciden con `version.json` y la política de seguridad no depende de Google Fonts; en total 7 pruebas en verde. 4) Verificación real en Chromium (Playwright, 390 px): fuentes propias cargadas, 0 respuestas 404, 0 errores de consola, portada visible. Revisión de código muerto final: ninguna función sin uso. Pendiente (decisión aparte por riesgo): empaquetador Vite, división de `index.js` en módulos, catálogo en JSON, PWA y analítica; la PWA exige cuidar que no queden precios viejos en caché.
- 28/10/2026: **potenciación engranada, tercera tanda (módulos y PWA).** 1) `index.js` (2.600 líneas) se dividió en módulos ES nativos dentro de `src/`: `config`, `dinero`, `calculadora`, `armado`, `plan`, `fechas`, `carrito`, `combos`, `origen`, `mensajes`, `medicion` (lógica pura, sin DOM) y `main` (interfaz); `src/indice.js` los reúne para las pruebas. `index.html` carga `<script type="module" src="src/main.js?v=...">`; no hace falta empaquetador ni cambia la publicación en Vercel, y los módulos internos se revalidan siempre (cabecera por defecto de Vercel). El código se movió sin reescribirlo: la división se hizo con un script que calcula las importaciones. Verificado en Chromium: agregar a la lista, calculadora con 40 invitados × 5 (3 opciones), elegir camino, 0 errores y 0 respuestas 404. 2) Web instalable (PWA ligera): `manifest.webmanifest`, íconos `img/icono-192.png` y `icono-512.png`, y `sw.js` con la red primero para páginas, scripts, estilos y datos (así nunca se ven precios viejos) y caché primero solo para fotos y fuentes; `version.json` siempre va directo a la red. Verificado: con el sitio ya cargado y sin conexión, recarga y muestra las 24 tarjetas. 3) Pruebas: 7 en verde (ahora leen `src/` y el manifiesto). **No se hizo, por decisión de riesgo:** Vite (cambia el flujo de publicación y no se puede verificar Vercel desde aquí), catálogo en JSON (necesita paso de construcción para no perder SEO) y analítica de terceros (requiere elegir servicio y ajustar la política de seguridad); los eventos de `registrar()` siguen listos para conectarse. Para cerrar un cambio hay que subir el sello de versión en los tres lugares de `index.html` y `version.json` (la prueba de publicación lo comprueba).
- 28/10/2026: **planificador rediseñado (alternativa A, "paso a paso").** Pedido del usuario: la zona de planificación se sentía amontonada. Se evaluaron 4 alternativas en `propuestas/planificador-alternativas.html` (local, excluida de Vercel) y se aplicó la A. Cambios: 1) `index.html`: título e introducción arriba (la guía de paquetes pasó a la introducción) y dos columnas: a la izquierda las etapas 1 (invitados) y 2 (tipo de evento con tres botones: almuerzo o cena, picoteo o brindis, comida principal, que rellenan "Bocaditos por invitado"; también se puede escribir), a la derecha el resultado y la etapa 3 (los tres caminos como opciones de radio con un único botón "Armar mi lista con …"); un aviso con borde punteado ocupa la derecha hasta calcular. Se eliminó el bloque "Datos a considerar". 2) `src/main.js`: `crearFilaOpcion` ahora crea radios nativos (la elegida muestra su detalle y sobrantes), nuevos `caminoMarcado`, `actualizarBotonCamino` y `marcarEvento` (reemplaza a `resaltarTramo`); el botón único llama a `elegirCamino` como antes, así que filtro, lista y medición no cambian. 3) `index.css`: bloque del planificador reescrito (`etapa`, `evento`, `opcion` en filas); se nombró `etapa` y no `paso` porque `.paso` ya existe en "Cómo pedir". 4) **Reparación importante:** una edición mía anterior había duplicado unas 540 líneas de `index.css` (quedaban dos copias de casi todas las reglas); se reconstruyó el archivo desde la versión limpia (fuentes propias, promo retirada, movimiento sutil una sola vez) y pasó de 3.000 a unas 2.400 líneas. 5) Pruebas nuevas: todo id que `main.js` busca existe en el HTML y los tres tipos de evento cubren de 3 a 20 sin huecos (9 en total). Verificado en Chromium (1200 y 390 px): evento rellena el campo y queda marcado, cálculo, cambio de radio actualiza el botón, elegir salados filtra el catálogo, error por dato inválido, 0 errores y 0 404. Limpieza: sin clases CSS ni funciones sin uso (las clases `avance--*` y `lista__estado--*` se generan por plantilla en JS y no son código muerto).
- 28/10/2026: **ajuste del planificador para que coincida con el modelo A.** El usuario señaló que lo publicado no se parecía a la alternativa A presentada. Diferencias corregidas: 1) el resultado ahora es un bloque grande ("NECESITAS 240 unidades" con la sugerencia de paquetes debajo, cifra que cuenta de 0) en lugar de la frase en barra rosada; la frase completa queda solo para lectores de pantalla y para el aviso de error; 2) los tres caminos son tres opciones de radio en una fila (apiladas en celular) con título y reparto, y el detalle de sobrantes y productos del camino marcado va debajo (en el modelo no estaba; se conservó porque es información útil antes de elegir); 3) el botón único dice "Armar mi lista con este camino"; 4) las etiquetas del formulario usan el estilo mono en mayúsculas del modelo, con el rango dentro de la etiqueta (se quitaron los textos de ayuda sueltos). Código: `textoSugerenciaPaquetes` (calculadora.js), `necesarias` y `sugerencia` en `describirResultado` (armado.js), `crearDetalleOpcion` y `calculadora-hero` en main.js; se eliminó `crearUnidades`. Verificado en Chromium (1200 y 390 px), 9 pruebas en verde, sin código sin uso.
- 28/10/2026: **planificador como panel en vivo, ceñido al modelo A adjunto por el usuario.** Cambios respecto a lo publicado antes: 1) sin botón "Calcular": el resultado se actualiza al escribir o al pulsar un tipo de evento (`calcularEnVivo` en main.js; sin dato vuelve al aviso inicial, un dato fuera de rango muestra su aviso tras 700 ms para que "1" camino a "15" no parpadee, el camino marcado se conserva al recalcular, la cifra solo cuenta de 0 la primera vez y el evento `usar_calculadora` se mide al dejar de escribir 1,2 s); 2) el título y la introducción salieron de la tarjeta y quedan encima, como en el modelo; la tarjeta solo lleva los pasos; 3) etiquetas exactas del modelo ("Número de invitados", "Ajusta si quieres (3 a 20)", esta última con "Bocaditos por invitado" oculto para lectores de pantalla); 4) se quitaron la línea de sobrantes y el detalle de productos bajo los caminos, que el modelo no tiene; cada opción muestra solo título y reparto ("100 dulces + 100 salados", "200 dulces", "200 salados"); 5) la sugerencia omite "(N unidades en total)" cuando coincide con lo necesario ("Te sugerimos 2 paquetes de 100."). Código muerto retirado: `sugerirProductos`, `describirSugerencia`, `productosDeCategoria`, `textoSobrantesOpcion`, `textoSobrantesEquidad`, `textoSobran`, `MAX_LINEAS_SUGERENCIA`, los campos `boton`, `ayuda` y `descripcion` de `CAMINOS`, el parámetro `catalogo` de `describirResultado` y todo el CSS del detalle. 11 pruebas en verde; verificado en Chromium a 1200 y 390 px (vacío, en vivo, cambio de invitados con camino marcado, dato inválido, campo vacío, elegir camino y filtro), sin errores ni 404.
- 28/10/2026: **fortalecimiento por engranaje: guardianes contra duplicados y proceso de publicación en un solo flujo.** Criterio del usuario: evolucionar la estructura evitando duplicados que solo consumen memoria y las observaciones internas repetidas. Cambios: 1) `tools/auditoria.js` (detalle con `npm run auditar`) y `tests/auditoria.test.js` (parte de `npm test`) vigilan: selectores CSS repetidos en el mismo contexto, reglas con cuerpo idéntico (deben agruparse con coma), clases CSS sin uso (las `avance--*` y `lista__estado--*` se declaran dinámicas porque el JS las arma por plantilla), funciones y constantes sin uso en `src/` e imágenes o fuentes huérfanas (lo excluido en `.vercelignore` cuenta como material de marca guardado a propósito). Se comprobó que fallan al inyectar un duplicado. 2) Se fundió el CSS existente: 5 selectores repetidos (`body`, `img`, `.menu`, `.tarjeta__foto`, `.tarjeta__nombre`) en una sola regla cada uno y 7 grupos de reglas idénticas agrupadas con coma; se retiró un envoltorio `@media` vacío. Comprobación: estilo calculado de todos los elementos (1.200 por estado) antes y después en 1200 y 390 px y en cuatro estados (inicio, cálculo, camino elegido, lista abierta): 0 diferencias. 3) `npm run sellar` (`tools/sellar.js`) actualiza de una vez el sello de versión en `index.html` (data-version y los dos `?v=`) y en `version.json`; la prueba de publicación sigue comprobando que coincidan. 4) `.vercelignore` ahora excluye `tools/`, `tests/` y `package.json` de lo que se publica. Flujo de cierre de cada cambio: editar, `npm test`, `npm run sellar`, commit y push. 16 pruebas en verde.
- 28/10/2026: **pendientes atendidos: `main.js` dividido en módulos de interfaz y `avance.md` archivado.** 1) `src/main.js` pasó de 1.561 a unas 590 líneas. Se extrajeron a `src/ui/`: `planificador.js` (panel en vivo), `combos.js` (promos), `galeria.js` (portada, selector de grupo y carrusel), `menu.js`, `progreso.js`, `proteccion.js`, `version.js` (aviso de versión nueva), `almacenamiento.js`, `utiles.js` (`$`, `crear`, `ponerTexto`, `consultaMovimiento`) y `sesion.js` (la lista y el plan, el único estado compartido). Cada módulo recibe de `main.js` solo lo que necesita (por ejemplo `aplicarFiltro` y `dibujarLista`) y nada se duplicó: `consultaMovimiento`, `crear` y `$` viven en un solo sitio. Quedan en `main.js` el catálogo, la lista de compras y el pedido, que comparten demasiadas piezas para separarse sin riesgo. 2) Nuevo guardián en `npm test`: cada módulo importa exactamente lo que usa (encontró 3 importaciones sobrantes que dejó la división y se corrigieron); ahora son 17 pruebas. 3) Regresión de interfaz en Chromium (1200 y 390 px, 33 comprobaciones): agregar al catálogo, guardado, protección contra copia, barra de progreso, subrayado del menú, planificador en vivo, elegir camino, combo, selector de grupo, flechas y pausa de la galería, cambio de foto de portada, clic en diapositiva, lista, pedido por WhatsApp con plan, fecha y total, y aviso de versión nueva: todo bien y sin errores de consola. 4) `avance.md` bajó de 148 KB a unos 64 KB: el historial del 21/09 al 01/10 (55 entradas) está en `archivo/avance-historial-2026-09.md`, y arriba del archivo hay una tabla "Estado actual del código" con el mapa de módulos y el flujo de cierre. `archivo/` no se publica.
- 28/10/2026: **nueva sección "El pecado más vendido" (kekes rectangulares).** Decisiones del usuario: mostrar las 14 versiones de su lista (piña, durazno, arándano, plátano, maracuyá, fresa con arándano, zanahoria, naranja, chocolate, marmoleado, chispas de chocolate, vainilla, oreo y el de Novia; había dicho 9 pero la lista tenía 14), sección propia con cinta en la portada (se descartó la ventana flotante casi transparente: no cabe tanta variedad, tapa el contenido en celular y el texto sobre transparencia pierde legibilidad), precio distinto por versión y sin fotos todavía. Se hizo: 1) `src/kekes.js`: única fuente de datos (id, nombre real, matiz sutil, color del sabor, precio en céntimos o `null`, `especial` para Novia) más `textoPrecioKeke` y `construirMensajeKeke`; 2) `src/ui/kekes.js` dibuja las tarjetas (keke dibujado con el color del sabor, nombre con su matiz en cursiva, precio y botón "Pedir este" a WhatsApp con el sabor en el mensaje; el origen de la visita lo suma `aplicarOrigenAEnlaces`); 3) `index.html`: sección `#pecado` justo bajo la portada (nace oculta), cinta discreta en la portada ("El pecado más vendido · 14 versiones →") y enlace "Kekes" en el menú (compactado en celular para que quepan los 5 enlaces); 4) `index.css`: bloque propio, y `.keke` se sumó a las reglas ya existentes de aparición y elevación (sin duplicar); el de Novia ocupa dos columnas con el dorado de la marca; 5) `tests/kekes.test.js`: datos válidos, precio y mensaje, y que el HTML diga la cantidad correcta de versiones (14). 20 pruebas en verde; regresión de 33 comprobaciones sin cambios. **Pendiente del usuario:** el precio de cada versión (hoy dice "Consultar precio"; basta poner `precioCentimos`, por ejemplo 3500 para S/ 35,00), las fotos (hoy hay una forma de keke con el color del sabor) y afinar los matices de los nombres (son propuestas: soleada, jugoso, silvestre, maduro, vibrante, frutos rojos, casero, fresco, profundo, a dos tonos, en cada bocado, clásico, cremoso y edición especial). Los kekes aún no se agregan a "Mi lista" porque no tienen tamaños ni precios; se piden uno a uno por WhatsApp.
- 28/10/2026: **kekes presentados como "Muestrario de colores" (alternativa elegida por el usuario de 5 propuestas locales).** Las alternativas (estantería, escaparate, muestrario, por familias y carta) están en `propuestas/kekes-alternativas.html`, que no se publica. Se aplicó la 3 tal cual: una franja de color por versión; en escritorio son franjas verticales con el nombre de lado y la tocada se ensancha mostrando nombre grande, matiz, precio y "Pedir este"; en celular se apilan como acordeón. Arranca abierta la segunda (Piña). Mejoras sobre el boceto sin cambiar lo que se ve: la franja es un contenedor con un botón (nombre, con `aria-expanded` y teclado) y el enlace de WhatsApp queda fuera del botón, porque un enlace dentro de un botón no es válido; el texto va oscuro sobre colores claros y blanco sobre oscuros con `esTonoClaro` (probado); las transiciones solo con movimiento permitido. Se retiró lo de la versión anterior de tarjetas: todo el CSS `.keke*`, el campo `especial` de los datos, su prueba, y `.keke` de las reglas de aparición y elevación. El id del contenedor pasó a `kekes-tiras`. La sección dice ahora "Toca un color para ver su sabor"; la cantidad de versiones queda solo en la cinta de la portada (la prueba lo vigila). 21 pruebas en verde; verificado en Chromium a 1200 y 390 px (14 franjas, apertura por clic y por teclado, una sola detalle visible, enlace con sabor y origen, sin errores). Siguen pendientes del usuario: precios, fotos y afinar los matices.
- 28/10/2026: **6 sabores nuevos de keke (de la lista "incluir" del usuario): coco, frutos secos, higo, manzana, limón y lúcuma; ya son 20 versiones.** Se sumaron al final del muestrario con matices propuestos (tropical, crocante, meloso, tierna, cítrico, andina) y un color cada uno. Como el usuario avisó que "se incluirán algunos más", se facilitó crecer: 1) agregar un sabor es **una sola línea** en `src/kekes.js`; 2) la cantidad de versiones de la cinta de la portada ya no está escrita en el HTML: la escribe `src/ui/kekes.js` (`#kekes-cantidad`) y una prueba vigila que nadie vuelva a escribirla a mano; 3) el color del texto sobre cada franja se elige por contraste real (WCAG) entre texto oscuro y blanco, no por luminosidad a ojo; eso corrigió zanahoria, que con texto blanco daba 3,2:1 y ahora usa texto oscuro (5,0:1); 4) nueva prueba: todo sabor, presente o futuro, debe llegar a 4,5:1 de contraste, así un color mal elegido hace fallar `npm test` y dice cuál. Verificado en Chromium (20 franjas en 1200 y 390 px, apertura por clic y teclado, cinta en una sola línea, menú sin desborde, sin errores); 22 pruebas en verde. Pendientes del usuario: precios, fotos, afinar matices y confirmar los sabores que se sumen.
- 28/10/2026: **título de "El pecado más vendido": la palabra "pecado" crece y va en el rojo de la marca.** Pedido del usuario, para alinearlo con la temática de la web. Se usó el mismo recurso de la portada ("El placer de *pecar.*"): color de acento más el subrayado dorado fino. En vez de copiar el estilo, se agrupó el selector existente (`.portada__titulo em, .seccion__titulo em`) y solo se añadió el tamaño (1,35 veces, es decir unos 59 px en escritorio y 39 px en celular). Quedó en minúscula, como "pecar." de la portada; si se prefiere "PECADO" en mayúsculas es una línea de CSS. Verificado en 1200 y 390 px; 22 pruebas en verde.
- 28/10/2026: **carpeta de fotos de los kekes y proceso para conectarlas a la web.** Pedido del usuario: una carpeta donde ir dejando las fotos de referencia de cada versión, y que la web se vaya actualizando a medida que llegan, hasta terminar. Se creó `fotos-kekes/` (con `LEEME.md` que explica cómo nombrar cada foto: el nombre del sabor, con o sin tildes; el contenido de la carpeta no se sube a GitHub ni a la web). El proceso es `npm run fotos` (`tools/fotos-kekes.js`, con `sharp` como herramienta de desarrollo): convierte cada foto a WebP de hasta 1.400 px y calidad 80 en `img/KEKES/<sabor>.webp`, la asocia al sabor por su id o su nombre y agrega el campo `foto` en esa línea de `src/kekes.js`; avisa de las fotos que no coinciden con ningún sabor (posible sabor nuevo) y deja una sola foto por sabor (gana la más reciente). Con `-- --vigilar` espera fotos nuevas, procesa el lote y termina, para publicar cada tanda. En la web, al abrirse la franja de un sabor con foto, esta aparece de fondo con un degradado oscuro y texto blanco (solo se descarga cuando se abre). Probado con fotos de prueba (nombre con tilde y mayúsculas, nombre con espacios y un archivo sin coincidencia) y luego retiradas. `.gitignore` y `.vercelignore` actualizados (`node_modules`, `package-lock.json` y la carpeta de originales no se publican). 25 pruebas en verde. Pendiente del usuario: las fotos, los precios y confirmar los matices.
- 28/10/2026: **primera foto de kekes conectada: Piña.** Llegó "keke Piña.jpg" a `fotos-kekes/`; el nombre llevaba el prefijo "keke", así que el proceso de fotos aprendió a tolerar "keke", "kekes", "keke de", sufijos como "(2)", "copia" o "final" (con prueba). Se convirtió a `img/KEKES/pina.webp` (79 KB, de unos 720 KB originales) y se conectó con el campo `foto` de `src/kekes.js`. La franja abierta muestra la foto de fondo con dos capas oscuras (un degradado inferior y un velo del 30 %) para que el nombre y el matiz se lean también cuando la parte superior de la foto es clara; en celular la franja con foto abre con 15 rem de alto en vez de 11. Nota: la foto parece una imagen de referencia (con un frasco que dice "FLOUR" al fondo); si el usuario la usa solo como guía, conviene reemplazarla por una propia cuando la tenga. 25 pruebas en verde. Faltan las fotos de los otros 19 sabores, los precios y confirmar los matices.
- 28/10/2026: **foto de Durazno conectada** (`durazno.jpg`, unos 865 KB, a `img/KEKES/durazno.webp` de 124 KB; cuadrada, el keke queda centrado y se ve bien al recortarla en la franja). Ya hay foto de Piña y Durazno; faltan 18 sabores. Como la anterior, parece una imagen de referencia (frasco con "FLOUR"). 25 pruebas en verde.
- 28/10/2026: **foto de Arándano conectada** (`arandano.jpg` a `img/KEKES/arandano.webp`, 74 KB; el keke queda hacia la derecha pero entra en el recorte de la franja). Ya hay 3 de 20 sabores con foto: Piña, Durazno y Arándano.
- 28/10/2026: **herramientas de VS Code y revisión de código integradas al flujo (pedido "qué extensiones nos fortalecen" y luego "procede con todo con idoneidad").** 1) **Extensiones instaladas** (con `code --install-extension`): ESLint, Prettier, Live Server, Image Preview (gutter-preview), CSS Peek, Error Lens, Code Spell Checker con diccionario en español; GitHub Pull Requests ya estaba en su última versión. La de Vercel no se pudo instalar desde el catálogo y se quitó de las recomendaciones. 2) **ESLint dentro de `npm test`:** `eslint.config.js` (reglas recomendadas, `no-unused-vars`, `eqeqeq`, `no-var`, `prefer-const`; entornos de navegador para `src/`, Node para `tools/` y `tests/`, service worker para `sw.js`) y `tests/lint.test.js`; también `npm run lint`. Encontró 2 detalles que se corrigieron (una comparación `== null` en `filtrarEntradaNumerica`, ahora `?? ""`, y una variable sin uso en `tools/auditoria.js`). 3) **Configuración del proyecto:** `.vscode/extensions.json` (recomendadas, VS Code las sugiere al abrir la carpeta), `.vscode/settings.json` (sin formatear al guardar para que Prettier no reescriba el código por su cuenta, ESLint con configuración plana, ortografía es/en con las palabras del negocio, Live Server desde la raíz, exclusiones de búsqueda), `.prettierrc.json` (140 columnas, comillas dobles, sin comas finales, igual al estilo actual), `.prettierignore` y `.editorconfig`. Nada de esto se publica (`.vercelignore`). 26 pruebas en verde. Recomendación pendiente al usuario: desactivar en este espacio de trabajo las extensiones de Python, .NET y Rojo, que no aportan a esta web.
- 28/10/2026: **kekes presentados con la "Mezcla E" (escenario con flechas y cinta por familias), elegida por el usuario entre 5 mezclas de la carta (#3) y el escenario (#5).** Historia: al usuario le pareció que el muestrario de franjas verticales con veinte colores "rompía con solidez"; se propusieron 4 ajustes de las franjas, el usuario destacó la guía sutil del Ajuste 3 (NOVIA, FRUTALES, CLÁSICOS, CHOCOLATE en letra pequeña con una línea fina) y pidió otras bases, luego mezclar las bases 3 y 5. Las propuestas están en `propuestas/` (`kekes-muestrario-ajustes.html`, `kekes-base-con-guia.html`, `kekes-mezcla-3y5.html`; no se publican). **Aplicado:** un escenario grande con el keke elegido (foto, o el keke dibujado con el color del sabor si aún no hay foto), flechas anterior/siguiente que dan la vuelta (Novia ↔ Oreo) con un contador ("Frutales · 12 · 2 de 20") y una cinta deslizable de miniaturas donde la guía de familias separa los grupos; arranca en Piña. Código: `src/kekes.js` ahora tiene `familia` en cada sabor, `FAMILIAS`, `rotuloFamilia` y `miniaturaDe`, y la lista va ordenada por familia (Novia 1, Frutales 12, Clásicos 4, Chocolate 3; una prueba exige que las familias vayan seguidas y en el orden de la guía); `src/ui/kekes.js` reescrito; `index.html` con flechas, escenario y cinta; `index.css` con el bloque nuevo (la guía es la clase `.guia`). El enlace de WhatsApp se recrea en cada cambio, así que lleva el origen de la visita en el mensaje (una sola vez; `iniciarKekes` corre después de `aplicarOrigenAEnlaces`). `npm run fotos` genera también una miniatura cuadrada de 240 px en `img/KEKES/min/` (7 a 13 KB cada una) para la cinta, y la auditoría entiende que la miniatura se deriva de la foto. **Retirado por quedar sin uso:** todo el CSS de las franjas, `esTonoClaro`, `contrasteDeTexto` (el texto ya no va sobre el color del sabor) y sus pruebas. 27 pruebas en verde; verificado en Chromium a 1200 y 390 px (20 miniaturas, 4 rótulos de la guía, flechas con vuelta completa, chip, enlace con sabor y origen sin duplicar, la página no salta al cambiar, sin errores); regresión de 33 comprobaciones sin cambios.

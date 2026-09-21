# Registro de avance - El Delicioso

Actualizado: 21/09/2026

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
- **Ideas diferenciadoras:** mensaje de WhatsApp prellenado por producto y cantidad; sección "Para tu ocasión"; precio por unidad calculado; fecha del evento en el pedido. Para más adelante y por validar: calculadora de invitados y cajas surtidas.

> Nota: la paleta y las tipografías de las secciones "Grupo 2" (burdeos, Fraunces) quedaron reemplazadas por el rediseño descrito en "Rediseño según el ejemplo de diseño".

## Estructura del sitio (arquitecto-web)

Una sola página larga (`index.html`) con estas secciones en orden:

| # | Sección | Objetivo | Produce |
|---|---|---|---|
| 1 | Encabezado | Logo, menú y contador del carrito | disenador-web, programador-web |
| 2 | Portada | Propuesta de valor en 5 segundos, botones "Ver catálogo" y "Pedir por WhatsApp" | redactor-comercial, director-arte-visual |
| 3 | Ventajas | Los 3 pilares | redactor-comercial, disenador-web |
| 4 | Catálogo | Filtros Todos/Dulces/Salados, 12 tarjetas con selector 25/50/100, precio y precio por unidad | programador-web, disenador-web |
| 5 | Para tu ocasión | Tamaño sugerido según el evento (cantidades por validar) | redactor-comercial |
| 6 | Cómo pedir | 4 pasos: elige, indica fecha del evento, envía por WhatsApp, confirma | redactor-comercial |
| 7 | Nosotros | Historia breve y sencilla (la completa el dueño) | redactor-comercial |
| 8 | Contacto | WhatsApp, @ELDELICIOSO, zona y horario | programador-web |
| 9 | Carrito (panel lateral) | Lista, total, fecha del evento y botón de envío | programador-web |
| 10 | Botón flotante de WhatsApp | Conversión permanente | programador-web |

**Recorrido del cliente:** llega y entiende la propuesta, filtra el catálogo y compara tamaños, agrega productos, revisa el carrito e indica la fecha del evento, y envía el pedido por WhatsApp con el mensaje ya redactado.

**Datos del catálogo para `index.js`:** cada producto tendrá `id`, `nombre`, `categoria` ("dulce" o "salado"), `precios` (por 25, 50 y 100), `foto`, `fotoAlt`, `descripcion` y `porConfirmar`. El precio por unidad se calcula y no se guarda.

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
- **Componentes:** botón principal (píldora, 48 px de alto), botón WhatsApp con icono (el flotante, circular de 60 px), tarjeta de producto (foto 4:5, insignia Dulce/Salado, precio grande y "S/ x,xx c/u"), selector 25/50/100 (radios reales tipo segmento), panel lateral del carrito (400 px máx., campo de fecha obligatorio, botón fijo al pie) y calculadora de invitados (bloque rosado).
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

- **Catálogo:** filtros Todos/Dulces/Salados; selector 25/50/100 que actualiza precio total y precio por unidad ("S/ 35,00" y "S/ 1,40 c/u"). Los precios se leen de los `data-precio-*` del HTML, sin tabla duplicada.
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

**Auditoría de coherencia (arquitecto-web):** las decisiones del usuario, los 12 productos, sus 36 precios y los 12 precios por unidad coinciden con el catálogo; ninguna caja surtida implementada, como se decidió.

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

- 21/09/2026: creados los 4 archivos base con esqueleto mínimo.
- 21/09/2026: leído el PDF (12 productos) y registrado el catálogo; marketing-web definió la estrategia y arquitecto-web el mapa del sitio.
- 21/09/2026: grupo 2 elaborado: paleta y tipografías (disenador-web), textos y tres opciones de eslogan (redactor-comercial), 13 fotos extraídas del PDF a `img/` (director-arte-visual).
- 21/09/2026: el usuario eligió el eslogan "El placer de pecar." y la variante sobria; se ajustaron paleta, componentes y textos.
- 21/09/2026: grupo 3 terminado: `index.html` e `index.css` maquetados y revisados con capturas en 1280 px y 400 px.
- 21/09/2026: grupo 3 validado por el usuario. Grupo 4 terminado: `index.js` con filtros, carrito, fecha obligatoria, calculadora y pedido por WhatsApp.
- 21/09/2026: grupo 4 validado. Grupo 5 terminado: SEO con Lima, JSON-LD `Bakery`, medición neutral de 6 eventos y plan de redes de 4 semanas.
- 21/09/2026: grupo 5 validado. Grupo 6 terminado: comprobaciones técnicas, auditoría de coherencia y correcciones mínimas aplicadas.
- 21/09/2026: el archivo de avance cambia de `.txt` a `.md` por pedido del usuario.

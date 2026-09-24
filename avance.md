# Registro de avance - El Delicioso

Actualizado: 23/09/2026

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

- 21/09/2026: creados los 4 archivos base con esqueleto mínimo.
- 21/09/2026: leído el PDF (12 productos) y registrado el catálogo; marketing-web definió la estrategia y arquitecto-web el mapa del sitio.
- 21/09/2026: grupo 2 elaborado: paleta y tipografías (disenador-web), textos y tres opciones de eslogan (redactor-comercial), 13 fotos extraídas del PDF a `img/` (director-arte-visual).
- 21/09/2026: el usuario eligió el eslogan "El placer de pecar." y la variante sobria; se ajustaron paleta, componentes y textos.
- 21/09/2026: grupo 3 terminado: `index.html` e `index.css` maquetados y revisados con capturas en 1280 px y 400 px.
- 21/09/2026: grupo 3 validado por el usuario. Grupo 4 terminado: `index.js` con filtros, carrito, fecha obligatoria, calculadora y pedido por WhatsApp.
- 21/09/2026: grupo 4 validado. Grupo 5 terminado: SEO con Lima, JSON-LD `Bakery`, medición neutral de 6 eventos y plan de redes de 4 semanas.
- 21/09/2026: grupo 5 validado. Grupo 6 terminado: comprobaciones técnicas, auditoría de coherencia y correcciones mínimas aplicadas.
- 21/09/2026: rediseño según el "ejemplo de diseño" aprobado por el usuario.
- 21/09/2026: página subida al repositorio `AldoVeg/zegel` (rama `main`, commit `6ebf690`), reemplazando el sitio anterior de ese repositorio (que queda en el historial, commit `bc888c6`). Se subieron `index.html`, `index.css`, `index.js`, `avance.md` e `img/`; no se subieron el PDF ni la carpeta `ejemplo de diseño`. URL prevista: https://aldoveg.github.io/zegel/ (con `canonical`, `og:url` y `og:image` pendientes de agregar con esa dirección).
- 21/09/2026: correcciones (subrayado de "pecar.", sin precios por unidad, calculadora ampliada) y luego actualización con `incluir.pdf`: 23 productos con precios nuevos, planificador arriba con tres caminos y columna flotante "Tu lista de compras". Todo está solo en la carpeta local; falta subirlo a `AldoVeg/zegel`.
- 21/09/2026: nueva versión subida a `AldoVeg/zegel` (commit `ee36aec`, 23 productos, planificador con bocaditos por invitado y sugerencias con nombres, lista flotante y textos de ventajas nuevos). Despliegue verificado: **https://aldoveg.github.io/zegel/** responde con 23 tarjetas y las imágenes. Pendiente: `canonical`, `og:url`, `og:image` (1200x630) y `sitemap.xml` con esa dirección.
- 21/09/2026 (noche): rango de 3 a 10 bocaditos por invitado sin valor por defecto y mensajes de sobrantes; leyenda "Datos a considerar"; la lista de compras reemplaza al carrito y pasa a ser un panel horizontal desplegable desde "Mi lista", con el último paso (fecha y WhatsApp) al pie; producto especial "Empanadas amazónicas" (24 productos); planificador rediseñado según la maqueta del usuario. Subido a `AldoVeg/zegel` (rama `main`) y publicado en https://aldoveg.github.io/zegel/. Pendientes: `canonical`, `og:url`, `og:image` (1200x630) y `sitemap.xml` con esa dirección; envío real a WhatsApp, lectores de pantalla y Safari sin verificar.
- 21/09/2026 (noche): SEO y compartir aplicados con la dirección real `https://aldoveg.github.io/zegel/`: `canonical`, `og:url`, `og:image` (con tipo, 1200x630 y texto alternativo), `twitter:card` (`summary_large_image`) con título, descripción e imagen, y `url` e `image` en el JSON-LD `Bakery`. Se creó la tarjeta para compartir `img/og-portada.jpg` (1200x630, 128 KB: foto de la tartaleta, nombre y eslogan, generada con el navegador a partir de la portada) y `sitemap.xml` con una sola dirección. No se creó `robots.txt` (solo funciona en la raíz del dominio). Siguen sin datos reales `sameAs`, `openingHours` y la dirección completa. Pasos del dueño: verificar la propiedad en Google Search Console, enviar `sitemap.xml` y crear el perfil de Google Business (dirección oculta, área de servicio en Lima). Si se cambia el dominio o el nombre del repositorio, hay que actualizar esas direcciones. Observación: la `description` del JSON-LD fue editada por el usuario y quedó con una frase cortada ("...todo tipo de evento. por WhatsApp con 2 días de anticipación."); conviene revisarla.
- 21/09/2026 (noche): **marca integrada.** El usuario entregó `img/DELICIOSO.jpg` (el nombre "El Delicioso" con los labios como "O", 1024x178) e `img/logo.jpg` (solo los labios con destellos, 198x172), ambos JPG rojos sobre blanco. El director de arte los mejoró sin alterar el diseño (color a transparencia, curva sobre el alfa, ampliación Lanczos con supersampling, bordes nítidos) y creó en `img/`: `marca-eldelicioso-original.png` (1600x289, rojo fiel #EE2426, archivo maestro, no se usa en la página), `marca-eldelicioso.png` (1200x217, 24 KB, recoloreado al rojo de la página #BE1E3C), `marca-simbolo.png` (512x449, labios con destellos en #BE1E3C), `favicon-32.png`, `favicon-180.png` (labios sobre crema, para iPhone) y `favicon.ico` (32 y 48 px, solo labios). Los originales JPG no se tocaron. **Decisión de color:** en la página se usa el rojo #BE1E3C (más oscuro y vinoso que el rojo original #EE2426) para cohesionar con la paleta y mantener los contrastes AA; si el usuario prefiere el rojo original, basta cambiar el archivo del encabezado por `marca-eldelicioso-original.png`.
  - **Integración:** encabezado con el nombre de la marca (40 px de alto en escritorio y 34 px en móvil, con `aria-label="El Delicioso, ir al inicio"`); en la portada, los labios como sello decorativo sobre la esquina inferior izquierda de la foto (120 px, girado −8°, con latido suave una vez al cargar y al pasar el cursor solo con movimiento permitido); pie con el nombre de la marca (180 px) y "El placer de pecar."; íconos de pestaña (`favicon.ico`, `favicon-32.png` y `apple-touch-icon`); clave `logo` en el JSON-LD; y tarjeta para compartir `img/og-portada.jpg` regenerada con la marca y el sello (1200x630, 144 KB). Se ajustó el menú del encabezado con `justify-content: safe center` para que el logo más ancho no recorte "Planifica" en tablet.
  - **Límites:** el borde irregular tipo sello de las letras es del diseño original y se conservó; no se puede inventar detalle que no existe. Para impresión grande o rotulado conviene pedir el vectorial (SVG, AI o PDF). Los labios de `logo.jpg` tienen más detalle que los de la "O" del nombre, así que no son idénticos. Pendiente de verificar: Safari/iOS y la vista del panel entre 800 y 1100 px. **Estos cambios están solo en la carpeta local; falta subirlos a `zegel`.**
- 21/09/2026 (noche): **reformulación según la maqueta `images/2.png` y dinámica sutil.** 1) Se eliminó la sección "Cómo pedir" y su enlace del menú (delivery y formas de pago siguen en Contacto; la anticipación de 2 días, en la lista). 2) Portada: se quitó "Por 25, 50 o 100." del subtítulo. 3) El rectángulo "El Delicioso" sobre el titular es ahora un **selector por grupo** (Todo · Dulces · Salados; `radiogroup` "Explora por grupo", con flechas, Inicio y Fin): cambia la foto de la portada con fundido (Todo = `portada.jpg`, Dulces = `mini-alfajores-chocolate.jpg`, Salados = `mini-empanaditas-carne.jpg`; se descartó `pettit-pollo-apio-nueva.jpg` por traer una placa "El Delicioso" y la estrella de Gemini), sincroniza el filtro del catálogo (24, 14 y 10) y filtra la galería; evento `elegir_grupo`. Un solo estado gobierna selector, foto, filtro y galería; si se elige un camino o se cambia el filtro del catálogo, el selector sigue. 4) **Galería (carrusel) `#galeria`** justo debajo del planificador: solo imágenes grandes (22 rem, proporción 4:5; 3 a la vez desde 48 em, 78 vw en móvil) de los 24 bocaditos, en **orden aleatorio** (Fisher-Yates) en cada carga y en cada cambio de grupo; se construye desde las tarjetas del catálogo, con botones anterior/siguiente, avance automático suave cada 5 s (pausa con el cursor, con foco dentro, al tocar y con la pestaña oculta; sin avance con movimiento reducido) y, al hacer clic o Enter en una imagen, se desplaza a su tarjeta y la resalta. 5) **Planificador:** "Datos a considerar" en cuadrícula 2×2 (lectura por columnas) y las tres opciones como **tarjetas en tres columnas** de igual alto con el botón al pie (en móvil, apiladas). 6) **Sello "ya agregado":** al agregar un producto aparece la marca (labios) en la esquina superior derecha de su tarjeta, con un "pop", mientras tenga una línea en la lista; se restaura desde localStorage. 7) El **nombre del postre** cambia de color (solo el nombre) con hover o foco. 8) **Subrayado del menú** que sigue al cursor cuando se acerca a la zona superior (solo puntero fino desde 48 em): se desliza al enlace más cercano y su intensidad (opacidad y grosor de 2 a 4 px) crece con la cercanía. 9) Plus sutiles aplicados: **barra de lectura** de 3 px (rojo a dorado) en el borde del encabezado y **conteo suave** de la cifra de unidades de cada camino (siempre termina en el valor final, con respaldo por temporizador). Con movimiento reducido todo queda estático. Pruebas: 60 combinaciones idénticas en Node; Edge a 400, 800 y 1280 px sin errores de script, ids duplicados ni desbordamiento. Pendiente: la galería no tiene botón de pausa (WCAG 2.2.2), lectores de pantalla, Safari/iOS y el arrastre táctil real. **Estos cambios están solo en la carpeta local; falta subirlos a `zegel`.**
- 21/09/2026 (noche): **ajustes finales pedidos.** 1) El avance automático de la galería pasa de 5 a **4 segundos** (`INTERVALO_GALERIA_MS = 4000`). 2) Se eliminó la fila de las tres ventajas ("Sabor a casa", "Variedad para elegir", "Pídelo a un solo clic"): sección `#ventajas` y su CSS. 3) Se eliminó la franja informativa de Contacto (`dl.contacto__datos`: WhatsApp, zona, delivery y formas de pago); Contacto queda con su título, "Escríbenos y armamos tu pedido." y el botón verde de WhatsApp (el delivery y las formas de pago ya no se muestran en la página; se consultan por WhatsApp, y el mensaje del pedido lo pregunta). Sigue existiendo la franja de tres datos de "Nosotros" (Hechos en casa; 25, 50 o 100 unidades; Pedidos con 2 días de anticipación). 4) **"Volver al inicio" corregido**: había dos causas. La primera: el enlace y el logo apuntaban a `#inicio`, que es el encabezado fijo y ya está pegado arriba, así que el navegador no tenía dónde desplazarse; ahora apuntan a `#arriba` (`id` del `body`). La segunda: en escritorio el botón flotante de WhatsApp quedaba encima del enlace al llegar al final; se restituyó el espacio inferior del pie (6 rem). Verificado en el navegador: con desplazamiento inmediato, el enlace del pie va de 11043 a 0 y el logo de 2500 a 0, sin errores; y el enlace queda 63 px por encima del botón flotante a 1276 px. **Cambios solo en la carpeta local; falta subirlos a `zegel`.**
- 21/09/2026 (noche): **cuatro ajustes más.** 1) **Menú solo con subrayado:** el "sombreado" era `.menu a:hover { background: var(--fondo-rosado) }` y su transición; se quitaron. Al acercar el cursor solo cambia el color del texto a `--acento` y se ve la línea de subrayado (degradado rojo a dorado, sin sombra ni fondo; opacidad y grosor de 2 a 4 px según la cercanía); se conserva el contorno de foco de teclado. 2) **Se eliminó la zona de contacto:** el enlace "Contacto" del menú y la sección `#contacto` (título, texto y botón). El pie (marca, "El placer de pecar." y "Volver al inicio"), el botón flotante de WhatsApp y los enlaces de "Para tu ocasión" se mantienen, así que la vía de contacto sigue siendo WhatsApp. 3) **Fotos al azar en la portada:** con "Dulces" y con "Salados", cada vez que se elige la opción (también al pulsar de nuevo la ya elegida) la foto de la portada cambia a otra al azar de ese grupo, con fundido y sin repetir hasta agotar el conjunto (baraja y reparte, función pura `sacarDeBaraja`); "Todo" sigue con `portada.jpg`. Las fotos aptas se marcan en el HTML con `data-portada="x% y%"` (el valor es el encuadre): **Dulces (9):** mini-alfajores-chocolate, tartaleta de fresa, de durazno y de maracuyá, brownies, vasitos de maracuyá y de fresa, niditos-de-amor y mini-pay-manzana; **Salados (5):** empanaditas de carne, empanaditas mixtas, empanadas amazónicas, mini-causitas y pettit-pollo-durazno. Excluidas por placa, sello, estrella de Gemini, baja resolución o formato vertical: pettit con apio, causitas de pollo y de atún, empanaditas de pollo, pettit-pollo, alfachips, alfajores con coco, trufas, pay de limón y vasitos de durazno. Para excluir una foto basta quitar su atributo `data-portada`. 4) **"Datos a considerar" rediseñado:** sin cajas ni rellenos de color ni barras laterales; título pequeño en mono gris, línea fina arriba y abajo, y cada ítem con una raya dorada de 24 px, la etiqueta en `--texto` y el texto en `--texto-suave`; 4 columnas con líneas verticales finas en escritorio (desde 62,5 em), 2×2 con líneas horizontales desde 40 em y una columna con divisores en móvil. Pruebas: 32 combinaciones idénticas en Node; selector con 10 selecciones consecutivas sin repetir dos seguidas; Edge a 400, 800 y 1280 px sin errores de script, ids duplicados ni desbordamiento. Sin verificar: Safari y lectores de pantalla. Nota: las tres tarjetas de "Nosotros" conservan el estilo de borde dorado a la izquierda. **Cambios solo en la carpeta local; falta subirlos a `zegel`.**
- 21/09/2026 (noche): **planificador, catálogo, Nosotros y ocasiones (maqueta `images/3.png`).** 1) **"Datos a considerar"** vuelve a la columna izquierda de la cabecera del planificador, bajo el título y la línea breve, como líneas compactas (raya dorada de 18 px, etiqueta en `--texto` y texto en `--texto-suave` en la misma línea, con sangría si envuelve); los campos y "Calcular" quedan a la derecha; se eliminó el bloque a todo el ancho. **Textos evaluados por posible confusión social:** "3 a 4 por invitado · Acompañan un almuerzo o cena." (antes "Hay almuerzo o cena", que podía leerse como que el evento es un almuerzo); "5 a 7 por invitado · Picoteo, brindis o cumpleaños con torta." (se añadió "brindis", muy común en Lima); "8 a 10 por invitado · Serán la comida principal." (antes "Los bocaditos son la comida", ambiguo); "Paquetes de 25, 50, 100 y más · Se combinan para llegar a tu cantidad; lo que sobre queda de reserva y te avisamos." (antes "te decimos cuántas sobran", que sonaba a desperdicio). **Interacción nueva:** al escribir en "Bocaditos por invitado" se resalta el tramo correspondiente (raya que se alarga de 18 a 32 px, etiqueta en `--acento`, `aria-current="true"`); vacío, fuera de 3 a 10 o decimal no resalta nada, y "Paquetes" nunca; no modifica ni rellena el campo; sin transición con movimiento reducido. Idea no aplicada por ahora: ajustar el consejo si hay niños. 2) **Texto bajo "Nuestro catálogo":** se quitó el `max-width` de 40 rem de la cabecera y los párrafos introductorios de las secciones con cabecera usan `--t-lg` (una sola línea en escritorio; entre unos 1000 y 1230 px puede envolver, porque mide ~1150 px y el contenedor llega a 1200 px). 3) **Nosotros:** el ítem de "25, 50 o 100 unidades" pasó a **"23 sabores para mezclar · Arma tu mesa combinando dulces y salados."**; el número lo escribe el script con el conteo de tarjetas con precio (respaldo de 23 en el HTML). 4) **"Para tu ocasión"** (5 tarjetas): sin fondo, borde fino y texto oscuro; al acercar el cursor (o con foco de teclado o pulsación) cambian a un tinte propio (cumpleaños `#FBDDE2`, baby shower `#FFF1D6`, reunión de trabajo `#F0E1D8`, colegio o iglesia `#FCE2B6`, otro evento `#FCEDEA`; contraste AA) y aparece al costado una ilustración con entrada deslizando desde la derecha con giro y rebote de 420 ms (sin animar con movimiento reducido). Se quitó la elevación de estas tarjetas. **Ilustraciones:** hoy solo existe `img/torta.png` (torta con vela, gorro y regalo) para Cumpleaños. El mecanismo va por datos: una tarjeta muestra ilustración si lleva `data-ilustracion="img/archivo.png"`, `data-ilustracion-ancho` y `data-ilustracion-alto` (hay un comentario en el HTML que explica cómo añadirlas). Las otras cuatro ocasiones (baby shower, reunión de trabajo, colegio o iglesia, otro evento) solo cambian de color hasta que el usuario entregue sus imágenes en `img/`. En táctil (sin hover) la ilustración se ve siempre, pequeña (6 rem). Pruebas: 32 combinaciones idénticas en Node; hover real con CDP, foco, movimiento reducido y táctil emulado; sin errores de script, ids duplicados, peticiones 404 ni desbordamiento a 400, 800 y 1280 px. **Cambios solo en la carpeta local; falta subirlos a `zegel`.**
- 21/09/2026: el archivo de avance cambia de `.txt` a `.md` por pedido del usuario.
- 21/09/2026 (noche): **imágenes organizadas y "Para tu ocasión" con fotos reales.** 1) **Orden de `img/`:** las 26 fotos de producto pasaron de estar sueltas en `img/` a `img/DULCE/` (15) e `img/SALADO/` (13), con sus rutas corregidas en `index.html` (se habían movido las carpetas antes de actualizar el HTML y las fotos quedaron rotas; ya verificado que las 26 cargan). Las imágenes de marca, portada y favicons se quedaron en la raíz de `img/` tal como las usa el HTML. 2) **"Para tu ocasión" con fotos reales:** el usuario entregó 5 ilustraciones (una por ocasión, estilo doodle sobre fondo blanco) que estaban en `img/OCASIÓN/` con espacios y tildes en los nombres; se movieron a `img/OCASIONES/` con nombres sin tildes ni espacios (`cumpleanos.jpg`, `baby-shower.jpg`, `reunion-trabajo.jpg`, `colegio-iglesia.jpg`, `otro-evento.jpg`) para que no se rompan en GitHub Pages. Se quitó el mecanismo sin usar de ilustración decorativa (`data-ilustracion`, `img/torta.png` inexistente, función `prepararIlustracionesOcasion` en `index.js`) y, a pedido del usuario, la tarjeta quedó así: en reposo solo se ve el borde y el texto (sin foto); al acercar el cursor (o con foco de teclado dentro, o al tocar en pantallas táctiles) la foto de la ocasión aparece cubriendo toda la tarjeta y el texto pasa a un recuadro semitransparente (`rgba(255, 251, 246, .88)` con `backdrop-filter: blur`, el mismo efecto "vidrio" del encabezado fijo) para seguir siendo legible. Se quitaron los tintes de color por tarjeta (rosa, dorado, etc.) porque ya no hacían falta. 3) **Repositorio conectado y actualizado:** la carpeta local no tenía `git` inicializado; se conectó a `AldoVeg/zegel` (que ya existía con una versión más antigua del sitio, sin la reorganización de `img/`, sin las fotos de ocasión ni el branding/favicons), se restauró `.github/workflows/static.yml` (no estaba en la carpeta local) y se subió todo el estado actual en el commit `785827a`, incluyendo lo pendiente de sesiones anteriores (marca y favicons, ajustes de planificador, catálogo y ocasiones de la maqueta `images/3.png`, ajustes de menú y portada). Publicado en https://aldoveg.github.io/zegel/. Se agregó `.gitignore` para excluir `.claude/` del repositorio. Pendiente: verificar el despliegue de Pages tras el push, Safari/iOS y lectores de pantalla.
- 21/09/2026: **auditoría de accesibilidad real del flujo completo (programador-web).** Primera vez que se prueba con herramientas de accesibilidad (nunca se había hecho pese a varios rediseños). Se instaló Playwright + `@axe-core/playwright` en una carpeta temporal fuera del repositorio (con red disponible) y se sirvió el sitio con un servidor HTTP local mínimo (probar con `file://` genera errores de consola falsos por CORS al leer `index.css`, que no ocurren por HTTP ni en GitHub Pages). Se auditaron con axe-core (WCAG 2.1 A y AA) seis estados: portada al cargar, planificador tras enviar vacío (error de validación), planificador con resultado calculado, la lista de compras abierta tras agregar un producto, el catálogo con el filtro "Dulces" aplicado y la página completa tras todas las interacciones. **Encontrado y corregido:** el botón flotante de WhatsApp (`.whatsapp-flotante`) quedaba fuera de cualquier landmark (regla `region` de axe, impacto moderado); se envolvió en `<aside aria-label="Contacto directo por WhatsApp">` en `index.html` (línea ~1129), sin tocar su CSS ni su comportamiento. Tras la corrección, las seis auditorías quedan sin violaciones. **Revisión manual adicional** (con pruebas de teclado automatizadas en Playwright): el `radiogroup` del selector de grupo de la portada responde a flechas y cicla correctamente; abrir "Mi lista" con Enter mueve el foco al título del panel y Escape lo devuelve a "Mi lista", como está documentado; al agregar un producto desde una tarjeta con Enter, el foco se queda a propósito en el botón (ahora "Agregado", con `aria-label` actualizado) y el panel se abre solo visualmente en escritorio sin robar el foco al visitante, que es el comportamiento ya documentado en el grupo de "Nuevo orden y flujo de compra"; no se detectó ninguna trampa de foco real (con 150 tabulaciones seguidas el foco recorre el conjunto de elementos enfocables de la página y vuelve a empezar, sin quedarse fijo en ningún componente). Se confirmó que las imágenes decorativas de "Para tu ocasión" llevan `alt=""` y `aria-hidden="true"` y no son focalizables. Se confirmaron los `aria-live`/`role="status"`/`role="alert"` ya existentes en el contador de la lista, el resultado del planificador, el estado de la lista y los errores de fecha y del formulario. `node --check index.js` sin errores y sin ids duplicados en `index.html` tras el cambio. **Pendiente, ya señalado antes en este archivo y no corregido ahora por ser una decisión de diseño:** la galería (carrusel) no tiene un botón explícito para pausar el avance automático (relevante para el criterio WCAG 2.2.2, aunque ya se pausa solo con el cursor encima, con foco dentro, al tocar la pantalla, con la pestaña oculta y por completo con `prefers-reduced-motion`); añadir un botón de pausa visible requeriría un ícono y un lugar en el diseño del carrusel, así que se reporta para que el diseñador lo valide en vez de decidirlo aquí. Sigue sin probarse con un lector de pantalla real (NVDA/JAWS/VoiceOver) ni en Safari/iOS. **Cambios solo en la carpeta local; falta subirlos a `zegel`.**
- 21/09/2026: **caché del navegador corregida.** El usuario reportó que tras publicar una actualización, "se queda pegado con la data anterior" aunque se actualice la página. Causa: `index.css` e `index.js` se enlazaban en `index.html` sin ningún parámetro de versión, así que el navegador (y la caché de GitHub Pages) seguían sirviendo el archivo guardado en caché en vez de pedir el nuevo. Se agregó `?v=AAAAMMDDHHmm` a ambos enlaces (por ejemplo `index.css?v=202609212159`), con un comentario en el HTML que recuerda cambiar ese número cada vez que se publique una actualización de esos dos archivos. Con esto, una recarga normal del navegador siempre trae la versión nueva; ya no hace falta borrar caché a mano.
- 21/09/2026 (noche): **el problema de caché seguía porque GitHub Pages cachea todo, no solo `index.css`/`index.js`.** Se comprobó con las cabeceras reales del sitio publicado: `Cache-Control: max-age=600` en TODOS los archivos, incluido `index.html`. GitHub Pages no permite configurar cabeceras propias, así que una pestaña que ya cargó la página no vuelve a preguntarle al servidor durante 10 minutos aunque se pulse "actualizar" (recarga normal); el `?v=` de la corrección anterior nunca llega a aplicarse hasta que ese cacheo vence o se hace una recarga forzada (Ctrl+Shift+R). **Solución: la propia página se revisa y se recarga sola.** Se creó `version.json` en la raíz (`{"v": "202609212159"}`) y la etiqueta `<html>` lleva `data-version="202609212159"`. `index.js` pide `version.json` sin caché (con un parámetro que cambia en cada pedido, así nunca lo sirve cacheado ni el navegador ni GitHub Pages) al volver a la pestaña (`visibilitychange`) y cada 5 minutos mientras quede abierta (`INTERVALO_VERSION_MS`); si el valor no coincide con `data-version`, aparece un aviso fijo abajo a la izquierda ("Hay una versión nueva de la página." + botón "Actualizar ahora") que al pulsarlo recarga con una URL nunca antes cacheada (`?_=` con la hora exacta), trayendo la versión nueva de una sola vez. **Mantenimiento:** de ahora en más, cada vez que se publique un cambio en `index.html`, `index.css` o `index.js` hay que actualizar la misma fecha y hora (`AAAAMMDDHHmm`) en **tres lugares a la vez**: los `?v=` de `index.css` e `index.js`, el `data-version` de `<html>`, y el `"v"` de `version.json` (los tres están comentados en el HTML para no olvidarlo). Sin conexión o si `version.json` falla, el aviso simplemente no aparece; no rompe la página. `node --check index.js` sin errores; sin ids duplicados.
- 23/09/2026: **ruta personalizada con la marca.** El repositorio se renombró de `zegel` a `eldelicioso` (lo hizo el usuario desde Configuración de GitHub; yo no tengo credenciales para renombrar). La dirección pública pasa a **https://aldoveg.github.io/eldelicioso/**. Se actualizaron las 8 referencias a `/zegel/` (`canonical`, `og:url`, `og:image`, `twitter:image`, `url`, `image` y `logo` del JSON-LD en `index.html`, y `sitemap.xml`), el remoto de git (`AldoVeg/eldelicioso`), la versión de caché en sus tres lugares, y se regeneró `img/qr-eldelicioso.png` apuntando a la dirección nueva (verificado que decodifica exactamente a ella). GitHub redirige la dirección vieja por un tiempo, pero el QR y los enlaces impresos deben ser los nuevos. Limitación: "aldoveg" (usuario de GitHub) solo se puede quitar de la dirección con un dominio propio; no se cambió. Para no volver a cambiar la ruta, el nombre `eldelicioso` no debe renombrarse otra vez.
- 23/09/2026: **la calculadora ahora se reinicia al actualizar.** El usuario notó que los datos de la calculadora (invitados, bocaditos por invitado, resultado y camino) permanecían tras actualizar la página. Causas: 1) el plan se guardaba en `localStorage` (`el-delicioso-plan`) y `restaurarPlan()` lo devolvía al abrir; 2) el navegador puede recordar por su cuenta lo escrito en los campos y al volver con "atrás" (caché de página). Cambios: `index.js` descarta el plan guardado al arrancar (la calculadora siempre inicia en blanco; se borra la clave antigua) y recarga la página si el navegador la devuelve congelada (`pageshow` con `persisted`); `index.html` pone `autocomplete="off"` al formulario y a sus dos campos. **La lista de compras sí se conserva** (decisión mantenida). Prueba en Chromium real (Playwright): calcular 40 invitados × 5 → recargar → campos vacíos, sin resultado, clave de almacenamiento nula y sin errores de script. Si el usuario prefiere que la lista también se reinicie, es un cambio aparte.
- 23/09/2026: **cuatro mejoras: origen de la visita, guía de 3 pasos, carrusel con pausa y combos por ocasión.** 1) **Origen en WhatsApp:** `index.js` lee `?origen=` (y, si no sirve, `?utm_source=`), lo normaliza a una lista corta permitida (`qr`, `instagram`, `facebook`, `tiktok`, `google`; alias `ig`, `insta`, `fb`; todo lo demás se ignora y nunca se copia texto libre), lo guarda en `sessionStorage` (`el-delicioso-origen`) y agrega al FINAL del mensaje de pedido y de cotización la línea "(Vi la web por: QR)" solo si hay origen. Los enlaces prellenados fijos del HTML (portada, las 5 ocasiones y el botón flotante) reciben la misma línea por JS al cargar (`enlaceConOrigen`), sin duplicar textos en el HTML; los de cotización ya la llevan por `construirMensajeCotizacion`. `registrar()` suma `origen` a todos los eventos cuando existe. Un valor desconocido no pisa el origen ya guardado. Funciones puras nuevas y exportadas: `normalizarOrigen`, `leerOrigenDeURL`, `textoOrigen`, `agregarLineaOrigen`, `enlaceConOrigen`, `fijarOrigenMedicion`. 2) **Guía "Pedir es facilísimo" (`#como-pedir`):** tres pasos en una `<ol>` (Elige tus antojos, Escríbenos por WhatsApp, Coordinamos entrega y pago con recordatorio de 2 días y entrega en Lima), tarjetas blancas con filete dorado y número rojo, sobre el tinte rosado. Ubicada justo después del catálogo (cuando el visitante ya vio los productos y se pregunta qué sigue) y antes de "Para tu ocasión"; no rompe el planificador (sigue arriba) ni la galería. No lista formas de pago concretas, para respetar la decisión anterior de no mostrarlas en la página. 3) **Carrusel:** el avance sigue en 4 s; la transición pasa a ~0,7 s (`DURACION_TRANSICION_GALERIA_MS`) con curva ease-out cúbica y sin desenfoque; del final al inicio (y al revés) la pista se desvanece, salta y reaparece en vez de recorrer todas las imágenes de golpe. Botón visible de pausa/reproducir (círculo de 44 px bajo las imágenes, íconos SVG `icono-pausa` e `icono-reproducir`, foco visible): `aria-label` fijo "Pausar el avance automático de la galería" y `aria-pressed="true"` = en pausa (la etiqueta no cambia, para no duplicar el estado); en pausa se pinta en rojo y muestra "reproducir". La pausa del botón (`pausadaPorUsuario`) es persistente y distinta de las automáticas (cursor, foco, toque, pestaña oculta): no la levanta nada salvo el visitante y sobrevive al cambio de grupo. Al reproducir se limpian el toque y el foco pendientes, y el cursor solo pausa sobre las imágenes y flechas (no sobre el botón), para que "reproducir" arranque de verdad. Con `prefers-reduced-motion` no hay avance automático y el botón se OCULTA (no tiene nada que controlar); si el ajuste cambia, reaparece. Evento nuevo `pausar_galeria`. 4) **Combos por ocasión (`#combos`, con enlace "Combos" en el menú):** sección después de "Para tu ocasión" y antes de "Nosotros". Cinco tarjetas armadas por JS desde la constante `COMBOS` (ids por defecto, títulos y frases; los precios NUNCA se duplican: salen del catálogo leído del HTML): Cumpleaños (50: pettit con pollo + mini alfajores con coco), Baby shower (50: mini pay de limón + mini empanaditas de pollo), Reunión de trabajo (50: mini causitas de atún + mini alfachips), Colegio o iglesia (100: mini empanaditas de pollo + mini alfajores con coco) y "Arma el tuyo" (50 o 100 unidades, mitad y mitad). Cada tarjeta tiene dos `<select>` nativos (dulce y salado, solo productos con precio: 14 dulces y 9 salados; "Empanadas amazónicas" queda fuera) y muestra el precio anterior tachado, el del combo y "5% de descuento", en vivo. **Precio:** 5% sobre la suma de los precios de catálogo de cada mitad (precio-25 o precio-50), redondeado al sol entero con la mitad hacia arriba, en céntimos enteros (`calcularPrecioCombo`): 63 -> 60, 62 -> 59, 63 -> 60, 115 -> 109. **Integración con la lista:** un combo es UNA sola línea `{combo, dulce, salado, tamano (cada mitad), packs}` en el mismo arreglo/localStorage (`agregarCombo`, `claveLinea` con prefijo `combo|`); su subtotal ya lleva el descuento (precio de un combo x cantidad), así el total de la lista, el de la barra y el del mensaje son el mismo número. Las listas antiguas (sin campo `combo`) no cambian; `normalizarLineas` valida y descarta combos dañados, inexistentes, con categorías cambiadas o con un tamaño que no corresponde. Los combos suman la mitad a dulces y la mitad a salados en las metas del planificador (`porCategoria`). Los pasos −/+ y Quitar de la lista funcionan sobre el combo completo. El mensaje nombra "Combo Cumpleaños: 50 unidades - S/ 60,00 (5% de descuento sobre S/ 63,00)" y, debajo, "Incluye: 25 ... + 25 ...". **Sello de "ya agregado":** la tarjeta del combo lleva el sello mientras la lista tenga un combo idéntico (si cambias un selector, se va; si vuelves, regresa), y las tarjetas del catálogo de los productos incluidos también lo llevan; el botón muestra "Agregado" 1,2 s. Evento `agregar_combo`. **Otros ajustes:** en tablet (48 a 62,5 em) el menú reduce relleno y tamaño de letra para que quepan los cinco enlaces; `index.html` suma `<p class="lista__item-descuento">` a la plantilla de la lista. **Versión de caché:** 202609232130 en los tres lugares. **Pruebas:** `node --check`; 393 comprobaciones en Node (descuento y redondeo de los 4 combos = 60, 59, 60 y 109; vasitos y el caso de la mitad; rechazos; ida y vuelta por localStorage; listas antiguas; origen normalizado con valores maliciosos como `__proto__`; mensajes y enlaces con y sin origen; regresión idéntica frente a la versión anterior en `describirResultado`, `describirLista`, mensajes, `normalizarLineas` y fechas); Chromium real con Playwright (servidor HTTP local) a 400, 800 y 1280 px: sin errores de script ni de red, sin ids duplicados ni desborde horizontal, precios por defecto, cambio de selector con precio en vivo, agregar combos y total correcto (S/ 169,00 = 60 + 109) en lista, barra y mensaje, recarga con la lista restaurada, calculadora en blanco tras recargar, pausa del carrusel (persistente, sobrevive al cambio de grupo, reanuda, teclado Enter y Espacio, foco visible), origen (qr, utm_source, desconocido, persistencia en sessionStorage, eventos con origen) y axe-core WCAG 2.1 A/AA sin violaciones en los estados nuevos (combos, lista con combos, galería en marcha y en pausa, movimiento reducido). Nota de método: axe se ejecutó con las animaciones por desplazamiento desactivadas, porque el fundido de aparición de "Nosotros" a mitad de camino daba un falso positivo de contraste a 800 px. **Pendientes:** lectores de pantalla reales, Safari/iOS y el envío real a WhatsApp siguen sin verificarse; el nombre "Combo personalizado" y las frases de los combos son propuestas por validar; para usar el origen hay que publicar los enlaces con `?origen=qr` (el QR actual apunta a la dirección sin parámetro), `?origen=instagram`, etc.
- 23/09/2026 (Promo para cada ocasión): se fusionaron "Para tu ocasión" (#ocasiones) y "Combos por ocasión" (#combos) en una sola sección, **"Promo para cada ocasión"** (#promos), con cinco tarjetas generadas por JS desde COMBOS: Cumpleaños, Baby shower, Reunión de trabajo, Colegio o iglesia y "Arma el tuyo" (reemplaza a "Otro evento" y conserva su foto otro-evento.jpg). Cada tarjeta muestra título, frase corta (las de "Para tu ocasión"), contenido ("25 pettit pan con pollo + 25 mini alfajores con coco"), "Para N personas · 3 c/u" (función pura `calcularPersonasCombo`, Math.floor(unidades/3): 50 → 16, 100 → 33; en "Arma el tuyo" se recalcula al elegir 50/100), precio con 5% de descuento y el anterior tachado, y el botón "Agregar a mi lista". Los datos secundarios van en letra suave (--texto-suave, tamaño pequeño, halo claro casi imperceptible). Los selectores dulce/salado quedan plegados en un `<details>` "Cambiar productos" (cerrado por defecto); el tamaño 50/100 de "Arma el tuyo" queda visible fuera del plegable porque cambia las personas. Debajo del botón, enlace discreto "¿Dudas? Escríbenos" a WhatsApp con el mensaje prellenado de cada ocasión (ubicación de medición `promo_<clave>`, antes `ocasion_*`; suma "(Vi la web por: X)" como el resto). La foto de fondo se conserva (oculta en reposo; aparece con hover, foco o toque tras un recuadro semitransparente al 88% con desenfoque leve; alt vacío y aria-hidden). Menú: "Ocasiones" y "Combos" pasan a un solo enlace "Promos" (#promos); se eliminó el ajuste de relleno del menú en tablet, que solo hacía falta con cinco enlaces (a 800 px caben los cuatro). La guía dice ahora "toma una promo". Se borró el HTML, CSS y JS muertos de las dos secciones; la lógica de combos (precios desde el catálogo, líneas de lista, total, mensaje, sellos, origen, normalizarLineas) no se tocó. **Versión de caché:** 202609232245 en los tres lugares. **Pruebas:** `node --check`; Node (personas 50 → 16 y 100 → 33, casos límite, definiciones de COMBOS); Chromium con Playwright a 400, 800 y 1280 px: una sola sección de promos (sin #ocasiones ni #combos), precios por defecto 60, 59, 60 y 109, sin errores de script ni de red, sin ids duplicados ni desborde, menú y anclas sin enlaces rotos, "Cambiar productos" abre y cambia precio, contenido y personas en vivo, agregar el combo de Cumpleaños deja S/ 60,00, foto oculta en reposo y visible al hover, enlace de WhatsApp exacto, contraste del texto suave sobre el fondo más oscuro con foto visible 5,3:1 (muestreo de píxeles), axe-core WCAG 2.1 A/AA sin violaciones (con los plegables abiertos y con la foto visible; axe marca 1 elemento como "incompleto" por el fondo de imagen), calculadora en blanco tras recargar. **Pendientes:** lectores de pantalla reales, Safari/iOS, toque real en móvil y el envío real a WhatsApp siguen sin verificarse; si hay paneles de analítica con la ubicación `ocasion_*`, ahora aparece como `promo_*`.
- 23/09/2026: **el ahorro de las promos baja del 5% a S/ 1 fijo.** El usuario indicó que el 5% era demasiado y pidió reducir como máximo 1 sol de la suma de los precios. Decisión validada con el usuario: se resta **exactamente S/ 1,00** a la suma de los productos sueltos (constante `DESCUENTO_COMBO_CENTIMOS = 100` en `index.js`, reemplaza a `DESCUENTO_COMBO_PORCIENTO`); si la suma trae céntimos se conservan. Precios por defecto: Cumpleaños S/ 62 (antes 63), Baby shower S/ 61 (62), Reunión de trabajo S/ 62 (63), Colegio o iglesia S/ 114 (115), "Arma el tuyo" S/ 62 en 50 unidades y S/ 122 en 100 (con los productos por defecto; se recalcula al cambiar productos o tamaño). La etiqueta de cada tarjeta pasa de "5% de descuento" a **"Precio promo"** (también en la introducción de la sección, la fila de la lista y el mensaje: "precio promo; por separado suman S/ 63,00"). Las listas guardadas siguen válidas (la línea de combo no guarda el porcentaje; el precio se recalcula del catálogo). Prueba en Chromium real: precios 62, 61, 62, 114 y 62; agregar Cumpleaños deja S/ 62,00 en la lista y en el mensaje de WhatsApp, con la línea de origen; sin errores de script.
- 23/09/2026: **empanadas amazónicas con precio y aviso de salida.** 1) La tarjeta de "Empanadas amazónicas" deja de ser "por cotizar": ahora muestra precio y cantidades **6, 12 y 24 unidades a S/ 25, S/ 50 y S/ 100** (referencia del usuario: S/ 25 por 6, continuada proporcionalmente). Los precios viven en la propia tarjeta (`data-reserva-6/12/24`, en soles) y la fecha de salida en `data-salida` ("jueves 1 de octubre"). Decisión validada con el usuario: **se separa por WhatsApp**, no entra a la lista de compras ni a los totales ni a las promos (el catálogo de la lista sigue con paquetes de 25, 50 y 100). El botón pasa de "Solicitar por WhatsApp" a **"Separa el tuyo"** y el mensaje dice: "Quisiera separar N unidades de empanadas amazónicas (S/ X) para su salida del jueves 1 de octubre. ¿Me confirman la disponibilidad?", con la línea de origen cuando la hay (`construirMensajeReserva`, exportada; evento `reserva_empanadas-amazonicas`). 2) **Cinta de aviso sobre el encabezado** (elección del usuario, en lugar de una franja en la portada): "Jueves 01: salen las empanadas amazónicas. ¡Ya volvieron! Separa el tuyo"; el enlace lleva a la tarjeta (muestra todo si un filtro la oculta y la resalta). Se oculta sola pasado el 1 de octubre (`data-hasta="2026-10-01"` en `#cinta-aviso`; para reutilizarla basta cambiar texto y fecha). Prueba en Chromium real a 400 y 1280 px: cinta visible, clic lleva a la tarjeta, precios 25/50/100 con su mensaje, sin errores de script ni desborde; con la fecha simulada al 2 de octubre la cinta no aparece. Nota: la tarjeta sigue siendo "Especial" y "Salado"; sin verificar: lectores de pantalla y Safari.
- 23/09/2026: **franja de novedad con `Encabezado.png`, más nítida y con movimiento sutil.** El usuario entregó `img/Encabezado.png` (1920x480, banner de las empanadas amazónicas: "2da edición", media docena S/. 25, jueves 1 de octubre) y pidió mejorar su enfoque/definición y usarlo como franja con movimiento sutil. **Imagen:** se conserva el original como archivo maestro (`img/Encabezado.png`, no se usa en la página) y se genera `img/encabezado-empanadas.webp` (2880x666, 119 KB frente a 970 KB): recorte de las barras transparentes de 18 px arriba y abajo, **se quitó el código QR** del banner (decisión del usuario: no se pudo decodificar y en pantalla no se escanea; se rellenó con el fondo crema muestreado y borde suave), ampliación 1,5x con Lanczos, enfoque suave (sigma 1,1) y +6% de saturación. No se inventó detalle: la mejora es de nitidez de bordes y texto. **Integración:** sección `#franja-aviso` al inicio de `<main>` (enlace a la tarjeta de las empanadas, con `aria-label` que resume el mensaje; la imagen es decorativa con `alt=""`), visible desde 48em (tablet y escritorio, ~186 px de alto a 800 px y ~297 px a 1280 px); en móvil la imagen sería ilegible, así que se mantiene la cinta de texto de arriba. **Movimiento:** la imagen "respira" con un acercamiento mínimo y centrado (escala 1 a 1,035 en 20 s, `ease-in-out`, alternando) para que ningún texto se recorte; sin animación con `prefers-reduced-motion`. Como la cinta, se oculta sola pasado el 1 de octubre (`data-hasta="2026-10-01"`). Prueba en Chromium real a 400, 800 y 1280 px: visibilidad correcta por tamaño, movimiento comprobado, clic lleva a la tarjeta y la resalta, sin errores ni desborde; con fecha simulada al 2 de octubre ambas desaparecen. Por hacer cuando pase la fecha: retirar franja y cinta del HTML o reutilizarlas cambiando imagen, enlace y `data-hasta`.

# Lethon web v2 — guion y encargo

## Qué es y para qué

La web de presentación de **Lethon**, una app de mensajería privada para Android.

**Objetivos, por orden:**
1. Que la gente **descargue Lethon**.
2. Que **confíe**: la seguridad va contada dentro de la historia, no en una lista técnica.
3. Un final secundario: **«Únete a la flota»** (montar un nodo o apoyar el proyecto).

**Cómo tiene que ser:**
- Premium.
- Contada como una historia (storytelling con el scroll).
- Que funcione en cualquier dispositivo, desde un Android barato hasta un monitor 4K.
- Muy cuidada en cada detalle.

## Fuente de verdad (léela antes de escribir un solo texto)

- `/home/user/Ibri/docs/COMO-FUNCIONA.md`: qué hace la app de verdad y qué no.
- `/home/user/Ibri/docs/superpowers/specs/2026-11-01-rediseno-interfaz-design.md`: la marca (tokens, tipografía, voz).
- `/home/user/Ibri/docs/superpowers/specs/2026-11-01-rediseno-interfaz.html`: las pantallas reales de la app. Úsalas para los móviles que salgan en la web; recréalas en HTML/CSS, nunca como imágenes borrosas.
- `/home/user/Ibri/docs/superpowers/specs/2026-10-26-cerca-offline-design.md`: Cerca y las salas.

**Regla de oro: ninguna frase promete algo que la app no hace.**
- Si una afirmación de la v1 no aparece en `COMO-FUNCIONA.md`, se quita. Por ejemplo «anti-voice biometrics», «CBR masking» o «LVL 0.8».
- Las llamadas todavía no funcionan, porque falta i2pd: no se anuncian.
- En una web de seguridad, una promesa falsa destruye la confianza.

## Marca

**Colores** (exactos, de la especificación de la app):
- Mundo internet: fondo **Tinta `#0C1015`**, acento **Jade `#38D6C0`**.
- Mundo Cerca: fondo **Brasa `#15100A`**, acento **Ámbar `#FFB547`**.
- Los demás tokens (texto, superficies) se toman de la especificación.

**Fuentes:**
- Familjen Grotesk para los titulares.
- Figtree para el texto.
- JetBrains Mono solo para detalles técnicos breves.
- Los archivos están en `/home/user/Ibri/lethon-android/src/main/res/font/`. Cópialos a `public/fonts/` y sírvelos desde la propia web. **Nada de Google Fonts ni CDNs.**

**Monograma:** una «l» con una luz al lado. La luz es el **hilo visual** de toda la web:
- la vemos al empezar;
- acompaña al lector;
- se vuelve ámbar en Cerca;
- al final aterriza en el monograma, junto al botón de descarga.

**Voz:** frases cortas, humanas y sin jerga. Se habla de «tú». Nada de «hacker» ni de verde terminal.

## Guion (escenas al hacer scroll)

Cada escena es una sección anclada (pin) con una animación ligada al scroll. Los textos de abajo son la versión en español; la versión en inglés va a la par.

**0 · Oscuridad**
- Pantalla negra (tinta). Solo hay un punto de luz jade que respira despacio.
- Texto: *«Cada mensaje que envías cuenta una historia. No siempre la tuya.»*
- Indicación sutil de que hay que bajar.

**1 · Lo que ven de ti**
- Una burbuja de chat, «¿Quedamos a las 8?», entra en escena.
- Con el scroll se encienden a su alrededor etiquetas de metadatos, una por una: **Quién**, **A quién**, **A qué hora**, **Desde dónde** (una IP y una ciudad), **Cada cuánto**.
- Texto: *«El mensaje va cifrado. Todo lo demás, no.»*
- Reaprovecha la idea de `MetadataSection` de la v1, con la marca nueva.

**2 · Apagar las luces**
- Lethon apaga cada etiqueta, cada una con una línea sencilla y verdadera según `COMO-FUNCIONA.md`, por ejemplo:
  - sin número de teléfono;
  - sin servidor central (Tor y red sin centro);
  - todos los mensajes miden lo mismo;
  - mensajes de tapadera que no se distinguen de los reales.
- Al final la burbuja se funde entre muchas iguales.
- Texto: *«¿Cuál es la tuya? Ni nosotros lo sabemos.»*

**3 · El corte**
- La luz parpadea y todo se va a negro.
- Texto: *«¿Y si un día no hay internet?»*

**4 · La noche en que se cae internet** (clímax; toda la paleta pasa a Brasa y Ámbar)
- Una plaza vista desde arriba, llena de puntos: cada punto es un móvil.
- Un mensaje salta de móvil en móvil (Bluetooth o wifi) hasta llegar, con un contador vivo: «Lo llevan 1… 7 móviles».
- Al lado, en pantallas anchas, un móvil con la app real cambiando a Cerca (pestaña Cerca, en ámbar).
- Texto: *«Sin antenas. Sin internet. Sin nadie en medio.»*
- Que se entienda que Cerca funciona aunque la parte de internet esté apagada.

**5 · Salas**
- Un cartel con un QR. Unas siluetas lo escanean y entran en la sala.
- Para quien coordina algo en la calle.
- Solo lo que las salas hacen de verdad, según la especificación de Cerca.

**6 · Por qué fiarte** (se vuelve a tinta y jade)
- Dos columnas honestas: **«Lo que protege»** y **«Lo que no»**, sacadas de `COMO-FUNCIONA.md`.
  - En «Lo que no» van cosas reales, por ejemplo: si te quitan el móvil desbloqueado, la app no puede protegerte.
- Código abierto, sin cuentas. Enlace al código: `https://github.com/sudplo/ibri`.
- Tabla comparativa compacta. Reaprovecha `CompareSection`, pero solo con filas verificables.
- **«Esta web tampoco te espía»**: un contador real, calculado en el navegador con `performance.getEntriesByType('resource')`, que muestra:
  - 0 cookies;
  - 0 analíticas;
  - 0 peticiones a otros dominios.
  - Tiene que ser verdad: la web no puede cargar nada de fuera.

**7 · Descargar**
- La luz que ha acompañado toda la historia aterriza en el monograma «l».
- Botón grande **«Descargar para Android»**, que enlaza a `https://github.com/sudplo/ibri/releases/latest`.
- Debajo:
  - huella SHA-256 del APK, con un marcador `PENDIENTE` bien visible en el código, en `src/content/release.js`, para rellenarla al publicar;
  - un enlace a «Cómo comprobarlo».
- Requisitos: Android 7 o superior.

**8 · Únete a la flota**
- Un final tranquilo con dos tarjetas:
  - «Monta un nodo»: enlaza a la documentación de la flota en el repo de la app.
  - «Apoya el proyecto».
- Pie de página con idioma, código y licencia.

## Requisitos técnicos

- Trabaja **en este repo**, en la rama **`web-v2`**.
  - No toques `main`: al subir a `main` se publica en GitHub Pages.
  - Mantén Next.js con `output: 'export'` y el `basePath` actual.
- **GSAP + ScrollTrigger** para las escenas, con `gsap.matchMedia()`.
- **Quitar:**
  - Three.js, `@react-three/*` y los componentes de `canvas/` (pesan y gastan batería);
  - el cursor personalizado;
  - el scroll suavizado propio (tiene que funcionar el scroll nativo).
  - Las secciones viejas se borran o se rehacen; no deben quedar en la página.
- **Móvil primero.**
  - 360 px como mínimo, con un margen lateral de al menos 16 px y nada de scroll horizontal.
  - Ningún titular toca el borde; usa `clamp()` para los tamaños de letra.
  - Probar en 360×740, 390×844, 768×1024, 1440×900 y 2560×1440.
- **`prefers-reduced-motion`:** las escenas se muestran como fotogramas quietos, legibles, en su estado final y sin pin.
- **Sin JavaScript:** la página se lee entera. Todo el texto está en el HTML; las animaciones solo añaden.
- **Accesibilidad:**
  - contraste AA como mínimo (texto ≥ 4.5:1);
  - foco visible;
  - estructura de encabezados correcta;
  - etiquetas `aria` en lo que sea solo visual;
  - botón de descarga de al menos 48 px.
- **Idiomas:** español (por defecto) e inglés.
  - Todos los textos en `src/content/{es,en}.js`.
  - Selector de idioma en la cabecera que recuerde la elección (localStorage dentro de try/catch).
  - Al entrar, elegir según `navigator.language`.
  - Sin rutas separadas, porque es una exportación estática.
- **Rendimiento:**
  - JS inicial pequeño;
  - animar solo `transform` y `opacity`;
  - `will-change` con moderación;
  - las animaciones de muchos puntos (plaza, burbujas) con un `<canvas>` 2D ligero o SVG, pausadas cuando no se ven (IntersectionObserver).
- **Privacidad:**
  - cero peticiones a terceros, sin analíticas ni cookies;
  - metadatos `<head>` buenos (título, descripción, Open Graph con una imagen propia generada en el repo, `theme-color`);
  - favicon con el monograma.
- **Actualizar** el `README.md` (qué es y cómo compilar) y borrar los `dev-3001*.log`.

## Calidad: cómo demuestras que está bien

1. `npx next build` sin errores.
2. Lint en verde.
3. Sirve `out/` y haz capturas con Playwright (ya está instalado; `require('playwright')`).
   - Recorrido completo en 390×844 y 1440×900, y la página entera con reduced-motion.
   - Guárdalas en `docs/capturas-v2/` y **míralas**.
   - Corrige lo que se vea mal: texto cortado, contraste bajo, pantallas vacías, solapes. La v1 tenía muchos tramos negros y vacíos; eso no puede pasar.
4. Comprueba con Playwright que **no hay scroll horizontal** en 360 px y que **no hay peticiones a otros dominios**.
5. Commits pequeños y frecuentes (uno por escena o bloque), con push a `web-v2` después de cada uno.

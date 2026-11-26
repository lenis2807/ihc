
# ShareRoom

Sitio web responsivo para buscar habitaciones, encontrar roomies compatibles y publicar alojamientos.

> Solo **Datos** y **Estructura** son específicos de ShareRoom. El resto sirve de punto de partida para cualquier proyecto HTML y CSS basado en Figma.

## Datos

- **Proyecto:** ShareRoom
- **Curso:** Interacción Humano Computador y Programación Web
- **Entrega:** TB3
- **Tecnologías:** HTML5, CSS3 y JavaScript vanilla
- **Diseño:** Mockups y User Flow de Figma
- **Tipografía:** Montserrat
- **Versiones:** Escritorio (1440 px) y móvil (390 px)
- **Objetivo:** Reproducir las pantallas de Figma y conectar los recorridos; las funciones solicitadas para habitaciones usan almacenamiento local.

## Cómo trabajar

1. Revisar el User Flow y los mockups desktop y móvil de Figma.
2. Implementar una pantalla a la vez, siguiendo el flujo establecido.
3. Crear o modificar el HTML correspondiente y actualizar `css/styles.css` cuando sea necesario.
4. Reutilizar los componentes y estilos existentes para evitar duplicaciones.
5. Verificar cada pantalla en Live Server, tanto en escritorio como en móvil.
6. Corregir las diferencias respecto a Figma antes de avanzar.
7. Mantener los archivos organizados y registrar los cambios con Git.

## Estructura

    ihc/
    ├── index.html
    ├── SPEC.md
    ├── css/
    │   └── styles.css
    ├── img/
    │   ├── branding/
    │   ├── icons/
    │   ├── profiles/
    │   └── rooms/
    ├── pages/
    │   ├── account/
    │   │   ├── compare-applicants.html
    │   │   ├── favorites.html
    │   │   ├── home.html
    │   │   ├── my-listings.html
    │   │   ├── notifications.html
    │   │   ├── profile.html
    │   │   ├── publish-preview.html
    │   │   ├── publish-room.html
    │   │   ├── publish-success.html
    │   │   ├── request-history.html
    │   │   └── room-detail.html
    │   ├── auth/
    │   │   ├── login.html
    │   │   ├── signup.html
    │   │   ├── profile-create.html
    │   │   ├── recover-password.html
    │   │   └── verify-profile.html
    │   ├── roomies/
    │   │   └── search.html
    │   └── rooms/
    │       ├── contact.html
    │       ├── detail.html
    │       ├── review.html
    │       ├── search.html
    │       └── visits.html
    ├── js/
    │   ├── events.js
    │   └── localstorage.js
    └── test/
        └── localstorage.test.cjs

## Alcance

Las pantallas existentes siguen siendo principalmente estáticas. Como excepción solicitada, la búsqueda y las vistas de habitaciones, favoritos, reseñas y visitas implementan interacciones en JavaScript vanilla y persisten sus datos en `localStorage`.

- **Sí:** HTML semántico, CSS responsive, validación nativa de formularios, navegación relativa y JavaScript vanilla para las funciones anteriores.
- **Almacenamiento:** la aplicación usa la clave `shareroom.local.v1`; habitaciones de ejemplo, favoritos, reseñas, visitas y avisos simulados permanecen en el navegador actual.
- **US09 y US11:** al confirmar una visita se verifica de nuevo la disponibilidad; las visitas programadas pueden reprogramarse o cancelarse. Las visitas realizadas no se pueden modificar. Los avisos al anfitrión son registros locales, no mensajes enviados.
- **No:** servidor, API REST, llamadas a servicios externos, frameworks, autenticación real, sincronización entre dispositivos ni envío de notificaciones fuera del navegador.
- **Otras pantallas:** las funciones no incluidas en este alcance mantienen su comportamiento visual estático.
- **Pruebas:** ejecutar `node --test test/localstorage.test.cjs`.

## Reglas

- **Archivos:** un `.html` por pantalla dentro de la carpeta de su grupo en `pages/`, y un solo `css/styles.css` para todo el sitio. Nombres en minúsculas y guiones. Se permiten páginas adicionales para etapas o estados de navegación expresamente definidos, como el inicio del usuario autenticado.

- **HTML:** semántico (`header`, `nav`, `main`, `section`, `footer`), un solo `<h1>` por página, `alt` en todas las imágenes y `<label>` en cada campo de formulario.

- **CSS:** clases con nombres claros (estilo BEM), sin estilos inline ni `!important`. Colores, fuentes y espacios compartidos como variables al inicio de `css/styles.css`. Los estilos de cada pantalla van en su propia sección con un comentario.

- **Formularios:** cada campo debe tener su `<label>`, `name` y validación HTML cuando corresponda. Los errores se presentan en el idioma de la pantalla.

- **Navegación:** utilizar `<a href>` para pasar de una pantalla a otra, incluso cuando se simula un proceso como iniciar sesión o crear una cuenta. Usar `<button>` para acciones propias de formularios o controles, cuando corresponda. No realizar autenticación ni envío real de datos.

- **Rutas:** son relativas. `index.html` usa `css/styles.css` e `img/...`. Las páginas de `pages/<grupo>/` usan `../../css/styles.css` e `../../img/...`. Para ir a otro grupo se usa `../<grupo>/<archivo>.html`; para volver al inicio, `../../index.html`.

- **Landing (index.html):** es una sola página en la raíz, fuera de `pages/`. Lleva su propia cabecera y pie, y sus botones permiten navegar hacia los demás grupos. La variante del inicio autenticado se representa en `pages/account/home.html`, reutilizando el diseño del inicio.

- **Responsive:** el Figma trae diseños para escritorio y móvil. Implementarlos en el mismo `.html` mediante `@media` en `css/styles.css`. Empezar por móvil y utilizar `@media (min-width: 768px)` para escritorio. Usar Flexbox o Grid, sin crear archivos separados para móvil.

- **Diseño:** respetar los mockups y el User Flow de Figma en ambos tamaños. Utilizar los colores, tipografía, imágenes, íconos y componentes originales del diseño.

- **Pantallas alternativas:** los estados de error, vacío o rechazo pertenecen a la misma pantalla, no requieren páginas HTML independientes. Se pueden representar mediante clases modificadoras y CSS. Las etapas de confirmación o navegación pueden tener su propio HTML cuando el flujo lo requiera.

- **Tipografía:** utilizar Montserrat e incluir los enlaces de Google Fonts en el `<head>` de cada nuevo HTML.

- **Tecnologías:** utilizar HTML5 y CSS3 en todas las pantallas. Para las funciones locales de habitaciones, enlazar solo los scripts vanilla `js/localstorage.js` y `js/events.js`; no agregar dependencias ni servicios externos.
- **Simulaciones:** las funciones locales no representan sesiones reales, una base de datos compartida ni el envío de correos o mensajes.

- **Organización:** reutilizar los componentes existentes y evitar selectores duplicados, estilos innecesarios o modificaciones de pantallas que ya funcionan correctamente.

- **Pantallas:** si hay dudas, preguntar. No inventar pantallas ni funcionalidades fuera del Figma o de lo solicitado para el proyecto.


# ShareRoom

Sitio web responsivo para buscar habitaciones, encontrar roomies compatibles y publicar alojamientos.

> Solo **Datos** y **Estructura** son específicos de ShareRoom. El resto sirve de punto de partida para cualquier proyecto HTML y CSS basado en Figma.

## Datos

- **Proyecto:** ShareRoom
- **Curso:** Interacción Humano Computador y Programación Web
- **Entrega:** TB3
- **Tecnologías:** HTML5 y CSS3
- **Diseño:** Mockups y User Flow de Figma
- **Tipografía:** Montserrat
- **Versiones:** Escritorio (1440 px) y móvil (390 px)
- **Objetivo:** Reproducir las pantallas de Figma y conectar sus recorridos mediante navegación estática.

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
    │       └── search.html
    └── js/

## Alcance

Solo representar visualmente cada pantalla y conectarla: formularios con sus campos, listas con datos de ejemplo y enlaces entre pantallas. No se implementa lógica de negocio.

- **Sí:** HTML semántico, CSS3, `<form>` con atributos de validación (`required`, `type="email"`, `minlength`), listas con datos de ejemplo fijos y navegación con `<a href>`.
- **No:** JavaScript, frameworks, librerías de programación, preprocesadores ni CDNs, excepto Google Fonts para Montserrat. No utilizar `<script>` ni eventos como `onclick`.
- **Carpeta `js/`:** no utilizar ni enlazar sus archivos durante la entrega TB3.
- **Contadores, chips y buscadores:** representarlos visualmente, sin implementar cálculos, filtros ni búsquedas reales.
- **Formularios:** utilizar campos y validaciones nativas de HTML. Los enlaces que simulan el envío permiten navegar entre pantallas, pero no ejecutan las validaciones del formulario.
- **Diseño:** utilizar los textos, colores, imágenes y valores de ejemplo del Figma.
- **Pantallas:** implementar las vistas establecidas en los mockups, el User Flow o solicitadas para ShareRoom.
- **Responsive:** desarrollar las versiones de escritorio y móvil en el mismo archivo HTML.
- **Estados:** representar visualmente los errores y confirmaciones que correspondan.
- **Navegación:** conectar las pantallas mediante rutas relativas.
- **Usuarios:** representar los estados de visitante y usuario autenticado mediante páginas estáticas.
- **Simulaciones:** no implementar autenticación, almacenamiento, búsqueda ni envío real de información.
- Si existen dudas sobre un elemento, consultar antes de agregar funcionalidades no solicitadas.

## Reglas

- **Archivos:** un `.html` por pantalla dentro de la carpeta de su grupo en `pages/`, y un solo `css/styles.css` para todo el sitio. Nombres en minúsculas y guiones. Se permiten páginas adicionales para etapas o estados de navegación expresamente definidos, como el inicio del usuario autenticado.

- **HTML:** semántico (`header`, `nav`, `main`, `section`, `footer`), un solo `<h1>` por página, `alt` en todas las imágenes y `<label>` en cada campo de formulario.

- **CSS:** clases con nombres claros (estilo BEM), sin estilos inline ni `!important`. Colores, fuentes y espacios compartidos como variables al inicio de `css/styles.css`. Los estilos de cada pantalla van en su propia sección con un comentario.

- **Formularios:** cada campo debe tener su `<label>`, `name` y validación HTML cuando corresponda. Los errores se presentan debajo de los campos, en el idioma del Figma. Las validaciones nativas se utilizan cuando existe un envío de formulario; los enlaces de simulación no ejecutan estas validaciones.

- **Navegación:** utilizar `<a href>` para pasar de una pantalla a otra, incluso cuando se simula un proceso como iniciar sesión o crear una cuenta. Usar `<button>` para acciones propias de formularios o controles, cuando corresponda. No realizar autenticación ni envío real de datos.

- **Rutas:** son relativas. `index.html` usa `css/styles.css` e `img/...`. Las páginas de `pages/<grupo>/` usan `../../css/styles.css` e `../../img/...`. Para ir a otro grupo se usa `../<grupo>/<archivo>.html`; para volver al inicio, `../../index.html`.

- **Landing (index.html):** es una sola página en la raíz, fuera de `pages/`. Lleva su propia cabecera y pie, y sus botones permiten navegar hacia los demás grupos. La variante del inicio autenticado se representa en `pages/account/home.html`, reutilizando el diseño del inicio.

- **Responsive:** el Figma trae diseños para escritorio y móvil. Implementarlos en el mismo `.html` mediante `@media` en `css/styles.css`. Empezar por móvil y utilizar `@media (min-width: 768px)` para escritorio. Usar Flexbox o Grid, sin crear archivos separados para móvil.

- **Diseño:** respetar los mockups y el User Flow de Figma en ambos tamaños. Utilizar los colores, tipografía, imágenes, íconos y componentes originales del diseño.

- **Pantallas alternativas:** los estados de error, vacío o rechazo pertenecen a la misma pantalla, no requieren páginas HTML independientes. Se pueden representar mediante clases modificadoras y CSS. Las etapas de confirmación o navegación pueden tener su propio HTML cuando el flujo lo requiera.

- **Tipografía:** utilizar Montserrat e incluir los enlaces de Google Fonts en el `<head>` de cada nuevo HTML.

- **Tecnologías:** utilizar únicamente HTML5 y CSS3. No incluir JavaScript, frameworks, etiquetas `<script>` ni eventos como `onclick`.

- **Simulaciones:** los enlaces entre pantallas representan el User Flow. No se implementan sesiones reales, bases de datos, envío de correos ni almacenamiento de información.

- **Organización:** reutilizar los componentes existentes y evitar selectores duplicados, estilos innecesarios o modificaciones de pantallas que ya funcionan correctamente.

- **Pantallas:** si hay dudas, preguntar. No inventar pantallas ni funcionalidades fuera del Figma o de lo solicitado para el proyecto.

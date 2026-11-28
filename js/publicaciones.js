// ===== Elementos =====
const listaPublicaciones = document.querySelector("#lista-publicaciones");
const formPublicacion = document.querySelector("#formulario-publicacion");
const fotoVista = document.querySelector("#foto-vista");
const fotoArchivo = document.querySelector("#foto-archivo");
const botonPublicar = document.querySelector("#boton-publicar");
const listaSolicitudes = document.querySelector("#lista-solicitudes");
const chipsSolicitud = document.querySelectorAll("[data-estado]");
const listaInteresados = document.querySelector("#lista-interesados");
const tablaComparacion = document.querySelector("#tabla-comparacion");
const botonContactar = document.querySelector("#boton-contactar");
const resumenExito = document.querySelector("#resumen-exito");
const codigoPublicacion = document.querySelector("#codigo-publicacion");
const panelEdicion = document.querySelector("#panel-edicion");
const formEdicion = document.querySelector("#formulario-edicion");
const botonPausar = document.querySelector("#boton-pausar");
const botonDescartar = document.querySelector("#boton-descartar");
const fotoEdicionArchivo = document.querySelector("#ed-foto-archivo");
const filtros = document.querySelectorAll("[data-filtro]");

// ?id=1 indica la publicación; ?volver=1 recupera el borrador del formulario
const parametros = new URLSearchParams(location.search);
const idPublicacion = Number(parametros.get("id"));
const volverAEditar = parametros.get("volver") === "1";


// ===== Datos =====
const CLAVE_SOLICITUDES = "shareroom_solicitudes_roomie";

let idSeleccionada = idPublicacion || null;
let filtroActual = "todas";
let fotoActual = "../../img/rooms/habitacion-01.png";
let fotoEdicion = null;
let filtroSolicitud = "todas";
let seleccionados = [];

const estadosSolicitud = {
  revision: "En revisión",
  visita: "Visita programada",
  aceptada: "Aceptada",
  rechazada: "Rechazada",
  cancelada: "Cancelada",
};

const etiquetasChip = {
  todas: "Todas",
  revision: "En revisión",
  visita: "Visitas",
  aceptada: "Aceptadas",
  rechazada: "Rechazadas",
  cancelada: "Canceladas",
};

const publicacionesIniciales = [
  {
    id: 1,
    titulo: "Habitación luminosa en Pueblo Libre",
    descripcion: "Habitación privada con escritorio y clóset. Se comparte el departamento con dos estudiantes. Incluye agua e internet.",
    precio: 890,
    distrito: "Pueblo Libre",
    universidad: "PUCP",
    direccion: "Jr. Andalucía 245, Pueblo Libre",
    tipo: "Privada",
    estado: "publicado",
    vistas: 74,
    disponible: "2026-10-15",
    servicios: ["WiFi", "Amoblado", "Cocina", "Lavandería"],
    reglas: ["No fumar", "Sin fiestas"],
    imagen: "../../img/rooms/room-01.png",
  },
  {
    id: 2,
    titulo: "Dormitorio amoblado en San Miguel",
    descripcion: "Dormitorio amoblado cerca de la UPC.",
    precio: 980,
    distrito: "San Miguel",
    universidad: "UPC",
    direccion: "Av. La Marina 1200, San Miguel",
    tipo: "Privada",
    estado: "publicado",
    vistas: 52,
    disponible: "2026-11-01",
    servicios: ["WiFi", "Amoblado"],
    reglas: ["No fumar"],
    imagen: "../../img/rooms/room-02.png",
  },
  {
    id: 3,
    titulo: "Cuarto privado cerca de la PUCP",
    descripcion: "Cuarto privado ideal para estudiantes.",
    precio: 820,
    distrito: "San Miguel",
    universidad: "PUCP",
    direccion: "Calle Los Pinos 340, San Miguel",
    tipo: "Privada",
    estado: "borrador",
    vistas: 0,
    disponible: "",
    servicios: ["WiFi"],
    reglas: [],
    imagen: "../../img/rooms/room-03.png",
  },
];

// Personas interesadas de ejemplo (se reparten entre tus publicaciones)
const solicitantesDemo = [
  {
    id: 1, nombre: "Mariana Torres", foto: "../../img/profiles/mariana.png",
    perfil: "22 años · Administración · UL",
    fecha: "2026-09-28", estado: "visita", visita: "2026-10-03T17:30",
    compatibilidad: 79, presupuesto: "S/ 700–900", ingreso: "Noviembre",
    horario: "Estudia mañana", convivencia: "Sociable", mascotas: "Sin mascotas",
  },
  {
    id: 2, nombre: "Diego Ramos", foto: "../../img/profiles/diego.png",
    perfil: "25 años · Diseñador · Remoto",
    fecha: "2026-09-19", estado: "revision", visita: "",
    compatibilidad: 86, presupuesto: "S/ 800–1,000", ingreso: "Inmediato",
    horario: "Trabajo remoto", convivencia: "Tranquilo", mascotas: "Acepta gatos",
  },
  {
    id: 3, nombre: "Lucía Fernández", foto: "../../img/profiles/lucia.png",
    perfil: "23 años · Psicología · PUCP",
    fecha: "2026-09-04", estado: "aceptada", visita: "",
    compatibilidad: 91, presupuesto: "S/ 750–950", ingreso: "Octubre",
    horario: "Estudia tarde", convivencia: "Ordenada", mascotas: "Sin mascotas",
  },
  {
    id: 4, nombre: "Carlos Vega", foto: "../../img/profiles/carlos.png",
    perfil: "26 años · Analista · Híbrido",
    fecha: "2026-08-22", estado: "rechazada", visita: "",
    compatibilidad: 74, presupuesto: "S/ 850–1,100", ingreso: "Inmediato",
    horario: "Horario híbrido", convivencia: "Tranquilo", mascotas: "Sin mascotas",
  },
  {
    id: 5, nombre: "Andrea Paredes", foto: "../../img/profiles/andrea.png",
    perfil: "21 años · Arquitectura · UPC",
    fecha: "2026-08-11", estado: "cancelada", visita: "",
    compatibilidad: 68, presupuesto: "S/ 600–800", ingreso: "Diciembre",
    horario: "Estudia noche", convivencia: "Sociable", mascotas: "Acepta gatos",
  },
];

const obtenerPublicaciones = () =>
  leerDatos("shareroom_lista_publicaciones", publicacionesIniciales);

const buscarPublicacion = (id) =>
  obtenerPublicaciones().find((p) => p.id === id);

const crearSolicitudesIniciales = () => {
  const publicaciones = obtenerPublicaciones();
  const destinos = publicaciones.length ? publicaciones : publicacionesIniciales;
  return solicitantesDemo.map((s, i) => ({
    ...s,
    idPublicacion: destinos[i % destinos.length].id,
  }));
};

const obtenerSolicitudes = () =>
  leerDatos(CLAVE_SOLICITUDES, crearSolicitudesIniciales());

// Completa los campos que le falten a publicaciones guardadas antes
const completarPublicacion = (p) => ({
  estado: "publicado",
  vistas: 0,
  tipo: "Privada",
  direccion: "",
  disponible: "",
  servicios: [],
  reglas: [],
  ...p,
});

const obtenerPublicacionesCompletas = () =>
  obtenerPublicaciones().map(completarPublicacion);

const crearPublicacion = (publicacion) => {
  const publicaciones = obtenerPublicaciones();
  const ids = publicaciones.map((p) => p.id);
  publicacion.id = Math.max(0, ...ids) + 1;
  publicaciones.push(publicacion);
  guardarDatos("shareroom_lista_publicaciones", publicaciones);
};

const editarPublicacion = (id, publicacion) => {
  const publicaciones = obtenerPublicaciones();
  const posicion = publicaciones.findIndex((p) => p.id === id);
  publicacion.id = id;
  publicaciones[posicion] = publicacion;
  guardarDatos("shareroom_lista_publicaciones", publicaciones);
};

const borrarPublicacion = (id) => {
  const publicaciones = obtenerPublicaciones().filter((p) => p.id !== id);
  guardarDatos("shareroom_lista_publicaciones", publicaciones);
};


// ===== Funciones =====
const escribir = (selector, texto) => {
  const elemento = document.querySelector(selector);
  if (elemento) elemento.textContent = texto;
};

const mostrarAviso = (texto) => {
  let aviso = document.querySelector(".ml-toast");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.className = "ml-toast";
    aviso.setAttribute("role", "status");
    document.body.appendChild(aviso);
  }
  aviso.textContent = texto;
  aviso.classList.add("is-visible");
  setTimeout(() => aviso.classList.remove("is-visible"), 2500);
};

const formatearFecha = (texto) =>
  new Date(`${texto}T00:00:00`).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// --- Publicar: formulario y foto ---
// Achica la foto para que quepa en el navegador (localStorage)
const reducirImagen = (archivo, alTerminar) => {
  const lector = new FileReader();
  lector.onload = () => {
    const imagen = new Image();
    imagen.onload = () => {
      const ancho = Math.min(800, imagen.width);
      const alto = Math.round(imagen.height * (ancho / imagen.width));
      const lienzo = document.createElement("canvas");
      lienzo.width = ancho;
      lienzo.height = alto;
      const contexto = lienzo.getContext("2d");
      contexto.fillStyle = "#ffffff";
      contexto.fillRect(0, 0, ancho, alto);
      contexto.drawImage(imagen, 0, 0, ancho, alto);
      alTerminar(lienzo.toDataURL("image/jpeg", 0.8));
    };
    imagen.src = lector.result;
  };
  lector.readAsDataURL(archivo);
};

const cambiarFoto = (e) => {
  const archivo = e.target.files[0];
  if (!archivo) return;
  reducirImagen(archivo, (datos) => {
    fotoActual = datos;
    fotoVista.src = datos;
  });
};

const guardarBorrador = (e) => {
  e.preventDefault();

  const borrador = {
    titulo: document.querySelector("#room-title").value.trim(),
    distrito: document.querySelector("#room-district").value.trim(),
    universidad: document.querySelector("#room-university").value.trim(),
    precio: Number(document.querySelector("#room-price").value),
    tipo: document.querySelector("#room-type").value.trim(),
    descripcion: document.querySelector("#room-description").value.trim(),
    servicios: [...document.querySelectorAll('input[name="servicio"]:checked')].map((c) => c.value),
    reglas: [...document.querySelectorAll('input[name="regla"]:checked')].map((c) => c.value),
    imagen: fotoActual,
  };

  guardarDatos("shareroom_borrador_publicacion", borrador);
  location.href = "publish-preview.html";
};

const llenarDesdeBorrador = () => {
  const b = leerDatos("shareroom_borrador_publicacion", null);
  if (!b) return;

  document.querySelector("#room-title").value = b.titulo;
  document.querySelector("#room-district").value = b.distrito;
  document.querySelector("#room-university").value = b.universidad;
  document.querySelector("#room-price").value = b.precio;
  document.querySelector("#room-type").value = b.tipo;
  document.querySelector("#room-description").value = b.descripcion;

  document.querySelectorAll('input[name="servicio"]').forEach((casilla) => {
    casilla.checked = b.servicios.includes(casilla.value);
  });
  document.querySelectorAll('input[name="regla"]').forEach((casilla) => {
    casilla.checked = b.reglas.includes(casilla.value);
  });

  fotoActual = b.imagen;
  fotoVista.src = b.imagen;
};

// --- Publicar: vista previa y confirmación ---
const mostrarEtiquetas = (selectorLista, selectorBloque, items) => {
  document.querySelector(selectorLista).innerHTML = items
    .map((item) => `<li>${item}</li>`)
    .join("");
  document.querySelector(selectorBloque).hidden = items.length === 0;
};

const mostrarVistaPrevia = () => {
  // Con ?id=2 se muestra una publicación existente; sin id, el borrador del formulario
  const b = idPublicacion
    ? obtenerPublicacionesCompletas().find((p) => p.id === idPublicacion)
    : leerDatos("shareroom_borrador_publicacion", null);

  if (!b) {
    location.href = idPublicacion ? "my-listings.html" : "publish-room.html";
    return;
  }

  document.querySelector("#prev-imagen").src = b.imagen;
  escribir("#prev-titulo", b.titulo);
  escribir("#prev-ubicacion", b.universidad ? `${b.distrito} · Cerca de ${b.universidad}` : b.distrito);
  document.querySelector("#prev-precio").innerHTML = `S/ ${b.precio} <span>/ mes</span>`;
  escribir("#prev-descripcion", b.descripcion);
  mostrarEtiquetas("#prev-servicios", "#prev-servicios-bloque", b.servicios || []);
  mostrarEtiquetas("#prev-reglas", "#prev-reglas-bloque", b.reglas || []);

  if (idPublicacion) {
    // Modo lectura: ya está publicada, solo se revisa
    botonPublicar.style.display = "none";
    document.querySelector(".publication-steps").style.display = "none";
    escribir(".section-eyebrow", "TU PUBLICACIÓN");
    const volver = document.querySelector("#boton-volver");
    volver.textContent = "Volver a Mis publicaciones";
    volver.href = "my-listings.html";
  }
};

const publicarHabitacion = () => {
  const b = leerDatos("shareroom_borrador_publicacion", null);
  if (!b) return;

  const publicacion = {
    titulo: b.titulo,
    descripcion: b.descripcion,
    precio: b.precio,
    distrito: b.distrito,
    universidad: b.universidad,
    tipo: b.tipo,
    servicios: b.servicios,
    reglas: b.reglas,
    imagen: b.imagen,
  };

  crearPublicacion(publicacion);
  guardarDatos("shareroom_ultima_publicacion", publicacion);
  eliminarDatos("shareroom_borrador_publicacion");
  location.href = "publish-success.html";
};

const mostrarExito = () => {
  const p = leerDatos("shareroom_ultima_publicacion", null);
  if (!p) return;

  const ubicacion = p.universidad
    ? `${p.distrito} · Cerca de ${p.universidad}`
    : p.distrito;
  const servicios = (p.servicios || []).join(" · ") || p.tipo || "";

  resumenExito.innerHTML = `
    <img src="${p.imagen}" alt="Habitación publicada">
    <div class="success-listing__info">
      <strong>${p.titulo}</strong>
      <span>${ubicacion}</span>
      <span>${servicios}</span>
      <p class="success-listing__price">S/ ${p.precio} <small>/ mes</small></p>
    </div>`;
  const hora = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
  codigoPublicacion.textContent =
    `Publicación SR-${String(p.id).padStart(4, "0")} · Visible desde hoy a las ${hora}`;
};

// --- Mis publicaciones: lista, filtros y resumen ---
const crearHtmlTarjeta = (p) => `
  <article class="ml-card ${p.id === idSeleccionada ? "is-selected" : ""}" data-id="${p.id}">
    <img src="${p.imagen}" alt=""
      onerror="this.onerror=null;this.src='../../img/rooms/room-01.png'">
    <div class="ml-card__body">
      <strong>${p.titulo}</strong>
      <span class="ml-card__price">S/ ${p.precio} / mes</span>
      <div class="ml-card__meta">
        <span class="ml-status ml-status--${p.estado}">${p.estado === "publicado" ? "Publicado" : "Borrador"}</span>
        <small>${p.estado === "publicado" ? p.vistas + " vistas" : "— vistas"}</small>
      </div>
    </div>
    <details class="ml-kebab">
      <summary aria-label="Más opciones">⋮</summary>
      <div class="ml-kebab__menu">
        <a href="request-history.html?id=${p.id}">Ver solicitudes</a>
        <button type="button" onclick="eliminarDeLista(${p.id})">Eliminar</button>
      </div>
    </details>
  </article>`;

const filtrarPorEstado = (lista) => {
  if (filtroActual === "activas") return lista.filter((p) => p.estado === "publicado");
  if (filtroActual === "borradores") return lista.filter((p) => p.estado === "borrador");
  return lista;
};

const mostrarFiltros = (todas) => {
  const activas = todas.filter((p) => p.estado === "publicado").length;
  const conteo = { todas: todas.length, activas, borradores: todas.length - activas };
  const nombres = { todas: "Todas", activas: "Activas", borradores: "Borradores" };

  filtros.forEach((boton) => {
    const filtro = boton.dataset.filtro;
    boton.textContent = `${nombres[filtro]} ${conteo[filtro]}`;
    boton.classList.toggle("is-active", filtro === filtroActual);
  });
};

const mostrarEstadisticas = () => {
  const publicaciones = obtenerPublicacionesCompletas();
  const solicitudes = obtenerSolicitudes();
  const activas = publicaciones.filter((p) => p.estado === "publicado").length;
  const vistas = publicaciones.reduce((total, p) => total + p.vistas, 0);
  const pendientes = solicitudes.filter((s) => s.estado === "revision").length;
  const elegidos = solicitudes.filter((s) => s.estado === "aceptada").length;

  escribir("#stat-activas", activas);
  escribir("#stat-activas-sub", `${publicaciones.length - activas} borrador`);
  escribir("#stat-vistas", vistas);
  escribir("#stat-interesados", solicitudes.length);
  escribir("#stat-interesados-sub", `${elegidos} roomie elegido`);
  escribir("#stat-visitas", pendientes);
};

const mostrarPublicaciones = () => {
  const todas = obtenerPublicacionesCompletas();
  const existe = todas.some((p) => p.id === idSeleccionada);
  if (!existe) idSeleccionada = todas.length ? todas[0].id : null;

  const visibles = filtrarPorEstado(todas);
  listaPublicaciones.innerHTML = visibles.length
    ? visibles.map(crearHtmlTarjeta).join("")
    : `<p class="ml-empty">No hay publicaciones en esta lista.</p>`;

  mostrarFiltros(todas);
  mostrarEstadisticas();
};

const cambiarFiltro = (e) => {
  filtroActual = e.currentTarget.dataset.filtro;
  mostrarPublicaciones();
};

const seleccionarTarjeta = (e) => {
  if (e.target.closest(".ml-kebab")) return;
  const tarjeta = e.target.closest(".ml-card");
  if (!tarjeta) return;
  idSeleccionada = Number(tarjeta.dataset.id);
  mostrarPublicaciones();
  mostrarEdicion();
};

const eliminarDeLista = (id) => {
  if (!confirm("¿Eliminar esta publicación?")) return;
  borrarPublicacion(id);
  if (id === idSeleccionada) idSeleccionada = null;
  mostrarPublicaciones();
  mostrarEdicion();
};

// --- Mis publicaciones: panel de edición ---
const mostrarEdicion = () => {
  const p = obtenerPublicacionesCompletas().find((x) => x.id === idSeleccionada);
  if (!p) {
    panelEdicion.hidden = true;
    return;
  }
  panelEdicion.hidden = false;

  // Si el tipo escrito al publicar no está en la lista, se agrega como opción
  const selectTipo = document.querySelector("#ed-tipo");
  if (![...selectTipo.options].some((o) => o.value === p.tipo)) {
    selectTipo.add(new Option(p.tipo, p.tipo));
  }

  document.querySelector("#ed-titulo").value = p.titulo;
  document.querySelector("#ed-precio").value = p.precio;
  selectTipo.value = p.tipo;
  document.querySelector("#ed-descripcion").value = p.descripcion;
  document.querySelector("#ed-direccion").value = p.direccion || p.distrito;
  document.querySelector("#ed-disponible").value = p.disponible;
  document.querySelector("#ed-activo").checked = p.estado === "publicado";
  document.querySelector("#ed-foto").src = p.imagen;
  fotoEdicion = p.imagen;
  document.querySelector("#enlace-vista-previa").href = `publish-preview.html?id=${p.id}`;

  document.querySelectorAll('input[name="servicios"]').forEach((casilla) => {
    casilla.checked = p.servicios.includes(casilla.value);
  });
  document.querySelectorAll('input[name="reglas"]').forEach((casilla) => {
    casilla.checked = p.reglas.includes(casilla.value);
  });

  escribir("#ed-subtitulo", `${p.estado === "publicado" ? "Publicado" : "Borrador"} · ${p.vistas} vistas`);
  botonPausar.textContent = p.estado === "publicado" ? "Pausar anuncio" : "Reanudar anuncio";
  escribir("#ed-mensaje", "Los cambios se guardan como borrador.");
};

const cambiarFotoEdicion = (e) => {
  const archivo = e.target.files[0];
  if (!archivo) return;
  reducirImagen(archivo, (datos) => {
    fotoEdicion = datos;
    document.querySelector("#ed-foto").src = datos;
    mostrarAviso("Foto lista. Pulsa Guardar cambios para aplicarla.");
  });
};

const guardarEdicion = (e) => {
  e.preventDefault();
  const actual = obtenerPublicacionesCompletas().find((x) => x.id === idSeleccionada);
  if (!actual) return;

  const cambios = {
    ...actual,
    titulo: document.querySelector("#ed-titulo").value,
    precio: Number(document.querySelector("#ed-precio").value),
    tipo: document.querySelector("#ed-tipo").value,
    descripcion: document.querySelector("#ed-descripcion").value,
    direccion: document.querySelector("#ed-direccion").value,
    disponible: document.querySelector("#ed-disponible").value,
    estado: document.querySelector("#ed-activo").checked ? "publicado" : "borrador",
    servicios: [...document.querySelectorAll('input[name="servicios"]:checked')].map((c) => c.value),
    reglas: [...document.querySelectorAll('input[name="reglas"]:checked')].map((c) => c.value),
    imagen: fotoEdicion || actual.imagen,
  };

  try {
    editarPublicacion(idSeleccionada, cambios);
  } catch (error) {
    mostrarAviso("No se pudo guardar. Prueba con una foto más liviana.");
    return;
  }

  mostrarPublicaciones();
  mostrarEdicion();
  mostrarAviso("Cambios guardados.");
};

const alternarEstado = () => {
  const p = obtenerPublicacionesCompletas().find((x) => x.id === idSeleccionada);
  if (!p) return;
  p.estado = p.estado === "publicado" ? "borrador" : "publicado";
  editarPublicacion(idSeleccionada, p);
  mostrarPublicaciones();
  mostrarEdicion();
  mostrarAviso(p.estado === "publicado" ? "Anuncio reanudado." : "Anuncio pausado.");
};

// --- Historial de solicitudes ---
const crearHtmlSolicitud = (s) => {
  const publicacion = buscarPublicacion(s.idPublicacion);
  const titulo = publicacion ? publicacion.titulo : "Publicación eliminada";
  const imagen = publicacion ? publicacion.imagen : "../../img/rooms/room-01.png";

  return `
    <a class="rh-row" href="compare-applicants.html?id=${s.idPublicacion}">
      <img src="${imagen}" alt=""
        onerror="this.onerror=null;this.src='../../img/rooms/room-01.png'">
      <div class="rh-row__info">
        <strong>${titulo}</strong>
        <small>${s.nombre} · ${formatearFecha(s.fecha)}</small>
      </div>
      <span class="rh-badge rh-badge--${s.estado}">${estadosSolicitud[s.estado]}</span>
      <span class="rh-row__chev" aria-hidden="true">›</span>
    </a>`;
};

const mostrarProximaVisita = (lista) => {
  const proxima = lista
    .filter((s) => s.estado === "visita" && s.visita)
    .sort((a, b) => a.visita.localeCompare(b.visita))[0];

  if (!proxima) {
    escribir("#rh-visita-fecha", "Sin visitas");
    escribir("#rh-visita-detalle", "Cuando se programe una visita aparecerá aquí.");
    return;
  }

  const fecha = new Date(proxima.visita);
  const dia = fecha.toLocaleDateString("es-PE", { day: "2-digit", month: "short" });
  const hora = fecha.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false });
  const publicacion = buscarPublicacion(proxima.idPublicacion);

  escribir("#rh-visita-fecha", `${dia} · ${hora}`);
  escribir("#rh-visita-detalle", `${publicacion ? publicacion.titulo : "Tu habitación"} con ${proxima.nombre}.`);
};

const mostrarSolicitudes = () => {
  const todas = obtenerSolicitudes();
  const base = idPublicacion
    ? todas.filter((s) => s.idPublicacion === idPublicacion)
    : todas;
  const contar = (estado) => base.filter((s) => s.estado === estado).length;

  if (idPublicacion) {
    const publicacion = buscarPublicacion(idPublicacion);
    escribir("#rh-subtitulo", `Solicitudes recibidas para «${publicacion ? publicacion.titulo : "tu publicación"}».`);
    document.querySelector("#rh-ver-todas").hidden = false;
  }

  escribir("#rh-total", base.length);
  escribir("#rh-revision", contar("revision"));
  escribir("#rh-visitas", contar("visita"));
  escribir("#rh-aceptadas", contar("aceptada"));

  chipsSolicitud.forEach((boton) => {
    const estado = boton.dataset.estado;
    const cantidad = estado === "todas" ? base.length : contar(estado);
    boton.textContent = `${etiquetasChip[estado]} ${cantidad}`;
    boton.classList.toggle("is-active", estado === filtroSolicitud);
  });

  const visibles = filtroSolicitud === "todas"
    ? base
    : base.filter((s) => s.estado === filtroSolicitud);

  listaSolicitudes.innerHTML = visibles.map(crearHtmlSolicitud).join("");
  document.querySelector("#sin-solicitudes").hidden = visibles.length > 0;
  mostrarProximaVisita(base);
};

const cambiarFiltroSolicitud = (e) => {
  filtroSolicitud = e.currentTarget.dataset.estado;
  mostrarSolicitudes();
};

// --- Comparar interesados y elegir roomie ---
const filasComparacion = [
  ["Compatibilidad", "compatibilidad"],
  ["Presupuesto", "presupuesto"],
  ["Ingreso", "ingreso"],
  ["Horario", "horario"],
  ["Convivencia", "convivencia"],
  ["Mascotas", "mascotas"],
];

const obtenerInteresados = () =>
  obtenerSolicitudes()
    .filter((s) => (!idPublicacion || s.idPublicacion === idPublicacion) && s.estado !== "cancelada")
    .sort((a, b) => b.compatibilidad - a.compatibilidad);

const crearHtmlInteresado = (s) => {
  const marcado = seleccionados.includes(s.id);
  return `
    <label class="ca-card ${marcado ? "is-selected" : ""}">
      <input type="checkbox" data-id="${s.id}" ${marcado ? "checked" : ""}>
      <img src="${s.foto}" alt="">
      <span class="ca-card__info"><strong>${s.nombre}</strong><small>${s.perfil}</small></span>
      <span class="ca-card__pct">${s.compatibilidad}%</span>
    </label>`;
};

const mostrarInteresados = () => {
  const lista = obtenerInteresados();
  escribir("#ca-total", lista.length);
  escribir("#ca-seleccionados", `${seleccionados.length} seleccionados`);
  listaInteresados.innerHTML = lista.length
    ? lista.map(crearHtmlInteresado).join("")
    : `<p class="ca-empty">Aún no hay interesados.</p>`;
};

const celdaDecision = (s) =>
  s.estado === "aceptada"
    ? `<span class="rh-badge rh-badge--aceptada">Elegido</span>`
    : `<button type="button" class="btn btn--primary" data-elegir="${s.id}">Elegir roomie</button>`;

const mostrarTabla = () => {
  const elegidos = obtenerInteresados().filter((s) => seleccionados.includes(s.id));
  escribir("#ca-n", elegidos.length);

  if (elegidos.length < 2) {
    tablaComparacion.innerHTML =
      `<p class="ca-empty">Selecciona al menos 2 perfiles para ver la comparación.</p>`;
    return;
  }

  const cabecera = elegidos.map((s) => `
    <th>
      <img src="${s.foto}" alt="">
      <strong>${s.nombre.split(" ")[0]}</strong>
      <button type="button" class="ca-remove" data-retirar="${s.id}">× Retirar</button>
    </th>`).join("");

  const filas = filasComparacion.map(([titulo, campo]) => {
    const celdas = elegidos.map((s) => campo === "compatibilidad"
      ? `<td class="ca-pct">${s.compatibilidad}%</td>`
      : `<td>${s[campo]}</td>`).join("");
    return `<tr><th scope="row">${titulo}</th>${celdas}</tr>`;
  }).join("");

  const decision = `<tr><th scope="row">Decisión</th>${elegidos.map((s) => `<td>${celdaDecision(s)}</td>`).join("")}</tr>`;

  tablaComparacion.innerHTML = `
    <div class="ca-scroll">
      <table class="ca-table">
        <thead><tr><th>Información principal</th>${cabecera}</tr></thead>
        <tbody>${filas}${decision}</tbody>
      </table>
    </div>`;
};

const iniciarComparacion = () => {
  const publicacion = buscarPublicacion(idPublicacion);
  escribir(
    "#ca-subtitulo",
    `${publicacion ? publicacion.titulo : "Todas tus publicaciones"} · Selecciona al menos 2 perfiles.`
  );
  seleccionados = obtenerInteresados().slice(0, 3).map((s) => s.id);
  mostrarInteresados();
  mostrarTabla();
};

const cambiarSeleccion = (e) => {
  const casilla = e.target.closest('input[type="checkbox"]');
  if (!casilla) return;
  const id = Number(casilla.dataset.id);
  seleccionados = casilla.checked
    ? [...seleccionados, id]
    : seleccionados.filter((x) => x !== id);
  mostrarInteresados();
  mostrarTabla();
};

const elegirRoomie = (idSolicitud) => {
  const todas = obtenerSolicitudes();
  const elegida = todas.find((s) => s.id === idSolicitud);
  if (!elegida) return;

  const solicitudes = todas.map((s) => {
    if (s.idPublicacion !== elegida.idPublicacion || s.estado === "cancelada") return s;
    return { ...s, estado: s.id === idSolicitud ? "aceptada" : "rechazada" };
  });

  guardarDatos(CLAVE_SOLICITUDES, solicitudes);
  mostrarInteresados();
  mostrarTabla();
  mostrarAviso(`Elegiste a ${elegida.nombre} como roomie.`);
};

const accionTabla = (e) => {
  const retirar = e.target.closest("[data-retirar]");
  if (retirar) {
    const id = Number(retirar.dataset.retirar);
    seleccionados = seleccionados.filter((x) => x !== id);
    mostrarInteresados();
    mostrarTabla();
    return;
  }

  const elegir = e.target.closest("[data-elegir]");
  if (elegir) elegirRoomie(Number(elegir.dataset.elegir));
};

const contactarSeleccionados = () => {
  const nombres = obtenerInteresados()
    .filter((s) => seleccionados.includes(s.id))
    .map((s) => s.nombre.split(" ")[0]);

  if (nombres.length === 0) {
    mostrarAviso("Selecciona al menos un perfil.");
    return;
  }
  mostrarAviso(`Contacto enviado a ${nombres.join(", ")}.`);
};


// ===== Eventos =====
if (formPublicacion) {
  formPublicacion.addEventListener("submit", guardarBorrador);
  fotoArchivo.addEventListener("change", cambiarFoto);
  if (volverAEditar) llenarDesdeBorrador();
}

if (botonPublicar) {
  mostrarVistaPrevia();
  botonPublicar.addEventListener("click", publicarHabitacion);
}

if (resumenExito) {
  mostrarExito();
}

if (listaPublicaciones) {
  mostrarPublicaciones();
  mostrarEdicion();
  listaPublicaciones.addEventListener("click", seleccionarTarjeta);
  filtros.forEach((boton) => boton.addEventListener("click", cambiarFiltro));
}

if (formEdicion) {
  formEdicion.addEventListener("submit", guardarEdicion);
  fotoEdicionArchivo.addEventListener("change", cambiarFotoEdicion);
  botonDescartar.addEventListener("click", mostrarEdicion);
  botonPausar.addEventListener("click", alternarEstado);
}

if (listaSolicitudes) {
  mostrarSolicitudes();
  chipsSolicitud.forEach((boton) => boton.addEventListener("click", cambiarFiltroSolicitud));
}

if (listaInteresados) {
  iniciarComparacion();
  listaInteresados.addEventListener("change", cambiarSeleccion);
  tablaComparacion.addEventListener("click", accionTabla);
  botonContactar.addEventListener("click", contactarSeleccionados);
}
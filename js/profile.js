
/* =====================================
   SHAREROOM - PERFIL DE USUARIO TB4
   Creación, edición y localStorage
===================================== */

// Claves de almacenamiento
const PERFIL_KEY = "shareroom_perfiles";
const USUARIOS_PERFIL_KEY = "shareroom_usuarios";
const SESION_PERFIL_KEY = "shareroom_sesion";

// Formularios de las dos pantallas
const formCrearPerfil = document.querySelector("#formulario-perfil");
const formEditarPerfil = document.querySelector("#formulario-editar-perfil");

// Obtener el usuario que inició sesión
const obtenerSesionPerfil = () => {
    try {
        return JSON.parse(
            sessionStorage.getItem(SESION_PERFIL_KEY) || "null"
        );
    } catch (error) {
        return null;
    }
};

// Leer los perfiles del navegador
const obtenerPerfiles = () => {
    return leerDatos(PERFIL_KEY, {});
};

// Obtener el perfil del usuario actual
const obtenerPerfilActual = (correo) => {
    const perfiles = obtenerPerfiles();
    return perfiles[correo] || null;
};

// Guardar el perfil utilizando el correo como identificador
const guardarPerfilActual = (correo, perfil) => {
    const perfiles = obtenerPerfiles();
    perfiles[correo] = perfil;

    guardarDatos(PERFIL_KEY, perfiles);
};

// Leer un campo por su nombre
const leerCampo = (formulario, nombre) => {
    const campo = formulario.elements.namedItem(nombre);
    return campo ? campo.value.trim() : "";
};

// Leer todas las casillas seleccionadas
const leerSeleccionados = (formulario, nombre) => {
    return Array.from(
        formulario.querySelectorAll(
            `input[name="${nombre}"]:checked`
        )
    ).map((campo) => campo.value);
};

// Asignar valor a un campo
const asignarCampo = (formulario, nombre, valor) => {
    const campo = formulario.elements.namedItem(nombre);

    if (campo && valor !== undefined && valor !== null) {
        campo.value = valor;
    }
};

// Actualizar las casillas seleccionadas
const asignarSeleccionados = (formulario, nombre, valores) => {
    formulario.querySelectorAll(
        `input[name="${nombre}"]`
    ).forEach((campo) => {
        campo.checked = valores.includes(campo.value);
    });
};

// Mostrar mensajes en el formulario de creación
const mostrarMensajePerfil = (texto, error = false) => {
    const mensaje = document.querySelector("#mensaje-perfil");

    if (!mensaje) return;

    mensaje.textContent = texto;
    mensaje.hidden = false;
    mensaje.classList.toggle("profile-save-message--error", error);
};

// =====================================
// CREACIÓN DEL PERFIL
// =====================================

// Cargar los datos de la cuenta registrada
const cargarCrearPerfil = () => {
    const sesion = obtenerSesionPerfil();

    if (!sesion) {
        window.location.href = "login.html";
        return;
    }

    const usuarios = leerDatos(USUARIOS_PERFIL_KEY, []);

    const usuario = usuarios.find(
        (item) => item.correo === sesion.correo
    );

    const perfilGuardado = obtenerPerfilActual(sesion.correo);

    // Datos iniciales de la cuenta
    asignarCampo(formCrearPerfil, "nombre", usuario?.nombres || "");
    asignarCampo(formCrearPerfil, "apellidos", usuario?.apellidos || "");
    asignarCampo(formCrearPerfil, "correo", sesion.correo);

    // Limpiar los valores de ejemplo del Figma
    [
        "nacimiento",
        "institucion",
        "ocupacion",
        "acerca",
        "distritos",
        "presupuesto"
    ].forEach((nombre) => {
        asignarCampo(formCrearPerfil, nombre, "");
    });

    asignarCampo(formCrearPerfil, "pronombres", "prefiero-no-decir");

    asignarSeleccionados(formCrearPerfil, "busqueda", []);
    asignarSeleccionados(formCrearPerfil, "convivencia", []);
    asignarSeleccionados(formCrearPerfil, "habitos", []);

    const terminos = formCrearPerfil.elements.namedItem("acepta_terminos");
    if (terminos) terminos.checked = false;

    // Restaurar borrador o perfil previamente guardado
    if (perfilGuardado) {
        Object.keys(perfilGuardado).forEach((nombre) => {
            if (Array.isArray(perfilGuardado[nombre])) {
                asignarSeleccionados(
                    formCrearPerfil,
                    nombre,
                    perfilGuardado[nombre]
                );
            } else {
                asignarCampo(
                    formCrearPerfil,
                    nombre,
                    perfilGuardado[nombre]
                );
            }
        });
    }

    // Actualizar el nombre y avatar visibles
    const nombre = leerCampo(formCrearPerfil, "nombre");
    const apellidos = leerCampo(formCrearPerfil, "apellidos");

    const nombreVisible = document.querySelector(".profile-photo__name");
    const avatar = document.querySelector(".profile-photo__avatar");

    if (nombreVisible) {
        nombreVisible.textContent = `${nombre} ${apellidos}`.trim();
    }

    if (avatar) {
        avatar.textContent = (
            nombre.charAt(0) + apellidos.charAt(0)
        ).toUpperCase() || "SR";
    }
};

// Obtener los datos que ingresó el usuario
const recopilarPerfil = () => {
    return {
        nombre: leerCampo(formCrearPerfil, "nombre"),
        apellidos: leerCampo(formCrearPerfil, "apellidos"),
        nacimiento: leerCampo(formCrearPerfil, "nacimiento"),
        pronombres: leerCampo(formCrearPerfil, "pronombres"),
        institucion: leerCampo(formCrearPerfil, "institucion"),
        ocupacion: leerCampo(formCrearPerfil, "ocupacion"),
        acerca: leerCampo(formCrearPerfil, "acerca"),
        distritos: leerCampo(formCrearPerfil, "distritos"),
        presupuesto: leerCampo(formCrearPerfil, "presupuesto"),
        busqueda: leerSeleccionados(formCrearPerfil, "busqueda"),
        convivencia: leerSeleccionados(formCrearPerfil, "convivencia"),
        habitos: leerSeleccionados(formCrearPerfil, "habitos"),
        actualizado: new Date().toISOString()
    };
};

// Validar tamaño y tipo de foto, si se seleccionó
const validarFotoPerfil = () => {
    const input = document.querySelector("#foto-perfil");
    const archivo = input?.files[0];

    if (!archivo) return true;

    const tiposPermitidos = ["image/jpeg", "image/png"];
    const tamanoMaximo = 5 * 1024 * 1024;

    if (!tiposPermitidos.includes(archivo.type)) {
        mostrarMensajePerfil(
            "La imagen debe ser JPG o PNG.",
            true
        );
        return false;
    }

    if (archivo.size > tamanoMaximo) {
        mostrarMensajePerfil(
            "La imagen no debe superar los 5 MB.",
            true
        );
        return false;
    }

    return true;
};

// Guardar datos como borrador o perfil completo
const guardarCrearPerfil = (esBorrador = false) => {
    const sesion = obtenerSesionPerfil();
    if (!sesion) return false;

    if (!validarFotoPerfil()) return false;

    if (!esBorrador && !formCrearPerfil.reportValidity()) {
        return false;
    }

    const perfil = recopilarPerfil();

    // Conservar estado de verificación anterior
    const anterior = obtenerPerfilActual(sesion.correo);

    perfil.verificado = anterior?.verificado || false;
    perfil.estado = esBorrador ? "borrador" : "completo";

    guardarPerfilActual(sesion.correo, perfil);

    // Actualizar nombre mostrado en la sesión
    sessionStorage.setItem(
        SESION_PERFIL_KEY,
        JSON.stringify({
            ...sesion,
            nombre: `${perfil.nombre} ${perfil.apellidos}`.trim()
        })
    );

    if (esBorrador) {
        mostrarMensajePerfil("Borrador guardado correctamente.");
    }

    return true;
};

// =====================================
// EDICIÓN DEL PERFIL
// =====================================

// Cargar los datos guardados en profile.html
const cargarEditarPerfil = () => {
    const sesion = obtenerSesionPerfil();

    if (!sesion) {
        window.location.href = "../auth/login.html";
        return;
    }

    const perfil = obtenerPerfilActual(sesion.correo);
    const usuarios = leerDatos(USUARIOS_PERFIL_KEY, []);
    const usuario = usuarios.find(
        (item) => item.correo === sesion.correo
    );

    // El perfil puede no haberse completado aún
    const datos = perfil || {
        nombre: usuario?.nombres || sesion.nombre.split(" ")[0],
        apellidos: usuario?.apellidos || "",
        institucion: "",
        ocupacion: "",
        acerca: "",
        distritos: "",
        presupuesto: ""
    };

    asignarCampo(formEditarPerfil, "nombre", datos.nombre);
    asignarCampo(formEditarPerfil, "apellidos", datos.apellidos);
    asignarCampo(formEditarPerfil, "correo", sesion.correo);
    asignarCampo(
        formEditarPerfil,
        "telefono",
        usuario?.telefono || ""
    );
    asignarCampo(formEditarPerfil, "universidad", datos.institucion);
    asignarCampo(formEditarPerfil, "carrera", datos.ocupacion);
    asignarCampo(formEditarPerfil, "acerca", datos.acerca);
    asignarCampo(formEditarPerfil, "distritos", datos.distritos);
    asignarCampo(formEditarPerfil, "presupuesto_maximo", datos.presupuesto);

    if (datos.presupuesto_minimo !== undefined) {
        asignarCampo(
            formEditarPerfil,
            "presupuesto_minimo",
            datos.presupuesto_minimo
        );
    }

    if (datos.fecha_mudanza !== undefined) {
        asignarCampo(
            formEditarPerfil,
            "fecha_mudanza",
            datos.fecha_mudanza
        );
    }

    if (datos.convivenciaEdicion) {
        asignarSeleccionados(
            formEditarPerfil,
            "convivencia",
            datos.convivenciaEdicion
        );
    }

    if (datos.perfil_visible !== undefined) {
        formEditarPerfil.elements.namedItem("perfil_visible").checked =
            datos.perfil_visible;
    }

    if (datos.solo_verificados !== undefined) {
        formEditarPerfil.elements.namedItem("solo_verificados").checked =
            datos.solo_verificados;
    }

    // Actualizar nombre y avatar del perfil
    const nombreCompleto = `${datos.nombre} ${datos.apellidos}`.trim();
    const iniciales = (
        datos.nombre.charAt(0) + datos.apellidos.charAt(0)
    ).toUpperCase();

    const nombreSidebar = document.querySelector(
        ".profile-settings__user strong"
    );

    if (nombreSidebar) nombreSidebar.textContent = nombreCompleto;

    document.querySelectorAll(".profile-settings__avatar")
        .forEach((avatar) => {
            const estado = avatar.querySelector(".profile-settings__status");
            avatar.textContent = iniciales || "SR";
            if (estado) avatar.appendChild(estado);
        });
};

// Guardar los cambios realizados en la pantalla Mi perfil
const guardarEditarPerfil = (event) => {
    event.preventDefault();

    if (!formEditarPerfil.reportValidity()) return;

    const sesion = obtenerSesionPerfil();
    if (!sesion) return;

    const anterior = obtenerPerfilActual(sesion.correo) || {};

    const perfil = {
        ...anterior,
        nombre: leerCampo(formEditarPerfil, "nombre"),
        apellidos: leerCampo(formEditarPerfil, "apellidos"),
        institucion: leerCampo(formEditarPerfil, "universidad"),
        ocupacion: leerCampo(formEditarPerfil, "carrera"),
        acerca: leerCampo(formEditarPerfil, "acerca"),
        distritos: leerCampo(formEditarPerfil, "distritos"),
        presupuesto: leerCampo(formEditarPerfil, "presupuesto_maximo"),
        presupuesto_minimo: leerCampo(
            formEditarPerfil,
            "presupuesto_minimo"
        ),
        fecha_mudanza: leerCampo(formEditarPerfil, "fecha_mudanza"),
        convivenciaEdicion: leerSeleccionados(
            formEditarPerfil,
            "convivencia"
        ),
        perfil_visible: formEditarPerfil.elements
            .namedItem("perfil_visible").checked,
        solo_verificados: formEditarPerfil.elements
            .namedItem("solo_verificados").checked,
        actualizado: new Date().toISOString()
    };

    guardarPerfilActual(sesion.correo, perfil);

    // Actualizar también el teléfono del usuario
    const usuarios = leerDatos(USUARIOS_PERFIL_KEY, []);
    const usuario = usuarios.find(
        (item) => item.correo === sesion.correo
    );

    if (usuario) {
        usuario.telefono = leerCampo(formEditarPerfil, "telefono");
        guardarDatos(USUARIOS_PERFIL_KEY, usuarios);
    }

    sessionStorage.setItem(
        SESION_PERFIL_KEY,
        JSON.stringify({
            ...sesion,
            nombre: `${perfil.nombre} ${perfil.apellidos}`.trim()
        })
    );

    const mensaje = document.querySelector("#mensaje-editar-perfil");

    if (mensaje) {
        mensaje.textContent = "Cambios guardados correctamente.";
        mensaje.hidden = false;
    }

    cargarEditarPerfil();
};

// =====================================
// EVENTOS
// =====================================

// Pantalla Crear perfil
if (formCrearPerfil) {
    cargarCrearPerfil();

    formCrearPerfil.addEventListener("submit", (event) => {
        event.preventDefault();

        if (guardarCrearPerfil(false)) {
            window.location.href = "verify-profile.html";
        }
    });

    const botonBorrador = document.querySelector("#guardar-borrador");

    if (botonBorrador) {
        botonBorrador.addEventListener("click", () => {
            guardarCrearPerfil(true);
        });
    }
}

// Pantalla Mi perfil
if (formEditarPerfil) {
    cargarEditarPerfil();

    formEditarPerfil.addEventListener("submit", guardarEditarPerfil);
}


/* =====================================
   SHAREROOM - VERIFICACIÓN TB4
   Estado de verificación de prueba
===================================== */

const verificationEmail = document.querySelector(
    "#verification-email"
);

const verificationStatus = document.querySelector(
    "#verification-status"
);

const verificationButton = document.querySelector(
    "#verification-button"
);

// Obtener sesión actual
const obtenerSesionVerificacion = () => {
    try {
        return JSON.parse(
            sessionStorage.getItem("shareroom_sesion") || "null"
        );
    } catch (error) {
        return null;
    }
};

// Mostrar estado guardado
const cargarVerificacion = () => {
    const sesion = obtenerSesionVerificacion();

    if (!sesion) {
        window.location.href = "login.html";
        return;
    }

    verificationEmail.textContent = sesion.correo;

    const perfiles = leerDatos("shareroom_perfiles", {});
    const perfil = perfiles[sesion.correo];

    if (perfil?.verificado) {
        verificationStatus.textContent =
            "Verificación de prueba completada";

        verificationStatus.classList.add(
            "verification-demo__status--complete"
        );

        verificationButton.disabled = true;
        verificationButton.textContent =
            "Verificación completada";
    } else {
        verificationStatus.textContent =
            "Verificación pendiente";
    }
};

// Actualizar la verificación del perfil
const completarVerificacion = () => {
    const sesion = obtenerSesionVerificacion();

    if (!sesion) return;

    const perfiles = leerDatos("shareroom_perfiles", {});
    const perfil = perfiles[sesion.correo];

    if (!perfil) {
        verificationStatus.textContent =
            "Primero debes completar tu perfil.";

        return;
    }

    // Este estado es solo una simulación
    perfiles[sesion.correo] = {
        ...perfil,
        verificado: true,
        tipoVerificacion: "demo",
        fechaVerificacion: new Date().toISOString()
    };

    guardarDatos("shareroom_perfiles", perfiles);

    // Actualizar interfaz
    verificationStatus.textContent =
        "Verificación de prueba completada";

    verificationStatus.classList.add(
        "verification-demo__status--complete"
    );

    verificationButton.disabled = true;
    verificationButton.textContent =
        "Verificación completada";
};

// Eventos
if (verificationButton) {
    verificationButton.addEventListener(
        "click",
        completarVerificacion
    );
}

if (verificationEmail) {
    cargarVerificacion();
}

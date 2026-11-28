
/* =====================================
   SHAREROOM - SESIÓN DE USUARIO TB4
===================================== */

// Obtener la sesión actual
const obtenerSesion = () => {
    try {
        return JSON.parse(
            sessionStorage.getItem("shareroom_sesion") || "null"
        );
    } catch (error) {
        return null;
    }
};

// Proteger las páginas del usuario autenticado
const comprobarSesion = () => {
    const sesion = obtenerSesion();

    if (!sesion || !sesion.correo) {
        window.location.replace("../auth/login.html");
        return null;
    }

    return sesion;
};

// Obtener iniciales del usuario
const obtenerIniciales = (nombreCompleto) => {
    const palabras = nombreCompleto.trim()
        .split(/\s+/)
        .filter(Boolean);

    if (palabras.length === 0) return "SR";

    return (
        palabras[0].charAt(0) +
        (palabras.length > 1
            ? palabras[1].charAt(0)
            : "")
    ).toUpperCase();
};

// Mostrar información del usuario
const mostrarUsuario = (sesion) => {
    const nombre = sesion.nombre || "Usuario";
    const primerNombre = nombre.split(" ")[0];

    // Saludo de home.html
    const saludo = document.querySelector(
        ".home-hero__greeting"
    );

    if (saludo) {
        saludo.textContent = "Hola, " + primerNombre;
    }

    // Avatar del encabezado
    document.querySelectorAll(
        ".member-header__avatar"
    ).forEach((avatar) => {
        avatar.textContent = obtenerIniciales(nombre);
    });
};

// Cerrar sesión
const cerrarSesion = () => {
    sessionStorage.removeItem("shareroom_sesion");

    window.location.replace("../auth/login.html");
};

// Inicializar
const sesionActual = comprobarSesion();

if (sesionActual) {
    mostrarUsuario(sesionActual);

    const botonSalir = document.querySelector(
        "#cerrar-sesion"
    );

    if (botonSalir) {
        botonSalir.addEventListener(
            "click",
            cerrarSesion
        );
    }
}

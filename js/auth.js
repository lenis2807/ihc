
/* =====================================
   SHAREROOM - AUTENTICACIÓN TB4
   Login y registro de demostración
===================================== */

// Claves de almacenamiento
const USUARIOS_KEY = "shareroom_usuarios";
const CREDENCIAL_KEY = "shareroom_credencial_demo";
const SESION_KEY = "shareroom_sesion";

// Usuario inicial de demostración
const usuarioDemo = {
    nombre: "Ana Valdez",
    correo: "demo@shareroom.pe",
    contrasena: "Demo1234"
};

// Formularios
const formLogin = document.querySelector("#formulario-login");
const formSignup = document.querySelector("#signup-form");

// =====================================
// FUNCIONES COMPARTIDAS
// =====================================

// Normalizar los correos electrónicos
const normalizarCorreo = (correo) => {
    return correo.trim().toLowerCase();
};

// Mostrar un mensaje debajo de un campo
const mostrarErrorCampo = (campo, mensaje) => {
    const contenedor = campo.closest(
        ".signup-field, .form-field"
    ) || campo.parentElement;

    let error = contenedor.querySelector(".field-error");

    if (!error) {
        error = document.createElement("span");
        error.className = "field-error";
        error.setAttribute("role", "alert");
        contenedor.appendChild(error);
    }

    error.textContent = mensaje;
    campo.setAttribute("aria-invalid", "true");
};

// Limpiar los errores del formulario
const limpiarErrores = (formulario) => {
    formulario.querySelectorAll(".field-error")
        .forEach((error) => error.remove());

    formulario.querySelectorAll("[aria-invalid]")
        .forEach((campo) => {
            campo.removeAttribute("aria-invalid");
        });
};

// =====================================
// REGISTRO
// =====================================

const registrarUsuario = (event) => {
    event.preventDefault();

    limpiarErrores(formSignup);

    // Utilizamos las validaciones del HTML
    if (!formSignup.checkValidity()) {
        formSignup.reportValidity();
        return;
    }

    // Obtenemos los valores ingresados
    const nombres = document.querySelector(
        "#signup-nombres"
    ).value.trim();

    const apellidos = document.querySelector(
        "#signup-apellidos"
    ).value.trim();

    const campoCorreo = document.querySelector(
        "#signup-correo"
    );

    const correo = normalizarCorreo(campoCorreo.value);

    const usuario = document.querySelector(
        "#signup-usuario"
    ).value.trim();

    const contrasena = document.querySelector(
        "#signup-clave"
    ).value;

    const edad = document.querySelector(
        "#signup-edad"
    ).value;

    const telefono = document.querySelector(
        "#signup-telefono"
    ).value.trim();

    // Verificar que los nombres no estén vacíos
    if (!nombres || !apellidos || !usuario) {
        const campo = document.querySelector(
            "#signup-nombres"
        );

        mostrarErrorCampo(
            campo,
            "Completa los datos obligatorios."
        );

        return;
    }

    // Leer usuarios existentes
    const usuarios = leerDatos(USUARIOS_KEY, []);

    // Verificar si el correo ya existe
    const correoDuplicado = usuarios.some(
        (item) => item.correo === correo
    ) || correo === usuarioDemo.correo;

    if (correoDuplicado) {
        mostrarErrorCampo(
            campoCorreo,
            "Este correo ya está en uso."
        );

        campoCorreo.focus();
        return;
    }

    // Crear usuario de demostración
    const nuevoUsuario = {
        id: Date.now(),
        nombres: nombres,
        apellidos: apellidos,
        correo: correo,
        usuario: usuario,
        edad: edad,
        telefono: telefono,
        verificado: false
    };

    // Guardar datos no sensibles
    usuarios.push(nuevoUsuario);
    guardarDatos(USUARIOS_KEY, usuarios);

    // Credencial temporal SOLO para la prueba
    sessionStorage.setItem(
        CREDENCIAL_KEY,
        JSON.stringify({
            correo: correo,
            contrasena: contrasena
        })
    );

    // Crear sesión de demostración
    sessionStorage.setItem(
        SESION_KEY,
        JSON.stringify({
            id: nuevoUsuario.id,
            nombre: nombres + " " + apellidos,
            correo: correo
        })
    );

    // Ir a completar el perfil
    window.location.href = "profile-create.html";
};

// =====================================
// INICIO DE SESIÓN
// =====================================

const iniciarSesion = (event) => {
    event.preventDefault();

    const correo = normalizarCorreo(
        document.querySelector("#correo").value
    );

    const contrasena = document.querySelector(
        "#contrasena"
    ).value;

    const mensajeError = document.querySelector(
        "#mensaje-error"
    );

    mensajeError.hidden = true;

    // Obtener credencial de demostración
    const credencialGuardada = JSON.parse(
        sessionStorage.getItem(CREDENCIAL_KEY) || "null"
    );

    const usuarios = leerDatos(USUARIOS_KEY, []);

    let usuarioEncontrado = null;

    // Comprobar el usuario inicial
    if (correo === usuarioDemo.correo &&
        contrasena === usuarioDemo.contrasena) {

        usuarioEncontrado = {
            nombre: usuarioDemo.nombre,
            correo: usuarioDemo.correo
        };
    }

    // Comprobar usuario registrado en esta sesión
    if (credencialGuardada &&
        correo === credencialGuardada.correo &&
        contrasena === credencialGuardada.contrasena) {

        const usuario = usuarios.find(
            (item) => item.correo === correo
        );

        if (usuario) {
            usuarioEncontrado = {
                id: usuario.id,
                nombre: usuario.nombres + " " +
                        usuario.apellidos,
                correo: usuario.correo
            };
        }
    }

    if (usuarioEncontrado) {

        // Guardar sesión
        sessionStorage.setItem(
            SESION_KEY,
            JSON.stringify(usuarioEncontrado)
        );

        // Inicio correcto
        window.location.href = "../account/home.html";

    } else {

        // Inicio inválido
        mensajeError.textContent =
            "Correo o contraseña incorrectos.";

        mensajeError.hidden = false;
    }
};

// =====================================
// EVENTOS
// =====================================

// Ejecutar solamente en Login
if (formLogin) {
    formLogin.addEventListener("submit", iniciarSesion);
}

// Ejecutar solamente en Signup
if (formSignup) {
    formSignup.addEventListener("submit", registrarUsuario);
}


/* =====================================
   SHAREROOM - RECUPERACIÓN TB4
   Simulación sin envío real de correos
===================================== */

const recoveryForm = document.querySelector("#recovery-form");
const recoveryRequest = document.querySelector("#recovery-request");
const recoveryConfirmation = document.querySelector(
    "#recovery-confirmation"
);
const recoveryEmail = document.querySelector("#recovery-email");
const recoveryError = document.querySelector("#recovery-error");

const mostrarErrorRecovery = (mensaje) => {
    recoveryError.textContent = mensaje;
    recoveryError.hidden = false;
    recoveryEmail.setAttribute("aria-invalid", "true");
};

const limpiarErrorRecovery = () => {
    recoveryError.textContent = "";
    recoveryError.hidden = true;
    recoveryEmail.removeAttribute("aria-invalid");
};

const solicitarRecuperacion = (event) => {
    event.preventDefault();
    limpiarErrorRecovery();

    const correo = recoveryEmail.value.trim().toLowerCase();

    // Validación de campo obligatorio
    if (!correo) {
        mostrarErrorRecovery("Este campo es obligatorio.");
        recoveryEmail.focus();
        return;
    }

    // Validación del formato del correo
    if (!recoveryEmail.validity.valid) {
        mostrarErrorRecovery(
            "Ingresa un correo electrónico válido."
        );
        recoveryEmail.focus();
        return;
    }

    // Obtener los usuarios registrados
    const usuarios = leerDatos("shareroom_usuarios", []);

    const usuarioRegistrado = usuarios.some(
        (usuario) => usuario.correo === correo
    );

    // Cuenta inicial de demostración
    const esDemo = correo === "demo@shareroom.pe";

    if (!usuarioRegistrado && !esDemo) {
        mostrarErrorRecovery(
            "El correo no está registrado en esta demostración."
        );
        return;
    }

    // Guardar solamente una solicitud de prueba
    sessionStorage.setItem(
        "shareroom_recuperacion",
        JSON.stringify({
            correo: correo,
            fecha: new Date().toISOString(),
            estado: "simulada"
        })
    );

    // Mostrar el correo ingresado
    document.querySelector(
        "#recovery-confirmation-email"
    ).textContent = correo;

    // Cambiar entre los estados de la pantalla
    recoveryRequest.hidden = true;
    recoveryConfirmation.hidden = false;
};

// Evento del formulario
if (recoveryForm) {
    recoveryForm.addEventListener(
        "submit",
        solicitarRecuperacion
    );

    recoveryEmail.addEventListener(
        "input",
        limpiarErrorRecovery
    );
}

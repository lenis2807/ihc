
/* =====================================
   SHAREROOM - NOTIFICACIONES TB4
   Filtros, lectura y preferencias
===================================== */

const sesionNotificaciones = (() => {
    try {
        return JSON.parse(
            sessionStorage.getItem("shareroom_sesion") || "null"
        );
    } catch (error) {
        return null;
    }
})();

if (sesionNotificaciones?.correo) {

    // Datos y elementos
    const tarjetas = Array.from(
        document.querySelectorAll(".notification-card")
    );

    const filtros = document.querySelectorAll(
        ".notifications__filters button"
    );

    const botonTodas = document.querySelector("#marcar-todas");

    const preferencias = Array.from(
        document.querySelectorAll(
            ".notification-preference input"
        )
    );

    const claveLectura =
        "shareroom_notificaciones_" +
        sesionNotificaciones.correo;

    const clavePreferencias =
        "shareroom_preferencias_" +
        sesionNotificaciones.correo;

    
    // Categorías de las notificaciones
    const categorias = [
        "mensajes",
        "publicaciones",
        "publicaciones",
        "publicaciones",
        "sistema"
    ];

    // Asignar una categoría a cada tarjeta
    tarjetas.forEach((tarjeta, indice) => {
        tarjeta.dataset.category = categorias[indice];
    });


    // Cargar estados de lectura
    const estadosGuardados = JSON.parse(
        localStorage.getItem(claveLectura) || "null"
    );

    const estados = Array.isArray(estadosGuardados) &&
        estadosGuardados.length === tarjetas.length
            ? estadosGuardados
            : [false, false, false, true, true];

    let filtroActivo = "todas";

    // Guardar los estados
    const guardarLectura = () => {
        localStorage.setItem(
            claveLectura,
            JSON.stringify(estados)
        );
    };

    // Actualizar apariencia y contadores
    const actualizarNotificaciones = () => {

        tarjetas.forEach((tarjeta, indice) => {
            const categoria = categorias[indice];
            const leida = estados[indice];

            
            // Filtrar según la categoría seleccionada
            const mostrar = filtroActivo === "todas" ||
                tarjeta.dataset.category === filtroActivo;

            tarjeta.hidden = !mostrar;


            tarjeta.classList.toggle(
                "notification-card--unread",
                !leida
            );

            const indicador = tarjeta.querySelector(
                ".notification-card__unread"
            );

            if (indicador) {
                indicador.setAttribute(
                    "aria-label",
                    leida ? "Leída" : "No leída"
                );
            }

            const boton = tarjeta.querySelector(
                ".notification-card__mark"
            );

            if (boton) {
                boton.textContent = leida
                    ? "Marcar como no leída"
                    : "Marcar como leída";

                boton.setAttribute(
                    "aria-label",
                    boton.textContent
                );
            }
        });

        // Actualizar contadores de los filtros
        filtros.forEach((boton) => {
            const categoria = boton.dataset.filter;

            const cantidad = categoria === "todas"
                ? tarjetas.length
                : categorias.filter(
                    (valor) => valor === categoria
                ).length;

            boton.querySelector("span").textContent =
                cantidad;
        });

        // Ocultar títulos de fechas sin tarjetas visibles
        document.querySelectorAll(
            ".notifications__date"
        ).forEach((fecha) => {

            let siguiente = fecha.nextElementSibling;
            let hayVisibles = false;

            while (siguiente &&
                   !siguiente.classList.contains(
                       "notifications__date"
                   )) {

                if (siguiente.classList.contains(
                    "notification-card"
                ) && !siguiente.hidden) {
                    hayVisibles = true;
                }

                siguiente = siguiente.nextElementSibling;
            }

            fecha.hidden = !hayVisibles;
        });

        if (botonTodas) {
            botonTodas.disabled = estados.every(Boolean);
        }
    };

    // Crear un botón para cada notificación
    tarjetas.forEach((tarjeta, indice) => {
        const cuerpo = tarjeta.querySelector(
            ".notification-card__body"
        );

        if (!cuerpo) return;

        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "notification-card__mark";

        boton.addEventListener("click", () => {
            estados[indice] = !estados[indice];

            guardarLectura();
            actualizarNotificaciones();
        });

        cuerpo.appendChild(boton);
    });

    // Cambiar de filtro
    filtros.forEach((boton) => {
        boton.addEventListener("click", () => {
            filtroActivo = boton.dataset.filter;

            filtros.forEach((elemento) => {
                const activo = elemento === boton;

                elemento.classList.toggle(
                    "is-active",
                    activo
                );

                elemento.setAttribute(
                    "aria-pressed",
                    String(activo)
                );
            });

            actualizarNotificaciones();
        });
    });

    // Marcar todas como leídas
    if (botonTodas) {
        botonTodas.addEventListener("click", () => {
            estados.fill(true);

            guardarLectura();
            actualizarNotificaciones();
        });
    }

    // Cargar preferencias guardadas
    const preferenciasGuardadas = JSON.parse(
        localStorage.getItem(clavePreferencias) || "null"
    );

    if (Array.isArray(preferenciasGuardadas)) {
        preferencias.forEach((campo, indice) => {
            campo.checked = Boolean(
                preferenciasGuardadas[indice]
            );
        });
    }

    // Guardar cambios de preferencias
    preferencias.forEach((campo) => {
        campo.addEventListener("change", () => {
            const valores = preferencias.map(
                (item) => item.checked
            );

            localStorage.setItem(
                clavePreferencias,
                JSON.stringify(valores)
            );
        });
    });

    // Inicializar
    actualizarNotificaciones();
}

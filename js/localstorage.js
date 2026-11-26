
/* =====================================
   SHAREROOM - ALMACENAMIENTO
===================================== */

// Guarda datos en el navegador.
const guardarDatos = (clave, datos) => {
    localStorage.setItem(clave, JSON.stringify(datos));
};

// Lee datos guardados o devuelve un valor inicial.
const leerDatos = (clave, datosIniciales = []) => {
    const texto = localStorage.getItem(clave);

    if (!texto) {
        return datosIniciales;
    }

    try {
        return JSON.parse(texto);
    } catch (error) {
        console.error("Error al leer los datos:", error);
        return datosIniciales;
    }
};

// Elimina un dato almacenado.
const eliminarDatos = (clave) => {
    localStorage.removeItem(clave);
};

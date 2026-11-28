// ===== Elementos =====
const ventana = document.querySelector("#ventana-chat");
const mensajes = document.querySelector("#mensajes");
const campo = document.querySelector("#texto-chat");
const botonMicrofono = document.querySelector("#boton-microfono");


// ===== Datos =====
// La clave NO está aquí: la agrega la función de Netlify desde el archivo .env
const urlApi = "/.netlify/functions/chat";
const modelo = "gemini-2.5-flash";
const idioma = "es-MX"; // idioma de la voz y del micrófono: "es-MX", "es-ES", "es-PE"...

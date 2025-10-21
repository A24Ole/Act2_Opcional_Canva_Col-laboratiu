<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { communicationManager } from "../services/communicationManager";

const message = ref("");
const messages = ref([]); // reactive array for messages

const sendMessage = () => {
  if (message.value.trim()) {
    communicationManager.emit("chat message", message.value);
    message.value = "";
  }
};

const handleUserConnected = (msg) => {
  console.log(msg);
};

const handleChatMessage = (msg) => {
  messages.value.push(msg);
};

const handleUserDisconnected = (id) => {
  console.log(`User disconnected: ${id}`);
};

onMounted(() => {
  communicationManager.on("user connected", handleUserConnected); // fixed typo
  communicationManager.on("chat message", handleChatMessage);
  communicationManager.on("user disconnected", handleUserDisconnected);
});

onUnmounted(() => {
  // Clean up listeners to avoid duplicates if the component unmounts/mounts
  communicationManager.off("user connected", handleUserConnected);
  communicationManager.off("chat message", handleChatMessage);
  communicationManager.off("user disconnected", handleUserDisconnected);
});
</script>

<template>
  <div class="chat-container">
    <ul id="messages">
      <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
    </ul>
    <form id="form" @submit.prevent="sendMessage">
      <input id="input" v-model="message" placeholder="Escribe tu mensaje..." />
      <button type="submit">Enviar</button>
    </form>
  </div>
</template>


<style scoped>

/* ------------------------------------------- */
/* 1. CONTENEDOR PRINCIPAL (BASE OSCURA)        */
/* ------------------------------------------- */
.chat-container {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 400px;
    max-width: 90%;
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-height: 100%;
    /* Fondo principal del chat container */
    background: #1e1e1e; /* Fondo oscuro */
    color: #f0f0f0; /* Color de texto claro por defecto */
    box-shadow: -4px 0 10px rgba(0, 0, 0, 0.5); /* Sombra para destacarlo */
}

/* ------------------------------------------- */
/* 2. BARRA DE ENTRADA (FORMULARIO)            */
/* ------------------------------------------- */
#form {
    /* Mantenemos el efecto de transparencia, pero con un color más oscuro */
    background: rgba(0, 0, 0, 0.4);
    padding: 0.25rem;
    display: flex;
    height: 3rem;
    box-sizing: border-box;
    backdrop-filter: blur(10px);
    flex-shrink: 0;
    width: 100%;
    /* Añadimos un borde superior sutil */
    border-top: 1px solid #333;
}
#input {
    border: none;
    padding: 0 1rem;
    flex-grow: 1;
    border-radius: 2rem;
    margin: 0.25rem;
    /* Colores del input en modo oscuro */
    background: #333; /* Fondo oscuro del input */
    color: #f0f0f0; /* Texto del input claro */
}
#input::placeholder {
    color: #aaa; /* Color del placeholder */
}
#input:focus { outline: none; }

#form > button {
    /* Color de fondo para el botón (ej. un azul/morado oscuro) */
    background: #5a57a5;
    border: none;
    padding: 0 1rem;
    margin: 0.25rem;
    border-radius: 3px;
    outline: none;
    color: #fff; /* Texto del botón blanco */
    font-weight: bold;
}

/* ------------------------------------------- */
/* 3. LISTA Y MENSAJES (UL Y LI)              */
/* ------------------------------------------- */
#messages {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow-y: auto;
    flex-grow: 1;
    padding-bottom: 0.5rem;
    /* Barra de scroll oculta o estilizada (opcional) */
}

#messages > li {
    padding: 0.5rem 1rem;
    text-align: right; /* Mantenemos la alineación a la derecha */
}

/* Fondo para mensajes "impares" (para contraste en el tema oscuro) */
#messages > li:nth-child(odd) {
    background: #252526; /* Un gris ligeramente más claro que el fondo principal */
}

/* ------------------------------------------- */
/* 4. ESTILOS BODY (Para no afectar el resto)  */
/* ------------------------------------------- */
body {
    margin: 0;
    /* Eliminamos el padding si el chat ocupa toda la altura */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
</style>

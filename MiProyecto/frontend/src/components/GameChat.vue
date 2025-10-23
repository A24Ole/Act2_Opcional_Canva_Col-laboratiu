<script setup>
import { ref, onMounted, onUnmounted, defineProps } from "vue";
import { communicationManager } from "../services/communicationManager";

const props = defineProps({
  playerName: {
    type: String,
    required: true
  },
  roomCode: {
    type: String,
    required: true
  }
});

const message = ref("");
const messages = ref([]); 

const sendMessage = () => {
  if (message.value.trim()) {
    const chatMessage = {
      sender: props.playerName,
      text: message.value
    };
    // Añade el mensaje localmente para que se muestre al instante
    messages.value.push(chatMessage);
    
    // Envía el mensaje al servidor
    communicationManager.emit("chat message", chatMessage);
    
    // Limpia el input
    message.value = "";
  }
};

const handleChatMessage = (msg) => {
  messages.value.push(msg);
};

onMounted(() => {
  communicationManager.on("chat message", handleChatMessage);
});

onUnmounted(() => {
  communicationManager.off("chat message", handleChatMessage);
});
</script>

<template>
  <div class="chat-container">
    <ul id="messages">
      <li v-for="(msg, index) in messages" :key="index">
        <strong>{{ msg.sender }}:</strong> {{ msg.text }}
      </li>
    </ul>
    <form id="form" @submit.prevent="sendMessage">
      <input id="input" v-model="message" placeholder="Escribe tu mensaje..." />
      <button type="submit">Enviar</button>
    </form>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  background-color: #2f343d;
  border: 1px solid #61dafb;
  border-radius: 8px;
  padding: 15px;
  width: 350px; /* Ancho fijo para el chat */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  font-family: Arial, sans-serif;
  color: white;
}

#messages {
  list-style-type: none;
  margin: 0;
  padding: 0 10px;
  overflow-y: auto;
  flex-grow: 1;
  margin-bottom: 15px;
  min-height: 0; /* Solución para el scroll en flexbox */
}

#messages > li {
  padding: 8px 12px;
  border-radius: 5px;
  margin-bottom: 5px;
}

#messages > li:nth-child(odd) {
  background: #282c34; /* Fondo oscuro para mensajes impares */
}

#messages strong {
    color: #61dafb; /* Color acento para el nombre */
}

#form {
  display: flex;
  gap: 10px;
}

#input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #555;
  background-color: #282c34;
  color: white;
  font-size: 1rem;
  flex-grow: 1;
}

#input::placeholder {
  color: #888;
}

#form > button {
  background-color: #61dafb;
  color: #282c34;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

#form > button:hover {
  background-color: #21a1f1;
}
</style>
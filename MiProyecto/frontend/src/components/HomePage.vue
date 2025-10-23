<script setup>
import { ref } from 'vue';

defineProps({
  playerName: {
    type: String,
    required: true
  }
});

// --- ¡NUEVO! ---
// Define los eventos que este componente puede "emitir" hacia su padre
const emit = defineEmits(['joinRoom', 'createRoom']);

// Variable reactiva para guardar el ID de la sala que el usuario escribe
const roomId = ref('');

// --- ¡NUEVO! ---
// Función para unirse a una sala
function handleJoinRoom() {
  if (roomId.value.trim()) {
    // Emite el evento 'joinRoom' con el ID de la sala
    emit('joinRoom', roomId.value.trim());
  } else {
    alert('Por favor, ingresa un ID de sala para unirte.');
  }
}

// --- ¡NUEVO! ---
// Función para crear una sala
function handleCreateRoom() {
  // Emite el evento 'createRoom'. El padre se encargará de la lógica.
  // Podrías pasar roomId.value si quisieras crear una sala con nombre,
  // pero un "create" simple es más común.
  emit('createRoom');
}

</script>

<template>
  <div class="homepage-container">
    <h1>¡Bienvenido, {{ playerName }}!</h1>

    <div class="room-actions">
      <div class="action-card">
        <h2>Crear Sala</h2>
        <p>Crea una sala de dibujo nueva e invita a tus amigos.</p>
        <button @click="handleCreateRoom">Crear Nueva Sala</button>
      </div>

      <div class="action-card">
        <h2>Unirse a Sala</h2>
        <p>Ingresa el ID de la sala a la que quieres unirte.</p>
        <input 
          v-model="roomId" 
          type="text" 
          placeholder="Ingresa ID de la sala" 
          @keyup.enter="handleJoinRoom"
        />
        <button @click="handleJoinRoom">Unirse a la Sala</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- ¡MODIFICADO! --- */
.homepage-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #282c34; /* Fondo oscuro (del canvas) */
  color: white;
  font-family: Arial, sans-serif;
  padding: 20px;
  box-sizing: border-box;
}

h1 {
  color: #61dafb; /* Color acento (del canvas) */
  font-size: 2.5rem;
  margin-bottom: 50px;
  text-shadow: 0 0 10px rgba(97, 218, 251, 0.5);
}

.room-actions {
  display: flex;
  flex-wrap: wrap; /* Para que se adapte a pantallas pequeñas */
  justify-content: center;
  gap: 30px;
}

.action-card {
  background-color: #2f343d; /* Un poco más claro que el fondo */
  border: 1px solid #61dafb;
  border-radius: 8px;
  padding: 25px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.6);
}

.action-card h2 {
  margin-top: 0;
  color: #61dafb;
}

.action-card p {
  font-size: 0.95rem;
  color: #ccc;
  text-align: center;
  min-height: 40px; /* Ayuda a alinear las tarjetas */
  margin-bottom: 20px;
}

input[type="text"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #555;
  background-color: #282c34;
  color: white;
  font-size: 1rem;
  box-sizing: border-box; /* Para que el padding no afecte el ancho */
}

input[type="text"]::placeholder {
  color: #888;
}

button {
  background-color: #61dafb;
  color: #282c34;
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
  width: 100%;
}

button:hover {
  background-color: #21a1f1;
}
</style>
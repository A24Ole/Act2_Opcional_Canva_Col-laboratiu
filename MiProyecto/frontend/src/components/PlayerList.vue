<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { communicationManager } from '../services/communicationManager';

// --- Estado ---
// Esta será la lista de IDs de los jugadores en la sala
const players = ref([]);
// Guardará nuestro propio ID para poder destacarlo
const myId = ref(null);

// --- Manejadores de Eventos ---

// 1. Evento para recibir la lista completa (debe ser enviado por el servidor al unirte)
const onPlayerList = (playerIds) => {
  console.log("Recibida lista de jugadores:", playerIds);
  players.value = playerIds;
  // Asumimos que nuestro ID está disponible a través del manager
  myId.value = communicationManager.getId(); 
};

// 2. Evento cuando un *nuevo* jugador se une
const onPlayerJoin = (playerId) => {
  console.log("Jugador se unió:", playerId);
  // Añadir solo si no está ya en la lista
  if (!players.value.includes(playerId)) {
    players.value.push(playerId);
  }
};

// 3. Evento cuando un jugador se va
const onPlayerLeave = (playerId) => {
  console.log("Jugador se fue:", playerId);
  players.value = players.value.filter(id => id !== playerId);
};

// --- Ciclo de Vida ---
onMounted(() => {
  // Escuchamos los eventos del communicationManager
  
  // 'currentPlayerList' -> Lo debe emitir el servidor SÓLO a ti cuando te unes
  communicationManager.on('currentPlayerList', onPlayerList);
  
  // 'userJoinedCanvas' -> Lo emite el servidor a TODOS cuando alguien se une
  communicationManager.on('userJoinedCanvas', onPlayerJoin);
  
  // 'userLeftCanvas' -> Lo emite el servidor a TODOS cuando alguien se va
  communicationManager.on('userLeftCanvas', onPlayerLeave);
});

onUnmounted(() => {
  // Es crucial limpiar los listeners para evitar fugas de memoria
  // Tu communicationManager necesita un método .off() para esto
  communicationManager.off('currentPlayerList', onPlayerList);
  communicationManager.off('userJoinedCanvas', onPlayerJoin);
  communicationManager.off('userLeftCanvas', onPlayerLeave);
});
</script>

<template>
  <div class="player-list-container">
    <h2>Jugadores ({{ players.length }})</h2>
    <ul>
      <li v-if="players.length === 0" class="empty-list">
        Nadie conectado.
      </li>
      
      <li 
        v-for="player in players" 
        :key="player" 
        :class="{ 'is-self': player === myId }"
      >
        {{ player }}
        
        <span v-if="player === myId"> (Tú)</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.player-list-container {
  width: 250px; /* Ancho del contenedor */
  height: 80vh; /* Misma altura que el canvas */
  position: fixed;
  bottom: 0;
  /* Posicionado a la derecha del canvas (80vw) */
  left: 80vw; 
  background-color: #2f343d;
  color: #f0f0f0;
  border-left: 2px solid #61dafb;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.5);
  padding: 15px;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  overflow-y: auto; /* Para scroll si hay muchos jugadores */
}

h2 {
  font-size: 1.3rem;
  color: #61dafb;
  border-bottom: 1px solid #61dafb;
  padding-bottom: 10px;
  margin-top: 0;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 10px 5px;
  border-bottom: 1px solid #444;
  font-size: 0.9rem;
  
  /* Para que los IDs largos no se salgan */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

li:last-child {
  border-bottom: none;
}

.empty-list {
  font-style: italic;
  color: #888;
}

/* Estilo especial para tu propio ID */
li.is-self {
  font-weight: bold;
  color: #ffffff;
  background-color: rgba(97, 218, 251, 0.2);
  border-radius: 4px;
}
</style>
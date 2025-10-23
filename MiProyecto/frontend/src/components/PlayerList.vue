<script setup>
import { ref, onMounted, onUnmounted, defineProps } from 'vue';
import { communicationManager } from '../services/communicationManager';

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

const players = ref([]);

const onPlayerList = (playerNames) => {
  players.value = playerNames;
};

onMounted(() => {
  communicationManager.on('currentPlayerList', onPlayerList);
});

onUnmounted(() => {
  communicationManager.off('currentPlayerList', onPlayerList);
});
</script>

<template>
  <div class="player-list-container">
    <h2>Jugadores ({{ players.length }})</h2>
    <ul>
      <li v-if="players.length === 0" class="empty-list">
        Nadie conectado.
      </li>
      <li v-for="player in players" :key="player" :class="{ 'is-self': player === playerName }">
        {{ player }}
        <span v-if="player === playerName"> (Tú)</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.player-list-container {
  width: 250px; /* Ancho fijo */
  background-color: #2f343d;
  color: #f0f0f0;
  border: 1px solid #61dafb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  padding: 15px;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
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

li.is-self {
  font-weight: bold;
  color: #ffffff;
  background-color: rgba(97, 218, 251, 0.2);
  border-radius: 4px;
}
</style>

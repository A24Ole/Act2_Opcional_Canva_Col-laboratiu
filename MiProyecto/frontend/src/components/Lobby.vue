<script setup>
import { defineProps } from 'vue';
import GameChat from './GameChat.vue';
import Canva from './Canva.vue';
import PlayerList from './PlayerList.vue';

defineProps({
  playerName: {
    type: String,
    required: true
  },
  roomCode: {
    type: String,
    required: true
  }
});
</script>

<template>
  <div class="lobby-container">
    <div class="header">
      <h2>Bienvenido a la sala, {{ playerName }}!</h2>
      <h3>Código de la sala: <strong>{{ roomCode }}</strong></h3>
    </div>
    <div class="main-container">
      <PlayerList :playerName="playerName" :roomCode="roomCode" />
      <Canva :playerName="playerName" :roomCode="roomCode" />
      <GameChat :playerName="playerName" :roomCode="roomCode" />
    </div>
  </div>
</template>

<style scoped>
.lobby-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh; /* Altura fija para evitar scroll */
  overflow: hidden; /* Oculta cualquier desbordamiento */
  background-color: #282c34;
  color: white;
  font-family: Arial, sans-serif;
  padding: 20px;
  box-sizing: border-box;
}

.header {
  text-align: center;
  margin-bottom: 20px; /* Reducir margen */
  flex-shrink: 0; /* Evita que el header se encoja */
}

.main-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 1600px;
  flex-grow: 1; /* Ocupa el espacio vertical restante */
  align-items: stretch; /* Estira los hijos para que tengan la misma altura */
  min-height: 0; /* Permite que el contenedor se encoja si es necesario */
}
</style>

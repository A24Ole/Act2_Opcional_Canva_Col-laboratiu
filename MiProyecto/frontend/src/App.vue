<script setup>
import { ref } from 'vue';
import NameBegin from './components/NameBegin.vue';
import HomePage from './components/HomePage.vue';
import Lobby from './components/Lobby.vue';

const currentView = ref('NameBegin');
const playerName = ref('');
const roomCode = ref('');

function handleNameSubmitted(name) {
  playerName.value = name;
  currentView.value = 'HomePage';
}

function handleCreateRoom() {
  roomCode.value = Math.random().toString(36).substring(2, 8);
  currentView.value = 'Lobby';
}

function handleJoinRoom(code) {
  roomCode.value = code;
  currentView.value = 'Lobby';
}
</script>

<template>
  <div id="app">
    <NameBegin v-if="currentView === 'NameBegin'" @name-submitted="handleNameSubmitted" />
    <HomePage v-else-if="currentView === 'HomePage'" @create-room="handleCreateRoom" @join-room="handleJoinRoom" />
    <Lobby v-else-if="currentView === 'Lobby'" :playerName="playerName" :roomCode="roomCode" />
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
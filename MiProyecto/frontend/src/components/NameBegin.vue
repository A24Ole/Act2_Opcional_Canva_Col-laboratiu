<script setup>
import { ref } from 'vue';

const playerName = ref('');
const emit = defineEmits(['name-submitted']);

function startGame() {
  if (playerName.value.trim()) {
    emit('name-submitted', playerName.value);
  }
}
</script>

<template>
  <form @submit.prevent="startGame">
    <label for="name">Introduce tu nombre:</label>
    <input type="text" id="name" v-model="playerName" required>
    <button type="submit">Empezar</button>
  </form>
</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: blue;
  margin: 0;
  padding: 20px;
}
</style>

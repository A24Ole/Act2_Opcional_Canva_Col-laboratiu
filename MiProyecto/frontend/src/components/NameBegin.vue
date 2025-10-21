<script setup>
import { ref } from 'vue';

import HomePage from '@/components/HomePage.vue';

const showHomePage = ref(false);

const playerName = ref('');

function startGame() {
    console.log(`Se unio el jugador: ${playerName.value}`);
    showHomePage.value = true;
}
</script>

<template>
        <form v-if="!showHomePage" @submit.prevent="startGame">
            <label for="name">Introduce tu nombre:</label>
            <input type="text" id="name" v-model="playerName" required>
            <button type="submit">Empezar</button>
        </form>
        <HomePage v-if="showHomePage" :playerName="playerName"/>
</template>

<style scoped>
body {
    font-family: Arial, sans-serif;
    background-color: blue;
    margin: 0;
    padding: 20px;
}
</style>
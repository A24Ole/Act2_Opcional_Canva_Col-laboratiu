<script setup>
import { ref } from 'vue';


import NameBegin from './components/NameBegin.vue'; 
import GameChat from './components/GameChat.vue';
import Canva from './components/Canva.vue';
import PlayerList from './components/PlayerList.vue';

</script>

<template>
  <div id="app">
    <GameChat />
    <Canva />
  </div>
</template>

<style scoped>

</style>

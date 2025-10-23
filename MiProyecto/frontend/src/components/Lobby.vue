<script setup>
import { ref } from 'vue';

import GameChat from './GameChat.vue';
import Canva from './Canva.vue';
import PlayerList from './PlayerList.vue';

</script>

<template>
    <div>
        <h2>Lobby Component</h2>
        <PlayerList />
        <GameChat />
        <Canva />
    </div>
</template>
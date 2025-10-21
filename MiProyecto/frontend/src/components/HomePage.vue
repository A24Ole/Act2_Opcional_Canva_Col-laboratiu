<script setup>
import { ref } from 'vue';

defineProps({
  playerName: {
    type: String,
    required: true
  }
});

</script>

<template>
    <div>
        <h1>Welcome to the HomePage, {{ playerName }}!</h1>
    </div>
</template>
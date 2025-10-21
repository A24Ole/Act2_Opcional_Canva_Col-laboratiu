<script setup>
import { ref, onMounted } from "vue";
import { communicationManager } from "../services/communicationManager";

onMounted(() => {
    // Evento "user connected" del servidor
    communicationManager.on("user conected", (msg) => {
        console.log(msg);
    });
    // Evento "user disconnected" del servidor
    communicationManager.on("user disconnected", (msg) => {
        console.log(msg);
    });
});

</script>


<template>
    <ul id="messages"></ul>
    <form id="form" action="">
        <input id="input" autocomplete="off" /><button>Send</button>
    </form>
</template>

<style scoped>
    body { margin: 0; padding-bottom: 3rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }

    #form {
        background: rgba(0, 0, 0, 0.15);
        padding: 0.25rem;
        position: fixed;
        bottom: 0;
        right: 0;
        width: 400px; /* O el ancho que prefieras */
        display: flex;
        height: 3rem;
        box-sizing: border-box;
        backdrop-filter: blur(10px);
        /* left: 0;  <-- Elimina esta línea */
    }
    #input { border: none; padding: 0 1rem; flex-grow: 1; border-radius: 2rem; margin: 0.25rem; }
    #input:focus { outline: none; }
    #form > button { background: #333; border: none; padding: 0 1rem; margin: 0.25rem; border-radius: 3px; outline: none; color: #fff; }

    #messages { list-style-type: none; margin: 0; padding: 0; }
    #messages > li { padding: 0.5rem 1rem; }
    #messages > li:nth-child(odd) { background: #efefef; }
</style>
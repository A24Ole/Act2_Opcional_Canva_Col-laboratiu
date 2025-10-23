<script setup>
import { ref, onMounted, onUnmounted, defineProps } from "vue";
import { communicationManager } from "../services/communicationManager";

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

const canvas = ref(null);
const context = ref(null);
const isDrawing = ref(false);

const setupCanvas = () => {
  if (!canvas.value) return;
  context.value = canvas.value.getContext("2d");

  const currentStrokeStyle = context.value.strokeStyle;
  const currentLineWidth = context.value.lineWidth;
  const currentLineCap = context.value.lineCap;

  canvas.value.width = canvas.value.offsetWidth;
  canvas.value.height = canvas.value.offsetHeight;
  
  context.value.strokeStyle = currentStrokeStyle || "black";
  context.value.lineWidth = currentLineWidth || 2;
  context.value.lineCap = currentLineCap || "round";
};

const startDrawing = (event) => {
  const rect = canvas.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  context.value.beginPath();
  context.value.moveTo(x, y);
  isDrawing.value = true;
  communicationManager.emit("startStroke", { x, y, room: props.roomCode });
};

const draw = (event) => {
  if (!isDrawing.value) return;

  const rect = canvas.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  context.value.lineTo(x, y);
  context.value.stroke(); 
  communicationManager.emit("drawing", { x, y, room: props.roomCode });
};

const stopDrawing = () => {
  if (!isDrawing.value) return;
  isDrawing.value = false;
};

const performLocalClear = () => {
  if (!context.value) return;
  context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
  context.value.beginPath();
};

const clearCanvas = () => {
  communicationManager.emit("clearCanvas", { room: props.roomCode });
};

onMounted(() => {
  setupCanvas();
  window.addEventListener("resize", setupCanvas);

  communicationManager.emit("joinCanvas", { room: props.roomCode, playerName: props.playerName });

  communicationManager.on("initialCanvasState", (history) => {
    performLocalClear();
    if (!context.value || !Array.isArray(history)) return;

    history.forEach(action => {
      if (action.type === "startStroke") {
        context.value.beginPath();
        context.value.moveTo(action.data.x, action.data.y);
      } else if (action.type === "drawing") {
        context.value.lineTo(action.data.x, action.data.y);
        context.value.stroke();
      }
    });
    context.value.beginPath();
  });
  
  communicationManager.on("canvasCleared", () => {
    performLocalClear();
  });

  communicationManager.on("startStroke", (data) => {
    context.value.beginPath();
    context.value.moveTo(data.x, data.y);
  });

  communicationManager.on("drawing", (data) => {
    context.value.lineTo(data.x, data.y);
    context.value.stroke();
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", setupCanvas);
  communicationManager.emit("leaveCanvas", { room: props.roomCode });
  communicationManager.off("canvasCleared", performLocalClear);
});
</script>

<template>
  <div class="canva-container">
    <canvas 
      ref="canvas" 
      @mousedown="startDrawing" 
      @mousemove="draw" 
      @mouseup="stopDrawing" 
      @mouseleave="stopDrawing"
    ></canvas>
    
    <div class="button-controls">
      <button @click="clearCanvas" class="clear-btn">Borrar Todo</button>
    </div>
  </div>
</template>

<style scoped>
.canva-container {
  flex-grow: 1; /* Ocupa el espacio disponible */
  min-width: 0; /* Permite que se encoja */
  display: flex;
  flex-direction: column;
  background-color: #2f343d;
  border: 1px solid #61dafb;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

canvas {
  border: 2px solid #61dafb;
  background-color: #ffffff;
  cursor: crosshair;
  width: 100%;
  height: 100%;
  margin-bottom: 10px;
  border-radius: 5px; /* Bordes redondeados para el canvas */
}

.button-controls {
  display: flex;
  justify-content: center; /* Centra los botones */
  width: 100%;
  gap: 10px; /* Espacio entre botones */
}

.canva-container button {
  background-color: #61dafb;
  color: #282c34;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin: 0 5px;
}

.canva-container button:hover {
  background-color: #21a1f1;
}

.canva-container button.clear-btn {
  background-color: #e63946;
  color: white;
}

.canva-container button.clear-btn:hover {
  background-color: #d02b3a;
}

.canva-container button:disabled {
  background-color: #555;
  color: #999;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
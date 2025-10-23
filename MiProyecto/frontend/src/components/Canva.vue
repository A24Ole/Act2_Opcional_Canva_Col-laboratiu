<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { communicationManager } from "../services/communicationManager";

const canvas = ref(null);
const context = ref(null);
const isDrawing = ref(false);
const isConnected = ref(false);

// Función para configurar el canvas y reajustarlo
const setupCanvas = () => {
  if (!canvas.value) return;
  context.value = canvas.value.getContext("2d");

  // Guardar estado actual del contexto
  const currentStrokeStyle = context.value.strokeStyle;
  const currentLineWidth = context.value.lineWidth;
  const currentLineCap = context.value.lineCap;

  // Ajustar el tamaño del canvas a su tamaño real en pantalla
  canvas.value.width = canvas.value.offsetWidth;
  canvas.value.height = canvas.value.offsetHeight;
  
  // Restaurar el estilo del contexto
  context.value.strokeStyle = currentStrokeStyle || "black";
  context.value.lineWidth = currentLineWidth || 2;
  context.value.lineCap = currentLineCap || "round";
};

// Inicia el dibujo local
const startDrawing = (event) => {
  if (!isConnected.value) return;

  const rect = canvas.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  context.value.beginPath();
  context.value.moveTo(x, y);
  isDrawing.value = true;
  communicationManager.emit("startStroke", { x, y });
};

// Dibuja localmente
const draw = (event) => {
  if (!isDrawing.value || !isConnected.value) return;

  const rect = canvas.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  context.value.lineTo(x, y);
  context.value.stroke(); 
  communicationManager.emit("drawing", { x, y });
};

// Detiene el dibujo local
const stopDrawing = () => {
  if (!isDrawing.value) return;
  isDrawing.value = false;
};

// Se conecta/desconecta
const toggleConnection = () => {
  isConnected.value = !isConnected.value;
  if (isConnected.value) {
    communicationManager.emit("joinCanvas");
  } else {
    communicationManager.emit("leaveCanvas");
  }
};

// --- ¡NUEVO! ---
// Función que borra físicamente el canvas local
const performLocalClear = () => {
  if (!context.value) return;
  // Limpia todo el rectángulo del canvas
  context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
  // Resetea el 'camino' para que el próximo trazo no se conecte al último punto
  context.value.beginPath();
};

// Función llamada por el botón "Borrar Todo"
const clearCanvas = () => {
  if (!isConnected.value) return;
  // No borra localmente de inmediato.
  // Emite un evento al servidor. El servidor lo retransmitirá a TODOS
  // (incluido este cliente) para asegurar que todos borren al mismo tiempo.
  communicationManager.emit("clearCanvas");
};
// --- FIN DE LO NUEVO ---


onMounted(() => {
  setupCanvas();
  window.addEventListener("resize", setupCanvas);

  // Escucha el historial de dibujo (sin cambios)
  communicationManager.on("initialCanvasState", (history) => {
    console.log("Recibiendo historial del canvas...");
    performLocalClear(); // Borra por si acaso antes de dibujar el historial
    if (!context.value || !Array.isArray(history)) return;

    history.forEach(action => {
      if (action.type === "startStroke") {
        context.value.beginPath();
        context.value.moveTo(action.data.x, action.data.y);
      } else if (action.type === "drawing") {
        context.value.lineTo(action.data.x, action.data.y);
        context.value.stroke();
      }
      // Si el servidor guardara un action.type === 'clear', aquí lo ignoraríamos
    });
    context.value.beginPath();
  });
  
  // --- ¡NUEVO! ---
  // Escucha el evento global de borrado
  communicationManager.on("canvasCleared", () => {
    console.log("Recibido: El servidor ordenó borrar el canvas.");
    performLocalClear();
  });
  // --- FIN DE LO NUEVO ---

  // Listeners de dibujo (sin cambios)
  communicationManager.on("startStroke", (data) => {
    if (!isConnected.value) return;
    context.value.beginPath();
    context.value.moveTo(data.x, data.y);
  });

  communicationManager.on("drawing", (data) => {
    if (!isConnected.value) return;
    context.value.lineTo(data.x, data.y);
    context.value.stroke();
  });

  communicationManager.on("userJoinedCanvas", () => { /* ... */ });
  communicationManager.on("userLeftCanvas", () => { /* ... */ });
});

onUnmounted(() => {
  window.removeEventListener("resize", setupCanvas);
  if (isConnected.value) {
    communicationManager.emit("leaveCanvas");
  }
  // --- ¡NUEVO! ---
  // Limpiar el listener de borrado
  communicationManager.off("canvasCleared", performLocalClear);
  // (Necesitarás implementar 'off' en tu communicationManager si no lo tienes)
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
      <button @click="toggleConnection">
        {{ isConnected ? 'Leave' : 'Join' }}
      </button>
      
      <button 
        @click="clearCanvas" 
        :disabled="!isConnected" 
        class="clear-btn"
      >
        Borrar Todo
      </button>
    </div>
    </div>
</template>


<style scoped>
.canva-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 80vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: #282c34;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.6);
  padding: 10px;
  box-sizing: border-box;
}

canvas {
  border: 2px solid #61dafb;
  background-color: #ffffff;
  cursor: crosshair;
  flex-grow: 1; 
  max-width: calc(100% - 20px); 
  max-height: calc(100% - 70px); /* Aumenta el espacio para los botones */
  margin-bottom: 10px;
}

/* --- ¡NUEVO! --- */
.button-controls {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
}
/* --- FIN DE LO NUEVO --- */

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
  margin: 0 5px; /* Añade espacio entre botones */
}

.canva-container button:hover {
  background-color: #21a1f1;
}

/* --- ¡NUEVO! --- */
/* Estilo específico para el botón de borrar */
.canva-container button.clear-btn {
  background-color: #e63946; /* Rojo */
  color: white;
}

.canva-container button.clear-btn:hover {
  background-color: #d02b3a;
}

/* Estilo para botones deshabilitados */
.canva-container button:disabled {
  background-color: #555;
  color: #999;
  cursor: not-allowed;
  opacity: 0.7;
}
/* --- FIN DE LO NUEVO --- */
</style>
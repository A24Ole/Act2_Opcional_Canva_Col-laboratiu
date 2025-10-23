// En services/communicationManager.js

import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export const communicationManager = {
  on(event, callback) {
    socket.on(event, callback);
  },
  
  // --- ¡NUEVO! ---
  off(event, callback) {
    socket.off(event, callback);
  },
  
  emit(event, data) {
    socket.emit(event, data);
  },
  
  disconnect() {
    socket.disconnect();
  },

  // --- ¡NUEVO! ---
  getId() {
    // Devuelve el ID del socket actual (o null si no está conectado)
    return socket.id;
  }
};
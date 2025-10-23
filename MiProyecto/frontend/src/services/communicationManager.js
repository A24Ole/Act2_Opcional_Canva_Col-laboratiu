import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export const communicationManager = {
  on(event, callback) {
    socket.on(event, callback);
  },

  off(event, callback) {
    socket.off(event, callback);
  },
  
  emit(event, data) {
    socket.emit(event, data);
  },
  
  disconnect() {
    socket.disconnect();
  },

  getId() {
    return socket.id;
  }
};
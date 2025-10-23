const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Tu cliente de Vue
    methods: ["GET", "POST"]
  }
});

// --- ¡NUEVO! ---
// Aquí guardaremos todo el historial de dibujo.
// Para una app más grande, esto debería estar en una base de datos o
// separado por salas. Para este ejemplo, un array global es suficiente.
let canvasHistory = [];

app.get('/', (req, res) => {
  // Asegúrate de que esta ruta sea correcta para tu proyecto
  // Esto es para servir el frontend, pero tú lo corres en el puerto 5173 (Vite)
  // así que esta línea probablemente no sea necesaria para ti.
  // res.sendFile(join(__dirname, '../frontend/index.html'));
  res.send('Servidor de Socket.io funcionando.');
});

// --- CORRECCIÓN ---
// Solo debe haber UN manejador io.on('connection'
io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);
  
  // Usar 'user connected' (corregida la errata)
  io.emit('user connected', 'Un nuevo usuario se ha unido al chat');

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
    io.emit('user disconnected', 'Un usuario ha salido del chat');
  });

  // --- Lógica del Chat (ya estaba bien) ---
  socket.on('chat message', (msg) => {
    console.log('mensaje: ' + msg);
    io.emit('chat message', msg);
  });

 socket.on('joinCanvas', async () => { // Convertir a async
  socket.join('canvasRoom');
  console.log(`Usuario ${socket.id} se unió a 'canvasRoom'`);

  // --- ¡NUEVO! ---
  // 1. Obtener la lista actual de sockets en la sala
  const sockets = await io.in('canvasRoom').fetchSockets();
  const playerIds = sockets.map(s => s.id);
  
  // 2. Enviar la lista completa SÓLO al nuevo usuario
  socket.emit('currentPlayerList', playerIds);
  // --- FIN DE LO NUEVO ---

  // 3. Enviar el historial del canvas (esto ya lo tenías)
  socket.emit('initialCanvasState', canvasHistory);

  // 4. Notificar a TODOS LOS DEMÁS que alguien nuevo se unió
  // (Usamos socket.to() para no enviártelo a ti mismo)
  socket.to('canvasRoom').emit('userJoinedCanvas', socket.id); 
});

  // --- ¡NUEVO! ---
  // Escuchar el evento de "inicio de trazo"
  socket.on('startStroke', (data) => {
    // 1. Guardar en el historial
    const action = { type: 'startStroke', data: data };
    canvasHistory.push(action);
    
    // 2. Retransmitir a todos los demás en la sala
    socket.to('canvasRoom').emit('startStroke', data);
  });
  // --- FIN DE LO NUEVO ---

  // --- MODIFICADO ---
  // Modificado para guardar también en el historial
  socket.on('drawing', (data) => {
    // 1. Guardar en el historial
    const action = { type: 'drawing', data: data };
    canvasHistory.push(action);
    
    // 2. Retransmitir a todos los demás en la sala (esto ya estaba bien)
    socket.to('canvasRoom').emit('drawing', data);
  });
}); // <-- El bloque io.on('connection') termina aquí

// En tu archivo server.js, dentro de io.on('connection', ...)

  // --- ¡NUEVO! ---
  // Escuchar el evento de borrar canvas
  socket.on('clearCanvas', () => {
    
    // 1. Borrar el historial de dibujo del servidor
    //    Esto es crucial para que los nuevos usuarios vean un canvas limpio.
    canvasHistory = []; 
    
    // 2. Notificar a TODOS en la sala (incluido el emisor)
    //    que deben borrar su canvas local.
    io.to('canvasRoom').emit('canvasCleared');
    
    console.log(`Usuario ${socket.id} borró el canvas para 'canvasRoom'`);
  });
  // --- FIN DE LO NUEVO ---


server.listen(3000, () => {
  // Este log es más preciso, el servidor corre en 3000.
  // El cliente (Vite) corre en 5173.
  console.log('Servidor corriendo en http://localhost:3000');
});
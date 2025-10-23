const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const rooms = {};

io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  socket.on('joinCanvas', ({ room, playerName }) => {
    socket.join(room);
    console.log(`Usuario ${socket.id} (${playerName}) se unió a la sala ${room}`);

    if (!rooms[room]) {
      rooms[room] = {
        players: {},
        canvasHistory: []
      };
    }

    rooms[room].players[socket.id] = playerName;

    socket.emit('initialCanvasState', rooms[room].canvasHistory);
    io.to(room).emit('currentPlayerList', Object.values(rooms[room].players));
  });

  socket.on('startStroke', ({ x, y, room }) => {
    if (rooms[room]) {
      rooms[room].canvasHistory.push({ type: 'startStroke', data: { x, y } });
      socket.to(room).emit('startStroke', { x, y });
    }
  });

  socket.on('drawing', ({ x, y, room }) => {
    if (rooms[room]) {
      rooms[room].canvasHistory.push({ type: 'drawing', data: { x, y } });
      socket.to(room).emit('drawing', { x, y });
    }
  });

  socket.on('clearCanvas', ({ room }) => {
    if (rooms[room]) {
      rooms[room].canvasHistory = [];
      io.to(room).emit('canvasCleared');
    }
  });

  socket.on('chat message', (msg) => {
    const room = Object.keys(socket.rooms).find(r => r !== socket.id);
    if (room) {
        io.to(room).emit('chat message', msg);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Usuario desconectado: ${socket.id}`);
    for (const room in rooms) {
      if (rooms[room].players[socket.id]) {
        delete rooms[room].players[socket.id];
        io.to(room).emit('currentPlayerList', Object.values(rooms[room].players));
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

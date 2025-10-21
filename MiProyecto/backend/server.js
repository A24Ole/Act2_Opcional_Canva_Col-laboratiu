const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
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
  
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/index.html'));
});

io.on('connection', (socket) => {
  console.log('El usuario se ha conectado');
  io.emit('user conected', 'Un nuevo usuario se ha unido al chat');
  socket.on('disconnect', () => {
    console.log('El usuario se ha desconectado');
    io.emit('user disconnected', 'Un usuario ha salido del chat');
  });
});


io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('mensaje: ' + msg);
  });
});
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
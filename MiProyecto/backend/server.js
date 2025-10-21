const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../frontend/index.html'));
});

io.on('connection', (socket) => {
  console.log('El usuario se ha conectado');
  io.emit('user conected', 'Un nuevo usuario se ha unido al chat');
  socket.on('diconnect', () => {
    console.log('El usuario se ha desconectado');
    io.emit('user disconnected', 'Un usuario ha salido del chat');
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
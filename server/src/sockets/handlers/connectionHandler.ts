import { Socket } from "socket.io";

export function Connect(socket: Socket) {
  console.log("Client connected:", socket.id);

  // Send message to client
  socket.emit('HEllo', 'Hello from server!');

  // Listen for messages from client
  socket.on('message', (data) => {
    console.log('Message from client:', data);
    socket.broadcast.emit('message', data);
  });

  // Handle disconnect inside socket
  socket.on('disconnect', () => {
    Disconnect(socket);
  });
}

export function Disconnect(socket: Socket) {
  console.log("Client disconnected:", socket.id);
}

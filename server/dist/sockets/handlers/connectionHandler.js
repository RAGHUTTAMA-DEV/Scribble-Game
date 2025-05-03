"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connect = Connect;
exports.Disconnect = Disconnect;
function Connect(socket) {
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
function Disconnect(socket) {
    console.log("Client disconnected:", socket.id);
}

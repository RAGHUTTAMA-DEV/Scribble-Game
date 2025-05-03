"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connectSocket = (io) => {
    io.on('connection', (socket) => {
        console.log("Client conntected", socket.id);
        socket.emit("Hello");
    });
};
exports.default = connectSocket;

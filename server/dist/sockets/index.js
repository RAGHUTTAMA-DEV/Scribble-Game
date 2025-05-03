"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const initSocket = (io) => {
    io.on("connection", (socket) => {
        socket.emit("heleo");
    });
};
exports.initSocket = initSocket;

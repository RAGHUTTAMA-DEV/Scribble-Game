"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const connectionHandler_1 = require("./handlers/connectionHandler");
const initSocket = (io) => {
    io.on('connection', connectionHandler_1.Connect);
    console.log('Socket.IO server is ready');
};
exports.initSocket = initSocket;

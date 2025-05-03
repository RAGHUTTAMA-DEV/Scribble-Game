import { Server } from 'socket.io';
import { Connect } from './handlers/connectionHandler';

export const initSocket = (io: Server) => {
  io.on('connection', Connect);
  console.log('Socket.IO server is ready');
};

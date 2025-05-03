import { Server, Socket } from "socket.io";
import connectSocket from "./handlers/connectionHandler";

export const initSocket = (io: Server) => {
  io.on("connection",(socket)=>{
     socket.emit("heleo")
  });
  
};
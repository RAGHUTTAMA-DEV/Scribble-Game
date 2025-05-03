import { Server, Socket } from "socket.io";

const connectSocket = (io:Server)=>{
    io.on('connection',(socket:Socket)=>{
        console.log("Client conntected",socket.id);
        socket.emit("Hello")
        
    })
}

export default connectSocket;

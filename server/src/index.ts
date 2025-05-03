import express from 'express';
import mongoose from 'mongoose';
import { connectDB,PORT } from './config/db';
import cors from 'cors';
import  { Server } from 'socket.io'
import AuthRouter from './routes/AuthRoutes';
import { initSocket } from './sockets';
import  http from 'http'
import RoomRoutes from './routes/UserRoutes';

const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{origin:'*'}
})

app.use(cors());
app.use(express.json());

app.use('/api/auth',AuthRouter)
app.use('/api/room',RoomRoutes)
io.on('connection', (socket)=>{
    console.log('a user connected');
    socket.emit('HEllo');
})
async function main(){
    try{
        await connectDB();
        server.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        })
    }catch(error:any){
        console.log("Error internal issuse",error);
    }   
}

main();
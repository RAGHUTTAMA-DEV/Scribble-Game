import express from 'express';
import mongoose from 'mongoose';
import { connectDB,PORT } from './config/db';
import cors from 'cors';
import nothing from 'socket.io'
import UserRouter from './routes/UserRoutes';


const app=express();

app.use(cors());
app.use(express.json());

app.use('/api',UserRouter)


async function main(){
    try{
        await connectDB();
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        })
    }catch(error:any){
        console.log("Error internal issuse",error);
    }
}

main();
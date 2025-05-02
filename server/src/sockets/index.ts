import express from 'express';
import mongoose from 'mongoose';
import { connectDB,PORT } from '../config/db';
import cors from 'cors';


const app=express();

app.use(cors());
app.use(express.json());



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
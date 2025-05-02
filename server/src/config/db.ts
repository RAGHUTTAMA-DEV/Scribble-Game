import express from 'express';
import mongoose from 'mongoose';

export const MongoURl = process.env.MONGO_URL || 'mongodb://localhost:27017/myapp';
export const PORT = process.env.PORT || 5000;
export const connectDB=async ()=>{
    await mongoose.connect(MongoURl);
    console.log('MongoDB connected successfully');
}
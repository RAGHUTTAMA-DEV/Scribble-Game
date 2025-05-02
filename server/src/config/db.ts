import mongoose from 'mongoose';

export const PORT = process.env.PORT || 5000;

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://raghuttama03:samera2007@cluster0.sylhh.mongodb.net/scribble';
    await mongoose.connect(uri );
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};
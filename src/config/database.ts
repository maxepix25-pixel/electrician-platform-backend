import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongooseConfig = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/electrician-platform';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

export default mongooseConfig;
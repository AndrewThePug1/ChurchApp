import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/songManagement');
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database: ', error);
    process.exit(1);
  }
};

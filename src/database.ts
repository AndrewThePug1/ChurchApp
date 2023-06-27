import mongoose from 'mongoose';

export const connectDB = async (dbURI: string) => {
    try {
        await mongoose.connect(dbURI);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to database: ', error);
        process.exit(1);
    }
};

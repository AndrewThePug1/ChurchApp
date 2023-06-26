import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://AndrewThePug1:Atlasturtle22!@cluster0.lzrg3yn.mongodb.net/?retryWrites=true&w=majority')
        console.log('Database connected succesfully');
    } catch (error) {
        console.error('Error connecting to database: ', error);
        process.exit(1);
    }
};
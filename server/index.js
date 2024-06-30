import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './database/db.js';

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 8000;

// Import routes
import userRoutes from './routes/user.js';
app.use('/api', userRoutes);

// Start the server and connect to the database
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'; 
import authRoutes from './src/routes/authRoute.js';
import menuRoutes from './src/routes/menuRoute.js';
import userRoutes from './src/routes/userRoute.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    exposedHeaders: ['*', 'Authorization']
}));
app.use(cookieParser());
app.use(express.json()); 
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/menu' ,menuRoutes) 
app.use('/api/users' ,userRoutes)

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import express from 'express';
import authRoutes from './routes/auth';

const app = express();
app.use(express.json());

// Use the router correctly
app.use('/api/auth', authRoutes);
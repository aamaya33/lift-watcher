import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import workoutsRouter from './routes/workouts';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRouter); //auth for now 
app.use('/workouts', workoutsRouter); //workouts for now

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
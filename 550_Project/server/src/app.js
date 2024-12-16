import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import cityRoutes from './routes/cityRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import ComplexRoutes from './routes/ComplexRoutes.js';
import RestaurantRoutes from './routes/RestaurantRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/business', businessRoutes);
app.use('/api/business', cityRoutes);
app.use('/api/homepage', ComplexRoutes);
app.use('/api/restaurant', RestaurantRoutes);
export default app;


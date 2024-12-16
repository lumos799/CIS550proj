import express from 'express';
import { getRestInsights} from '../controllers/Restaurant_Insights.js';

const router = express.Router();

//GET http://localhost:8080/api/restaurant/getRestInsights?city=Philadelphia
router.get('/getRestInsights', getRestInsights);

export default router;
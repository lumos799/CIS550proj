import express from 'express';
import {
    getTopCitiesByReviewCount,
  } from '../controllers/cityController.js';

const router = express.Router();
//GET /api/business/top-review

// http://localhost:8080/api/business/top-review
router.get('/top-review', getTopCitiesByReviewCount);



export default router;
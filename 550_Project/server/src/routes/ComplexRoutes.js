import express from 'express';
import { gettrafficComplex1} from '../controllers/Complex_Insights.js';
import { getRestInsights} from '../controllers/Complex_Insights.js';
import { getopendayAvgstarComplex2} from '../controllers/Complex_Insights.js';
import { getactiveUserBusiComplex3 } from '../controllers/Complex_Insights.js';
import { gettrafficBusiComplex4 } from '../controllers/Complex_Insights.js';


const router = express.Router();

//GET /api/homepage/getRestInsights?city=CityName
//GET http://localhost:8080/api/homepage/getRestInsights?city=Philadelphia
router.get('/getRestInsights', getRestInsights);
//GET /api/homepage/gettrafficComplex1?city=CityName
// http://localhost:8080/api/homepage/gettrafficComplex1?city=Philadelphia
router.get('/gettrafficComplex1', gettrafficComplex1);

// http://localhost:8080/api/homepage/getopendayAvgstarComplex2?starBiggerthan=4
router.get('/getopendayAvgstarComplex2', getopendayAvgstarComplex2);

// http://localhost:8080/api/homepage/getactiveUserBusiComplex3?city=Philadelphia
router.get('/getactiveUserBusiComplex3', getactiveUserBusiComplex3);



// http://localhost:8080/api/homepage/gettrafficBusiComplex4?city=Philadelphia
router.get('/gettrafficBusiComplex4', gettrafficBusiComplex4);
export default router;
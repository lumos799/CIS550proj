import express from 'express';
import { getTopBusiness} from '../controllers/businessController.js';
import { filteredBusiness} from '../controllers/businessController.js';
import { getDistinctCategories} from '../controllers/businessController.js';
import { getSingleBusiness} from '../controllers/businessController.js';
import { getCategoryPics} from '../controllers/businessController.js';
import { getCategoryBusiness} from '../controllers/businessController.js';
// import { getDistinctCities} from '../controllers/businessController.js';
const router = express.Router();

//GET /api/business/top15-categories?city=CityName
// http://localhost:8080/api/business/top15-categories?city=Philadelphia
router.get('/top15-categories', getTopBusiness);



// http://localhost:8080/api/business/recommend?city=Philadelphia&category=Restaurants&availability=Open&?min_reviews=0

router.get('/recommend', filteredBusiness)
// router.get('/distinct-cities', getDistinctCities);
router.get('/distinct-categories', getDistinctCategories);

//http://localhost:8080/api/business/single-business?business_id=EQ-TZ2eeD_E0BHuvoaeG5Q
router.get('/single-business', getSingleBusiness);


//http://localhost:8080/api/business/category-pics
//http://localhost:8080/api/business/category-pics?category=Restaurants
router.get('/category-pics', getCategoryPics);

//http://localhost:8080/api/business/category-business?category=Restaurants
router.get('/category-business', getCategoryBusiness);

export default router;


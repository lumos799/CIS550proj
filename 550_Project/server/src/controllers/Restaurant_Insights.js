import {query} from '../database/index.js';

export const getRestInsights = async (req, res) => {
    const {city} = req.query
    if(!city){
        return res.status(400).json({ error: 'Put a city' })
    }

const sql = `
    WITH exploded_categories AS (
    SELECT
        business_id,
        TRIM(category) AS category
    FROM public.yelp_business,
         UNNEST(string_to_array(categories, ',')) AS category
)
SELECT
    B.city,
    EC.category,
    AVG(B.review_count) AS avg_review_count,       
    COUNT(B.business_id) AS num_of_businesses,    
    SUM(T.useful) AS total_useful_tips,           
    SUM(T.funny) AS total_funny_tips,             
    SUM(T.cool) AS total_cool_tips,               
    CASE
        WHEN B.stars = 1 THEN '1 star'
        WHEN B.stars BETWEEN 2 AND 3 THEN '2-3 stars'
        WHEN B.stars BETWEEN 4 AND 5 THEN '4-5 stars'
        ELSE NULL
    END AS star_group
    FROM public.yelp_business B
    LEFT JOIN exploded_categories EC
        ON B.business_id = EC.business_id
    LEFT JOIN public.yelp_review T
        ON B.business_id = T.business_id              
    WHERE B.city = $1 AND EC.category = 'Restaurants'
    GROUP BY B.city, EC.category, star_group;
    `
    try {
        const { rows } = await query(sql, [city]);
        if (rows.length === 0) {
          return res.status(404).json({ message: 'No categories found for the specified city.' });
        }
    
        res.json(rows);
      } catch (error) {
        console.error('Error fetching top 15 categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };


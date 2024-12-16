import {query} from '../database/index.js';


export const gettrafficComplex1 = async (req, res) => {
    const {city} = req.query
    if(!city){
        return res.status(400).json({ error: 'Put a city' })
    }

const sql = `

WITH business_checkin AS (
    SELECT business_id, substring(date, 1, 10) as date, substring(date, 12, 2) as hour
    FROM (SELECT b.business_id, unnest(string_to_array(date, ', ')) as date
          FROM yelp_checkin c JOIN yelp_business b ON c.business_id = b.business_id
          WHERE b.city = $1) t
),
business_stars AS (
    SELECT business_id,
    CASE
        WHEN stars = 1 THEN '1 star'
        WHEN stars BETWEEN 2 AND 3 THEN '2-3 stars'
        WHEN stars BETWEEN 4 AND 5 THEN '4-5 stars'
    END AS star_group
    FROM yelp_business
    WHERE city = $1
),
business_checin_categories AS(
    SELECT star_group, date, hour
    FROM business_checkin b
        JOIN business_stars s ON b.business_id = s.business_id
),
DayofWeek AS (
	SELECT generate_series(1,7) AS dayofweek
),
Hours AS (
	SELECT generate_series(0, 23) AS hour
)
SELECT d.dayofweek, h.hour, star_group, COUNT(bc.date) as traffic
FROM DayofWeek d
    CROSS JOIN Hours h
    LEFT JOIN business_checin_categories bc ON
        d.dayofweek = EXTRACT(DOW FROM bc.date::TIMESTAMP)
        AND h.hour = CAST(bc.hour AS INTEGER)
GROUP BY d.dayofweek, h.hour, star_group
ORDER BY d.dayofweek, h.hour, star_group;
    `
    try {
        const { rows } = await query(sql, [city]);
        if (rows.length === 0) {
          return res.status(404).json({ message: 'No categories found for the specified city.' });
        }
    
        res.json(rows);
      } catch (error) {
        console.error('Error fetching traffic data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    };

export const getopendayAvgstarComplex2 = async (req, res) => {
    const {starBiggerthan} = req.query
    if(!starBiggerthan){
        return res.status(400).json({ error: 'Put a star' })
    }

const sql = `

WITH exploded_hours AS (
SELECT
    b.business_id,
    b.name AS business_name,
    b.city,
    key AS day,
    value AS hours
FROM yelp_business b,
LATERAL jsonb_each_text(b.hours) AS hours_entry
WHERE jsonb_typeof(b.hours) = 'object'
),
tmp_cte AS (
SELECT
    e.business_id,
    e.business_name,
    e.city,
    r.review_id,
    r.user_id,
    r.stars,
    r.useful,
    r.funny,
    r.cool,
    r.text,
    r.date,
    e.day AS open_day,
    e.hours AS open_hours
FROM exploded_hours e
JOIN yelp_review r ON e.business_id = r.business_id
WHERE r.stars >= $1
),
final_cte AS (
SELECT
    t.business_id,
    t.business_name,
    t.city,
    t.open_day,
    SUM(t.useful + t.funny + t.cool) AS total_positive_feedback,
    AVG(t.stars) AS average_stars
FROM tmp_cte t
GROUP BY t.business_id, t.business_name, t.city, t.open_day
)

SELECT
f.business_id,
f.business_name,
f.city,
COUNT(*) AS open_day,
SUM(total_positive_feedback) AS total_positive_feedback,
AVG(average_stars) AS avg_total_stars
FROM final_cte f
GROUP BY f.business_id, f.business_name, f.city;
    `
    try {
        const { rows } = await query(sql, [starBiggerthan]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No categories found for the specified city.' });
        }
    
        res.json(rows);
        } catch (error) {
        console.error('Error fetching star data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    };

export const getactiveUserBusiComplex3 = async (req, res) => {
        const {city} = req.query
        if(!city){
            return res.status(400).json({ error: 'Put a city' })
        }
    
    const sql = `
    
WITH Top250ActiveUsers AS (
	SELECT
    	u.user_id,
    	u.name,
    	u.review_count,
    	AVG(r.stars) AS average_stars,
    	COUNT(r.review_id) AS region_reviews
	FROM yelp_user u
	JOIN yelp_review r ON u.user_id = r.user_id
	JOIN yelp_business b ON r.business_id = b.business_id
	WHERE b.city = $1
	GROUP BY u.user_id, u.name, u.review_count
	ORDER BY region_reviews DESC
	LIMIT 250
),
TargetUsersBusiness AS (
    SELECT DISTINCT
        ua.user_id,
        ua.name,
        ua.review_count,
        ua.average_stars,
        ua.region_reviews,
        r.business_id,
        COUNT(*) AS num
    FROM yelp_review r
    JOIN Top250ActiveUsers  ua ON r.user_id = ua.user_id
    JOIN yelp_business b ON r.business_id = b.business_id
    WHERE city = $1
    GROUP BY ua.user_id, ua.name, ua.review_count, ua.average_stars, ua.region_reviews, r.business_id
    ORDER BY num DESC
),
LatestReview AS (
    SELECT user_id, r.business_id, b.name AS business_name, r.stars AS review_star, text,date
    FROM(SELECT *,
                row_number() over (
                    PARTITION BY user_id, business_id
                    ORDER BY date DESC) as rank
        FROM yelp_review) r
    JOIN yelp_business b ON r.business_id = b.business_id
    WHERE rank = 1 AND b.city = $1
),
ALLinfo AS (
    SELECT
        *,
        FLOOR(AVG(rank) OVER (PARTITION BY business_id)) AS avg_rank
    FROM(
        SELECT
            ub.user_id,
            ub.name,
            ub.review_count,
            ub.average_stars,
            ub.region_reviews,
            ur.business_id,
            ur.business_name,
            ur.review_star,
            ur.text AS review_text,
            ur.date AS review_date,
            ROW_NUMBER() OVER (
                PARTITION BY ub.user_id
                ORDER BY ub.num DESC
            ) AS rank
        FROM TargetUsersBusiness ub
        JOIN LatestReview ur ON ub.user_id = ur.user_id AND ub.business_id = ur.business_id
        ORDER BY business_id
        )
)
SELECT user_id, business_id, name, review_count, average_stars, review_star, review_date
FROM ALLinfo
WHERE rank <= 30
ORDER BY region_reviews DESC, user_id, rank;
        `
        try {
            const { rows } = await query(sql, [city]);
            if (rows.length === 0) {
              return res.status(404).json({ message: 'No categories found for the specified city.' });
            }
        
            res.json(rows);
          } catch (error) {
            console.error('Error fetching traffic data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        };
    



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

export const gettrafficBusiComplex4 = async (req, res) => {
        const {city} = req.query
        if(!city){
            return res.status(400).json({ error: 'Put a city' })
        }
    
    const sql = `
    
WITH business_checkin AS (
    SELECT business_id,
           substring(date, 1, 10) as exact_date,
           CAST(substring(date, 1, 4) AS INTEGER) as year
    FROM (SELECT b.business_id, unnest(string_to_array(date, ', ')) as date
          FROM yelp_checkin c JOIN yelp_business b ON c.business_id = b.business_id
          WHERE b.city = $1) t
),
BusinessTraffic AS (
    select
        business_id,
        year,
        count(*) as traffic
    from business_checkin
    group by business_id, year
),
TrafficTrend AS (
    SELECT
        *,
        prev_traffic,
        CASE
            WHEN prev_traffic <= traffic THEN 1
            WHEN prev_traffic IS NULL THEN 1
            ELSE 0
        END AS growth
    FROM (
        SELECT
            *,
            LAG(traffic) OVER (PARTITION BY business_id ORDER BY year) AS prev_traffic
        FROM BusinessTraffic
    ) t
    ORDER BY business_id, year
),
ConsistentGrowth AS (
    SELECT
        business_id, sum(traffic) as traffic, count(growth) -1  as consecutive_years
    FROM TrafficTrend
    group by business_id
    having sum(growth) = count(growth)
    and count(growth) > 1
    and sum(traffic) >= 100
)
select *
from ConsistentGrowth c
    join yelp_business b on c.business_id = b.business_id
order by review_count desc
        `
        try {
            const { rows } = await query(sql, [city]);
            if (rows.length === 0) {
              return res.status(404).json({ message: 'No categories found for the specified city.' });
            }
        
            res.json(rows);
          } catch (error) {
            console.error('Error fetching traffic data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        };
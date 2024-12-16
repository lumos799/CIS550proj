import {query} from '../database/index.js';

export const getTopBusiness = async (req, res) => {
    const {city} = req.query
    if(!city){
        return res.status(400).json({ error: 'Put a city' })
    }

    const sql = `
    WITH exploded_categories AS (
      SELECT
        TRIM(category) AS category,
        review_count
      FROM yelp_business,
      UNNEST(string_to_array(categories, ',')) AS category
      WHERE city = $1
    )
    SELECT
      category,
      COUNT(*) AS occurrence,
      SUM(review_count) AS total_reviews,
      COUNT(*) * SUM(review_count) AS score
    FROM exploded_categories
    GROUP BY category
    ORDER BY score DESC
    LIMIT 15;
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


export const filteredBusiness = async (req, res) =>{
  const {city, category, availability, min_reviews, max_reviews} = req.query
  if (!city){
    return res.status(400).json({error: "Please provide a city name"})
  }
  
  let is_open_val;
  if (availability && (availability.toLowerCase() === 'open' || availability.toLowerCase() === 'closed')) {
    is_open_val = availability.toLowerCase() === 'open' ? 1 : 0;
  }

  const params = [];
  let filterConditions = 'WHERE 1=1';
  if (city) {
    filterConditions += ` AND yelp_business.city = $${params.length + 1}`;
    params.push(city);
  }
  if (category) {
    filterConditions += ` AND TRIM(c.category) = $${params.length + 1}`;
    params.push(category);
  }
  if (is_open_val !== undefined) {
    filterConditions += ` AND yelp_business.is_open = $${params.length + 1}`;
    params.push(is_open_val);
  }
  const minRev = min_reviews ? parseInt(min_reviews, 10) : 0;
  const maxRev = max_reviews ? parseInt(max_reviews, 10) : 99999;
  filterConditions += ` AND yelp_business.review_count BETWEEN $${params.length + 1} AND $${params.length + 2}`;
  params.push(minRev, maxRev);

  const sql = `
    SELECT
      yelp_business.business_id,
      yelp_business.name,
      yelp_business.city,
      TRIM(c.category) AS category,
      yelp_business.address,
      CASE WHEN yelp_business.is_open = 1 THEN 'Open' ELSE 'Closed' END AS availability,
      yelp_business.review_count AS reviews,
      yelp_business.stars AS stars
    FROM
      yelp_business
    CROSS JOIN LATERAL
      unnest(string_to_array(yelp_business.categories, ',')) AS c(category)
    ${filterConditions}
    ORDER BY yelp_business.stars DESC
    LIMIT 10;
  `;

  try{
    const {rows} = await query(sql, params)
    if (rows.length === 0){
      return res.status(404).json({message: "No business found"})
    }
    res.json(rows);
    console.log(rows)
  }catch(error){
    console.error('Error fetching filtered businesses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// export const getDistinctCities = async (req, res) => {
//   const sql = `
//     SELECT distinct city
//     FROM yelp_business
//     ORDER by city;
//   `;
//   try {
//     const { rows } = await query(sql);
//     res.json(rows.map(r => r.city));
//     console.log(rows)
//   } catch (error) {
//     console.error('Error fetching cities:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

export const getDistinctCategories = async (req, res) => {
  const sql = `
    WITH exploded_categories AS (
      SELECT TRIM(category) AS category
      FROM yelp_business,
      UNNEST(string_to_array(categories, ',')) AS category
    )
    SELECT DISTINCT category
    FROM exploded_categories
    ORDER BY category;
  `;
  try {
    const { rows } = await query(sql);
    res.json(rows.map(r => r.category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getSingleBusiness = async (req, res) => {
  const { business_id } = req.query;

  // 检查 business_id 是否为空
  if (!business_id) {
    return res.status(400).json({ error: 'Business ID is required.' });
  }
  const sql = `
  WITH MostUsefulReview AS (
    SELECT 
      r.business_id,
      r.text AS most_useful_text,
      r.useful AS most_useful_count
    FROM yelp_review r
    WHERE r.business_id = $1
    ORDER BY r.useful DESC
    LIMIT 1
  )
  SELECT 
    b.business_id,
    b.name,
    b.address,
    b.stars AS avg_star,
    COUNT(r.business_id) AS review_count,
    SUM(CASE WHEN r.stars = 1 THEN 1 ELSE 0 END) AS star1_count,
    SUM(CASE WHEN r.stars = 2 THEN 1 ELSE 0 END) AS star2_count,
    SUM(CASE WHEN r.stars = 3 THEN 1 ELSE 0 END) AS star3_count,
    SUM(CASE WHEN r.stars = 4 THEN 1 ELSE 0 END) AS star4_count,
    SUM(CASE WHEN r.stars = 5 THEN 1 ELSE 0 END) AS star5_count,
    m.most_useful_text,
    m.most_useful_count
  FROM yelp_business b
  LEFT JOIN yelp_review r ON b.business_id = r.business_id
  LEFT JOIN MostUsefulReview m ON b.business_id = m.business_id
  WHERE b.business_id = $1
  GROUP BY b.business_id, b.name, b.address, b.stars, m.most_useful_text, m.most_useful_count;
`;


  try {
    const { rows } = await query(sql, [business_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No business found with the provided ID.' });
    }

    res.json(rows[0]); // 返回单个业务
  } catch (error) {
    console.error('Error fetching a single business:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getCategoryPics = async (req, res) => {
  const { category } = req.query; // get category

  const sql = category
    ? `SELECT category, url FROM category_pic WHERE category = $1` // with parameter
    : `SELECT category, url FROM category_pic`; // without parameter

  try {
    const { rows } = category ? await query(sql, [category]) : await query(sql); // execute different SQL
    if (category && rows.length === 0) {
      return res.status(404).json({ message: 'No category found with the provided parameter.' });
    }
    res.json(rows); 
  } catch (error) {
    console.error('Error fetching category pics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const getCategoryBusiness = async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ error: 'category is required.' });
  }
  const sql = `
    WITH expanded_category as (
        SELECT
        *,
        TRIM(unnest(string_to_array(categories, ','))) AS category
        FROM yelp_business
    )
    SELECT e.business_id, e.name, e.address, e.stars, e.postal_code, e.city, COUNT(*) AS review_num
    FROM expanded_category e
    JOIN yelp_review r ON e.business_id = r.business_id
    WHERE category = $1
    GROUP BY e.business_id, e.name, e.address, e.stars, e.postal_code, e.city
    ORDER BY review_num DESC
    LIMIT 100;
  `;
  try {
    const { rows } = await query(sql, [category]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No business found with the provided category.' });
    }
    res.json(rows); 
  } catch (error) {
    console.error('Error fetching a single business:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

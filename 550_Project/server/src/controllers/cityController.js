import {query} from '../database/index.js';

export const getTopCitiesByReviewCount = async (req, res) => {
    const sql = `
      SELECT city, SUM(review_count) AS all_review_count
      FROM yelp_business
      GROUP BY city
      ORDER BY all_review_count DESC
      LIMIT 25;
    `;
    try {
      const { rows } = await query(sql);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching top cities by review count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

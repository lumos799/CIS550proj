// src/db/index.js

import pkg from 'pg';
const { Pool, types } = pkg;
import config from '../../config.json' assert { type: 'json' };

// Override the default parsing for BIGINT (PostgreSQL type ID 20)
types.setTypeParser(20, (val) => parseInt(val, 10));

// Create PostgreSQL connection using database credentials provided in config.json
const pool = new Pool({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

// Export the query method
export const query = (text, params) => pool.query(text, params);

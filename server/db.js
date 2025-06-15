const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin123',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: 'mmuseum'
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect()
};
  
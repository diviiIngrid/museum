const db = require('./db');

const initDatabase = async () => {
  try {
    await db.connect();
    
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER'))
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS exhibitions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        short_description TEXT NOT NULL,
        full_description TEXT NOT NULL,
        image_url VARCHAR(255),
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        ticket_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        exhibition_id INTEGER REFERENCES exhibitions(id),
        reservation_date TIMESTAMP NOT NULL,
        visitor_count INTEGER NOT NULL,
        visitor_name VARCHAR(100) NOT NULL,
        visitor_email VARCHAR(100) NOT NULL,
        visitor_phone VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const adminExists = await db.query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@museum.com']
    );

    if (adminExists.rows.length === 0) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await db.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        ['Admin', 'admin@museum.com', hashedPassword, 'ADMIN']
      );
      
      console.log('Admin user created');
    }

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDatabase();
  
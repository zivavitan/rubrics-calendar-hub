
import { Pool } from 'pg';
import dbConfig from './config';

// Create a connection pool
const pool = new Pool(dbConfig);

// Test the database connection
pool.connect()
  .then(client => {
    console.log('Successfully connected to PostgreSQL database');
    client.release();
  })
  .catch(err => {
    console.error('Error connecting to PostgreSQL database:', err);
  });

export default pool;

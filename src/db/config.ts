
// PostgreSQL database configuration
const dbConfig = {
  host: 'localhost',      // Your PostgreSQL server host
  port: 5432,             // Default PostgreSQL port
  database: 'dutycalendar', // Your database name
  user: 'postgres',       // Your PostgreSQL username
  password: 'postgres',   // Your PostgreSQL password
  ssl: false,             // Set to true if your PostgreSQL requires SSL
};

export default dbConfig;

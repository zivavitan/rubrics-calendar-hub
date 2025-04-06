
// PostgreSQL database configuration
const dbConfig = {
  host: 'localhost',      // Your PostgreSQL server host
  port: 5432,             // Default PostgreSQL port
  database: 'dutycalendar', // Your database name
  user: 'postgres',       // Your PostgreSQL username
  password: 'mypassword', // Your PostgreSQL password
  ssl: false,             // Set to false for local connections
};

export default dbConfig;

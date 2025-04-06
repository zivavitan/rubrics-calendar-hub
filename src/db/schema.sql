
-- Create tables for the Duty Calendar application

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  password VARCHAR(100) -- Would be hashed in a real application
);

-- Rubrics (duty types) table
CREATE TABLE IF NOT EXISTS rubrics (
  name VARCHAR(100) PRIMARY KEY
);

-- Duties table
CREATE TABLE IF NOT EXISTS duties (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) REFERENCES rubrics(name) ON DELETE CASCADE,
  date DATE NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS duties_date_idx ON duties(date);
CREATE INDEX IF NOT EXISTS duties_user_id_idx ON duties(user_id);

-- Insert initial data for testing

-- Admin user
INSERT INTO users (name, email, phone, role, password) 
VALUES ('Admin User', 'admin@example.com', '+1234567890', 'admin', 'admin123')
ON CONFLICT (email) DO NOTHING;

-- Regular users
INSERT INTO users (name, email, phone, role, password) 
VALUES ('John Doe', 'john@example.com', '+1234567891', 'user', 'user123')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, phone, role, password) 
VALUES ('Jane Smith', 'jane@example.com', '+1234567892', 'user', 'user123')
ON CONFLICT (email) DO NOTHING;

-- Duty types (rubrics)
INSERT INTO rubrics (name) VALUES ('Primary On-Call') ON CONFLICT (name) DO NOTHING;
INSERT INTO rubrics (name) VALUES ('Secondary On-Call') ON CONFLICT (name) DO NOTHING;
INSERT INTO rubrics (name) VALUES ('Operations') ON CONFLICT (name) DO NOTHING;
INSERT INTO rubrics (name) VALUES ('Support') ON CONFLICT (name) DO NOTHING;
INSERT INTO rubrics (name) VALUES ('Maintenance') ON CONFLICT (name) DO NOTHING;

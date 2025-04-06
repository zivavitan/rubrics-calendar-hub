
import pool from './client';
import { User } from '@/types';

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Get user by id
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};

// Add a new user
export const addUser = async (user: Omit<User, 'id'>): Promise<User | null> => {
  try {
    const { name, email, phone, role } = user;
    const result = await pool.query(
      'INSERT INTO users (name, email, phone, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, phone, role]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding user:', error);
    return null;
  }
};

// Update an existing user
export const updateUser = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  try {
    const { name, email, phone, role } = updates;
    const result = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone), role = COALESCE($4, role) WHERE id = $5 RETURNING *',
      [name, email, phone, role, userId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

// Delete a user
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};

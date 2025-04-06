
import pool from './client';
import { Duty, DutyWithUser, User } from '@/types';

// Get all duties
export const getAllDuties = async (): Promise<Duty[]> => {
  try {
    const result = await pool.query('SELECT * FROM duties');
    return result.rows;
  } catch (error) {
    console.error('Error fetching duties:', error);
    return [];
  }
};

// Get duties with user details
export const getDutiesWithUsers = async (): Promise<DutyWithUser[]> => {
  try {
    const result = await pool.query(`
      SELECT d.id, d.user_id as "userId", d.type, d.date, 
             u.id as "user.id", u.name as "user.name", 
             u.email as "user.email", u.phone as "user.phone", 
             u.role as "user.role"
      FROM duties d
      JOIN users u ON d.user_id = u.id
    `);
    
    // Transform the flat results into nested objects
    return result.rows.map(row => ({
      id: row.id,
      userId: row.userId,
      type: row.type,
      date: row.date,
      user: {
        id: row['user.id'],
        name: row['user.name'],
        email: row['user.email'],
        phone: row['user.phone'],
        role: row['user.role']
      }
    }));
  } catch (error) {
    console.error('Error fetching duties with users:', error);
    return [];
  }
};

// Add a new duty
export const addDuty = async (duty: Duty): Promise<Duty | null> => {
  try {
    const { userId, type, date } = duty;
    const result = await pool.query(
      'INSERT INTO duties (user_id, type, date) VALUES ($1, $2, $3) RETURNING *',
      [userId, type, date]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding duty:', error);
    return null;
  }
};

// Update an existing duty
export const updateDuty = async (dutyId: string, updates: Partial<Duty>): Promise<Duty | null> => {
  try {
    const { userId, type, date } = updates;
    const result = await pool.query(
      'UPDATE duties SET user_id = COALESCE($1, user_id), type = COALESCE($2, type), date = COALESCE($3, date) WHERE id = $4 RETURNING *',
      [userId, type, date, dutyId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating duty:', error);
    return null;
  }
};

// Delete a duty
export const deleteDuty = async (dutyId: string): Promise<boolean> => {
  try {
    await pool.query('DELETE FROM duties WHERE id = $1', [dutyId]);
    return true;
  } catch (error) {
    console.error('Error deleting duty:', error);
    return false;
  }
};

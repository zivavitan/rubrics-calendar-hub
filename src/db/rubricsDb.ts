
import pool from './client';
import { RubricType } from '@/types';

// Get all rubrics (duty types)
export const getAllRubrics = async (): Promise<RubricType[]> => {
  try {
    const result = await pool.query('SELECT * FROM rubrics');
    return result.rows.map(row => row.name);
  } catch (error) {
    console.error('Error fetching rubrics:', error);
    return [];
  }
};

// Add a new rubric
export const addRubric = async (name: string): Promise<boolean> => {
  try {
    await pool.query('INSERT INTO rubrics (name) VALUES ($1)', [name]);
    return true;
  } catch (error) {
    console.error('Error adding rubric:', error);
    return false;
  }
};

// Update a rubric
export const updateRubric = async (oldName: string, newName: string): Promise<boolean> => {
  try {
    await pool.query('UPDATE rubrics SET name = $1 WHERE name = $2', [newName, oldName]);
    // Also update any duties that use this rubric
    await pool.query('UPDATE duties SET type = $1 WHERE type = $2', [newName, oldName]);
    return true;
  } catch (error) {
    console.error('Error updating rubric:', error);
    return false;
  }
};

// Delete a rubric
export const deleteRubric = async (name: string): Promise<boolean> => {
  try {
    await pool.query('DELETE FROM rubrics WHERE name = $1', [name]);
    return true;
  } catch (error) {
    console.error('Error deleting rubric:', error);
    return false;
  }
};

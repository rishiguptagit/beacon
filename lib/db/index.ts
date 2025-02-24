import { sql } from '@vercel/postgres';
import { Point } from 'geojson';

export async function createUser({ email, fullName, passwordHash }: {
  email: string;
  fullName: string;
  passwordHash: string;
}) {
  try {
    const result = await sql`
      INSERT INTO users (email, full_name, password_hash)
      VALUES (${email}, ${fullName}, ${passwordHash})
      RETURNING id, email, full_name;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email};
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function createAlert({
  userId,
  title,
  description,
  latitude,
  longitude,
  severity
}: {
  userId: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  severity: string;
}) {
  try {
    const result = await sql`
      INSERT INTO alerts (user_id, title, description, latitude, longitude, severity)
      VALUES (${userId}, ${title}, ${description}, ${latitude}, ${longitude}, ${severity})
      RETURNING *;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
}

export async function getAlerts() {
  try {
    const result = await sql`
      SELECT 
        alerts.*,
        users.full_name as reporter_name
      FROM alerts
      JOIN users ON alerts.user_id = users.id
      WHERE alerts.status = 'active'
      ORDER BY alerts.created_at DESC;
    `;
    return result.rows;
  } catch (error) {
    console.error('Error getting alerts:', error);
    throw error;
  }
}
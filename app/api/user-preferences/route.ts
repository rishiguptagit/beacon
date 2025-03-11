import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the most recent user preferences
    const result = await sql`
      SELECT * FROM user_preferences 
      ORDER BY updated_at DESC 
      LIMIT 1;
    `;

    if (result.rows.length === 0) {
      // Return default zip code if no preferences found
      return NextResponse.json({ zipCode: '94582' });
    }

    return NextResponse.json({ zipCode: result.rows[0].zip_code });
  } catch (error) {
    console.error('Database error:', error);
    // Return default zip code on error
    return NextResponse.json({ zipCode: '94582' });
  }
}

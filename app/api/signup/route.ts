import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        email VARCHAR(255) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const { email, fullName, password } = await request.json();
    console.log('Attempting to create user:', { email, fullName }); // Log attempt

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const result = await sql`
      INSERT INTO users (email, full_name, password_hash)
      VALUES (${email}, ${fullName}, ${hashedPassword})
      RETURNING email, full_name;
    `;

    console.log('User created:', result.rows[0]); // Log success
    return NextResponse.json({
      success: true,
      user: result.rows[0],
    });

  } catch (error: unknown) {
    console.error('Detailed error:', error); // Log detailed error
    // Handle duplicate email
    if (typeof error === 'object' && error && 'code' in error && error.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

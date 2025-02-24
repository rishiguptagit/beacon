import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS user_preferences (
        email VARCHAR(255) PRIMARY KEY,
        zip_code VARCHAR(10),
        notification_preference VARCHAR(20),
        alert_radius INTEGER,
        emergency_contacts TEXT,
        special_needs BOOLEAN,
        special_needs_details TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const {
      email,
      zipCode,
      notificationPreference,
      alertRadius,
      emergencyContacts,
      specialNeeds,
      specialNeedsDetails
    } = await request.json();

    // Insert or update user preferences
    const result = await sql`
      INSERT INTO user_preferences (
        email,
        zip_code,
        notification_preference,
        alert_radius,
        emergency_contacts,
        special_needs,
        special_needs_details,
        updated_at
      ) VALUES (
        ${email},
        ${zipCode},
        ${notificationPreference},
        ${parseInt(alertRadius)},
        ${emergencyContacts},
        ${specialNeeds},
        ${specialNeedsDetails},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (email) DO UPDATE SET
        zip_code = EXCLUDED.zip_code,
        notification_preference = EXCLUDED.notification_preference,
        alert_radius = EXCLUDED.alert_radius,
        emergency_contacts = EXCLUDED.emergency_contacts,
        special_needs = EXCLUDED.special_needs,
        special_needs_details = EXCLUDED.special_needs_details,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      preferences: result.rows[0]
    });

  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save preferences' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT 
        zip_code,
        notification_preference,
        alert_radius,
        emergency_contacts,
        special_needs,
        special_needs_details,
        updated_at
      FROM user_preferences
      WHERE email = ${email}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No preferences found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      preferences: result.rows[0]
    });

  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}

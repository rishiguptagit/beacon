import { config } from 'dotenv';
import * as path from 'path';
import { sql } from '@vercel/postgres';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

async function setupDatabase() {
  try {
    console.log('Creating official_incidents table...');
    await sql`
      CREATE TABLE IF NOT EXISTS official_incidents (
        id SERIAL PRIMARY KEY,
        external_id TEXT UNIQUE NOT NULL,
        source TEXT NOT NULL,
        incident_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        location POINT,
        magnitude REAL,
        status TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        occurred_at TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `;
    console.log('Creating spatial index...');
    await sql`
      CREATE INDEX IF NOT EXISTS official_incidents_location_idx 
      ON official_incidents USING GIST (location);
    `;

    console.log('Creating user_reported_incidents table...');
    await sql`
      CREATE TABLE IF NOT EXISTS user_reported_incidents (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        incident_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        location POINT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        occurred_at TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS user_reported_incidents_location_idx 
      ON user_reported_incidents USING GIST (location);
    `;

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

setupDatabase().catch(console.error);

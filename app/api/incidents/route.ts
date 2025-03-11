import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

interface Incident {
  id: number;
  source: string;
  incident_type: string;
  location: string;
  longitude: number;
  latitude: number;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  reported_at: string;
  last_updated_at: string;
  status: string;
  expected_resolution_time?: string;
  official_guidance?: string;
  affected_radius_meters?: number;
  external_reference_id?: string;
}

export async function GET(request: Request) {
  try {
    // First test basic database connectivity
    try {
      await sql`SELECT 1;`;
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: dbError instanceof Error ? dbError.message : 'Unknown error',
        incidents: [],
        count: 0
      }, { status: 500 });
    }

    // Then ensure PostGIS is available
    try {
      await sql`SELECT PostGIS_Version();`;
    } catch (postgisError) {
      console.log('PostGIS not found, attempting to create extension');
      try {
        await sql`CREATE EXTENSION IF NOT EXISTS postgis;`;
        // Verify PostGIS is now working
        await sql`SELECT PostGIS_Version();`;
        console.log('PostGIS extension created and verified');
      } catch (error) {
        console.error('Failed to initialize PostGIS:', error);
        return NextResponse.json({
          success: false,
          error: 'Database configuration error',
          details: 'Failed to initialize PostGIS extension',
          incidents: [],
          count: 0
        }, { status: 500 });
      }
    }

    // Get center coordinates and radius from query params
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radiusMiles = parseFloat(searchParams.get('radius') || '50');
    
    // Convert miles to meters for the database query
    const radiusMeters = radiusMiles * 1609.34;
    // Get active incidents within radius using PostGIS
    console.log('Querying incidents with params:', { lat, lng, radiusMeters });
    let result;
    try {
      result = await sql`
        WITH point_query AS (
          SELECT ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography AS center_point
        )
        SELECT 
          id,
          source,
          incident_type,
          location,
          ST_X(coordinates::geometry) as longitude,
          ST_Y(coordinates::geometry) as latitude,
          description,
          severity,
          reported_at,
          last_updated_at,
          status,
          expected_resolution_time,
          official_guidance,
          affected_radius_meters,
          external_reference_id,
          ST_Distance(
            coordinates::geography,
            (SELECT center_point FROM point_query)
          ) as distance_meters
        FROM official_incidents
        WHERE 
          status != 'resolved'
          AND last_updated_at > NOW() - INTERVAL '24 hours'
          AND ST_DWithin(
            coordinates::geography,
            (SELECT center_point FROM point_query),
            ${radiusMeters}
          )
        ORDER BY 
          CASE severity
            WHEN 'Critical' THEN 1
            WHEN 'High' THEN 2
            WHEN 'Medium' THEN 3
            WHEN 'Low' THEN 4
            ELSE 5
          END,
          distance_meters ASC;
      `;

      // Ensure we always return an array, even if empty
      const incidents = result.rows || [];
      console.log(`Found ${incidents.length} incidents`);
      return NextResponse.json({ 
        success: true,
        incidents,
        count: incidents.length
      });
    } catch (queryError) {
      console.error('Failed to execute incidents query:', queryError);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch incidents',
        details: queryError instanceof Error ? queryError.message : 'Error executing query',
        incidents: [],
        count: 0
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch incidents',
      details: error instanceof Error ? error.message : 'Unknown database error',
      incidents: [],
      count: 0
    }, { status: 500 });
  }
}

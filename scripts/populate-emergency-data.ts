import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

import { sql } from '@vercel/postgres';
import { Point, Feature, GeoJSON } from 'geojson';

type EarthquakeProperties = {
  mag: number;
  place: string;
  time: number;
  alert?: string;
  status: string;
  type: string;
  id: string;
};

type EarthquakeFeature = Feature<Point, EarthquakeProperties>;

async function upsertOfficialIncident(incident: {
  source: string;
  incident_type: string;
  title: string;
  description: string;
  location: Point;
  magnitude?: number;
  status: string;
  external_id: string;
  occurred_at: Date;
}) {
  try {
    await sql`
      INSERT INTO official_incidents (
        source,
        incident_type,
        title,
        description,
        location,
        magnitude,
        status,
        external_id,
        occurred_at
      ) VALUES (
        ${incident.source},
        ${incident.incident_type},
        ${incident.title},
        ${incident.description},
        point(${incident.location.coordinates[0]}, ${incident.location.coordinates[1]})::point,
        ${incident.magnitude},
        ${incident.status},
        ${incident.external_id},
        ${incident.occurred_at.toISOString()}
      ) ON CONFLICT (external_id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        location = EXCLUDED.location,
        magnitude = EXCLUDED.magnitude,
        status = EXCLUDED.status,
        occurred_at = EXCLUDED.occurred_at
    `;
    console.log(`Upserted incident: ${incident.source} - ${incident.incident_type} - ${incident.title}`);
  } catch (error) {
    console.error('Error upserting official incident:', error);
    throw error;
  }
}

async function fetchAndStoreEmergencyData() {
  try {
    console.log('Fetching emergency data...');

    // Calculate dates for historical data (last 5 years)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 5);

    // Fetch historical earthquake data
    console.log('Fetching historical earthquake data...');
    // Fetch all earthquakes in batches to handle the large amount of data
    console.log(`Fetching earthquakes from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    // We'll fetch data year by year to avoid timeouts and memory issues
    const earthquakes: EarthquakeFeature[] = [];
    let currentStart = new Date(startDate);
    let currentEnd = new Date(currentStart);
    currentEnd.setFullYear(currentStart.getFullYear() + 1);

    while (currentStart < endDate) {
      if (currentEnd > endDate) {
        currentEnd = new Date(endDate);
      }
      
      console.log(`Fetching batch: ${currentStart.toISOString()} to ${currentEnd.toISOString()}`);
      try {
        console.log('Sending request to USGS API...');
        const batchResponse = await fetch(
          `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${currentStart.toISOString()}&endtime=${currentEnd.toISOString()}&limit=20000`
        );

        if (!batchResponse.ok) {
          const errorText = await batchResponse.text();
          throw new Error(`Failed to fetch earthquake batch: ${batchResponse.status} ${batchResponse.statusText}\nAPI Response: ${errorText}`);
        }

        console.log('Parsing response...');
        const batchData = await batchResponse.json();
        
        // Validate the response structure
        if (!batchData.features || !Array.isArray(batchData.features)) {
          throw new Error('Invalid response format from USGS API');
        }

        earthquakes.push(...batchData.features);
        console.log(`Fetched ${batchData.features.length} earthquakes for this batch`);

        // Add a delay between requests to avoid rate limiting
        console.log('Waiting before next request...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error fetching batch:', error);
        throw error;
      }


      // Move to next year
      currentStart.setFullYear(currentStart.getFullYear() + 1);
      currentEnd.setFullYear(currentEnd.getFullYear() + 1);

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`Total earthquakes fetched: ${earthquakes.length}`);

    // Fetch EONET data (limited to 365 days by API)
    console.log('Fetching EONET data...');
    const eonetResponse = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?days=365');

    if (!eonetResponse.ok) {
      throw new Error('Failed to fetch EONET data');
    }

    const eonetData = await eonetResponse.json();

    console.log(`Processing ${earthquakes.length} earthquakes...`);
    // Process earthquake data
    for (const feature of earthquakes) {
      if (!feature.properties.id) {
        console.warn('Skipping earthquake with no ID:', feature);
        continue;
      }
      
      try {
        await upsertOfficialIncident({
          source: 'USGS',
          incident_type: 'earthquake',
          title: `M${feature.properties.mag} - ${feature.properties.place}`,
          description: `Magnitude ${feature.properties.mag} earthquake near ${feature.properties.place}`,
          location: feature.geometry,
          magnitude: feature.properties.mag,
          status: feature.properties.status || 'unknown',
          external_id: `usgs-${feature.properties.id}`,  // Adding prefix to ensure uniqueness
          occurred_at: new Date(feature.properties.time)
        });
      } catch (error) {
        console.error('Error processing earthquake:', {
          id: feature.properties.id,
          mag: feature.properties.mag,
          place: feature.properties.place,
          error
        });
        throw error;
      }
    }

    console.log(`Processing ${eonetData.events.length} EONET events...`);
    // Process EONET data
    for (const event of eonetData.events) {
      if (event.geometry && event.geometry[0]) {
        const geometry = event.geometry[0];
        await upsertOfficialIncident({
          source: 'NASA_EONET',
          incident_type: event.categories[0].title.toLowerCase(),
          title: event.title,
          description: event.description || event.title,
          location: {
            type: 'Point',
            coordinates: [geometry.coordinates[0], geometry.coordinates[1]]
          },
          status: 'ongoing',
          external_id: `eonet-${event.id}`,
          occurred_at: new Date(geometry.date)
        });
      }
    }

    console.log('Successfully populated emergency data!');
  } catch (error) {
    console.error('Error populating emergency data:', error);
    throw error;
  }
}

// Run the script
fetchAndStoreEmergencyData()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

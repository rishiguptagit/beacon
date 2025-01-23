'use client';
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Get your access token from Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// Update type definitions after imports
type DisasterFeature = {
  geometry: {
    coordinates: [number, number, number]
  };
  properties: {
    mag: number;
    place: string;
    time: number;
    title: string;
    type: string;
    url: string;
  };
};

type EonetEvent = {
  title: string;
  geometry: [{
    coordinates: [number, number];
    date: string;
  }];
  categories: [{
    title: string;
  }];
  sources: [{
    url: string;
  }];
};

export default function Dashboard() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-98.5795, 39.8283],
      zoom: 3
    });

    const fetchEmergencies = async () => {
      try {
        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Fetch earthquakes
        const earthquakeResponse = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
        const earthquakeData = await earthquakeResponse.json();

        // Fetch NASA EONET events (fires, storms, etc.)
        const eonetResponse = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events');
        const eonetData = await eonetResponse.json();

        // Add earthquake markers
        earthquakeData.features.forEach((quake: DisasterFeature) => {
          const marker = new mapboxgl.Marker({ color: '#ff0000' })
            .setLngLat([quake.geometry.coordinates[0], quake.geometry.coordinates[1]])
            .setPopup(
              new mapboxgl.Popup().setHTML(`
                <div class="p-2 bg-gray-800 text-white rounded-lg shadow-lg">
                  <h3 class="font-bold text-lg mb-2">Earthquake</h3>
                  <p class="text-gray-300">Magnitude ${quake.properties.mag}</p>
                  <p class="text-gray-300">${quake.properties.place}</p>
                  <p class="text-gray-300">Time: ${new Date(quake.properties.time).toLocaleString()}</p>
                </div>
              `)
            )
            .addTo(map.current!);
          markersRef.current.push(marker);
        });

        // Add EONET event markers
        eonetData.events.forEach((event: EonetEvent) => {
          const coordinates = event.geometry[0].coordinates;
          const marker = new mapboxgl.Marker({ color: '#ff8c00' })
            .setLngLat([coordinates[0], coordinates[1]])
            .setPopup(
              new mapboxgl.Popup().setHTML(`
                <div class="p-2 bg-gray-800 text-white rounded-lg shadow-lg">
                  <h3 class="font-bold text-lg mb-2">${event.title}</h3>
                  <p class="text-gray-300">Type: ${event.categories[0].title}</p>
                  <p class="text-gray-300">Date: ${new Date(event.geometry[0].date).toLocaleString()}</p>
                  <a href="${event.sources[0].url}" target="_blank" class="text-blue-400 hover:text-blue-300">
                  </a>
                </div>
              `)
            )
            .addTo(map.current!);
          markersRef.current.push(marker);
        });

      } catch (error) {
        console.error('Error fetching emergencies:', error);
      }
    };

    fetchEmergencies();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchEmergencies, 300000);

    return () => {
      clearInterval(interval);
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div ref={mapContainer} className="w-full h-screen" />
    </div>
  );
}

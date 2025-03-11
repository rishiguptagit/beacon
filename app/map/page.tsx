'use client';

import { useEffect, useRef, useState, FormEvent } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import type { Feature, Polygon } from 'geojson';

// Neural network background animation component
const NeuralBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-200/30 via-gray-200/30 to-slate-200/30" />
      <svg className="absolute w-full h-full opacity-[0.02]">
        <pattern id="neural-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <circle cx="25" cy="25" r="1" fill="currentColor" />
          <line x1="25" y1="25" x2="50" y2="25" stroke="currentColor" strokeWidth="0.5" />
          <line x1="25" y1="25" x2="25" y2="50" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#neural-pattern)" />
      </svg>
    </div>
  );
};

// Define incident types
type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

interface Incident {
  id: number;
  source: string;
  incident_type: string;
  location: string;
  longitude: number;
  latitude: number;
  description: string;
  severity: SeverityLevel;
  reported_at: string;
  last_updated_at: string;
  status: string;
  expected_resolution_time?: string;
  official_guidance?: string;
  affected_radius_meters?: number;
  external_reference_id?: string;
}

// Severity color mapping
const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  'Critical': 'bg-red-600',
  'High': 'bg-orange-500',
  'Medium': 'bg-yellow-500',
  'Low': 'bg-blue-500'
};

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [zipCode, setZipCode] = useState('94582');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const radiusCircle = useRef<mapboxgl.GeoJSONSource | null>(null);
  
  // Function to convert miles to meters
  const milesToMeters = (miles: number) => miles * 1609.34;
  
  // Function to create a circle polygon given a center point and radius
  const createGeoJSONCircle = (center: [number, number], radiusMiles: number) => {
    const points = 64;
    const radiusMeters = milesToMeters(radiusMiles);
    const coords: GeoJSON.Feature<GeoJSON.Polygon> = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[]]
      },
      properties: {}
    };
    
    const coordinates: [number, number][] = [];
    
    for (let i = 0; i < points; i++) {
      const angle = (i * 2 * Math.PI) / points;
      const lat = center[1] + (radiusMeters / 111320) * Math.cos(angle);
      const lon = center[0] + (radiusMeters / (111320 * Math.cos(center[1] * (Math.PI / 180)))) * Math.sin(angle);
      coordinates.push([lon, lat]);
    }
    
    // Close the circle
    coordinates.push(coordinates[0]);
    coords.geometry.coordinates = [coordinates];
    
    return coords;
  };

  // Function to handle zip code search
  const loadIncidents = async (lat: number, lng: number) => {
    try {
      setError('');
      setLoading(true);

      // Use the correct port from the dev server
      const response = await fetch(
        `/api/incidents?lat=${lat}&lng=${lng}&radius=50`
      );
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.error || 'Network response was not ok';
        const details = data.details ? `: ${data.details}` : '';
        throw new Error(`${errorMessage}${details}`);
      }
      
      if (!data.success) {
        const details = data.details ? `: ${data.details}` : '';
        throw new Error(`${data.error || 'Failed to fetch incidents'}${details}`);
      }

      // Clear existing markers
      document.querySelectorAll('.incident-marker').forEach(el => el.remove());

      // Update incidents state
      const incidents = data.incidents || [];
      setIncidents(incidents);

      if (incidents.length === 0) {
        setError('No active incidents found in this area');
      }
      setLoading(false);

      // Add markers for each incident
      incidents.forEach((incident: Incident) => {
        const markerEl = document.createElement('div');
        markerEl.className = 'incident-marker';

        // Create marker element with severity-based styling
        const marker = document.createElement('div');
        const severityColor = SEVERITY_COLORS[incident.severity] || 'bg-gray-500';

        const pulseAnimation = incident.severity === 'Critical' ? 'animate-pulse' : '';
        
        marker.className = `w-6 h-6 rounded-full ${severityColor} border-2 border-white shadow-lg
          relative flex items-center justify-center text-white text-xs font-bold
          ${pulseAnimation} cursor-pointer`;
        marker.innerHTML = '!';

        // Add affected radius if available
        if (incident.affected_radius_meters) {
          const radiusCircle = new mapboxgl.Marker({
            element: document.createElement('div'),
            anchor: 'center'
          })
            .setLngLat([incident.longitude, incident.latitude])
            .addTo(map.current!);

          const el = radiusCircle.getElement();
          const radiusInPixels = incident.affected_radius_meters / 10; // Scale down for visibility
          el.className = `rounded-full border-2 ${severityColor} opacity-10`;
          el.style.width = `${radiusInPixels}px`;
          el.style.height = `${radiusInPixels}px`;
        }

        markerEl.appendChild(marker);

        // Add detailed popup
        const popup = new mapboxgl.Popup({ offset: 25, maxWidth: '300px' })
          .setHTML(
            `<div class="p-3">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-1 text-xs font-bold rounded ${severityColor} text-white">
                  ${incident.severity}
                </span>
                <h3 class="font-bold text-slate-900">${incident.incident_type}</h3>
              </div>
              <p class="text-sm text-slate-600 mb-2">${incident.description}</p>
              ${incident.official_guidance ? 
                `<div class="bg-blue-50 p-2 rounded-md mb-2">
                  <p class="text-sm text-blue-800 font-medium">Official Guidance:</p>
                  <p class="text-sm text-blue-600">${incident.official_guidance}</p>
                </div>` : 
                ''
              }
              <div class="text-xs text-slate-500 space-y-1">
                <p>Source: ${incident.source}</p>
                <p>Location: ${incident.location}</p>
                <p>Reported: ${new Date(incident.reported_at).toLocaleString()}</p>
                ${incident.expected_resolution_time ? 
                  `<p>Expected Resolution: ${new Date(incident.expected_resolution_time).toLocaleString()}</p>` : 
                  ''
                }
              </div>
            </div>`
          );

        // Add marker to map
        new mapboxgl.Marker(markerEl)
          .setLngLat([incident.longitude, incident.latitude])
          .setPopup(popup)
          .addTo(map.current!);
      });
    } catch (error) {
      console.error('Error loading incidents:', error);
    }
  };

  const handleZipCodeSearch = async (e: FormEvent | null, initialZipCode?: string) => {
    if (e) e.preventDefault();
    const searchZipCode = initialZipCode || zipCode;
    setError('');
    
    try {
      // Call Mapbox Geocoding API to convert zip code to coordinates
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchZipCode}.json?country=US&types=postcode&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        
        // Load incidents for this location
        await loadIncidents(lat, lng);
        
        // Fly to the location
        map.current?.flyTo({
          center: [lng, lat],
          zoom: 9,
          essential: true
        });
        
        // Create or update the radius circle
        const circleData = createGeoJSONCircle([lng, lat], 50);
        
        if (!map.current?.getSource('radius-circle')) {
          // First time - add source and layer
          map.current?.addSource('radius-circle', {
            type: 'geojson',
            data: circleData
          });
          
          map.current?.addLayer({
            id: 'radius-circle-fill',
            type: 'fill',
            source: 'radius-circle',
            paint: {
              'fill-color': '#3b82f6',  // Bright blue
              'fill-opacity': 0.15
            }
          });
          
          map.current?.addLayer({
            id: 'radius-circle-border',
            type: 'line',
            source: 'radius-circle',
            paint: {
              'line-color': '#2563eb',  // Darker blue
              'line-width': 3,
              'line-dasharray': [3, 3]
            }
          });
        } else {
          // Update existing circle
          const source = map.current?.getSource('radius-circle') as mapboxgl.GeoJSONSource;
          source.setData(circleData as any);
        }
      } else {
        setError('Zip code not found');
      }
    } catch (err) {
      setError('Error searching zip code');
      console.error(err);
    }
  };

  // Load user's zip code
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const response = await fetch('/api/user-preferences');
        const data = await response.json();
        setZipCode(data.zipCode);
        // Trigger search with the loaded zip code
        handleZipCodeSearch(null, data.zipCode);
      } catch (error) {
        console.error('Error loading user preferences:', error);
        setError('Failed to load preferences. Using default location.');
        // Use default zip code
        handleZipCodeSearch(null, '94582');
      }
    };

    loadUserPreferences();
  }, []);

  useEffect(() => {
    // Get Mapbox token from environment variable
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!mapboxToken) {
      console.error('Mapbox token not found');
      return;
    }

    // Initialize Mapbox
    mapboxgl.accessToken = mapboxToken;

    if (mapContainer.current && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',  // Neutral theme
        center: [-98.5795, 39.8283],  // Center of US
        zoom: 3,
        projection: 'globe'  // Use globe projection for world view
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl());

      // Add scale control
      map.current.addControl(new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'imperial'
      }));

      map.current.on('style.load', () => {
        setLoading(false);

        // Add atmosphere and glow effects for globe view
        map.current?.setFog({
          color: 'rgb(176, 186, 197)',  // Neutral fog
          'high-color': 'rgb(176, 186, 197)',
          'horizon-blend': 0.4,
          'space-color': 'rgb(230, 236, 240)',
          'star-intensity': 0.6
        });
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 relative">
      <NeuralBackground />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {loading && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-blue-600">Loading incidents...</p>
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        <form onSubmit={handleZipCodeSearch} className="mb-6">
          <div className="flex gap-4 max-w-md mx-auto">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter ZIP code"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 font-medium placeholder:text-slate-500"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                pattern="[0-9]{5}"
                maxLength={5}
                required
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900">
            Emergency Map
          </h1>
          <p className="text-slate-600 mt-2">
            View and monitor emergency situations worldwide
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-400/10"
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 z-10">
              <div className="w-12 h-12 border-4 border-slate-500/30 border-t-slate-500 rounded-full animate-spin" />
            </div>
          )}
          <div
            ref={mapContainer}
            className="w-full h-[70vh] rounded-2xl"
          />
        </motion.div>
      </div>
    </div>
  );
}
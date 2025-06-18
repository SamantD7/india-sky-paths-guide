
import React, { useEffect, useRef, useState } from 'react';
import MapApiKeyForm from './MapApiKeyForm';

const GoogleMap = ({ sourceAirport, destinationAirport, route }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const apiKey = localStorage.getItem('map_api_key');
    if (apiKey && apiKey !== 'demo_key_for_sky_path') {
      setHasApiKey(true);
      loadGoogleMaps(apiKey);
    } else {
      setHasApiKey(false);
    }
  }, []);

  const loadGoogleMaps = (apiKey) => {
    if (window.google) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.async = true;
    script.onload = () => {
      initializeMap();
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps API');
      // Fall back to demo mode
      initializeDemoMap();
    };
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 5,
      center: { lat: 20.5937, lng: 78.9629 }, // Center of India
      mapTypeId: 'terrain',
    });

    setMapLoaded(true);
    
    // Add markers and route if available
    if (sourceAirport && destinationAirport) {
      addMarkersAndRoute(map);
    }
  };

  const initializeDemoMap = () => {
    if (!mapRef.current) return;
    
    // Create a simple demo visualization
    mapRef.current.innerHTML = `
      <div style="
        width: 100%; 
        height: 100%; 
        background: linear-gradient(to bottom, #87CEEB, #98FB98);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        color: #333;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h3 style="margin: 0 0 10px 0;">Demo Map View</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">
            ${sourceAirport && destinationAirport ? 
              `Route: ${sourceAirport.code} → ${destinationAirport.code}` : 
              'Select airports to see route visualization'}
          </p>
          ${route ? `
            <div style="margin-top: 10px; font-size: 12px; color: #888;">
              Distance: ${route.distance.toFixed(2)} km<br>
              Duration: ${route.duration.toFixed(2)} min<br>
              Path: ${route.path.join(' → ')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
    setMapLoaded(true);
  };

  const addMarkersAndRoute = (map) => {
    if (!sourceAirport || !destinationAirport || !window.google) return;

    // Add source marker
    new window.google.maps.Marker({
      position: { lat: sourceAirport.position.lat, lng: sourceAirport.position.lng },
      map: map,
      title: `${sourceAirport.name} (${sourceAirport.code})`,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <circle cx="12" cy="12" r="8" fill="#22c55e" stroke="white" stroke-width="2"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">S</text>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(30, 30)
      }
    });

    // Add destination marker
    new window.google.maps.Marker({
      position: { lat: destinationAirport.position.lat, lng: destinationAirport.position.lng },
      map: map,
      title: `${destinationAirport.name} (${destinationAirport.code})`,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <circle cx="12" cy="12" r="8" fill="#ef4444" stroke="white" stroke-width="2"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">D</text>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(30, 30)
      }
    });

    // Draw route if available
    if (route && route.path) {
      // This is a simplified route drawing - in a real app you'd get actual coordinates for each airport
      const routePath = [
        { lat: sourceAirport.position.lat, lng: sourceAirport.position.lng },
        { lat: destinationAirport.position.lat, lng: destinationAirport.position.lng }
      ];

      new window.google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: '#3b82f6',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map
      });
    }

    // Fit map to show both airports
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: sourceAirport.position.lat, lng: sourceAirport.position.lng });
    bounds.extend({ lat: destinationAirport.position.lat, lng: destinationAirport.position.lng });
    map.fitBounds(bounds);
  };

  useEffect(() => {
    if (mapLoaded && sourceAirport && destinationAirport) {
      // Re-initialize map with new data
      if (window.google) {
        initializeMap();
      } else {
        initializeDemoMap();
      }
    }
  }, [sourceAirport, destinationAirport, route, mapLoaded]);

  const handleApiKeySet = () => {
    const apiKey = localStorage.getItem('map_api_key');
    if (apiKey && apiKey !== 'demo_key_for_sky_path') {
      setHasApiKey(true);
      loadGoogleMaps(apiKey);
    } else {
      setHasApiKey(false);
      initializeDemoMap();
    }
  };

  if (!hasApiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <MapApiKeyForm onKeySet={handleApiKeySet} />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default GoogleMap;

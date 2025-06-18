
import React, { useEffect, useRef, useState } from 'react';
import MapApiKeyForm from './MapApiKeyForm';

const GoogleMap = ({ sourceAirport, destinationAirport, route }) => {
  const mapRef = useRef(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const apiKey = localStorage.getItem('map_api_key');
    if (apiKey) {
      setHasApiKey(true);
    }
  }, []);

  useEffect(() => {
    if (!hasApiKey || !mapRef.current) return;

    // Simple map placeholder since we don't have actual Google Maps integration
    const mapElement = mapRef.current;
    mapElement.innerHTML = `
      <div style="
        width: 100%; 
        height: 100%; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        font-family: system-ui;
        text-align: center;
        padding: 20px;
      ">
        <h2 style="margin: 0 0 20px 0; font-size: 24px;">Flight Route Map</h2>
        ${sourceAirport ? `<p style="margin: 5px 0;">Source: ${sourceAirport.city} (${sourceAirport.code})</p>` : ''}
        ${destinationAirport ? `<p style="margin: 5px 0;">Destination: ${destinationAirport.city} (${destinationAirport.code})</p>` : ''}
        ${route ? `
          <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px;">
            <p style="margin: 5px 0;">Route: ${route.path.join(' → ')}</p>
            <p style="margin: 5px 0;">Distance: ${route.distance.toFixed(2)} km</p>
            <p style="margin: 5px 0;">Algorithm: ${route.algorithm}</p>
          </div>
        ` : ''}
        <p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
          Interactive map would be displayed here with Google Maps API integration
        </p>
      </div>
    `;
    
    setMap(mapElement);
  }, [hasApiKey, sourceAirport, destinationAirport, route]);

  if (!hasApiKey) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <MapApiKeyForm onKeySet={() => setHasApiKey(true)} />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
};

export default GoogleMap;

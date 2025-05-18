
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Polyline, Marker } from '@react-google-maps/api';
import { Airport, Route } from "@/types/aviation";
import { Skeleton } from "@/components/ui/skeleton";

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };
const DEFAULT_ZOOM = 5;

interface GoogleMapComponentProps {
  sourceAirport: Airport | null;
  destinationAirport: Airport | null;
  route: Route | null;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const GoogleMapComponent = ({ sourceAirport, destinationAirport, route }: GoogleMapComponentProps) => {
  // Get the API key from localStorage to avoid hardcoded keys
  const apiKey = localStorage.getItem('map_api_key') || '';
  const [mapReady, setMapReady] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  // Load the Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    // Important to prevent multiple instances loading
    id: 'google-map-script',
  });

  // Create a path from the route path
  const getPathCoordinates = () => {
    if (!route || !route.path.length) return [];
    
    return route.path.map(airportCode => {
      const airport = [sourceAirport, destinationAirport, ...dummyAirports].find(
        a => a && a.code === airportCode
      );
      return airport ? { lat: airport.position.lat, lng: airport.position.lng } : null;
    }).filter(Boolean) as google.maps.LatLngLiteral[];
  };

  // Define a list of dummy airports in case we need them for path rendering
  const dummyAirports = [
    { code: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi", position: { lat: 28.5561, lng: 77.1000 } },
    { code: "BOM", name: "Chhatrapati Shivaji International Airport", city: "Mumbai", position: { lat: 19.0896, lng: 72.8656 } },
    { code: "MAA", name: "Chennai International Airport", city: "Chennai", position: { lat: 12.9941, lng: 80.1709 } },
    { code: "BLR", name: "Kempegowda International Airport", city: "Bangalore", position: { lat: 13.1986, lng: 77.7066 } },
    { code: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", position: { lat: 22.6520, lng: 88.4463 } },
    { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", position: { lat: 17.2403, lng: 78.4294 } },
    { code: "GOI", name: "Dabolim Airport", city: "Goa", position: { lat: 15.3808, lng: 73.8314 } },
    { code: "JAI", name: "Jaipur International Airport", city: "Jaipur", position: { lat: 26.8242, lng: 75.8122 } },
    { code: "COK", name: "Cochin International Airport", city: "Kochi", position: { lat: 10.1520, lng: 76.3920 } },
    { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad", position: { lat: 23.0722, lng: 72.6193 } },
    { code: "IXC", name: "Chandigarh International Airport", city: "Chandigarh", position: { lat: 30.6735, lng: 76.7885 } },
    { code: "PNQ", name: "Pune Airport", city: "Pune", position: { lat: 18.5793, lng: 73.9089 } },
  ];

  // Callback for when the map loads
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setMapReady(true);
  }, []);

  // Center and zoom map to show the route whenever the route changes
  useEffect(() => {
    if (map && route && route.path.length > 0) {
      const pathCoordinates = getPathCoordinates();
      
      if (pathCoordinates.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        
        pathCoordinates.forEach(coord => {
          bounds.extend(coord);
        });
        
        // Adjust the viewport to fit the route
        map.fitBounds(bounds);
        
        // If only one point or very close points, set a reasonable zoom level
        if (map.getZoom() && map.getZoom()! > 10) {
          map.setZoom(10);
        }
      }
    }
  }, [map, route]);

  // Always show loading state first, regardless of error
  if (!isLoaded) {
    return <Skeleton className="w-full h-full" />;
  }

  // Only show error after loading if there's an actual API error
  if (loadError) {
    return <div className="flex items-center justify-center h-full bg-gray-100 p-4">
      <p className="text-red-500">Map cannot be loaded. Please check your API key.</p>
    </div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={INDIA_CENTER}
      zoom={DEFAULT_ZOOM}
      onLoad={onMapLoad}
    >
      {sourceAirport && (
        <Marker 
          position={sourceAirport.position}
          label={{
            text: sourceAirport.code,
            color: '#ffffff',
            fontWeight: 'bold',
          }}
          title={`${sourceAirport.city} (${sourceAirport.code})`}
          icon={{
            path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
            fillColor: '#FF0000',
            fillOpacity: 0.8,
            strokeWeight: 1,
            scale: 0.5,
          }}
        />
      )}
      
      {destinationAirport && (
        <Marker
          position={destinationAirport.position}
          label={{
            text: destinationAirport.code,
            color: '#ffffff',
            fontWeight: 'bold',
          }}
          title={`${destinationAirport.city} (${destinationAirport.code})`}
          icon={{
            path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
            fillColor: '#0000FF',
            fillOpacity: 0.8,
            strokeWeight: 1,
            scale: 0.5,
          }}
        />
      )}
      
      {route && route.path.length > 1 && (
        <Polyline
          path={getPathCoordinates()}
          options={{
            strokeColor: '#9b87f5',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            geodesic: true,
          }}
        />
      )}

      {/* Render intermediate airports in the route */}
      {route && route.path.length > 2 && route.path.slice(1, -1).map(airportCode => {
        const airport = dummyAirports.find(a => a.code === airportCode);
        if (!airport) return null;
        
        return (
          <Marker
            key={airport.code}
            position={airport.position}
            label={{
              text: airport.code,
              color: '#ffffff',
              fontWeight: 'bold',
            }}
            title={`${airport.city} (${airport.code})`}
            icon={{
              path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
              fillColor: '#00FF00',
              fillOpacity: 0.8,
              strokeWeight: 1,
              scale: 0.4,
            }}
          />
        );
      })}
    </GoogleMap>
  );
};

export default GoogleMapComponent;

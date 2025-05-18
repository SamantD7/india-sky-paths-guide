
import React, { useEffect, useRef, useState } from "react";
import { Airport, Route } from "@/types/aviation";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";

interface FlightMapProps {
  sourceAirport: Airport | null;
  destinationAirport: Airport | null;
  route: Route | null;
}

const FlightMap = ({ sourceAirport, destinationAirport, route }: FlightMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapAPIKey, setMapAPIKey] = useState<string | null>(null);
  
  // In a production app, you would fetch this from environment variables or your backend
  // For now, let's create a form to input it for demonstration
  const [showKeyInput, setShowKeyInput] = useState(true);
  
  useEffect(() => {
    // Check if we already have the API key in localStorage
    const savedKey = localStorage.getItem("map_api_key");
    if (savedKey) {
      setMapAPIKey(savedKey);
      setShowKeyInput(false);
    }
  }, []);

  useEffect(() => {
    if (!mapAPIKey || !mapRef.current) return;
    
    // This is a mock function to simulate map loading
    // In a real implementation, you would initialize Google Maps here
    const loadMap = () => {
      // Placeholder for actual map initialization
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gray-100 rounded-md">
              <div class="text-center p-4">
                <div class="font-medium">Map Simulation</div>
                <p class="text-sm text-muted-foreground mt-2">
                  ${sourceAirport && destinationAirport 
                    ? `Showing route from ${sourceAirport.code} to ${destinationAirport.code}` 
                    : 'Select airports to view route'}
                </p>
                ${route ? `
                  <div class="mt-4 p-2 bg-white rounded shadow-sm text-left">
                    <div class="text-xs">Route: ${route.path.join(' → ')}</div>
                    <div class="text-xs">Distance: ${route.distance.toFixed(2)} km</div>
                    <div class="text-xs">Duration: ${route.duration.toFixed(2)} min</div>
                  </div>
                ` : ''}
              </div>
            </div>
          `;
          setMapLoaded(true);
        }
      }, 1000);
    };
    
    loadMap();
    
    // In a real implementation, you would need cleanup code here
    return () => {
      // Map cleanup code would go here
    };
  }, [mapAPIKey, sourceAirport, destinationAirport, route]);

  const handleSubmitKey = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const key = formData.get("apiKey") as string;
    
    if (key) {
      localStorage.setItem("map_api_key", key);
      setMapAPIKey(key);
      setShowKeyInput(false);
    }
  };

  if (showKeyInput) {
    return (
      <Card className="p-6">
        <div className="text-center mb-4">
          <h3 className="font-medium">Google Maps API Key Required</h3>
          <p className="text-sm text-muted-foreground">
            Enter your Google Maps API key to enable the map
          </p>
        </div>
        <form onSubmit={handleSubmitKey} className="space-y-4">
          <div>
            <input
              name="apiKey"
              type="text"
              placeholder="Enter API Key"
              className="w-full p-2 border rounded"
            />
            <p className="text-xs mt-1 text-muted-foreground">
              For now, any value will work as this is a simulation
            </p>
          </div>
          <Button type="submit" className="w-full">
            Set API Key
          </Button>
        </form>
      </Card>
    );
  }

  return (
    <div className="relative h-full">
      {!mapLoaded && <Skeleton className="w-full h-full rounded-md" />}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-md border"
      />
      
      {/* Airport markers */}
      {sourceAirport && mapLoaded && (
        <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-md text-xs">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-red-500" />
            <span>Source: {sourceAirport.city} ({sourceAirport.code})</span>
          </div>
        </div>
      )}
      
      {destinationAirport && mapLoaded && (
        <div className="absolute top-12 left-4 bg-white p-2 rounded shadow-md text-xs">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-blue-500" />
            <span>Destination: {destinationAirport.city} ({destinationAirport.code})</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Import Button here to avoid circular dependency
import { Button } from "@/components/ui/button";

export default FlightMap;

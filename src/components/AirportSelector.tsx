
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Airport } from "@/types/aviation";
import { useEffect, useState } from "react";

interface AirportSelectorProps {
  sourceAirport: Airport | null;
  destinationAirport: Airport | null;
  onSourceChange: (airport: Airport | null) => void;
  onDestinationChange: (airport: Airport | null) => void;
  onCalculate: () => void;
  isLoading: boolean;
}

const AirportSelector = ({
  sourceAirport,
  destinationAirport,
  onSourceChange,
  onDestinationChange,
  onCalculate,
  isLoading
}: AirportSelectorProps) => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoadingAirports, setIsLoadingAirports] = useState(true);

  useEffect(() => {
    // Fetch airports from our API
    const fetchAirports = async () => {
      try {
        // For now, we'll use dummy data until our API is ready
        const dummyAirports = [
          { code: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi", position: { lat: 28.5561, lng: 77.1000 } },
          { code: "BOM", name: "Chhatrapati Shivaji International Airport", city: "Mumbai", position: { lat: 19.0896, lng: 72.8656 } },
          { code: "MAA", name: "Chennai International Airport", city: "Chennai", position: { lat: 12.9941, lng: 80.1709 } },
          { code: "BLR", name: "Kempegowda International Airport", city: "Bangalore", position: { lat: 13.1986, lng: 77.7066 } },
          { code: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", position: { lat: 22.6520, lng: 88.4463 } },
          { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", position: { lat: 17.2403, lng: 78.4294 } },
        ];
        setAirports(dummyAirports);
      } catch (error) {
        console.error("Failed to fetch airports:", error);
      } finally {
        setIsLoadingAirports(false);
      }
    };

    fetchAirports();
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="source" className="text-sm font-medium">
          Source Airport
        </label>
        <Select
          disabled={isLoadingAirports}
          value={sourceAirport?.code}
          onValueChange={(value) => {
            const airport = airports.find((a) => a.code === value) || null;
            onSourceChange(airport);
          }}
        >
          <SelectTrigger id="source">
            <SelectValue placeholder="Select source airport" />
          </SelectTrigger>
          <SelectContent>
            {airports.map((airport) => (
              <SelectItem key={airport.code} value={airport.code}>
                {airport.city} ({airport.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="destination" className="text-sm font-medium">
          Destination Airport
        </label>
        <Select
          disabled={isLoadingAirports}
          value={destinationAirport?.code}
          onValueChange={(value) => {
            const airport = airports.find((a) => a.code === value) || null;
            onDestinationChange(airport);
          }}
        >
          <SelectTrigger id="destination">
            <SelectValue placeholder="Select destination airport" />
          </SelectTrigger>
          <SelectContent>
            {airports.map((airport) => (
              <SelectItem key={airport.code} value={airport.code}>
                {airport.city} ({airport.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        className="w-full" 
        onClick={onCalculate}
        disabled={!sourceAirport || !destinationAirport || sourceAirport.code === destinationAirport.code || isLoading}
      >
        {isLoading ? "Calculating..." : "Calculate Optimal Path"}
      </Button>
    </div>
  );
};

export default AirportSelector;

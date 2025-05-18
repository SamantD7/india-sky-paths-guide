
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Airport } from "@/types/aviation";
import { useEffect, useState } from "react";
import { getAirports } from "@/api/aviation";

interface AirportSelectorProps {
  sourceAirport: Airport | null;
  destinationAirport: Airport | null;
  algorithm: string;
  onSourceChange: (airport: Airport | null) => void;
  onDestinationChange: (airport: Airport | null) => void;
  onAlgorithmChange: (algorithm: string) => void;
  onCalculate: () => void;
  isLoading: boolean;
}

const AirportSelector = ({
  sourceAirport,
  destinationAirport,
  algorithm,
  onSourceChange,
  onDestinationChange,
  onAlgorithmChange,
  onCalculate,
  isLoading
}: AirportSelectorProps) => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoadingAirports, setIsLoadingAirports] = useState(true);

  useEffect(() => {
    // Fetch airports from our API
    const fetchAirports = async () => {
      try {
        const airportsData = getAirports();
        setAirports(airportsData);
      } catch (error) {
        console.error("Failed to fetch airports:", error);
      } finally {
        setIsLoadingAirports(false);
      }
    };

    fetchAirports();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Route Parameters</h2>
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
                    {airport.city} - {airport.code}
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
                    {airport.city} - {airport.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="algorithm" className="text-sm font-medium">
              Algorithm
            </label>
            <Select 
              value={algorithm} 
              onValueChange={(value) => onAlgorithmChange(value)}
            >
              <SelectTrigger id="algorithm">
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dijkstra">Dijkstra</SelectItem>
                <SelectItem value="astar">A*</SelectItem>
                <SelectItem value="floyd-warshall">Floyd-Warshall</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button 
        className="w-full" 
        onClick={onCalculate}
        disabled={!sourceAirport || !destinationAirport || sourceAirport.code === destinationAirport.code || isLoading}
      >
        {isLoading ? "Calculating..." : "Find Optimal Route"}
      </Button>
      
      <div className="text-xs text-muted-foreground">
        Select source and destination airports to calculate the most efficient flight path using your chosen algorithm.
      </div>
    </div>
  );
};

export default AirportSelector;

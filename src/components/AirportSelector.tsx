
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Airport } from "@/types/aviation";
import { useEffect, useState } from "react";
import { getAirports } from "@/api/aviation";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FlightClass } from "@/utils/costCalculator";

interface AirportSelectorProps {
  sourceAirport: Airport | null;
  destinationAirport: Airport | null;
  algorithm: string;
  flightClass: FlightClass;
  onSourceChange: (airport: Airport | null) => void;
  onDestinationChange: (airport: Airport | null) => void;
  onAlgorithmChange: (algorithm: string) => void;
  onFlightClassChange: (flightClass: FlightClass) => void;
  onCalculate: () => void;
  isLoading: boolean;
}

const algorithmExplanations: Record<string, string> = {
  dijkstra: "Finds the shortest path from a starting node to all other nodes in a weighted graph.",
  astar: "An informed search algorithm that uses heuristics to find the shortest path faster.",
  "floyd-warshall": "Calculates shortest paths between all pairs of nodes in a graph.",
  "bellman-ford": "Detects negative-weight cycles and finds shortest paths, works with negative edge weights."
};

const AirportSelector = ({
  sourceAirport,
  destinationAirport,
  algorithm,
  flightClass,
  onSourceChange,
  onDestinationChange,
  onAlgorithmChange,
  onFlightClassChange,
  onCalculate,
  isLoading
}: AirportSelectorProps) => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoadingAirports, setIsLoadingAirports] = useState(true);
  const [showSourceInfo, setShowSourceInfo] = useState(false);
  const [showDestInfo, setShowDestInfo] = useState(false);

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

  const renderAirportTooltip = (airport: Airport | null) => {
    if (!airport) return null;
    
    return (
      <div className="flex flex-col gap-1">
        <div className="font-medium">{airport.name}</div>
        <div className="text-sm">City: {airport.city} | State: {airport.state}</div>
        <div className="text-sm font-semibold">IATA: {airport.code}</div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Route Parameters</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="source" className="text-sm font-medium">
              Source Airport
            </label>
            <TooltipProvider>
              <Tooltip open={showSourceInfo} onOpenChange={setShowSourceInfo}>
                <TooltipTrigger asChild>
                  <div>
                    <Select
                      disabled={isLoadingAirports}
                      value={sourceAirport?.code}
                      onValueChange={(value) => {
                        const airport = airports.find((a) => a.code === value) || null;
                        onSourceChange(airport);
                        if (airport) setShowSourceInfo(true);
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
                </TooltipTrigger>
                {sourceAirport && (
                  <TooltipContent side="right" className="p-3 bg-white shadow-lg border border-gray-200 rounded-md">
                    {renderAirportTooltip(sourceAirport)}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-2">
            <label htmlFor="destination" className="text-sm font-medium">
              Destination Airport
            </label>
            <TooltipProvider>
              <Tooltip open={showDestInfo} onOpenChange={setShowDestInfo}>
                <TooltipTrigger asChild>
                  <div>
                    <Select
                      disabled={isLoadingAirports}
                      value={destinationAirport?.code}
                      onValueChange={(value) => {
                        const airport = airports.find((a) => a.code === value) || null;
                        onDestinationChange(airport);
                        if (airport) setShowDestInfo(true);
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
                </TooltipTrigger>
                {destinationAirport && (
                  <TooltipContent side="right" className="p-3 bg-white shadow-lg border border-gray-200 rounded-md">
                    {renderAirportTooltip(destinationAirport)}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
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
                <SelectItem value="bellman-ford">Bellman-Ford</SelectItem>
              </SelectContent>
            </Select>
            
            {algorithm && (
              <Card className="mt-2 bg-slate-50">
                <CardContent className="p-3 text-xs flex items-start gap-2">
                  <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p>{algorithmExplanations[algorithm]}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="flightClass" className="text-sm font-medium">
              Flight Class
            </label>
            <Select 
              value={flightClass} 
              onValueChange={(value: FlightClass) => onFlightClassChange(value)}
            >
              <SelectTrigger id="flightClass">
                <SelectValue placeholder="Select flight class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy (₹3/km)</SelectItem>
                <SelectItem value="business">Business (₹7/km)</SelectItem>
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

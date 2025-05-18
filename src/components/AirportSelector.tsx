
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
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

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

const algorithmExplanations: Record<string, string> = {
  dijkstra: "Finds the shortest path from a starting node to all other nodes in a weighted graph.",
  astar: "An informed search algorithm that uses heuristics to find the shortest path faster.",
  "floyd-warshall": "Calculates shortest paths between all pairs of nodes in a graph."
};

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

  // Custom component to render airport options with tooltips
  const AirportOption = ({ airport }: { airport: Airport }) => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <SelectItem key={airport.code} value={airport.code} className="cursor-pointer">
          {airport.city} - {airport.code}
        </SelectItem>
      </HoverCardTrigger>
      <HoverCardContent className="w-60 p-2">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">{airport.name}</h4>
          <p className="text-xs text-muted-foreground">{airport.city}{airport.state ? `, ${airport.state}` : ''}</p>
          <p className="text-xs font-medium">Code: {airport.code}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );

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
                <TooltipProvider>
                  {airports.map((airport) => (
                    <AirportOption key={airport.code} airport={airport} />
                  ))}
                </TooltipProvider>
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
                <TooltipProvider>
                  {airports.map((airport) => (
                    <AirportOption key={airport.code} airport={airport} />
                  ))}
                </TooltipProvider>
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
            
            {algorithm && (
              <Card className="mt-2 bg-slate-50">
                <CardContent className="p-3 text-xs flex items-start gap-2">
                  <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p>{algorithmExplanations[algorithm]}</p>
                </CardContent>
              </Card>
            )}
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


import AirportSelector from "@/components/AirportSelector";
import FlightMap from "@/components/FlightMap";
import Layout from "@/components/Layout";
import PathResults from "@/components/PathResults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { Airport, Route } from "@/types/aviation";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Loader2 } from "lucide-react";
import { calculatePath } from "@/api/aviation";

const Index = () => {
  const [sourceAirport, setSourceAirport] = useState<Airport | null>(null);
  const [destinationAirport, setDestination] = useState<Airport | null>(null);
  const [algorithm, setAlgorithm] = useState<string>("dijkstra");
  const [calculatedRoute, setCalculatedRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const calculateRouteHandler = async () => {
    if (!sourceAirport || !destinationAirport) return;
    
    setIsLoading(true);
    setError(null);
    setCalculatedRoute(null);
    
    try {
      // Direct function call to our client-side implementation
      const route = await calculatePath(
        sourceAirport.code,
        destinationAirport.code,
        algorithm
      );
      
      setCalculatedRoute(route);
      toast({
        title: "Route calculated",
        description: `Found optimal route from ${sourceAirport.code} to ${destinationAirport.code} using ${getAlgorithmName(algorithm)}`,
      });
    } catch (error) {
      console.error('Error calculating path:', error);
      setError((error as Error).message || "Failed to calculate the route");
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to calculate the route. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAlgorithmName = (algorithm: string): string => {
    switch (algorithm) {
      case 'astar':
        return 'A* Search';
      case 'floyd-warshall':
        return 'Floyd-Warshall';
      case 'dijkstra':
      default:
        return 'Dijkstra';
    }
  };

  return (
    <Layout
      sidebar={
        <div className="space-y-6">
          <AirportSelector
            sourceAirport={sourceAirport}
            destinationAirport={destinationAirport}
            algorithm={algorithm}
            onSourceChange={setSourceAirport}
            onDestinationChange={setDestination}
            onAlgorithmChange={setAlgorithm}
            onCalculate={calculateRouteHandler}
            isLoading={isLoading}
          />
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-center">
                Calculating the optimal flight path using {getAlgorithmName(algorithm)}...
              </p>
            </div>
          )}
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {calculatedRoute && !isLoading && !error && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Route Results</CardTitle>
              </CardHeader>
              <CardContent>
                <PathResults route={calculatedRoute} />
              </CardContent>
            </Card>
          )}
        </div>
      }
    >
      <div className="h-full">
        <FlightMap 
          sourceAirport={sourceAirport}
          destinationAirport={destinationAirport}
          route={calculatedRoute}
        />
      </div>
    </Layout>
  );
};

export default Index;

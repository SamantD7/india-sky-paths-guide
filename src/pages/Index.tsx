
import AirportSelector from "@/components/AirportSelector";
import GoogleMap from "@/components/GoogleMap";
import Layout from "@/components/Layout";
import PathResults from "@/components/PathResults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Airport, Route } from "@/types/aviation";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";

const Index = () => {
  const [sourceAirport, setSourceAirport] = useState<Airport | null>(null);
  const [destinationAirport, setDestination] = useState<Airport | null>(null);
  const [algorithm, setAlgorithm] = useState<string>("dijkstra");
  const [calculatedRoute, setCalculatedRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const calculatePath = async () => {
    if (!sourceAirport || !destinationAirport) return;
    
    setIsLoading(true);
    try {
      // Using our mock API for now, but prepared for real axios calls in future
      const response = await fetch('/api/calculate-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: sourceAirport.code,
          destination: destinationAirport.code,
          algorithm: algorithm
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate path');
      }
      
      const data = await response.json();
      setCalculatedRoute(data);
      toast({
        title: "Route calculated",
        description: `Found optimal route from ${sourceAirport.code} to ${destinationAirport.code} using ${algorithm}`,
      });
    } catch (error) {
      console.error('Error calculating path:', error);
      toast({
        title: "Error",
        description: "Failed to calculate the route. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            onCalculate={calculatePath}
            isLoading={isLoading}
          />
          
          {calculatedRoute && (
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
        <GoogleMap 
          sourceAirport={sourceAirport}
          destinationAirport={destinationAirport}
          route={calculatedRoute}
        />
      </div>
    </Layout>
  );
};

export default Index;


import AirportSelector from "@/components/AirportSelector";
import FlightMap from "@/components/FlightMap";
import PathResults from "@/components/PathResults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Airport, Route } from "@/types/aviation";

const Index = () => {
  const [sourceAirport, setSourceAirport] = useState<Airport | null>(null);
  const [destinationAirport, setDestination] = useState<Airport | null>(null);
  const [calculatedRoute, setCalculatedRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const calculatePath = async () => {
    if (!sourceAirport || !destinationAirport) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/calculate-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: sourceAirport.code,
          destination: destinationAirport.code,
          algorithm: 'dijkstra' // Default algorithm
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate path');
      }
      
      const data = await response.json();
      setCalculatedRoute(data);
    } catch (error) {
      console.error('Error calculating path:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Sky-Path Navigator</h1>
          <p className="text-sm opacity-90">Optimized Flight Path Calculator for Indian Airports</p>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Airports</CardTitle>
              </CardHeader>
              <CardContent>
                <AirportSelector 
                  sourceAirport={sourceAirport}
                  destinationAirport={destinationAirport}
                  onSourceChange={setSourceAirport}
                  onDestinationChange={setDestination}
                  onCalculate={calculatePath}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
            
            {calculatedRoute && (
              <Card>
                <CardHeader>
                  <CardTitle>Route Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <PathResults route={calculatedRoute} />
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="md:col-span-2">
            <Card className="h-full min-h-[500px]">
              <CardHeader>
                <CardTitle>Flight Map</CardTitle>
              </CardHeader>
              <CardContent className="h-[500px]">
                <FlightMap 
                  sourceAirport={sourceAirport}
                  destinationAirport={destinationAirport}
                  route={calculatedRoute}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto p-4 text-center text-sm text-gray-500 mt-8">
        <Separator className="mb-4" />
        &copy; {new Date().getFullYear()} Sky-Path Navigator
      </footer>
    </div>
  );
};

export default Index;

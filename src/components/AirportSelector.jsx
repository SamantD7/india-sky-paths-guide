
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plane, Calculator, Settings } from "lucide-react";
import { airports } from "@/api/aviation";

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
}) => {
  const handleSourceChange = (value) => {
    const airport = airports.find(a => a.code === value);
    onSourceChange(airport);
  };

  const handleDestinationChange = (value) => {
    const airport = airports.find(a => a.code === value);
    onDestinationChange(airport);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plane className="h-5 w-5" />
            Select Airports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source">Source Airport</Label>
            <Select value={sourceAirport?.code || ""} onValueChange={handleSourceChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select source airport" />
              </SelectTrigger>
              <SelectContent>
                {airports.map((airport) => (
                  <SelectItem key={airport.code} value={airport.code}>
                    {airport.code} - {airport.name}, {airport.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination Airport</Label>
            <Select value={destinationAirport?.code || ""} onValueChange={handleDestinationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination airport" />
              </SelectTrigger>
              <SelectContent>
                {airports.map((airport) => (
                  <SelectItem key={airport.code} value={airport.code}>
                    {airport.code} - {airport.name}, {airport.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5" />
            Algorithm Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={algorithm} onValueChange={onAlgorithmChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dijkstra" id="dijkstra" />
              <Label htmlFor="dijkstra">Dijkstra Algorithm</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="astar" id="astar" />
              <Label htmlFor="astar">A* Search Algorithm</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="floyd-warshall" id="floyd-warshall" />
              <Label htmlFor="floyd-warshall">Floyd-Warshall Algorithm</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bellman-ford" id="bellman-ford" />
              <Label htmlFor="bellman-ford">Bellman-Ford Algorithm</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5" />
            Flight Class
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={flightClass} onValueChange={onFlightClassChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="economy" id="economy" />
              <Label htmlFor="economy">Economy Class</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="business" id="business" />
              <Label htmlFor="business">Business Class</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Button 
        onClick={onCalculate} 
        disabled={!sourceAirport || !destinationAirport || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? "Calculating..." : "Calculate Route"}
      </Button>
    </div>
  );
};

export default AirportSelector;

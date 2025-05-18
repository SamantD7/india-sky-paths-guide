
import React from "react";
import { Airport, Route } from "@/types/aviation";
import GoogleMap from "./GoogleMap";

interface FlightMapProps {
  sourceAirport: Airport | null;
  destinationAirport: Airport | null;
  route: Route | null;
}

const FlightMap = ({ sourceAirport, destinationAirport, route }: FlightMapProps) => {
  return (
    <div className="relative h-full w-full">
      <GoogleMap
        sourceAirport={sourceAirport}
        destinationAirport={destinationAirport}
        route={route}
      />
    </div>
  );
};

export default FlightMap;

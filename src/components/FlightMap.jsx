
import React from "react";
import GoogleMap from "./GoogleMap";

const FlightMap = ({ sourceAirport, destinationAirport, route }) => {
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

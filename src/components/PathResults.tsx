
import React from 'react';
import { Route } from "@/types/aviation";
import { Badge } from "@/components/ui/badge";
import { Clock, Map } from "lucide-react";

interface PathResultsProps {
  route: Route;
}

const PathResults = ({ route }: PathResultsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Dijkstra Algorithm</Badge>
        <span className="text-xs text-muted-foreground">
          {route.path.length - 1} stops
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Map className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Distance: <strong>{route.distance.toFixed(2)} km</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Duration: <strong>{route.duration.toFixed(2)} min</strong></span>
        </div>
      </div>
      
      <div className="pt-2 border-t">
        <h4 className="text-sm font-medium mb-2">Route Path:</h4>
        <div className="flex flex-wrap gap-2">
          {route.path.map((airport, index) => (
            <React.Fragment key={airport}>
              <Badge variant="secondary">{airport}</Badge>
              {index < route.path.length - 1 && (
                <span className="text-muted-foreground">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PathResults;


import { Route } from "@/types/aviation";
import { getAirports, createGraph } from "@/utils/airports";
import { dijkstra } from "@/utils/dijkstra";
import { aStarSearch } from "@/utils/astar";
import { floydWarshall } from "@/utils/floydWarshall";

// Create modular algorithm implementations directly in the frontend
// Moved from server-side to client-side
export function calculatePath(source: string, destination: string, algorithm: string = "dijkstra"): Promise<Route> {
  // Create graph from routes
  const graph = createGraph();
  
  // Check if source and destination airports exist
  if (!graph[source]) {
    return Promise.reject(new Error(`Source airport ${source} not found`));
  }
  
  if (!graph[destination]) {
    return Promise.reject(new Error(`Destination airport ${destination} not found`));
  }

  let path: string[] = [];
  let distance = 0;
  let duration = 0;
  let computationTime = 0;

  // Implement different algorithms based on selection
  const startTime = performance.now();
  
  switch (algorithm) {
    case "astar": {
      // Get airport positions for the heuristic function
      const airports = getAirports();
      const airportPositions: Record<string, { lat: number; lng: number }> = {};
      airports.forEach(airport => {
        airportPositions[airport.code] = airport.position;
      });
      
      ({ path, distance, duration } = aStarSearch(graph, source, destination, airportPositions));
      break;
    }
    case "floyd-warshall":
      ({ path, distance, duration } = floydWarshall(graph, source, destination));
      break;
    case "dijkstra":
    default:
      ({ path, distance, duration } = dijkstra(graph, source, destination));
      break;
  }
  
  const endTime = performance.now();
  computationTime = parseFloat((endTime - startTime).toFixed(2));

  // Check if path was found
  if (path.length === 0 || path[0] !== source || path[path.length - 1] !== destination) {
    return Promise.reject(new Error(`No path found between ${source} and ${destination}`));
  }
  
  // Create route object
  const route: Route = {
    algorithm: algorithm,
    path,
    distance,
    duration,
    computationTime
  };
  
  // Simulate API delay (optional - can be removed for instant results)
  return new Promise(resolve => setTimeout(() => resolve(route), 300));
}

// Simplified API function for backward compatibility
export async function mockBackendRequest(source: string, destination: string, algorithm: string = "dijkstra"): Promise<Route> {
  try {
    return await calculatePath(source, destination, algorithm);
  } catch (error) {
    console.error("Error calculating path:", error);
    throw error;
  }
}

// Export airports for direct use in components
export { getAirports } from "@/utils/airports";

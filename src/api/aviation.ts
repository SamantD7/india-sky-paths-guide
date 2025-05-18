
import { Airport, Route } from "@/types/aviation";

// Mock airport data
const airports: Airport[] = [
  { code: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi", position: { lat: 28.5561, lng: 77.1000 } },
  { code: "BOM", name: "Chhatrapati Shivaji International Airport", city: "Mumbai", position: { lat: 19.0896, lng: 72.8656 } },
  { code: "MAA", name: "Chennai International Airport", city: "Chennai", position: { lat: 12.9941, lng: 80.1709 } },
  { code: "BLR", name: "Kempegowda International Airport", city: "Bangalore", position: { lat: 13.1986, lng: 77.7066 } },
  { code: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", position: { lat: 22.6520, lng: 88.4463 } },
  { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", position: { lat: 17.2403, lng: 78.4294 } },
  { code: "COK", name: "Cochin International Airport", city: "Kochi", position: { lat: 10.1520, lng: 76.3919 } },
  { code: "PNQ", name: "Pune Airport", city: "Pune", position: { lat: 18.5793, lng: 73.9089 } }
];

// Mock flight routes (graph edges)
const routes = [
  { from: "DEL", to: "BOM", distance: 1148, duration: 130 },
  { from: "DEL", to: "MAA", distance: 1760, duration: 165 },
  { from: "DEL", to: "BLR", distance: 1740, duration: 165 },
  { from: "DEL", to: "CCU", distance: 1305, duration: 140 },
  { from: "DEL", to: "HYD", distance: 1253, duration: 140 },
  { from: "BOM", to: "MAA", distance: 1033, duration: 130 },
  { from: "BOM", to: "BLR", distance: 842, duration: 110 },
  { from: "BOM", to: "HYD", distance: 623, duration: 95 },
  { from: "BOM", to: "COK", distance: 1008, duration: 125 },
  { from: "BOM", to: "PNQ", distance: 123, duration: 45 },
  { from: "MAA", to: "BLR", distance: 291, duration: 60 },
  { from: "MAA", to: "CCU", distance: 1382, duration: 150 },
  { from: "MAA", to: "HYD", distance: 565, duration: 90 },
  { from: "MAA", to: "COK", distance: 510, duration: 85 },
  { from: "BLR", to: "HYD", distance: 497, duration: 85 },
  { from: "BLR", to: "COK", distance: 365, duration: 70 },
  { from: "CCU", to: "HYD", distance: 1553, duration: 155 },
  { from: "HYD", to: "PNQ", distance: 520, duration: 90 }
];

// Mock function to calculate path using Dijkstra's algorithm
export async function calculatePath(source: string, destination: string): Promise<Route> {
  // Implement Dijkstra's algorithm

  // Create graph from routes
  const graph: Record<string, Record<string, { distance: number; duration: number }>> = {};
  
  // Initialize graph with airports
  airports.forEach(airport => {
    graph[airport.code] = {};
  });
  
  // Add edges to graph
  routes.forEach(route => {
    graph[route.from][route.to] = { distance: route.distance, duration: route.duration };
    // Add reverse direction for undirected graph
    graph[route.to][route.from] = { distance: route.distance, duration: route.duration };
  });

  // Dijkstra's algorithm implementation
  const distances: Record<string, number> = {};
  const durations: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  // Initialize distances
  Object.keys(graph).forEach(node => {
    distances[node] = node === source ? 0 : Infinity;
    durations[node] = node === source ? 0 : Infinity;
    previous[node] = null;
    unvisited.add(node);
  });

  while (unvisited.size > 0) {
    // Find the unvisited node with the minimum distance
    let current: string | null = null;
    let minDistance = Infinity;
    
    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        current = node;
      }
    }
    
    // If we can't find a node to visit, or we've reached the destination, break
    if (current === null || current === destination || minDistance === Infinity) {
      break;
    }
    
    unvisited.delete(current);
    
    // Update distances for neighbors
    for (const neighbor in graph[current]) {
      if (unvisited.has(neighbor)) {
        const edge = graph[current][neighbor];
        const newDistance = distances[current] + edge.distance;
        const newDuration = durations[current] + edge.duration;
        
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          durations[neighbor] = newDuration;
          previous[neighbor] = current;
        }
      }
    }
  }
  
  // Reconstruct path
  const path: string[] = [];
  let current = destination;
  
  while (current) {
    path.unshift(current);
    current = previous[current] || "";
    if (!current) break;
  }
  
  // Check if a path was found
  if (path.length === 0 || path[0] !== source) {
    throw new Error("No path found between these airports");
  }
  
  // Create route object
  const route: Route = {
    algorithm: "dijkstra",
    path,
    distance: distances[destination],
    duration: durations[destination],
  };
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return route;
}

// In a real application, this would be handled by your Express backend
export async function mockBackendRequest(source: string, destination: string): Promise<Route> {
  try {
    return await calculatePath(source, destination);
  } catch (error) {
    console.error("Error calculating path:", error);
    throw error;
  }
}

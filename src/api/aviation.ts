
import { Airport, Route } from "@/types/aviation";

// Mock airport data with extended list
const airports: Airport[] = [
  { code: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi", position: { lat: 28.5561, lng: 77.1000 } },
  { code: "BOM", name: "Chhatrapati Shivaji International Airport", city: "Mumbai", position: { lat: 19.0896, lng: 72.8656 } },
  { code: "MAA", name: "Chennai International Airport", city: "Chennai", position: { lat: 12.9941, lng: 80.1709 } },
  { code: "BLR", name: "Kempegowda International Airport", city: "Bangalore", position: { lat: 13.1986, lng: 77.7066 } },
  { code: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", position: { lat: 22.6520, lng: 88.4463 } },
  { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", position: { lat: 17.2403, lng: 78.4294 } },
  { code: "COK", name: "Cochin International Airport", city: "Kochi", position: { lat: 10.1520, lng: 76.3919 } },
  { code: "PNQ", name: "Pune Airport", city: "Pune", position: { lat: 18.5793, lng: 73.9089 } },
  { code: "GOI", name: "Dabolim Airport", city: "Goa", position: { lat: 15.3808, lng: 73.8314 } },
  { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad", position: { lat: 23.0722, lng: 72.6193 } },
  { code: "JAI", name: "Jaipur International Airport", city: "Jaipur", position: { lat: 26.8242, lng: 75.8122 } },
  { code: "IXC", name: "Chandigarh International Airport", city: "Chandigarh", position: { lat: 30.6735, lng: 76.7885 } }
];

// Expanded mock flight routes (graph edges) to ensure connectivity
const routes = [
  // Delhi connections
  { from: "DEL", to: "BOM", distance: 1148, duration: 130 },
  { from: "DEL", to: "MAA", distance: 1760, duration: 165 },
  { from: "DEL", to: "BLR", distance: 1740, duration: 165 },
  { from: "DEL", to: "CCU", distance: 1305, duration: 140 },
  { from: "DEL", to: "HYD", distance: 1253, duration: 140 },
  { from: "DEL", to: "AMD", distance: 780, duration: 95 },
  { from: "DEL", to: "JAI", distance: 240, duration: 60 },
  { from: "DEL", to: "IXC", distance: 230, duration: 55 },
  // Mumbai connections
  { from: "BOM", to: "MAA", distance: 1033, duration: 130 },
  { from: "BOM", to: "BLR", distance: 842, duration: 110 },
  { from: "BOM", to: "HYD", distance: 623, duration: 95 },
  { from: "BOM", to: "COK", distance: 1008, duration: 125 },
  { from: "BOM", to: "PNQ", distance: 123, duration: 45 },
  { from: "BOM", to: "GOI", distance: 410, duration: 70 },
  { from: "BOM", to: "AMD", distance: 440, duration: 75 },
  // Chennai connections
  { from: "MAA", to: "BLR", distance: 291, duration: 60 },
  { from: "MAA", to: "CCU", distance: 1382, duration: 150 },
  { from: "MAA", to: "HYD", distance: 565, duration: 90 },
  { from: "MAA", to: "COK", distance: 510, duration: 85 },
  // Bangalore connections
  { from: "BLR", to: "HYD", distance: 497, duration: 85 },
  { from: "BLR", to: "COK", distance: 365, duration: 70 },
  { from: "BLR", to: "PNQ", distance: 740, duration: 100 },
  // Kolkata connections
  { from: "CCU", to: "HYD", distance: 1553, duration: 155 },
  { from: "CCU", to: "BLR", distance: 1560, duration: 155 },
  { from: "CCU", to: "MAA", distance: 1382, duration: 150 },
  // Hyderabad connections
  { from: "HYD", to: "PNQ", distance: 520, duration: 90 },
  { from: "HYD", to: "GOI", distance: 580, duration: 90 },
  { from: "HYD", to: "COK", distance: 770, duration: 100 },
  // Pune connections
  { from: "PNQ", to: "GOI", distance: 330, duration: 65 },
  { from: "PNQ", to: "COK", distance: 780, duration: 105 },
  // Goa connections
  { from: "GOI", to: "COK", distance: 550, duration: 85 },
  { from: "GOI", to: "AMD", distance: 650, duration: 95 },
  // Ahmedabad connections
  { from: "AMD", to: "JAI", distance: 530, duration: 85 },
  // Jaipur connections
  { from: "JAI", to: "IXC", distance: 480, duration: 80 }
];

// Algorithm selection and calculation
export async function calculatePath(source: string, destination: string, algorithm: string = "dijkstra"): Promise<Route> {
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

  // Check if source and destination airports exist
  if (!graph[source]) {
    throw new Error(`Source airport ${source} not found`);
  }
  
  if (!graph[destination]) {
    throw new Error(`Destination airport ${destination} not found`);
  }

  let path: string[] = [];
  let distance = 0;
  let duration = 0;

  // Implement different algorithms based on selection
  switch (algorithm) {
    case "astar":
      ({ path, distance, duration } = aStarSearch(graph, source, destination));
      break;
    case "floyd-warshall":
      ({ path, distance, duration } = floydWarshall(graph, source, destination));
      break;
    case "dijkstra":
    default:
      ({ path, distance, duration } = dijkstra(graph, source, destination));
      break;
  }

  // Check if path was found
  if (path.length === 0 || path[0] !== source || path[path.length - 1] !== destination) {
    throw new Error(`No path found between ${source} and ${destination}`);
  }
  
  // Create route object
  const route: Route = {
    algorithm: algorithm,
    path,
    distance,
    duration
  };
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return route;
}

// Dijkstra's algorithm implementation
function dijkstra(graph: Record<string, Record<string, { distance: number; duration: number }>>, 
                  source: string, 
                  destination: string) {
  const distances: Record<string, number> = {};
  const durations: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  // Initialize
  Object.keys(graph).forEach(node => {
    distances[node] = node === source ? 0 : Infinity;
    durations[node] = node === source ? 0 : Infinity;
    previous[node] = null;
    unvisited.add(node);
  });

  while (unvisited.size > 0) {
    let current: string | null = null;
    let minDistance = Infinity;
    
    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        current = node;
      }
    }
    
    if (current === null || current === destination || minDistance === Infinity) {
      break;
    }
    
    unvisited.delete(current);
    
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
  
  return {
    path,
    distance: distances[destination],
    duration: durations[destination]
  };
}

// A* Search algorithm implementation
function aStarSearch(graph: Record<string, Record<string, { distance: number; duration: number }>>,
                    source: string,
                    destination: string) {
  // Get airport positions for heuristic calculation
  const airportPositions: Record<string, { lat: number; lng: number }> = {};
  airports.forEach(airport => {
    airportPositions[airport.code] = airport.position;
  });
  
  // Heuristic function - calculate straight line distance between two airports
  const heuristic = (from: string, to: string): number => {
    const fromPos = airportPositions[from];
    const toPos = airportPositions[to];
    
    if (!fromPos || !toPos) return 0;
    
    // Simple Euclidean distance (could be improved with actual distance calculation)
    const latDiff = fromPos.lat - toPos.lat;
    const lngDiff = fromPos.lng - toPos.lng;
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 100; // Scaled for testing
  };

  const openSet = new Set<string>([source]);
  const closedSet = new Set<string>();
  
  const gScore: Record<string, number> = {};  // Cost from start to current node
  const fScore: Record<string, number> = {};  // Estimated total cost from start to goal through current node
  const previous: Record<string, string | null> = {};
  const durations: Record<string, number> = {};
  
  // Initialize scores
  Object.keys(graph).forEach(node => {
    gScore[node] = node === source ? 0 : Infinity;
    fScore[node] = node === source ? heuristic(source, destination) : Infinity;
    previous[node] = null;
    durations[node] = node === source ? 0 : Infinity;
  });
  
  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let current: string | null = null;
    let lowestFScore = Infinity;
    
    for (const node of openSet) {
      if (fScore[node] < lowestFScore) {
        lowestFScore = fScore[node];
        current = node;
      }
    }
    
    if (!current) break;
    
    if (current === destination) {
      // Reconstruct path
      const path: string[] = [];
      let currentNode = destination;
      
      while (currentNode) {
        path.unshift(currentNode);
        currentNode = previous[currentNode] || "";
        if (!currentNode) break;
      }
      
      return {
        path,
        distance: gScore[destination],
        duration: durations[destination]
      };
    }
    
    openSet.delete(current);
    closedSet.add(current);
    
    // Check neighbors
    for (const neighbor in graph[current]) {
      if (closedSet.has(neighbor)) continue;
      
      const edge = graph[current][neighbor];
      const tentativeGScore = gScore[current] + edge.distance;
      const tentativeDuration = durations[current] + edge.duration;
      
      if (!openSet.has(neighbor)) {
        openSet.add(neighbor);
      } else if (tentativeGScore >= gScore[neighbor]) {
        continue;
      }
      
      // This path is better than any previous one
      previous[neighbor] = current;
      gScore[neighbor] = tentativeGScore;
      durations[neighbor] = tentativeDuration;
      fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, destination);
    }
  }
  
  // No path found
  return { path: [], distance: 0, duration: 0 };
}

// Floyd-Warshall algorithm implementation
function floydWarshall(graph: Record<string, Record<string, { distance: number; duration: number }>>,
                      source: string,
                      destination: string) {
  const nodes = Object.keys(graph);
  const n = nodes.length;
  
  // Initialize distance and next matrices
  const dist: Record<string, Record<string, number>> = {};
  const next: Record<string, Record<string, string | null>> = {};
  const durations: Record<string, Record<string, number>> = {};
  
  // Initialize matrices
  nodes.forEach(i => {
    dist[i] = {};
    next[i] = {};
    durations[i] = {};
    
    nodes.forEach(j => {
      if (i === j) {
        dist[i][j] = 0;
        durations[i][j] = 0;
        next[i][j] = null;
      } else if (graph[i][j]) {
        dist[i][j] = graph[i][j].distance;
        durations[i][j] = graph[i][j].duration;
        next[i][j] = j;
      } else {
        dist[i][j] = Infinity;
        durations[i][j] = Infinity;
        next[i][j] = null;
      }
    });
  });
  
  // Floyd-Warshall algorithm
  nodes.forEach(k => {
    nodes.forEach(i => {
      nodes.forEach(j => {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          durations[i][j] = durations[i][k] + durations[k][j];
          next[i][j] = next[i][k];
        }
      });
    });
  });
  
  // Path reconstruction
  if (dist[source][destination] === Infinity) {
    return { path: [], distance: 0, duration: 0 };
  }
  
  const path: string[] = [source];
  let current = source;
  
  while (current !== destination) {
    current = next[current][destination] as string;
    if (!current) break;
    path.push(current);
  }
  
  return {
    path,
    distance: dist[source][destination],
    duration: durations[source][destination]
  };
}

// In a real application, this would be handled by your Express backend
export async function mockBackendRequest(source: string, destination: string, algorithm: string = "dijkstra"): Promise<Route> {
  try {
    return await calculatePath(source, destination, algorithm);
  } catch (error) {
    console.error("Error calculating path:", error);
    throw error;
  }
}

export function getAirports(): Airport[] {
  return airports;
}

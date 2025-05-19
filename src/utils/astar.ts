
import { Airport } from "@/types/aviation";

// A* Search algorithm implementation
export function aStarSearch(
  graph: Record<string, Record<string, { distance: number; duration: number }>>,
  source: string,
  destination: string,
  airportPositions: Record<string, { lat: number; lng: number }>
): { path: string[], distance: number, duration: number } {
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

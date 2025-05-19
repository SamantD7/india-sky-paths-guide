
import { Route } from "@/types/aviation";

// Dijkstra's algorithm implementation
export function dijkstra(
  graph: Record<string, Record<string, { distance: number; duration: number }>>, 
  source: string, 
  destination: string
): { path: string[], distance: number, duration: number } {
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

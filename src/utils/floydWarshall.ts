
// Floyd-Warshall algorithm implementation
export function floydWarshall(
  graph: Record<string, Record<string, { distance: number; duration: number }>>,
  source: string,
  destination: string
): { path: string[], distance: number, duration: number } {
  const nodes = Object.keys(graph);
  
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

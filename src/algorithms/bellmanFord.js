
export const bellmanFord = (graph, airports, sourceCode, destinationCode) => {
  const startTime = performance.now();
  
  // Initialize distances
  const distances = {};
  const predecessors = {};
  
  // Set all distances to infinity except source
  airports.forEach(airport => {
    distances[airport.code] = airport.code === sourceCode ? 0 : Infinity;
    predecessors[airport.code] = null;
  });
  
  // Relax edges repeatedly
  for (let i = 0; i < airports.length - 1; i++) {
    let updated = false;
    
    // For each edge in the graph
    for (const [from, connections] of Object.entries(graph)) {
      if (distances[from] !== Infinity) {
        connections.forEach(connection => {
          const to = connection.to;
          const weight = connection.distance;
          
          if (distances[from] + weight < distances[to]) {
            distances[to] = distances[from] + weight;
            predecessors[to] = from;
            updated = true;
          }
        });
      }
    }
    
    // If no update occurred, we can break early
    if (!updated) break;
  }
  
  // Check for negative cycles
  for (const [from, connections] of Object.entries(graph)) {
    if (distances[from] !== Infinity) {
      connections.forEach(connection => {
        const to = connection.to;
        const weight = connection.distance;
        
        if (distances[from] + weight < distances[to]) {
          throw new Error("Graph contains a negative cycle");
        }
      });
    }
  }
  
  // Reconstruct path
  const path = [];
  let current = destinationCode;
  
  while (current !== null) {
    path.unshift(current);
    current = predecessors[current];
  }
  
  // If path doesn't start with source, no path exists
  if (path[0] !== sourceCode) {
    throw new Error(`No path found from ${sourceCode} to ${destinationCode}`);
  }
  
  const endTime = performance.now();
  const computationTime = Math.round(endTime - startTime);
  
  return {
    algorithm: 'bellman-ford',
    path,
    distance: distances[destinationCode],
    duration: distances[destinationCode] / 10, // Assuming 10 km/min average speed
    computationTime
  };
};


export default function dijkstra(graph, airports, sourceCode, destinationCode) {
  const startTime = performance.now();
  
  // Initialize distances and predecessors
  const distances = {};
  const predecessors = {};
  const visited = new Set();
  
  // Set all distances to infinity except source
  airports.forEach(airport => {
    distances[airport.code] = airport.code === sourceCode ? 0 : Infinity;
    predecessors[airport.code] = null;
  });
  
  while (visited.size < airports.length) {
    // Find the unvisited node with minimum distance
    let currentNode = null;
    let minDistance = Infinity;
    
    for (const airport of airports) {
      if (!visited.has(airport.code) && distances[airport.code] < minDistance) {
        minDistance = distances[airport.code];
        currentNode = airport.code;
      }
    }
    
    if (currentNode === null || minDistance === Infinity) break;
    
    visited.add(currentNode);
    
    // Update distances to neighbors
    if (graph[currentNode]) {
      graph[currentNode].forEach(neighbor => {
        const newDistance = distances[currentNode] + neighbor.distance;
        if (newDistance < distances[neighbor.to]) {
          distances[neighbor.to] = newDistance;
          predecessors[neighbor.to] = currentNode;
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
    algorithm: 'dijkstra',
    path,
    distance: distances[destinationCode],
    duration: distances[destinationCode] / 10, // Assuming 10 km/min average speed
    computationTime
  };
}


export default function aStar(graph, airports, sourceCode, destinationCode) {
  const startTime = performance.now();
  
  // Helper function to calculate heuristic (Euclidean distance)
  const heuristic = (from, to) => {
    const fromAirport = airports.find(a => a.code === from);
    const toAirport = airports.find(a => a.code === to);
    
    if (!fromAirport || !toAirport) return 0;
    
    const dx = fromAirport.position.lat - toAirport.position.lat;
    const dy = fromAirport.position.lng - toAirport.position.lng;
    return Math.sqrt(dx * dx + dy * dy) * 111; // Rough conversion to km
  };
  
  const openSet = new Set([sourceCode]);
  const closedSet = new Set();
  
  const gScore = {};
  const fScore = {};
  const predecessors = {};
  
  // Initialize scores
  airports.forEach(airport => {
    gScore[airport.code] = airport.code === sourceCode ? 0 : Infinity;
    fScore[airport.code] = airport.code === sourceCode ? heuristic(sourceCode, destinationCode) : Infinity;
    predecessors[airport.code] = null;
  });
  
  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let current = null;
    let minFScore = Infinity;
    
    for (const node of openSet) {
      if (fScore[node] < minFScore) {
        minFScore = fScore[node];
        current = node;
      }
    }
    
    if (current === destinationCode) {
      // Reconstruct path
      const path = [];
      let curr = destinationCode;
      
      while (curr !== null) {
        path.unshift(curr);
        curr = predecessors[curr];
      }
      
      const endTime = performance.now();
      const computationTime = Math.round(endTime - startTime);
      
      return {
        algorithm: 'astar',
        path,
        distance: gScore[destinationCode],
        duration: gScore[destinationCode] / 10,
        computationTime
      };
    }
    
    openSet.delete(current);
    closedSet.add(current);
    
    // Check neighbors
    if (graph[current]) {
      graph[current].forEach(neighbor => {
        if (closedSet.has(neighbor.to)) return;
        
        const tentativeGScore = gScore[current] + neighbor.distance;
        
        if (!openSet.has(neighbor.to)) {
          openSet.add(neighbor.to);
        } else if (tentativeGScore >= gScore[neighbor.to]) {
          return;
        }
        
        predecessors[neighbor.to] = current;
        gScore[neighbor.to] = tentativeGScore;
        fScore[neighbor.to] = gScore[neighbor.to] + heuristic(neighbor.to, destinationCode);
      });
    }
  }
  
  throw new Error(`No path found from ${sourceCode} to ${destinationCode}`);
}

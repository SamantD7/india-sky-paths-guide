
export default function floydWarshall(graph, airports, sourceCode, destinationCode) {
  const startTime = performance.now();
  
  const n = airports.length;
  const airportCodes = airports.map(a => a.code);
  const codeToIndex = {};
  
  // Create mapping from airport code to index
  airportCodes.forEach((code, index) => {
    codeToIndex[code] = index;
  });
  
  // Initialize distance matrix
  const dist = Array(n).fill(null).map(() => Array(n).fill(Infinity));
  const next = Array(n).fill(null).map(() => Array(n).fill(null));
  
  // Set diagonal to 0
  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
  }
  
  // Fill in direct connections
  Object.entries(graph).forEach(([from, connections]) => {
    const fromIndex = codeToIndex[from];
    connections.forEach(connection => {
      const toIndex = codeToIndex[connection.to];
      dist[fromIndex][toIndex] = connection.distance;
      next[fromIndex][toIndex] = toIndex;
    });
  });
  
  // Floyd-Warshall algorithm
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }
  
  // Reconstruct path
  const sourceIndex = codeToIndex[sourceCode];
  const destIndex = codeToIndex[destinationCode];
  
  if (dist[sourceIndex][destIndex] === Infinity) {
    throw new Error(`No path found from ${sourceCode} to ${destinationCode}`);
  }
  
  const path = [];
  let current = sourceIndex;
  
  while (current !== destIndex) {
    path.push(airportCodes[current]);
    current = next[current][destIndex];
    if (current === null) {
      throw new Error(`No path found from ${sourceCode} to ${destinationCode}`);
    }
  }
  path.push(airportCodes[destIndex]);
  
  const endTime = performance.now();
  const computationTime = Math.round(endTime - startTime);
  
  return {
    algorithm: 'floyd-warshall',
    path,
    distance: dist[sourceIndex][destIndex],
    duration: dist[sourceIndex][destIndex] / 10,
    computationTime
  };
}

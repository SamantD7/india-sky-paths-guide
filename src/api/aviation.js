
// Mock airport data for Indian airports
export const airports = [
  {
    code: "DEL",
    name: "Indira Gandhi International Airport",
    city: "New Delhi",
    state: "Delhi",
    position: { lat: 28.5561, lng: 77.1000 }
  },
  {
    code: "BOM",
    name: "Chhatrapati Shivaji Maharaj International Airport",
    city: "Mumbai",
    state: "Maharashtra",
    position: { lat: 19.0896, lng: 72.8656 }
  },
  {
    code: "MAA",
    name: "Chennai International Airport",
    city: "Chennai",
    state: "Tamil Nadu",
    position: { lat: 12.9941, lng: 80.1709 }
  },
  {
    code: "BLR",
    name: "Kempegowda International Airport",
    city: "Bangalore",
    state: "Karnataka",
    position: { lat: 13.1986, lng: 77.7066 }
  },
  {
    code: "CCU",
    name: "Netaji Subhas Chandra Bose International Airport",
    city: "Kolkata",
    state: "West Bengal",
    position: { lat: 22.6520, lng: 88.4463 }
  },
  {
    code: "HYD",
    name: "Rajiv Gandhi International Airport",
    city: "Hyderabad",
    state: "Telangana",
    position: { lat: 17.2403, lng: 78.4294 }
  },
  {
    code: "GOI",
    name: "Dabolim Airport",
    city: "Goa",
    state: "Goa",
    position: { lat: 15.3808, lng: 73.8314 }
  },
  {
    code: "JAI",
    name: "Jaipur International Airport",
    city: "Jaipur",
    state: "Rajasthan",
    position: { lat: 26.8242, lng: 75.8122 }
  },
  {
    code: "COK",
    name: "Cochin International Airport",
    city: "Kochi",
    state: "Kerala",
    position: { lat: 10.1520, lng: 76.3920 }
  },
  {
    code: "AMD",
    name: "Sardar Vallabhbhai Patel International Airport",
    city: "Ahmedabad",
    state: "Gujarat",
    position: { lat: 23.0722, lng: 72.6193 }
  },
  {
    code: "IXC",
    name: "Chandigarh International Airport",
    city: "Chandigarh",
    state: "Chandigarh",
    position: { lat: 30.6735, lng: 76.7885 }
  },
  {
    code: "PNQ",
    name: "Pune Airport",
    city: "Pune",
    state: "Maharashtra",
    position: { lat: 18.5793, lng: 73.9089 }
  }
];

// Function to get all airports
export const getAirports = () => {
  return airports;
};

// Helper function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Build adjacency matrix with distances
const buildGraph = () => {
  const graph = {};
  
  airports.forEach(airport => {
    graph[airport.code] = {};
    airports.forEach(otherAirport => {
      if (airport.code !== otherAirport.code) {
        const distance = calculateDistance(
          airport.position.lat, airport.position.lng,
          otherAirport.position.lat, otherAirport.position.lng
        );
        graph[airport.code][otherAirport.code] = distance;
      }
    });
  });
  
  return graph;
};

// Dijkstra's algorithm implementation
const dijkstra = (graph, start, end) => {
  const distances = {};
  const previous = {};
  const unvisited = new Set();
  
  // Initialize distances
  Object.keys(graph).forEach(node => {
    distances[node] = node === start ? 0 : Infinity;
    unvisited.add(node);
  });
  
  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let current = null;
    let minDistance = Infinity;
    
    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        current = node;
      }
    }
    
    if (current === null || current === end) break;
    
    unvisited.delete(current);
    
    // Update distances to neighbors
    Object.keys(graph[current]).forEach(neighbor => {
      if (unvisited.has(neighbor)) {
        const newDistance = distances[current] + graph[current][neighbor];
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = current;
        }
      }
    });
  }
  
  // Reconstruct path
  const path = [];
  let current = end;
  
  while (current !== undefined) {
    path.unshift(current);
    current = previous[current];
  }
  
  return {
    path: path,
    distance: distances[end],
    duration: distances[end] * 60 / 800 // Rough estimate: 800 km/h average flight speed
  };
};

// A* algorithm implementation
const aStar = (graph, start, end) => {
  const openSet = new Set([start]);
  const cameFrom = {};
  const gScore = {};
  const fScore = {};
  
  // Initialize scores
  Object.keys(graph).forEach(node => {
    gScore[node] = node === start ? 0 : Infinity;
    fScore[node] = node === start ? heuristic(start, end) : Infinity;
  });
  
  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let current = null;
    let minF = Infinity;
    
    for (const node of openSet) {
      if (fScore[node] < minF) {
        minF = fScore[node];
        current = node;
      }
    }
    
    if (current === end) {
      // Reconstruct path
      const path = [];
      let temp = current;
      
      while (temp !== undefined) {
        path.unshift(temp);
        temp = cameFrom[temp];
      }
      
      return {
        path: path,
        distance: gScore[end],
        duration: gScore[end] * 60 / 800
      };
    }
    
    openSet.delete(current);
    
    Object.keys(graph[current]).forEach(neighbor => {
      const tentativeGScore = gScore[current] + graph[current][neighbor];
      
      if (tentativeGScore < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, end);
        
        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
        }
      }
    });
  }
  
  return null; // No path found
};

// Heuristic function for A* (straight-line distance)
const heuristic = (nodeA, nodeB) => {
  const airportA = airports.find(a => a.code === nodeA);
  const airportB = airports.find(a => a.code === nodeB);
  
  if (!airportA || !airportB) return 0;
  
  return calculateDistance(
    airportA.position.lat, airportA.position.lng,
    airportB.position.lat, airportB.position.lng
  );
};

// Floyd-Warshall algorithm implementation
const floydWarshall = (graph, start, end) => {
  const nodes = Object.keys(graph);
  const dist = {};
  const next = {};
  
  // Initialize distance matrix
  nodes.forEach(i => {
    dist[i] = {};
    next[i] = {};
    nodes.forEach(j => {
      if (i === j) {
        dist[i][j] = 0;
      } else if (graph[i][j] !== undefined) {
        dist[i][j] = graph[i][j];
        next[i][j] = j;
      } else {
        dist[i][j] = Infinity;
      }
    });
  });
  
  // Floyd-Warshall main algorithm
  nodes.forEach(k => {
    nodes.forEach(i => {
      nodes.forEach(j => {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      });
    });
  });
  
  // Reconstruct path
  const path = [start];
  let current = start;
  
  while (current !== end) {
    current = next[current][end];
    if (current === undefined) break;
    path.push(current);
  }
  
  return {
    path: path,
    distance: dist[start][end],
    duration: dist[start][end] * 60 / 800
  };
};

// Bellman-Ford algorithm implementation
const bellmanFord = (graph, start, end) => {
  const nodes = Object.keys(graph);
  const distances = {};
  const previous = {};
  
  // Initialize distances
  nodes.forEach(node => {
    distances[node] = node === start ? 0 : Infinity;
  });
  
  // Relax edges repeatedly
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes.forEach(u => {
      if (distances[u] !== Infinity) {
        Object.keys(graph[u]).forEach(v => {
          const newDistance = distances[u] + graph[u][v];
          if (newDistance < distances[v]) {
            distances[v] = newDistance;
            previous[v] = u;
          }
        });
      }
    });
  }
  
  // Check for negative-weight cycles
  let hasNegativeCycle = false;
  nodes.forEach(u => {
    if (distances[u] !== Infinity) {
      Object.keys(graph[u]).forEach(v => {
        if (distances[u] + graph[u][v] < distances[v]) {
          hasNegativeCycle = true;
        }
      });
    }
  });
  
  if (hasNegativeCycle) {
    throw new Error("Graph contains a negative-weight cycle");
  }
  
  // Reconstruct path
  const path = [];
  let current = end;
  
  while (current !== undefined) {
    path.unshift(current);
    current = previous[current];
  }
  
  return {
    path: path,
    distance: distances[end],
    duration: distances[end] * 60 / 800
  };
};

// Main function to calculate path using specified algorithm
export const calculatePath = async (source, destination, algorithm = 'dijkstra') => {
  console.log(`Calculating path from ${source} to ${destination} using ${algorithm}`);
  
  const startTime = Date.now();
  const graph = buildGraph();
  let result;
  
  try {
    switch (algorithm) {
      case 'astar':
        result = aStar(graph, source, destination);
        break;
      case 'floyd-warshall':
        result = floydWarshall(graph, source, destination);
        break;
      case 'bellman-ford':
        result = bellmanFord(graph, source, destination);
        break;
      case 'dijkstra':
      default:
        result = dijkstra(graph, source, destination);
        break;
    }
    
    if (!result || result.distance === Infinity) {
      throw new Error(`No path found from ${source} to ${destination}`);
    }
    
    const computationTime = Date.now() - startTime;
    
    return {
      ...result,
      algorithm,
      computationTime
    };
    
  } catch (error) {
    console.error('Error calculating path:', error);
    throw error;
  }
};

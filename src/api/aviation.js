
// Sample Indian airports data with coordinates
const airports = [
  {
    code: "DEL",
    name: "Indira Gandhi International Airport",
    city: "New Delhi",
    state: "Delhi",
    position: { lat: 28.5665, lng: 77.1031 }
  },
  {
    code: "BOM",
    name: "Chhatrapati Shivaji Maharaj International Airport",
    city: "Mumbai",
    state: "Maharashtra",
    position: { lat: 19.0896, lng: 72.8656 }
  },
  {
    code: "BLR",
    name: "Kempegowda International Airport",
    city: "Bengaluru",
    state: "Karnataka",
    position: { lat: 13.1986, lng: 77.7066 }
  },
  {
    code: "MAA",
    name: "Chennai International Airport",
    city: "Chennai",
    state: "Tamil Nadu",
    position: { lat: 12.9941, lng: 80.1709 }
  },
  {
    code: "CCU",
    name: "Netaji Subhash Chandra Bose International Airport",
    city: "Kolkata",
    state: "West Bengal",
    position: { lat: 22.6540, lng: 88.4477 }
  },
  {
    code: "HYD",
    name: "Rajiv Gandhi International Airport",
    city: "Hyderabad",
    state: "Telangana",
    position: { lat: 17.2313, lng: 78.4298 }
  },
  {
    code: "AMD",
    name: "Sardar Vallabhbhai Patel International Airport",
    city: "Ahmedabad",
    state: "Gujarat",
    position: { lat: 23.0779, lng: 72.6317 }
  },
  {
    code: "COK",
    name: "Cochin International Airport",
    city: "Kochi",
    state: "Kerala",
    position: { lat: 10.1520, lng: 76.4019 }
  },
  {
    code: "GOI",
    name: "Goa International Airport",
    city: "Goa",
    state: "Goa",
    position: { lat: 15.3809, lng: 73.8314 }
  },
  {
    code: "PNQ",
    name: "Pune Airport",
    city: "Pune",
    state: "Maharashtra",
    position: { lat: 18.5822, lng: 73.9197 }
  }
];

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

// Create adjacency matrix with distances
const createGraph = () => {
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
  const startTime = performance.now();
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  // Initialize distances
  for (let node in graph) {
    distances[node] = node === start ? 0 : Infinity;
    previous[node] = null;
    unvisited.add(node);
  }

  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let current = null;
    for (let node of unvisited) {
      if (current === null || distances[node] < distances[current]) {
        current = node;
      }
    }

    if (current === end) break;

    unvisited.delete(current);

    // Update distances to neighbors
    for (let neighbor in graph[current]) {
      if (unvisited.has(neighbor)) {
        const alt = distances[current] + graph[current][neighbor];
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = current;
        }
      }
    }
  }

  // Reconstruct path
  const path = [];
  let current = end;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  const endTime = performance.now();
  const computationTime = Math.round(endTime - startTime);

  return {
    algorithm: 'dijkstra',
    path,
    distance: distances[end],
    duration: distances[end] / 8, // Assume average speed of 8 km/min
    computationTime
  };
};

// A* algorithm with heuristic
const aStar = (graph, start, end) => {
  const startTime = performance.now();
  const startAirport = airports.find(a => a.code === start);
  const endAirport = airports.find(a => a.code === end);
  
  const heuristic = (nodeCode) => {
    const node = airports.find(a => a.code ===

);
    return calculateDistance(
      node.position.lat, node.position.lng,
      endAirport.position.lat, endAirport.position.lng
    );
  };

  const openSet = new Set([start]);
  const closedSet = new Set();
  const gScore = { [start]: 0 };
  const fScore = { [start]: heuristic(start) };
  const previous = {};

  while (openSet.size > 0) {
    let current = null;
    for (let node of openSet) {
      if (current === null || fScore[node] < fScore[current]) {
        current = node;
      }
    }

    if (current === end) {
      // Reconstruct path
      const path = [];
      let temp = current;
      while (temp) {
        path.unshift(temp);
        temp = previous[temp];
      }
      
      const endTime = performance.now();
      const computationTime = Math.round(endTime - startTime);

      return {
        algorithm: 'astar',
        path,
        distance: gScore[end],
        duration: gScore[end] / 8,
        computationTime
      };
    }

    openSet.delete(current);
    closedSet.add(current);

    for (let neighbor in graph[current]) {
      if (closedSet.has(neighbor)) continue;

      const tentativeGScore = gScore[current] + graph[current][neighbor];

      if (!openSet.has(neighbor)) {
        openSet.add(neighbor);
      } else if (tentativeGScore >= (gScore[neighbor] || Infinity)) {
        continue;
      }

      previous[neighbor] = current;
      gScore[neighbor] = tentativeGScore;
      fScore[neighbor] = gScore[neighbor] + heuristic(neighbor);
    }
  }

  const endTime = performance.now();
  const computationTime = Math.round(endTime - startTime);

  return {
    algorithm: 'astar',
    path: [start, end],
    distance: graph[start][end],
    duration: graph[start][end] / 8,
    computationTime
  };
};

// Floyd-Warshall algorithm
const floydWarshall = (graph, start, end) => {
  const startTime = performance.now();
  const nodes = Object.keys(graph);
  const dist = {};
  const next = {};

  // Initialize distance matrix
  for (let i of nodes) {
    dist[i] = {};
    next[i] = {};
    for (let j of nodes) {
      if (i === j) {
        dist[i][j] = 0;
      } else if (graph[i][j]) {
        dist[i][j] = graph[i][j];
        next[i][j] = j;
      } else {
        dist[i][j] = Infinity;
        next[i][j] = null;
      }
    }
  }

  // Floyd-Warshall main algorithm
  for (let k of nodes) {
    for (let i of nodes) {
      for (let j of nodes) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          next[i][j] = next[i][k];
        }
      }
    }
  }

  // Reconstruct path
  const path = [];
  if (next[start][end] === null) {
    const endTime = performance.now();
    const computationTime = Math.round(endTime - startTime);
    
    return {
      algorithm: 'floyd-warshall',
      path: [start, end],
      distance: dist[start][end],
      duration: dist[start][end] / 8,
      computationTime
    };
  }

  let current = start;
  while (current !== end) {
    path.push(current);
    current = next[current][end];
  }
  path.push(end);

  const endTime = performance.now();
  const computationTime = Math.round(endTime - startTime);

  return {
    algorithm: 'floyd-warshall',
    path,
    distance: dist[start][end],
    duration: dist[start][end] / 8,
    computationTime
  };
};

// Bellman-Ford algorithm
const bellmanFord = (graph, start, end) => {
  const startTime = performance.now();
  const nodes = Object.keys(graph);
  const distances = {};
  const previous = {};

  // Initialize distances
  nodes.forEach(node => {
    distances[node] = node === start ? 0 : Infinity;
    previous[node] = null;
  });

  // Relax edges repeatedly
  for (let i = 0; i < nodes.length - 1; i++) {
    for (let node of nodes) {
      if (distances[node] !== Infinity) {
        for (let neighbor in graph[node]) {
          const newDistance = distances[node] + graph[node][neighbor];
          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance;
            previous[neighbor] = node;
          }
        }
      }
    }
  }

  // Check for negative cycles (not applicable in our case, but good practice)
  for (let node of nodes) {
    if (distances[node] !== Infinity) {
      for (let neighbor in graph[node]) {
        if (distances[node] + graph[node][neighbor] < distances[neighbor]) {
          throw new Error("Graph contains negative weight cycle");
        }
      }
    }
  }

  // Reconstruct path
  const path = [];
  let current = end;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  const endTime = performance.now();
  const computationTime = Math.round(endTime - startTime);

  return {
    algorithm: 'bellman-ford',
    path,
    distance: distances[end],
    duration: distances[end] / 8,
    computationTime
  };
};

export const getAirports = () => {
  return airports;
};

export const calculatePath = async (source, destination, algorithm = 'dijkstra') => {
  const graph = createGraph();
  
  // Add artificial delay to simulate real API call
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  switch (algorithm) {
    case 'astar':
      return aStar(graph, source, destination);
    case 'floyd-warshall':
      return floydWarshall(graph, source, destination);
    case 'bellman-ford':
      return bellmanFord(graph, source, destination);
    case 'dijkstra':
    default:
      return dijkstra(graph, source, destination);
  }
};

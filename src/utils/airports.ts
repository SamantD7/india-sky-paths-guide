
import { Airport } from "@/types/aviation";

// Mock airport data with extended list
export const airports: Airport[] = [
  { code: "DEL", name: "Indira Gandhi International Airport", city: "New Delhi", state: "Delhi", position: { lat: 28.5561, lng: 77.1000 } },
  { code: "BOM", name: "Chhatrapati Shivaji International Airport", city: "Mumbai", state: "Maharashtra", position: { lat: 19.0896, lng: 72.8656 } },
  { code: "MAA", name: "Chennai International Airport", city: "Chennai", state: "Tamil Nadu", position: { lat: 12.9941, lng: 80.1709 } },
  { code: "BLR", name: "Kempegowda International Airport", city: "Bangalore", state: "Karnataka", position: { lat: 13.1986, lng: 77.7066 } },
  { code: "CCU", name: "Netaji Subhas Chandra Bose International Airport", city: "Kolkata", state: "West Bengal", position: { lat: 22.6520, lng: 88.4463 } },
  { code: "HYD", name: "Rajiv Gandhi International Airport", city: "Hyderabad", state: "Telangana", position: { lat: 17.2403, lng: 78.4294 } },
  { code: "COK", name: "Cochin International Airport", city: "Kochi", state: "Kerala", position: { lat: 10.1520, lng: 76.3919 } },
  { code: "PNQ", name: "Pune Airport", city: "Pune", state: "Maharashtra", position: { lat: 18.5793, lng: 73.9089 } },
  { code: "GOI", name: "Dabolim Airport", city: "Goa", state: "Goa", position: { lat: 15.3808, lng: 73.8314 } },
  { code: "AMD", name: "Sardar Vallabhbhai Patel International Airport", city: "Ahmedabad", state: "Gujarat", position: { lat: 23.0722, lng: 72.6193 } },
  { code: "JAI", name: "Jaipur International Airport", city: "Jaipur", state: "Rajasthan", position: { lat: 26.8242, lng: 75.8122 } },
  { code: "IXC", name: "Chandigarh International Airport", city: "Chandigarh", state: "Chandigarh", position: { lat: 30.6735, lng: 76.7885 } }
];

// Expanded mock flight routes (graph edges) to ensure connectivity
export const routes = [
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

// Function to get all airports
export function getAirports(): Airport[] {
  return airports;
}

// Create graph from routes
export function createGraph() {
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
  
  return graph;
}

import { Airport, Route } from "@/types/aviation";
import dijkstra from "../algorithms/dijkstra";
import aStar from "../algorithms/astar";
import floydWarshall from "../algorithms/floydWarshall";
import { bellmanFord } from '../algorithms/bellmanFord';

const airportsData: Airport[] = [
  {
    code: "JFK",
    name: "John F. Kennedy International Airport",
    city: "New York",
    state: "NY",
    position: { lat: 40.6413, lng: -73.7781 },
  },
  {
    code: "LAX",
    name: "Los Angeles International Airport",
    city: "Los Angeles",
    state: "CA",
    position: { lat: 34.0522, lng: -118.2437 },
  },
  {
    code: "ORD",
    name: "O'Hare International Airport",
    city: "Chicago",
    state: "IL",
    position: { lat: 41.8781, lng: -87.6298 },
  },
  {
    code: "DFW",
    name: "Dallas/Fort Worth International Airport",
    city: "Dallas",
    state: "TX",
    position: { lat: 32.7767, lng: -96.7970 },
  },
  {
    code: "DEN",
    name: "Denver International Airport",
    city: "Denver",
    state: "CO",
    position: { lat: 39.7392, lng: -104.9903 },
  },
  {
    code: "SFO",
    name: "San Francisco International Airport",
    city: "San Francisco",
    state: "CA",
    position: { lat: 37.7749, lng: -122.4194 },
  },
  {
    code: "ATL",
    name: "Hartsfield-Jackson Atlanta International Airport",
    city: "Atlanta",
    state: "GA",
    position: { lat: 33.7489954, lng: -84.3879824 },
  },
  {
    code: "SEA",
    name: "Seattle-Tacoma International Airport",
    city: "Seattle",
    state: "WA",
    position: { lat: 47.6062, lng: -122.3321 },
  },
  {
    code: "MCO",
    name: "Orlando International Airport",
    city: "Orlando",
    state: "FL",
    position: { lat: 28.4294, lng: -81.3089 },
  },
  {
    code: "CLT",
    name: "Charlotte Douglas International Airport",
    city: "Charlotte",
    state: "NC",
    position: { lat: 35.2271, lng: -80.8431 },
  },
];

const graph = {
  JFK: [
    { to: "LAX", distance: 3940 },
    { to: "ORD", distance: 740 },
    { to: "ATL", distance: 800 },
  ],
  LAX: [
    { to: "JFK", distance: 3940 },
    { to: "DFW", distance: 1235 },
    { to: "SFO", distance: 338 },
  ],
  ORD: [
    { to: "JFK", distance: 740 },
    { to: "DEN", distance: 900 },
    { to: "DFW", distance: 802 },
  ],
  DFW: [
    { to: "LAX", distance: 1235 },
    { to: "ORD", distance: 802 },
    { to: "DEN", distance: 660 },
    { to: "CLT", distance: 930 },
  ],
  DEN: [
    { to: "ORD", distance: 900 },
    { to: "DFW", distance: 660 },
    { to: "SFO", distance: 950 },
    { to: "SEA", distance: 1020 },
  ],
  SFO: [
    { to: "LAX", distance: 338 },
    { to: "DEN", distance: 950 },
    { to: "SEA", distance: 680 },
  ],
  ATL: [
    { to: "JFK", distance: 800 },
    { to: "MCO", distance: 400 },
  ],
  SEA: [
    { to: "SFO", distance: 680 },
    { to: "DEN", distance: 1020 },
  ],
  MCO: [
    { to: "ATL", distance: 400 },
    { to: "CLT", distance: 460 },
  ],
  CLT: [
    { to: "DFW", distance: 930 },
    { to: "MCO", distance: 460 },
  ],
};

export const getAirports = (): Airport[] => {
  return airportsData;
};

export const calculatePath = async (
  sourceCode: string,
  destinationCode: string,
  algorithm: string
): Promise<Route> => {
  return new Promise((resolve, reject) => {
    try {
      let result;
      
      switch (algorithm) {
        case 'dijkstra':
          result = dijkstra(graph, airportsData, sourceCode, destinationCode);
          break;
        case 'astar':
          result = aStar(graph, airportsData, sourceCode, destinationCode);
          break;
        case 'floyd-warshall':
          result = floydWarshall(graph, airportsData, sourceCode, destinationCode);
          break;
        case 'bellman-ford':
          result = bellmanFord(graph, airportsData, sourceCode, destinationCode);
          break;
        default:
          throw new Error(`Unknown algorithm: ${algorithm}`);
      }
      
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

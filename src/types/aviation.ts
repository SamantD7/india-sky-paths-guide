
export interface Airport {
  code: string;
  name: string;
  city: string;
  position: {
    lat: number;
    lng: number;
  };
}

export interface Route {
  algorithm: string;
  path: string[];
  distance: number;
  duration: number;
}

export interface FlightData {
  flightNumber: string;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
}

export interface WeatherData {
  temperature: number;
  conditions: string;
  windSpeed: number;
  visibility: number;
}

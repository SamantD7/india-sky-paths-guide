
export const FLIGHT_RATES = {
  economy: 3, // ₹3 per km
  business: 7, // ₹7 per km
} as const;

export type FlightClass = keyof typeof FLIGHT_RATES;

export const calculateFlightCost = (distance: number, flightClass: FlightClass): number => {
  return distance * FLIGHT_RATES[flightClass];
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getFlightClassDisplayName = (flightClass: FlightClass): string => {
  return flightClass === 'economy' ? 'Economy Class' : 'Business Class';
};


export const FLIGHT_RATES = {
  economy: 3, // ₹3 per km
  business: 7, // ₹7 per km
};

export const calculateFlightCost = (distance, flightClass) => {
  return distance * FLIGHT_RATES[flightClass];
};

export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getFlightClassDisplayName = (flightClass) => {
  return flightClass === 'economy' ? 'Economy Class' : 'Business Class';
};

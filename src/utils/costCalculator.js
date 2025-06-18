
export const FLIGHT_CLASSES = {
  ECONOMY: 'economy',
  BUSINESS: 'business'
};

export const COST_PER_KM = {
  [FLIGHT_CLASSES.ECONOMY]: 3,
  [FLIGHT_CLASSES.BUSINESS]: 7
};

export const calculateFlightCost = (distance, flightClass) => {
  const costPerKm = COST_PER_KM[flightClass] || COST_PER_KM[FLIGHT_CLASSES.ECONOMY];
  return distance * costPerKm;
};

export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getFlightClassName = (flightClass) => {
  switch (flightClass) {
    case FLIGHT_CLASSES.BUSINESS:
      return 'Business Class';
    case FLIGHT_CLASSES.ECONOMY:
    default:
      return 'Economy Class';
  }
};


// Utility to store and retrieve the Google Maps API key from localStorage
export const storeMapApiKey = (key: string): void => {
  localStorage.setItem('map_api_key', key);
};

export const getMapApiKey = (): string => {
  return localStorage.getItem('map_api_key') || '';
};

// Function to check if the API key exists
export const hasMapApiKey = (): boolean => {
  return !!localStorage.getItem('map_api_key');
};

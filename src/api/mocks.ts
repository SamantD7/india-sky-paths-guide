
import { mockBackendRequest } from "./aviation";

// Mock service worker or another solution would be better in a real app
// For now, we'll intercept fetch calls to our API endpoint
const originalFetch = window.fetch;

window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
  // Handle our specific API endpoint
  if (typeof input === "string" && input === "/api/calculate-path" && init?.method === "POST") {
    try {
      const body = JSON.parse(init.body as string);
      const { source, destination, algorithm } = body;
      
      // Call our mock backend function
      const route = await mockBackendRequest(source, destination, algorithm);
      
      // Return a mock Response object
      return new Response(JSON.stringify(route), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: (error as Error).message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  
  // For all other requests, use the original fetch
  return originalFetch(input, init);
};

export function setupMockAPI() {
  console.log("Mock API initialized");
}

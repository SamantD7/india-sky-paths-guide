
# Sky-Path Navigator

## Overview
Sky-Path Navigator is a web application designed to solve the problem of inefficient air traffic routing in India. It calculates optimized flight paths between Indian airports using graph algorithms like Dijkstra, A*, and Floyd-Warshall.

## Features
- Select source and destination airports in India
- Calculate the shortest/fastest route using graph algorithms
- Visualize the optimized route on an interactive map
- View detailed information about the calculated route

## Project Structure
- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: (To be implemented) Node.js with Express.js
- **Database**: (To be implemented) PostgreSQL or Neo4j
- **APIs**: Mock implementation for now, plans to integrate with AviationStack and Google Maps

## Current Implementation
- Clean React frontend with a simulated map component
- Airport selection interface with dummy data
- Dijkstra's algorithm implementation for path calculation
- Mock API endpoints to simulate backend functionality

## Next Steps
- Implement actual backend with Express.js
- Connect to a real database
- Integrate with Google Maps API for visualization
- Add real-time flight and weather data
- Implement additional routing algorithms for comparison

## Getting Started
1. Clone the repository
2. Install dependencies: `npm i`
3. Start the development server: `npm run dev`
4. Open your browser and navigate to the provided URL

## License
MIT


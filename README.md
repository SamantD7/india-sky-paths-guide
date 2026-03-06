# 🛫 India Sky Paths Guide

An interactive guide to India's aviation routes, leveraging advanced graph algorithms for optimized flight path discovery and learning.

---

## Project Overview

**India Sky Paths Guide** is a web application that visualizes major Indian airports and air routes, allowing users to explore and optimally connect points across India’s airspace. The core of this project is its implementation of classical pathfinding algorithms—Dijkstra’s, Bellman-Ford, and A*—to showcase shortest, safest, and heuristic-efficient aviation journeys.

Whether you're an aviation enthusiast, student, or developer interested in graph algorithms, this project provides an intuitive interface to experiment with and learn from real-world applications of algorithmic pathfinding!

- **Live Demo:** [https://india-sky-paths-guide.vercel.app](https://india-sky-paths-guide.vercel.app)

---

## Project Features

- ✈️ **Interactive Map:** Visual interface to select airports across India and visualize route connections.
- 🚦 **Graph Algorithm Exploration:** Run Dijkstra, Bellman-Ford, and A* on real-world data; instantly compare results.
- 📏 **Route Metrics:** See path lengths, node visits, and algorithm execution times in real-time.
- 🔄 **Dynamic Input:** Choose start/end points and see how different algorithms perform on-the-fly.
- 📊 **Performance Comparison:** Analyze the strengths/limitations of each algorithm through visual output and stats.
- 🖥️ **Modern Stack:** Lightning-fast and responsive web app with a clean, easy-to-use layout.

---

## Algorithms Used and Explained

### Dijkstra’s Algorithm

- **Purpose:** Finds the shortest path from a starting node to all other nodes with non-negative edge weights.
- **How it works:** Explores nodes with the least cumulative cost, updating shortest paths and stopping early when the target is found.
- **Aviation Use:** Find the quickest flight route between airports considering distances or costs.

### Bellman-Ford Algorithm

- **Purpose:** Computes shortest paths from a single source even when edges have negative weights (but no negative cycles).
- **How it works:** Iteratively relaxes all edges, up to (vertices - 1) times, updating shortest paths. Detects if a graph contains negative cycles (error for real-world maps).
- **Aviation Use:** Handles more complex scenarios (fuel incentives, time zones, etc.) that may affect route costs.

### A* (A-Star) Algorithm

- **Purpose:** Efficiently finds the shortest path using heuristics to guide the search (often faster than Dijkstra).
- **How it works:** Expands nodes based on the actual path cost from the start and an estimated cost to the target (heuristic, e.g., straight-line distance).
- **Aviation Use:** Quick suggestions for realistic flight paths, taking geography into account.

---

## Project Structure

```
india-sky-paths-guide/
├── public/                # Static assets
├── src/
│   ├── algorithms/        # Implementations of Dijkstra, Bellman-Ford, and A*
│   ├── components/        # React components (Map, Controls, Info Panels)
│   ├── data/              # Prebuilt airport and route data
│   ├── types/             # TypeScript types and interfaces
│   ├── utils/             # Utility modules (e.g., graph construction)
│   └── App.tsx            # Main app component
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md              # (This file)
```

---

## Tech Stack

- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Data Visualization:** Custom map rendering (SVG/Canvas/GeoJSON, depending on app)
- **Package Manager:** Bun or npm
- **Deployment:** Vercel

---

## Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/SamantD7/india-sky-paths-guide.git
   cd india-sky-paths-guide
   ```

2. **Install Dependencies:**
   ```bash
   bun install       # or npm install or yarn install
   ```

3. **Run the Development Server:**
   ```bash
   bun run dev       # or npm run dev or yarn dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173).

4. **Build for Production:**
   ```bash
   bun run build     # or npm run build or yarn build
   ```

---

## Acknowledgements

- **Graph Algorithm Concepts:** Thanks to the broader open-source community and the foundational literature on pathfinding algorithms.
- **React** – for powering the interactive UI
- **Tailwind CSS** – for rapid, modern styles
- **Vercel** – for hassle-free deployment
- **Indian aviation/map data** – (cite any data sources if used; e.g., OpenStreetMap, DGCA, or mock datasets)

---

## Contact

For questions, suggestions, or to contribute:

- GitHub: [@SamantD7](https://github.com/SamantD7)
- Open an issue or PR at: [india-sky-paths-guide Issues](https://github.com/SamantD7/india-sky-paths-guide/issues)

---

**Happy exploring and learning about the algorithms that power our connected world!**

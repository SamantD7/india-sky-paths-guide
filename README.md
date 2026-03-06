# Graph Algorithms for Flight Path Optimization

## Bellman-Ford Algorithm
The Bellman-Ford algorithm computes shortest paths from a single source vertex to all other vertices in a weighted graph. It is capable of handling graphs with negative edges but no negative cycles.

### Steps:
1. Initialize distances from the source to all vertices as infinite, except the source itself, which is set to 0.
2. Relax all edges |V| - 1 times, where |V| is the number of vertices.
3. Check for negative-weight cycles.

### Use Case:
Efficient for cases where edges can have negative weights, such as flight paths with varying costs.

## Dijkstra's Algorithm
Dijkstra's algorithm finds the shortest path between nodes in a graph, which may represent, for example, road networks. It is efficient for graphs with non-negative edge weights.

### Steps:
1. Set the initial node's distance to zero and all others to infinity.
2. Mark all nodes as unvisited. Set the initial node as current.
3. For the current node, consider all of its unvisited neighbors and calculate their tentative distances.
4. When done considering all neighbors, mark the current node as visited. A visited node will not be checked again.
5. If the destination node has been marked visited or if the smallest tentative distance among the unvisited nodes is infinity, the algorithm is complete.

### Use Case:
Effective for finding the shortest route in roadmaps or air traffic routes where weights are positive.

## A* Search Algorithm
The A* algorithm is a pathfinding and graph traversal algorithm that is widely used in computer science. It finds paths to the target node with the shortest weights while considering both the cost to reach that node and an estimated cost to reach the destination.

### Steps:
1. Initialize open and closed lists.
2. Add the starting node to the open list.
3. While the open list is not empty:
   - Find the node with the lowest f cost.
   - If it is the target node, reconstruct the path and return it.
   - Move this node from open to closed.
   - For each neighbor of the node:
       - If it is not walkable or in the closed list, ignore it.
       - If it is not in the open list, add it and calculate its costs.

### Use Case:
Used in scenarios where optimal pathfinding is required considering various factors like terrain, weather, etc.
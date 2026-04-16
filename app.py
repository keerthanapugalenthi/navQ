from flask import Flask, request, jsonify
import heapq

app = Flask(__name__)

# Sample graph (demo purpose)
graph = {
    'A': {'B': {'distance': 4, 'risk': 3}, 'C': {'distance': 2, 'risk': 5}},
    'B': {'A': {'distance': 4, 'risk': 3}, 'D': {'distance': 5, 'risk': 2}},
    'C': {'A': {'distance': 2, 'risk': 5}, 'D': {'distance': 8, 'risk': 6}},
    'D': {'B': {'distance': 5, 'risk': 2}, 'C': {'distance': 8, 'risk': 6}}
}

def dijkstra(start, end, metric):
    pq = [(0, start, [])]
    visited = set()

    while pq:
        cost, node, path = heapq.heappop(pq)

        if node in visited:
            continue

        path = path + [node]
        visited.add(node)

        if node == end:
            return cost, path

        for neighbor, values in graph[node].items():
            if neighbor not in visited:
                heapq.heappush(pq, (cost + values[metric], neighbor, path))

    return float("inf"), []

@app.route('/route', methods=['POST'])
def get_route():
    data = request.json
    start = data["source"]
    end = data["destination"]

    fast_cost, fast_path = dijkstra(start, end, 'distance')
    safe_cost, safe_path = dijkstra(start, end, 'risk')

    return jsonify({
        "fastest": {"path": fast_path, "cost": fast_cost},
        "safest": {"path": safe_path, "cost": safe_cost}
    })

if __name__ == "__main__":
    app.run(debug=True)

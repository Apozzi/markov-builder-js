import { Vertex } from "../../interfaces/Vertex";

export interface Edge {
    source: number;
    target: number;
}

export interface LayoutConfig {
    distanceBetweenItems: number;
    offsetX: number;
    offsetY: number;
    columns?: number;
}

export const DEFAULT_CONFIG: LayoutConfig = {
    distanceBetweenItems: 200,
    offsetX: 500,
    offsetY: 250,
    columns: undefined
};

export class GridLayout {
    private config: LayoutConfig;

    constructor(config: Partial<LayoutConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    private createAdjacencyList(vertices: Vertex[], edges: Edge[]): Map<number, Set<number>> {
        const adjacencyList = new Map<number, Set<number>>();
        
        vertices.forEach((vertex, index) => {
            adjacencyList.set(index, new Set<number>());
        });

        edges.forEach(edge => {
            adjacencyList.get(edge.source)?.add(edge.target);
            adjacencyList.get(edge.target)?.add(edge.source);
        });

        return adjacencyList;
    }

    // TODO: melhorar essa função para considerar bidimensionalidade da grid.
    private orderVerticesByConnectivity(vertices: Vertex[], edges: Edge[]): number[] {
        const adjacencyList = this.createAdjacencyList(vertices, edges);
        const visited = new Set<number>();
        const orderedIndices: number[] = [];
        const findNextVertex = (): number | null => {
            let maxConnections = -1;
            let bestVertex: number | null = null;
            adjacencyList.forEach((connections, vertexIndex) => {
                if (visited.has(vertexIndex)) return;
                let relevantConnections = 0;
                connections.forEach(neighbor => {
                    if (visited.has(neighbor)) relevantConnections++;
                });
                if (relevantConnections > maxConnections || 
                    (relevantConnections === maxConnections && connections.size > (adjacencyList.get(bestVertex!)?.size || 0))) {
                    maxConnections = relevantConnections;
                    bestVertex = vertexIndex;
                }
            });
            return bestVertex;
        };

        let startVertex = 0;
        let maxConnections = 0;
        adjacencyList.forEach((connections, index) => {
            if (connections.size > maxConnections) {
                maxConnections = connections.size;
                startVertex = index;
            }
        });
        orderedIndices.push(startVertex);
        visited.add(startVertex);
        while (visited.size < vertices.length) {
            const next = findNextVertex();
            if (next === null) {
                vertices.forEach((_, index) => {
                    if (!visited.has(index)) {
                        orderedIndices.push(index);
                        visited.add(index);
                    }
                });
            } else {
                orderedIndices.push(next);
                visited.add(next);
            }
        }
        return orderedIndices;
    }

    public layout(vertices: Vertex[], edges: Edge[]): Vertex[] {
        if (!vertices.length) return [];

        const orderedIndices = this.orderVerticesByConnectivity(vertices, edges);
        const numVertices = vertices.length;
        const columns = this.config.columns || Math.ceil(Math.sqrt(numVertices));
        const result = new Array(vertices.length);
        
        orderedIndices.forEach((originalIndex, newPositionIndex) => {
            const row = Math.floor(newPositionIndex / columns);
            const col = newPositionIndex % columns;
            result[originalIndex] = {
                ...vertices[originalIndex],
                x: col * this.config.distanceBetweenItems + this.config.offsetX,
                y: row * this.config.distanceBetweenItems + this.config.offsetY
            };
        });

        return result;
    }

    public getDimensions(numVertices: number): { rows: number; columns: number } {
        const columns = this.config.columns || Math.ceil(Math.sqrt(numVertices));
        const rows = Math.ceil(numVertices / columns);
        return { rows, columns };
    }
}
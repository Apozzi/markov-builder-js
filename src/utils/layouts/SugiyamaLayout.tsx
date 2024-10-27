import { Edge } from "../../interfaces/Edge";
import { Vertex } from "../../interfaces/Vertex";

export interface SugiyamaConfig {
    layerHeight: number;    // Distância vertical entre camadas
    nodeSpacing: number;    // Espaçamento horizontal entre nós
    marginLeft: number;     // Margem esquerda do layout
    marginTop: number;      // Margem superior do layout
}

export const DEFAULT_CONFIG: SugiyamaConfig = {
    layerHeight: 300,
    nodeSpacing: 300,
    marginLeft: 50,
    marginTop: 50
};

interface ExtendedVertex extends Vertex {
    layer?: number;
    order?: number;
    dummy?: boolean;
}

interface ExtendedEdge extends Edge {
    dummy?: boolean;
    points?: { x: number; y: number; }[];
}

export class SugiyamaLayout {
    private config: SugiyamaConfig;

    constructor(config: Partial<SugiyamaConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    private findCycles(vertices: ExtendedVertex[], edges: Edge[]): Edge[] {
        const visited = new Set<number>();
        const recursionStack = new Set<number>();
        const cycleEdges: Edge[] = [];

        const dfs = (vertex: ExtendedVertex, parent: ExtendedVertex | null) => {
            visited.add(vertex.id);
            recursionStack.add(vertex.id);

            const neighbors = edges
                .filter(e => e.source === vertex.id)
                .map(e => vertices.find(v => v.id === e.target)!);

            for (const neighbor of neighbors) {
                if (!visited.has(neighbor.id)) {
                    if (dfs(neighbor, vertex)) {
                        cycleEdges.push({
                            source: vertex.id,
                            target: neighbor.id
                        });
                    }
                } else if (recursionStack.has(neighbor.id)) {
                    cycleEdges.push({
                        source: vertex.id,
                        target: neighbor.id
                    });
                    return true;
                }
            }

            recursionStack.delete(vertex.id);
            return false;
        };

        vertices.forEach(vertex => {
            if (!visited.has(vertex.id)) {
                dfs(vertex, null);
            }
        });

        return cycleEdges;
    }

    private assignLayers(vertices: ExtendedVertex[], edges: Edge[]): Map<number, ExtendedVertex[]> {
        // Cálculo do grau de entrada para cada vértice
        const inDegree = new Map<number, number>();
        vertices.forEach(v => inDegree.set(v.id, 0));
        edges.forEach(e => {
            const current = inDegree.get(e.target) || 0;
            inDegree.set(e.target, current + 1);
        });

        // Identificação dos nós fonte (sem arestas de entrada)
        const sources = vertices.filter(v => inDegree.get(v.id) === 0);
        const layers = new Map<number, ExtendedVertex[]>();
        const assigned = new Set<number>();

        // Atribuição de camadas
        let currentLayer = 0;
        let currentNodes = sources;

        while (currentNodes.length > 0) {
            layers.set(currentLayer, currentNodes);
            currentNodes.forEach(node => {
                node.layer = currentLayer;
                assigned.add(node.id);
            });

            const nextNodes: ExtendedVertex[] = [];
            currentNodes.forEach(node => {
                const outgoingEdges = edges.filter(e => e.source === node.id);
                outgoingEdges.forEach(edge => {
                    const targetNode = vertices.find(v => v.id === edge.target)!;
                    if (!assigned.has(targetNode.id)) {
                        const newInDegree = (inDegree.get(targetNode.id) || 0) - 1;
                        inDegree.set(targetNode.id, newInDegree);
                        if (newInDegree === 0) {
                            nextNodes.push(targetNode);
                        }
                    }
                });
            });

            currentNodes = nextNodes;
            currentLayer++;
        }

        return layers;
    }

    private minimizeCrossings(layers: Map<number, ExtendedVertex[]>, edges: Edge[]): void {
        const getEdgeCrossings = (layer1: ExtendedVertex[], layer2: ExtendedVertex[]): number => {
            let crossings = 0;
            for (let i = 0; i < layer1.length; i++) {
                for (let j = i + 1; j < layer1.length; j++) {
                    const edges1 = edges.filter(e => 
                        e.source === layer1[i].id && 
                        layer2.some(v => v.id === e.target)
                    );
                    const edges2 = edges.filter(e => 
                        e.source === layer1[j].id && 
                        layer2.some(v => v.id === e.target)
                    );

                    for (const e1 of edges1) {
                        for (const e2 of edges2) {
                            const pos1 = layer2.findIndex(v => v.id === e1.target);
                            const pos2 = layer2.findIndex(v => v.id === e2.target);
                            if (pos1 > pos2) crossings++;
                        }
                    }
                }
            }
            return crossings;
        };

        // Barycenter method
        const calculateBarycenter = (vertex: ExtendedVertex, otherLayer: ExtendedVertex[], isUpperLayer: boolean): number => {
            const connectedVertices = edges
                .filter(e => isUpperLayer ? e.target === vertex.id : e.source === vertex.id)
                .map(e => isUpperLayer ? e.source : e.target);

            if (connectedVertices.length === 0) return vertex.order || 0;

            const positions = connectedVertices.map(id => {
                const v = otherLayer.find(v => v.id === id);
                return v ? v.order || 0 : 0;
            });

            return positions.reduce((a, b) => a + b, 0) / positions.length;
        };

        // Iterate through layers multiple times to reduce crossings
        const maxIterations = 24;
        for (let iteration = 0; iteration < maxIterations; iteration++) {
            const layerCount = layers.size;
            
            // Sweep down
            for (let i = 1; i < layerCount; i++) {
                const upperLayer = layers.get(i - 1)!;
                const currentLayer = layers.get(i)!;

                currentLayer.forEach((vertex, index) => {
                    vertex.order = index;
                });

                // Sort by barycenter
                currentLayer.sort((a, b) => {
                    const baryA = calculateBarycenter(a, upperLayer, true);
                    const baryB = calculateBarycenter(b, upperLayer, true);
                    return baryA - baryB;
                });
            }

            // Sweep up
            for (let i = layerCount - 2; i >= 0; i--) {
                const lowerLayer = layers.get(i + 1)!;
                const currentLayer = layers.get(i)!;

                currentLayer.forEach((vertex, index) => {
                    vertex.order = index;
                });

                // Sort by barycenter
                currentLayer.sort((a, b) => {
                    const baryA = calculateBarycenter(a, lowerLayer, false);
                    const baryB = calculateBarycenter(b, lowerLayer, false);
                    return baryA - baryB;
                });
            }
        }
    }

    private assignCoordinates(layers: Map<number, ExtendedVertex[]>): void {
        layers.forEach((vertices, layer) => {
            vertices.forEach((vertex, index) => {
                vertex.y = this.config.marginTop + (layer * this.config.layerHeight);
                vertex.x = this.config.marginLeft + (index * this.config.nodeSpacing);
            });
        });
    }

    public layout(vertices: Vertex[], edges: Edge[]): Vertex[] {
        const extendedVertices = vertices as ExtendedVertex[];
        
        // Fase 1: Remoção de ciclos
        const cycleEdges = this.findCycles(extendedVertices, edges);
        const acyclicEdges = edges.filter(edge => 
            !cycleEdges.some(ce => 
                ce.source === edge.source && ce.target === edge.target
            )
        );

        // Fase 2: Atribuição de camadas
        const layers = this.assignLayers(extendedVertices, acyclicEdges);

        // Fase 3: Redução de cruzamentos
        this.minimizeCrossings(layers, acyclicEdges);

        // Fase 4: Atribuição de coordenadas
        this.assignCoordinates(layers);

        return vertices;
    }
}
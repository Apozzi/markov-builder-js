import { Edge } from "../../interfaces/Edge";
import { Vertex } from "../../interfaces/Vertex";

export interface LayoutConfig {
}

export const DEFAULT_CONFIG: LayoutConfig = {
};

export class TreeLayout {
    private config: LayoutConfig;

    constructor(config: Partial<LayoutConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    public initializeLayout(vertices: Vertex[]): void {
        if (!vertices.length) return;
    }

    public layout(vertices: Vertex[], edges: Edge[]): Vertex[] {
        let initialVertex = vertices.reduce((p , c) => {
            const countPreviousEdges = edges.filter((e) => e.source === p.id);
            const countCurrentEdges = edges.filter((e) => e.source === c.id);
            if (countPreviousEdges > countCurrentEdges) return p;
            return c;
        }, {} as Vertex);

        let vertexLayeredListTree = [[initialVertex]];
        vertexLayeredListTree.forEach((layer) => {
            let newLayer = [] as Vertex[];
            layer.forEach((vertice) => {
                newLayer = newLayer.concat(
                    edges.filter(e => e.source === vertice.id)
                        .map((e) => vertices.find((v) => v.id === e.target) || {} as Vertex)
                );
            });
            vertexLayeredListTree.push(newLayer);
        });

        console.log(vertexLayeredListTree);

        return [];
    }
}
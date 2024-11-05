import { Edge } from "../../interfaces/Edge";
import { Vertex } from "../../interfaces/Vertex";
import { TreeLayout } from "./TreeLayout";

export interface LayoutConfig {
    radius: number,
    margin: number,
    offsetX: number,
    offsetY: number
}

export const DEFAULT_CONFIG: LayoutConfig = {
    radius: 200,
    margin: 200,
    offsetX: 700,
    offsetY: 400
};

export class RadialLayout {
    private config: LayoutConfig;

    constructor(config: Partial<LayoutConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    public initializeLayout(vertices: Vertex[]): void {
        if (!vertices.length) return;
    }

    public layout(vertices: Vertex[], edges: Edge[], selectedVertex: Vertex | null): Vertex[] {
        let treeLayout = new TreeLayout();
        treeLayout.initializeLayout(vertices, edges);
        treeLayout.setSelectedInitialVertice(selectedVertex);
        const vertexLayeredListTree = treeLayout.getLayeredListTree(vertices, edges);
        const vertexLayeredListOfSizes = treeLayout.getLayeredListOfSizes(vertexLayeredListTree)
        const maxSizeCount = vertexLayeredListOfSizes[0].reduce((a: number, b:number) => a+b, 0);
        
        return vertexLayeredListTree.map((layer: any, i: number) => {
            let acc = 0;
            return layer.map((v: Vertex, j: number) => {
                const vertexSize = vertexLayeredListOfSizes[i][j];
                const angle = (vertexSize/2 + acc) * (2* Math.PI / maxSizeCount); 
                const distanceCenterMultiplier = vertexLayeredListOfSizes[0].length === 1 ? i : i + 1;
                const x = Math.cos(angle) * this.config.radius * distanceCenterMultiplier + this.config.offsetX / maxSizeCount;
                const y = Math.sin(angle) * this.config.radius * distanceCenterMultiplier + this.config.offsetY / maxSizeCount;
                const newVertex = {
                    ...v,
                    x:  x,
                    y: y
                };
                acc += vertexSize;
                return newVertex;
            });
        }).reduce((p: any, c: any) => (c.concat(p)), []).filter((v: Vertex) => v.id !== -1);
    }
}
import { Edge } from "../../interfaces/Edge";
import { Vertex } from "../../interfaces/Vertex";
import { Vector2D, VectorUtils } from "../AlgorithmsUtils";

export interface LayoutConfig {
}

export const DEFAULT_CONFIG: LayoutConfig = {
};

export class SugiyamaLayout {
    private config: LayoutConfig;

    constructor(config: Partial<LayoutConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    public initializeLayout(vertices: Vertex[]): void {
        if (!vertices.length) return;
    }

    public layout(vertices: Vertex[], edges: Edge[]): Vertex[] {
        return [];
    }
}
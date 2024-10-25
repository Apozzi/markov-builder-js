import { Edge } from "../interfaces/Edge";
import { Vertex } from "../interfaces/Vertex";
import { Vector2D, VectorUtils } from "./AlgorithmsUtils";

export interface LayoutConfig {
    springForce: number;
    idealDistance: number;
    repulsiveStrength: number;
    iterations: number;
    coolingFactor: number;
    maxDisplacement: number;
    minDistance: number; 
    area: number;
}

export const DEFAULT_CONFIG: LayoutConfig = {
    springForce: 0.4,  
    idealDistance: 1000,
    repulsiveStrength: 40,
    iterations: 1, 
    coolingFactor: 0.95,
    maxDisplacement: 200,
    minDistance: 100, 
    area: 1000 * 1000 
};

export class FruchtermanReingold {
    private config: LayoutConfig;
    private temperature: number;
    private center: Vector2D;
    private k: number;

    constructor(config: Partial<LayoutConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.temperature = this.config.maxDisplacement;
        const sideLength = Math.sqrt(this.config.area);
        this.center = { x: sideLength / 2, y: sideLength / 2 };
        this.k=0
    }

    public initializeLayout(vertices: Vertex[]): void {
        if (!vertices.length) return;
        this.temperature = this.config.maxDisplacement;
        this.k = Math.sqrt(this.config.area / vertices.length);
        
    }

    private calculateRepulsiveForce(vertices: Vertex[], displacements: Map<number, Vector2D>) {
        for (let i = 0; i < vertices.length; i++) {
            for (let j = i + 1; j < vertices.length; j++) {
                const u = vertices[i];
                const v = vertices[j];
                
                const delta = VectorUtils.subtract(u, v);
                let dist = VectorUtils.magnitude(delta);
                
                dist = Math.max(dist, this.config.minDistance);
                
                const repulsiveForce = (this.config.repulsiveStrength * this.k * this.k) / (dist * dist);
                const direction = VectorUtils.normalize(delta);
                const forceVector = VectorUtils.scale(direction, repulsiveForce);
                
                this.addDisplacement(u.id, forceVector, displacements);
                this.addDisplacement(v.id, VectorUtils.scale(forceVector, -1), displacements);
            }
        }
    }

    private calculateAttractiveForce(vertices: Vertex[], edges: Edge[], displacements: Map<number, Vector2D>) {
        for (const edge of edges) {
            const u = vertices.find(v => v.id === edge.source);
            const v = vertices.find(v => v.id === edge.target);
            
            if (!u || !v) continue;
            
            const delta = VectorUtils.subtract(v, u);
            const dist = VectorUtils.magnitude(delta);
            
            const attractiveForce = (dist * dist) / (this.k * this.config.springForce);
            const direction = VectorUtils.normalize(delta);
            const forceVector = VectorUtils.scale(direction, attractiveForce);
            
            this.addDisplacement(edge.source, forceVector, displacements);
            this.addDisplacement(edge.target, VectorUtils.scale(forceVector, -1), displacements);
        }
    }

    private calculateDisplacements(vertices: Vertex[], edges: Edge[]): Map<number, Vector2D> {
        const displacements = new Map<number, Vector2D>();
        vertices.forEach(vertex => displacements.set(vertex.id, { x: 0, y: 0 }));
        
        this.calculateRepulsiveForce(vertices, displacements);
        this.calculateAttractiveForce(vertices, edges, displacements)
        
        vertices.forEach(vertex => {
            const dx = vertex.x - this.center.x;
            const dy = vertex.y - this.center.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = Math.min(this.center.x, this.center.y) * 0.9;
            if (dist > maxDist) {
                const scale = maxDist / dist;
                const disp = displacements.get(vertex.id)!;
                disp.x -= (dx - dx * scale) * 0.1;
                disp.y -= (dy - dy * scale) * 0.1;
            }
        });
        
        return displacements;
    }

    private addDisplacement(vertexId: number, force: Vector2D, displacements: Map<number, Vector2D>): void {
        const currentDisp = displacements.get(vertexId);
        if (!currentDisp) return;
        displacements.set(vertexId, VectorUtils.add(currentDisp, force));
    }

    private applyDisplacements(vertices: Vertex[], displacements: Map<number, Vector2D>): Vertex[] {
        return vertices.map(vertex => {
            const disp = displacements.get(vertex.id);
            if (!disp) return vertex;
            
            const limitedDisp = VectorUtils.limitMagnitude(disp, this.temperature);
            const margin = 10;
            const maxX = Math.sqrt(this.config.area) - margin;
            const maxY = Math.sqrt(this.config.area) - margin;
            
            return {
                ...vertex,
                x: Math.max(margin, Math.min(maxX, vertex.x + limitedDisp.x)),
                y: Math.max(margin, Math.min(maxY, vertex.y + limitedDisp.y))
            };
        });
    }

    private coolDown(): void {
        this.temperature = Math.max(0.01, this.temperature * this.config.coolingFactor);
    }

    public layout(vertices: Vertex[], edges: Edge[]): Vertex[] {
        if (!vertices.length) return vertices;
        let currentVertices = [...vertices];
        
        for (let i = 0; i < this.config.iterations; i++) {
            const displacements = this.calculateDisplacements(currentVertices, edges);
            currentVertices = this.applyDisplacements(currentVertices, displacements);
            this.coolDown();
        }
        
        return currentVertices;
    }
}
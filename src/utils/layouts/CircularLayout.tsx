import { Vertex } from "../../interfaces/Vertex";

export interface CircularLayoutConfig {
    radius?: number;     
    startAngle?: number; 
    angleSpacing?: number;
    centerX?: number
    centerY?: number;
    multiLevel?: boolean;
    groupProperty?: string;
    spacing?: number;
    sort?: boolean;
}

const DEFAULT_CONFIG: Required<CircularLayoutConfig> = {
    radius: 200,
    startAngle: 0,
    angleSpacing: 0,
    centerX: 300,
    centerY: 300,
    multiLevel: false,
    groupProperty: 'group',
    spacing: 100,
    sort: true
};

export class CircularLayout {
    private config: Required<CircularLayoutConfig>;

    constructor(config: CircularLayoutConfig = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    private getGroupedVertices(vertices: Vertex[]): Map<string | number, Vertex[]> {
        const groups = new Map<string | number, Vertex[]>();
        if (!this.config.multiLevel) {
            groups.set('default', vertices);
            return groups;
        }
        vertices.forEach(vertex => {
            const group = (vertex as any)[this.config.groupProperty] || 'default';
            if (!groups.has(group)) {
                groups.set(group, []);
            }
            groups.get(group)!.push(vertex);
        });
        return groups;
    }

    private sortVertices(vertices: Vertex[]): Vertex[] {
        if (!this.config.sort) return vertices;
        return [...vertices].sort((a, b) => {
            if (this.config.multiLevel) {
                const groupA = (a as any)[this.config.groupProperty] || '';
                const groupB = (b as any)[this.config.groupProperty] || '';
                if (groupA !== groupB) return groupA.localeCompare(groupB);
            }
            return a.id - b.id;
        });
    }

    private calculateOptimalRadius(vertexCount: number, level: number = 0): number {
        const baseRadius = this.config.radius;
        const minSpacing = 30;
        const requiredCircumference = vertexCount * minSpacing;
        const calculatedRadius = requiredCircumference / (2 * Math.PI);
        const optimalRadius = Math.max(baseRadius, calculatedRadius);
        return optimalRadius + (level * this.config.spacing);
    }

    private positionVerticesInCircle(vertices: Vertex[], radius: number): Vertex[] {
        const count = vertices.length;
        if (count === 0) return [];
        
        if (count === 1) {
            return [{
                ...vertices[0],
                x: this.config.centerX,
                y: this.config.centerY
            }];
        }

        const angleStep = (2 * Math.PI) / count;
        const totalAngle = this.config.angleSpacing;
        
        return vertices.map((vertex, index) => {
            const angle = this.config.startAngle + (angleStep * index) + totalAngle;
            return {
                ...vertex,
                x: this.config.centerX + radius * Math.cos(angle),
                y: this.config.centerY + radius * Math.sin(angle)
            };
        });
    }

    public layout(vertices: Vertex[]): Vertex[] {
        if (vertices.length === 0) return [];

        const sortedVertices = this.sortVertices(vertices);
        const groups = this.getGroupedVertices(sortedVertices);
        let positionedVertices: Vertex[] = [];

        if (this.config.multiLevel) {
            let level = 0;
            for (const [_, groupVertices] of groups) {
                const radius = this.calculateOptimalRadius(groupVertices.length, level);
                const positioned = this.positionVerticesInCircle(groupVertices, radius);
                positionedVertices = [...positionedVertices, ...positioned];
                level++;
            }
        } else {
            const radius = this.calculateOptimalRadius(vertices.length);
            positionedVertices = this.positionVerticesInCircle(sortedVertices, radius);
        }

        return positionedVertices;
    }
}
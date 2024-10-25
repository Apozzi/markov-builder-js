import { Vertex } from "../interfaces/Vertex";

export interface Vector2D {
    x: number;
    y: number;
}
export class VectorUtils {
    static normalize(v: Vector2D): Vector2D {
        const magnitude = this.magnitude(v);
        return magnitude === 0 
            ? { x: 0, y: 0 }
            : { x: v.x / magnitude, y: v.y / magnitude };
    }

    static subtract(v1: Vector2D | Vertex, v2: Vector2D | Vertex): Vector2D {
        if (!v1 || !v2) {
            throw new Error("Cannot subtract undefined vectors");
        }
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y
        };
    }

    static add(v1: Vector2D, v2: Vector2D): Vector2D {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y
        };
    }

    static scale(v: Vector2D, factor: number): Vector2D {
        return {
            x: v.x * factor,
            y: v.y * factor
        };
    }

    static magnitude(v: Vector2D): number {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    static limitMagnitude(v: Vector2D, maxMagnitude: number): Vector2D {
        const magnitude = this.magnitude(v);
        if (magnitude > maxMagnitude) {
            const scale = maxMagnitude / magnitude;
            return this.scale(v, scale);
        }
        return v;
    }

    static randomOffset(scale: number = 0.1): Vector2D {
        return {
            x: (Math.random() - 0.5) * scale,
            y: (Math.random() - 0.5) * scale
        };
    }
}

export interface Vector2D {
    x: number;
    y: number;
}


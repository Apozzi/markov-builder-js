import { Edge } from "../../interfaces/Edge";
import { Vertex } from "../../interfaces/Vertex";

export interface SpectralConfig {
    width: number;
    height: number;
    scaling: number;
    maxIterations: number;
    tolerance: number;
}

export const DEFAULT_CONFIG: SpectralConfig = {
    width: 1800,
    height: 1600,
    scaling: 500,
    maxIterations: 100,
    tolerance: 1e-6
};

export class SpectralLayout {
    private config: SpectralConfig;
    private randomVector: number[];

    constructor(config: Partial<SpectralConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.randomVector = [];
    }

    private normalizeVector(vector: number[]): number[] {
        const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        return vector.map(val => val / (norm || 1));
    }

    private matrixVectorMultiply(matrix: number[][], vector: number[]): number[] {
        return matrix.map(row => row.reduce((sum, val, j) => sum + val * vector[j], 0));
    }

    private computeEigenvector(matrix: number[][], initialGuess: number[]): number[] {
        let vector = [...initialGuess];
        let iteration = 0;
        while (iteration++ < this.config.maxIterations) {
            const prevVector = [...vector];
            vector = this.normalizeVector(this.matrixVectorMultiply(matrix, vector));
            if (vector.reduce((sum, val, i) => sum + Math.abs(val - prevVector[i]), 0) < this.config.tolerance) break;
        }
        return vector;
    }

    private findFiedlerVector(laplacian: number[][]): number[] {
        const n = laplacian.length;
        const trivialEigenvector = Array(n).fill(1 / Math.sqrt(n));
        const deflatedMatrix = laplacian.map((row, i) => row.map((val, j) => val - n * trivialEigenvector[i] * trivialEigenvector[j]));
        return this.computeEigenvector(deflatedMatrix, this.randomVector);
    }

    private findThirdEigenvector(laplacian: number[][], fiedlerVector: number[]): number[] {
        const n = laplacian.length;
        const trivialEigenvector = Array(n).fill(1 / Math.sqrt(n));
        const deflatedMatrix = laplacian.map((row, i) => 
            row.map((val, j) => {
                const result = val - n * trivialEigenvector[i] * trivialEigenvector[j];
                return result - n * fiedlerVector[i] * fiedlerVector[j];
            })
        );
        return this.computeEigenvector(deflatedMatrix, this.randomVector);
    }

    private scaleAndCenter(coords: number[], min: number, max: number, size: number): number[] {
        const range = max - min;
        const scaling = size / (range || 1);
        const offset = (size - (max + min) * scaling) / 2;
        return coords.map(coord => coord * scaling + offset);
    }

    public layout(vertices: Vertex[], edges: Edge[]): Vertex[] {
        // Mesmo que implementação seja apenas para grafos grandes, ainda assim decidi incluir.
        if (vertices.length <= 1) {
            if (vertices.length === 1) {
                vertices[0].x = this.config.width / 2;
                vertices[0].y = this.config.height / 2;
            }
            return vertices;
        }

        const laplacianMatrix = vertices.map((v:Vertex) => {
            return vertices.map((v2:Vertex)=> {
                if (v===v2) return edges.filter((e:Edge) => e.target === v.id || e.source === v.id).length;
                if (edges.filter((e:Edge) => (e.target===v.id && e.source===v2.id) || (e.target===v2.id && e.source===v.id)).length) return -1;
                return 0;
            });
        });
        this.randomVector = Array(laplacianMatrix.length).fill(0).map(() => Math.random() - 0.5);
        const fiedlerVector = this.findFiedlerVector(laplacianMatrix);
        const thirdEigenvector = this.findThirdEigenvector(laplacianMatrix, fiedlerVector);
        const [xMin, xMax] = [Math.min(...fiedlerVector), Math.max(...fiedlerVector)];
        const [yMin, yMax] = [Math.min(...thirdEigenvector), Math.max(...thirdEigenvector)];

        const xCoords = this.scaleAndCenter(fiedlerVector, xMin, xMax, this.config.width);
        const yCoords = this.scaleAndCenter(thirdEigenvector, yMin, yMax, this.config.height);
        
        vertices.forEach((vertex, i) => {
            vertex.x = xCoords[i];
            vertex.y = yCoords[i];
        });
        
        return vertices;
    }
}
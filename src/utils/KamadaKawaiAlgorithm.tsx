import { Edge } from "../interfaces/Edge";
import { Vertex } from "../interfaces/Vertex";
import { VectorUtils } from "./AlgorithmsUtils";

interface LayoutConfig {
    epsilon: number;
    L0: number;
    K: number;
}

const DEFAULT_CONFIG: LayoutConfig = {
    epsilon: 0.01,
    L0: 500,
    K: 10
};

// Caso quiser saber sobre Algoritmo de Kamada-Kawai, link do documento pdf: https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=b8d3bca50ccc573c5cb99f7d201e8acce6618f04

export class KamadaKawai {
    private config: LayoutConfig;
    private distanceMatrix: Map<number, Map<number, number>>;
    private idealLengthMatrix: Map<number, Map<number, number>>;
    private springStrengthMatrix: Map<number, Map<number, number>>;
    private Delta: Map<number, number>;

    constructor(config: Partial<LayoutConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.distanceMatrix = new Map();
        this.idealLengthMatrix = new Map();
        this.springStrengthMatrix = new Map();
        this.Delta = new Map();
    }

    public layout(vertices: Vertex[], edges: Edge[]): Vertex[] {
        this.initializeMatrices(vertices, edges);
        this.optimizeLayout(vertices);
        return vertices;
    }

    private initializeMatrices(vertices: Vertex[], edges: Edge[]): void {
        this.floydWarshall(vertices, edges);
        const maxDistance = this.getMaxDistance();
        // Formula L = L0 /max_{i<j} d_{ij} (Recomendação)
        const L = this.config.L0 / maxDistance;
        const K = this.config.K;
        this.computeIdealLengthAndSpringStrengthMatrix(vertices, L, K);
        this.Delta.set(vertices[0].id, Infinity);

        vertices.forEach((v) => {
            v.x = this.config.L0 * Math.random();
            v.y = this.config.L0 * Math.random();
        });
        
    }

    private optimizeLayout(vertices: Vertex[]): void {
        let maxDeltaId = vertices[0].id;
        // Tenda reduzir δE/δx, δE/δy para zero.
        while (this.Delta.get(maxDeltaId)! > this.config.epsilon) {
            maxDeltaId = this.computeDelta(vertices);
            this.updatePosition(vertices, maxDeltaId, 
                this.computePartialDerivatives(vertices, maxDeltaId)
            );
        }
    }

    private computePartialDerivatives(vertices: Vertex[], id: number, calc2DPartialDerivatives: boolean = true): any {
        // Calcula derivadas parciais da função
        // E = \frac{1}{2} \sum_{i \neq j} k_{ij} \left( d_{ij} - \| x_i - x_j \| \right)^2
        let Exx = 0, Exy = 0, Eyy = 0, Ex = 0, Ey = 0;
        for (let j = 0; j < vertices.length; ++j) {
            const jid = vertices[j].id;
            if (jid === id) continue;
            const verticeI = vertices.find((v) => v.id === id) || {x : 0, y : 0} as Vertex;
            const dxij = verticeI.x - vertices[j].x;
            const dyij = verticeI.y - vertices[j].y;
            const springStrength = this.springStrengthMatrix.get(id)!.get(jid)!;
            const idealLength = this.idealLengthMatrix.get(id)!.get(jid)!;
            const norm = VectorUtils.distance(verticeI, vertices[j]);
            Ex += springStrength * dxij * (1.0 - idealLength / norm);
            Ey += springStrength * dyij * (1.0 - idealLength / norm);
            if (calc2DPartialDerivatives) {
                const normPower3 = norm * norm * norm;
                Exy += springStrength * idealLength * dxij * dyij / normPower3;
                Exx += springStrength * (1.0 - idealLength * dyij * dyij / normPower3);
                Eyy += springStrength * (1.0 - idealLength * dxij * dxij / normPower3);
            }
        }
        // Retorna derivadas parciais respectiva a δE/δx, δE/δy, δE/δx^2, δE/δy^2, δE/δxy.
        return {Exx,Exy,Eyy,Ex,Ey}
    }

    private updatePosition(vertices: Vertex[], id: number, d: any): void {
        // Utiliza a regra de Cramer para solucionar equações (11) e (12) do pdf acima.
        const D = d.Exx * d.Eyy - d.Exy * d.Exy;
        const dx = -(d.Eyy * d.Ex - d.Exy * d.Ey) / D;
        const dy = -(-d.Exy * d.Ex + d.Exx * d.Ey) / D;
        const verticeI = vertices.find((v) => v.id === id) || {x : 0, y : 0} as Vertex;
        verticeI.x += dx;
        verticeI.y += dy;
        this.Delta.set(verticeI.id, Math.hypot(d.Ex, d.Ey));
    }

    private computeDelta(vertices: Vertex[]): number {
        let maxDelta = 0;
        let maxDeltaId = 0;
        for (let i = 0; i < vertices.length; ++i) {
            const d = this.computePartialDerivatives(vertices, vertices[i].id, false);
            const delta = Math.hypot(d.Ex, d.Ey);
            this.Delta.set(vertices[i].id, delta);
            if (delta > maxDelta) {
                maxDelta = delta;
                maxDeltaId = vertices[i].id;
            }
        }
        return maxDeltaId;
    }

    private floydWarshall(vertices: Vertex[], edges: Edge[]): void {
        vertices.forEach((v) => {
            this.distanceMatrix.set(v.id, new Map());
            vertices.forEach((u) => this.distanceMatrix.get(v.id)!.set(u.id, v.id === u.id ? 0 : Infinity));
        });
        edges.forEach(({ source, target }) => {
            this.distanceMatrix.get(source)!.set(target, 1);
            this.distanceMatrix.get(target)!.set(source, 1);
        });
        vertices.forEach((v) => {
            vertices.forEach((u) => {
                vertices.forEach((w) => {
                    const distVU = this.distanceMatrix.get(v.id)!.get(u.id)!;
                    const distVW = this.distanceMatrix.get(v.id)!.get(w.id)!;
                    const distWU = this.distanceMatrix.get(w.id)!.get(u.id)!;
                    this.distanceMatrix.get(v.id)!.set(u.id, Math.min(distVU, distVW + distWU));
                });
            });
        });
    }

    private getMaxDistance(): number {
        let maxDistance = 0;
        this.distanceMatrix.forEach((vid) => {
            vid.forEach((uid) => {
                const dist = vid!.get(uid)!;
                if (maxDistance < dist) maxDistance = dist;
            });
        });
        return maxDistance;
    }

    private computeIdealLengthAndSpringStrengthMatrix(vertices: Vertex[], L: number, K: number): void {
        vertices.forEach((v) => {
            this.idealLengthMatrix.set(v.id, new Map());
            this.springStrengthMatrix.set(v.id, new Map());
            vertices.forEach((u) => {
                const distVU = this.distanceMatrix.get(v.id)!.get(u.id)!;
                if (v.id !== u.id) {
                    // Formula: l_{i,j} = L d_{i,j}
                    this.idealLengthMatrix.get(v.id)!.set(u.id, L * distVU);
                    // Formula: k_{i,j} = K/(d_{i,j}^2)
                    this.springStrengthMatrix.get(v.id)!.set(u.id, K / (distVU * distVU));
                }
            });
        });
    }
}
import { Edge } from "../../interfaces/Edge";
import { Vertex } from "../../interfaces/Vertex";

export interface LayoutConfig {
    distanceX: number,
    distanceY: number,
    margin: number,
    offsetX: number,
    offsetY: number
}

export const DEFAULT_CONFIG: LayoutConfig = {
    distanceX: 200,
    distanceY: 200,
    margin: 200,
    offsetX: 700,
    offsetY: 400
};

export class TreeLayout {
    private config: LayoutConfig;
    private vertices: Vertex[];
    private edges: Edge[];
    private dict: any;
    private selectedInitialVertice: Vertex | null;


    constructor(config: Partial<LayoutConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.vertices = [];
        this.edges = [];
        this.selectedInitialVertice = null;
    }

    private getAdjancent(vertice: Vertex) {
        let adjancentList = (direction: boolean) => (
            this.edges.filter(e => (direction ? e.source : e.target) === vertice.id)
                .map((e) => { 
                    let verticeAdj = this.vertices.find((v) => v.id === (direction ? e.target : e.source) && !this.dict[v.id] && vertice.id !== v.id);
                    if (verticeAdj) this.dict[verticeAdj.id] = true;
                    return verticeAdj || {} as Vertex;
                })
                .filter(v => v.id)
        );
        return adjancentList(true).concat(adjancentList(false))
    }

    private getNumberOfChildren(vertice: Vertex, count = 0, eraseDict = true, alreadyProcessed: any) {
        if (eraseDict) this.dict = [];
        this.dict[vertice.id] = true;
        let adjancent = this.getAdjancent(vertice);
        adjancent = adjancent.filter(v => !alreadyProcessed.find((vap: Vertex) => vap.id === v.id));
        if (adjancent.length === 0) {
            return 1;
        }
        let result = 0;
        for (let index = 0; index < adjancent.length; index++) {
            result += this.getNumberOfChildren(adjancent[index], count, false, alreadyProcessed);
        }
        return result;
    }

    private concatSecondLayer(array1: any = [], array2: any = []) {
        const resultArray = [...array1];
        for (let index = 0; index < resultArray.length; index++) {
            const concatenationArray = array2[index] ? array2[index] : []
            resultArray[index] = resultArray[index].concat(concatenationArray);
        }
        return resultArray;
    }

    private allVerticesSeen() {
        let result = true;
        this.vertices.forEach((v) => {
            result &&= this.dict[v.id];
        });
        return result;
    }

    public setSelectedInitialVertice(vertice: Vertex | null) {
        this.selectedInitialVertice = vertice;
    }

    public generateTreeBFS(vertices: Vertex[], edges: Edge[], generatedEmptyObj: boolean = false) {
        let initialVertex = this.selectedInitialVertice && !this.dict[this.selectedInitialVertice?.id] ? 
            this.selectedInitialVertice : 
            vertices.reduce((p , c) => {
                const countPreviousEdges = edges.filter((e) => e.source === p.id || e.target === p.id);
                const countCurrentEdges = edges.filter((e) => e.source === c.id || e.target === c.id);
                const isPreviousOnDict = p.id && !this.dict[p.id];
                const isCurrentOnDict = c.id && !this.dict[c.id];
                if ((countPreviousEdges >= countCurrentEdges && isPreviousOnDict) || !isCurrentOnDict) return p;
                return c;
            }, {} as Vertex);

        this.dict[initialVertex.id] = true;
        let vertexLayeredListTree = [[initialVertex]];
        for (let index = 0; index < vertexLayeredListTree.length; index++) {
            const layer = vertexLayeredListTree[index];
            let newLayer = [] as Vertex[];
            layer.forEach((vertice) => {
                let adjList = this.getAdjancent(vertice);
                if (generatedEmptyObj && adjList.length=== 0) adjList= [{id: -1, label: ''} as Vertex];
                newLayer = newLayer.concat(adjList);
            });
            if (newLayer.filter(v => v.id !== -1).length === 0) break;
            vertexLayeredListTree.push(newLayer);
        }
        return vertexLayeredListTree;
    }

    public getLayeredListTree(vertices: Vertex[], edges: Edge[]) {
        let vertexLayeredListTree : any = this.generateTreeBFS(vertices, edges, true);
        while (!this.allVerticesSeen()) {
            vertexLayeredListTree = this.concatSecondLayer(vertexLayeredListTree, this.generateTreeBFS(vertices, edges, true));
        }
        return vertexLayeredListTree;
    }


    public getLayeredListOfSizes(vertexLayeredListTree:any) {
        let alreadyProcessed : Vertex[] = [];
        return vertexLayeredListTree.map((layer: any) => layer.map((v: Vertex) => {
            const numberOfChildren = this.getNumberOfChildren(v, 0, true, alreadyProcessed);
            alreadyProcessed.push(v);
            return numberOfChildren;
        }));
    }

    public initializeLayout(vertices: Vertex[] = [], edges: Edge[] = []) {
        this.vertices = vertices;
        this.edges = edges;
        this.dict = [];
    }

    public layout(vertices: Vertex[], edges: Edge[], invertedPos: boolean = false): Vertex[] {
        this.initializeLayout(vertices, edges)
        const vertexLayeredListTree = this.getLayeredListTree(vertices, edges);
        const vertexLayeredListOfSizes = this.getLayeredListOfSizes(vertexLayeredListTree)
        const maxSizeCount = vertexLayeredListOfSizes[0].reduce((a: number, b:number) => a+b, 0);

        return vertexLayeredListTree.map((layer: any, i: number) => {
            let acc = 0;
            return layer.map((v: Vertex, j: number) => {
                const vertexSize = vertexLayeredListOfSizes[i][j];
                const x = (vertexSize/2 + acc) * this.config.distanceX + this.config.offsetX / maxSizeCount;
                const y = this.config.distanceY * i + this.config.offsetY / maxSizeCount;
                const newVertex = {
                    ...v,
                    x: invertedPos ? y + this.config.margin : x,
                    y: invertedPos ?  x - this.config.margin: y
                };
                acc += vertexSize;
                return newVertex;
            });
        }).reduce((p: any, c: any) => (c.concat(p)), []).filter((v: Vertex) => v.id !== -1);
    }
}
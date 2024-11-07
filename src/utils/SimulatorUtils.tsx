import GraphSchematicsManager from "../components/GraphSchematics/GraphSchematicsManager";
import AlphabetIterator from "./AlphabetIterator";



const documentobj: any = document ? document : {};

const createCloneObject = (objectId: String) => {
    if (objectId != "vertice") return;
    let clone = document.createElement('div');
    clone.classList.add("gateSet");
    clone.style.position = "absolute";
    clone.style.left = '-400px';
    clone.style.top = '-400px';
    clone.style.zIndex = "999";
    clone.innerHTML = `
        <div class="vertice">?</div>
    `;

    return clone;
}

const addObjectToTableObj = (gateId:String, clone: any, tableobj: any) => {
    clone.style.marginTop = "-87px";
    clone.style.top = "50px";
    clone.style.left = "0px";
    clone.style.position = "relative";
    clone.style.zIndex = "10";
    clone.setAttribute( 'id', gateId + "Set" );
    clone.onmousedown = () => {
        cloneFunction(gateId);
        tableobj.removeChild(clone);

    }
    let gateObjs = Array.from(tableobj.childNodes).filter((obj : any) => obj.id !== "controlline");
    if (gateObjs.length > 1) {
        tableobj.removeChild(gateObjs.slice(-1).pop() as Node);
    }
    tableobj.appendChild(clone);
}

const windowOffsetX = 170;
const windowOffsetY= 60;

const cloneFunction = (gateId : String) => {
  let dragId = gateId + "Drag";
  let clone = createCloneObject(gateId);
  if (!clone) return;
  clone.setAttribute( 'id', dragId );
  documentobj.onmousemove = (e: any) => {
    let d = documentobj.getElementById(dragId);
    if (d) {
        d.style.left = e.pageX - 48 +'px';
        d.style.top = e.pageY - 48 +'px';
    }
  };
  documentobj.querySelector('.toolbox').appendChild( clone );
  documentobj.onmouseup = (e: any) => {
    documentobj.onmousedown= () => {};
    const x = e.clientX-windowOffsetX;
    const y = e.clientY-windowOffsetY;
    GraphSchematicsManager.addVertex({x, y, label:AlphabetIterator.getNextLetter()});
    if (clone) {
      clone.remove();
      clone = undefined;
      documentobj.onmousemove = null;
      documentobj.onmouseup = null;
    }
  };
}

function orientation(p: any, q: any, r: any): number {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) return 0;
  return (val > 0) ? 1 : 2;
}

function distanceSquared(p1: any, p2: any): number {
  return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}

export function convexHull(vertices: any[]): any[] {
  const n = vertices.length;
  if (n < 3) return vertices; 

  let bottommost = 0;
  for (let i = 1; i < n; i++) {
    if (vertices[i].y < vertices[bottommost].y ||
       (vertices[i].y === vertices[bottommost].y && vertices[i].x < vertices[bottommost].x)) {
      bottommost = i;
    }
  }

  [vertices[0], vertices[bottommost]] = [vertices[bottommost], vertices[0]];
  const start = vertices[0];

  const sortedVertices = vertices.slice(1).sort((a, b) => {
    const order = orientation(start, a, b);
    if (order === 0) { 
      return distanceSquared(start, a) - distanceSquared(start, b);
    }
    return order === 2 ? -1 : 1; 
  });

  sortedVertices.unshift(start);

  const stack: any[] = [sortedVertices[0], sortedVertices[1], sortedVertices[2]];
  for (let i = 3; i < n; i++) {
    while (stack.length > 1 && orientation(stack[stack.length - 2], stack[stack.length - 1], sortedVertices[i]) !== 2) {
      stack.pop();
    }
    stack.push(sortedVertices[i]);
  }

  return stack;
}


export default class SimulatorUtils {
    public static cloneObject(gateId : String) {
        cloneFunction(gateId);
    }

    public static addAllGatesInTable(gatesObj: any) {
        for (let gateObj of gatesObj) {
            SimulatorUtils.addObjectInTable(gateObj.gate, gateObj.x, gateObj.y);
        }
    }

    private static addObjectInTable(gateId : String, x: number, y: number) {
        let clone = createCloneObject(gateId);
        let tableobjs = document.getElementById(`table-box_${x}_${y}`);
        addObjectToTableObj(gateId, clone, tableobjs);
    }

    public static calculateConvexHull(vertices: any[]): any[] {
      return convexHull(vertices);
    }

    public static calculateCentroidVertex(vertices: any[]): any {
      const hullVertices = convexHull(vertices);
      if (hullVertices.length === 0) {
        throw new Error("Cannot calculate centroid of an empty set of vertices");
      }
    
      let sumX = 0;
      let sumY = 0;
    
      for (const vertex of hullVertices) {
        sumX += vertex.x;
        sumY += vertex.y;
      }
    
      const avgX = sumX / hullVertices.length;
      const avgY = sumY / hullVertices.length;
    
      return {
        x: avgX,
        y: avgY
      };
    }

}
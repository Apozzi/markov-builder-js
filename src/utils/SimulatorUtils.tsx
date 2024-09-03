


const documentobj: any = document ? document : {};

const overlaps = (a: any, b: any) => {
  if (a === null || b === null) return false;
  const rect1 = a.getBoundingClientRect();
  const rect2 = b.getBoundingClientRect();
  const isInHoriztonalBounds =
    rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
  const isInVerticalBounds =
    rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
  const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
  return isOverlapping;
}

const createCloneObject = (objectId: String) => {
    if (objectId != "vertice") return;
    let clone = document.createElement('div');
    clone.classList.add("gateSet");
    clone.style.position = "absolute";
    clone.style.left = '-400px';
    clone.style.top = '-400px';
    clone.style.zIndex = "999";
    clone.innerHTML = `
        <div class="vertice"></div>
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
    clone.onmousedown = (e : any) => {
        cloneFunction(gateId);
        tableobj.removeChild(clone);

    }
    let gateObjs = Array.from(tableobj.childNodes).filter((obj : any) => obj.id !== "controlline");
    if (gateObjs.length > 1) {
        tableobj.removeChild(gateObjs.slice(-1).pop() as Node);
    }

    tableobj.appendChild(clone);

}

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
    documentobj.onmousemove = () => {};
    let tableobjs = document.getElementsByClassName('table-box');
    let isOnTable = false
    Array.from(tableobjs).forEach(tableobj => {
      if (overlaps(clone, tableobj)) {
        isOnTable = true;
        addObjectToTableObj(gateId, clone, tableobj);
      }
    });
    const toolbox = documentobj.querySelector('.toolbox');
    if (clone && !isOnTable && clone.parentNode === toolbox) {
      toolbox.removeChild(clone);
      clone = undefined;
    }
  };
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

    

}
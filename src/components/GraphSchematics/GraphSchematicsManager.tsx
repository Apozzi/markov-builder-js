import { Subject } from "rxjs";

export default class GraphSchematicsManager {

  private static addVertexSubject = new Subject();
  private static edgeCreationModeSubject = new Subject();
  private static exitCreationModeSubject = new Subject();
  private static isEdgeCreationMode = false;

  static addVertex(data: any) {
    GraphSchematicsManager.addVertexSubject.next(data);
  }

  static toggleEdgeCreationMode(data: any) {
    GraphSchematicsManager.edgeCreationModeSubject.next(data);
    this.isEdgeCreationMode=true;
  }

  static exitEdgeCreationMode() {
    GraphSchematicsManager.exitCreationModeSubject.next({});
    this.isEdgeCreationMode=false;
  }

  static getStateEdgeCreationMode() {
    return this.isEdgeCreationMode;
  }


  static onAddVertex() {
    return GraphSchematicsManager.addVertexSubject;
  }

  static edgeCreationMode() {
    return GraphSchematicsManager.edgeCreationModeSubject;
  }
  static exitCreationMode() {
    return GraphSchematicsManager.exitCreationModeSubject;
  }

  static unsubcribeSubjects() {
    GraphSchematicsManager.addVertexSubject.unsubscribe();
    GraphSchematicsManager.edgeCreationModeSubject.unsubscribe();
  }

}
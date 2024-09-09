import { Subject } from "rxjs";

export default class GraphSchematicsManager {

  private static addVertexSubject = new Subject();
  private static changeVertexSubject = new Subject();
  private static deleteEdgeSubject = new Subject();
  private static edgeCreationModeSubject = new Subject();
  private static exitCreationModeSubject = new Subject();
  private static selectedVertexObjectSubject = new Subject();
  private static changeVerticeArraySubject = new Subject();
  private static isPlayingSubject = new Subject();
  private static isEdgeCreationMode = false;

  static addVertex(data: any) {
    GraphSchematicsManager.addVertexSubject.next(data);
  }

  static setPlayOrStop(state: boolean) {
    GraphSchematicsManager.isPlayingSubject.next(state);
  }

  static deleteEdge(data: any) {
    GraphSchematicsManager.deleteEdgeSubject.next(data);
  }

  static changeVertex(data: any) {
    GraphSchematicsManager.changeVertexSubject.next(data);
  }

  static changeVerticeArray(data: any) {
    GraphSchematicsManager.changeVerticeArraySubject.next(data);
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

  static vertexSelected(data: any) {
    GraphSchematicsManager.selectedVertexObjectSubject.next(data);
  }

  static onVertexSelected() {
    return GraphSchematicsManager.selectedVertexObjectSubject;
  }

  static onAddVertex() {
    return GraphSchematicsManager.addVertexSubject;
  }

  static onChangeVertex() {
    return GraphSchematicsManager.changeVertexSubject;
  }

  static onChangeVerticeArray() {
    return GraphSchematicsManager.changeVerticeArraySubject;
  }

  static onDeleteEdge() {
    return GraphSchematicsManager.deleteEdgeSubject;
  }

  static edgeCreationMode() {
    return GraphSchematicsManager.edgeCreationModeSubject;
  }
  static exitCreationMode() {
    return GraphSchematicsManager.exitCreationModeSubject;
  }

  static isPlaying() {
    return GraphSchematicsManager.isPlayingSubject;
  }

  static unsubcribeSubjects() {
    GraphSchematicsManager.addVertexSubject.unsubscribe();
    GraphSchematicsManager.edgeCreationModeSubject.unsubscribe();
    GraphSchematicsManager.edgeCreationModeSubject.unsubscribe();
    GraphSchematicsManager.deleteEdgeSubject.unsubscribe();
    GraphSchematicsManager.selectedVertexObjectSubject.unsubscribe();
    GraphSchematicsManager.isPlayingSubject.unsubscribe();
  }

}
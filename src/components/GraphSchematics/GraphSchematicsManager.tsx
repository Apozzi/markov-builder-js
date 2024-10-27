import { Subject, take } from "rxjs";
import AlphabetIterator from "../../utils/AlphabetIterator";

export default class GraphSchematicsManager {

  private static movement = 100;
  private static isEdgeCreationMode = false;
  private static savedState = {};

  private static addVertexSubject = new Subject();
  private static changeVertexSubject = new Subject();
  private static deleteEdgeSubject = new Subject();
  private static edgeCreationModeSubject = new Subject();
  private static exitCreationModeSubject = new Subject();
  private static selectedVertexObjectSubject = new Subject();
  private static changeVerticeArraySubject = new Subject();
  private static changeStateSubject = new Subject();
  private static isPlayingSubject = new Subject();
  private static resetAllSubject = new Subject();
  private static loadStateSubject = new Subject<any>();
  private static updateVerticeAndEdgesSubject = new Subject<any>();

  private static onActivateSongInfo = new Subject<any>();
  private static onChangeConfigSubject = new Subject<any>();

  private static offsetControlX = new Subject();
  private static offsetControlY = new Subject();
  private static offsetCenter = new Subject();

  //

  private static applyFruchtermanReingoldSubject = new Subject<any>();
  private static applyKamadaKawaiSubject = new Subject<any>();
  private static applyYifanHuSubject = new Subject<any>();

  //

  private static applyCircularLayoutSubject = new Subject<any>();
  private static applyGridLayoutSubject = new Subject<any>();
  private static applyTreeLayoutSubject = new Subject<any>();
  private static applyRadialLayoutSubject = new Subject<any>();
  private static applySpectralLayoutSubject = new Subject<any>();
  private static applySugiyamaLayoutSubject = new Subject<any>();

  static applyYifanHu() {
    GraphSchematicsManager.applyYifanHuSubject.next({});
  }

  static onApplyYifanHu() {
    return GraphSchematicsManager.applyYifanHuSubject;
  }

  static applyKamadaKawai() {
    GraphSchematicsManager.applyKamadaKawaiSubject.next({});
  }

  static onApplyKamadaKawai() {
    return GraphSchematicsManager.applyKamadaKawaiSubject;
  }

  static applySugiyamaLayout() {
    GraphSchematicsManager.applySugiyamaLayoutSubject.next({});
  }

  static onApplySugiyamaLayout() {
    return GraphSchematicsManager.applySugiyamaLayoutSubject;
  }

  static applySpectralLayout() {
    GraphSchematicsManager.applySpectralLayoutSubject.next({});
  }

  static onApplySpectralLayout() {
    return GraphSchematicsManager.applySpectralLayoutSubject;
  }

  static applyRadialLayout() {
    GraphSchematicsManager.applyRadialLayoutSubject.next({});
  }

  static onApplyRadialLayout() {
    return GraphSchematicsManager.applyRadialLayoutSubject;
  }

  static applyTreeLayout(inverted: boolean) {
    GraphSchematicsManager.applyTreeLayoutSubject.next({inverted});
  }

  static onApplyTreeLayout() {
    return GraphSchematicsManager.applyTreeLayoutSubject;
  }

  static applyGridLayout() {
    GraphSchematicsManager.applyGridLayoutSubject.next({});
  }

  static onApplyGridLayoutSubject() {
    return GraphSchematicsManager.applyGridLayoutSubject;
  }

  static applyCircularLayout() {
    GraphSchematicsManager.applyCircularLayoutSubject.next({});
  }

  static onApplyCircularLayoutSubject() {
    return GraphSchematicsManager.applyCircularLayoutSubject;
  }

  static applyFruchtermanReingold() {
    GraphSchematicsManager.applyFruchtermanReingoldSubject.next({});
  }

  static onApplyFruchtermanReingold() {
    return GraphSchematicsManager.applyFruchtermanReingoldSubject;
  }

  static resetAll() {
    GraphSchematicsManager.resetAllSubject.next({});
    AlphabetIterator.reload();
  }

  static controlToCenter() {
    GraphSchematicsManager.offsetCenter.next({});
  }

  static controlMoveUp() {
    GraphSchematicsManager.offsetControlY.next(this.movement);
  }

  static controlMoveDown() {
    GraphSchematicsManager.offsetControlY.next(-this.movement);
  }

  static controlMoveLeft() {
    GraphSchematicsManager.offsetControlX.next(this.movement);
  }

  static controlMoveRight() {
    GraphSchematicsManager.offsetControlX.next(-this.movement);
  }

  static onChangeX() {
    return GraphSchematicsManager.offsetControlX;
  }

  static onChangeY() {
    return GraphSchematicsManager.offsetControlY;
  }

  static onOffsetCenter() {
    return GraphSchematicsManager.offsetCenter;
  }

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

  static onResetAll() {
    return GraphSchematicsManager.resetAllSubject;
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

  static getGraphState() {
    return this.savedState;
  }

  static setGraphState(state: any) {
    GraphSchematicsManager.changeStateSubject.next(state);
    this.savedState = state;
  }

  static loadGraphState(state: any) {
    GraphSchematicsManager.loadStateSubject.next(state);
  }

  static setConfig(config: any) {
    GraphSchematicsManager.onChangeConfigSubject.next(config);
  }

  static onChangeConfig() {
    return GraphSchematicsManager.onChangeConfigSubject;
  }

  static updateVertices(vertices: any) {
    GraphSchematicsManager.updateVerticeAndEdgesSubject.next({vertices});
  }

  static updateVerticesEdges(vertices: any, edges: any, edgeWeights: any) {
    GraphSchematicsManager.updateVerticeAndEdgesSubject.next({
      vertices,
      edges,
      edgeWeights
    });
  }

  static onExternalUpdateVerticesEdges() {
    return GraphSchematicsManager.updateVerticeAndEdgesSubject;
  }

  static onLoadGraphState() {
    return GraphSchematicsManager.loadStateSubject;
  }

  static onChangeGraphState() {
    return GraphSchematicsManager.changeStateSubject;
  }

  static toggleSongInfo(status: boolean) {
    GraphSchematicsManager.onActivateSongInfo.next(status);
  }

  static onChangeSongInfo() {
    return GraphSchematicsManager.onActivateSongInfo;
  }

  static unsubcribeSubjects() {
    GraphSchematicsManager.addVertexSubject.unsubscribe();
    GraphSchematicsManager.edgeCreationModeSubject.unsubscribe();
    GraphSchematicsManager.edgeCreationModeSubject.unsubscribe();
    GraphSchematicsManager.deleteEdgeSubject.unsubscribe();
    GraphSchematicsManager.selectedVertexObjectSubject.unsubscribe();
    GraphSchematicsManager.loadStateSubject.unsubscribe();
    GraphSchematicsManager.isPlayingSubject.unsubscribe();
    GraphSchematicsManager.offsetControlX.unsubscribe();
    GraphSchematicsManager.offsetControlY.unsubscribe();
    GraphSchematicsManager.changeStateSubject.unsubscribe();
    GraphSchematicsManager.updateVerticeAndEdgesSubject.unsubscribe();
  }

}
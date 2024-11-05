import GraphSchematicsManager from "../components/GraphSchematics/GraphSchematicsManager";
import { Vertex } from "../interfaces/Vertex";

export default class AlphabetIterator {
    private static currentIndex: number = 0;

    static reload() {
        this.currentIndex = 0;
    }
  
    static getNextLetter(): string {
        const letter = String.fromCharCode(65 + this.currentIndex);
        this.currentIndex = (this.currentIndex + 1) % 26;
        if (GraphSchematicsManager.getGraphState()?.vertices && GraphSchematicsManager.getGraphState()?.vertices.find((v:Vertex) => v.label === letter)) {
            return this.getNextLetter();
        }
        return letter;
    }

    static subIndex() {
        this.currentIndex = (this.currentIndex - 1) % 26;
    }
}
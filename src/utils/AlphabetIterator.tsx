export default class AlphabetIterator {
    private static currentIndex: number = 0;
  
    static getNextLetter(): string {
        const letter = String.fromCharCode(65 + this.currentIndex);
        this.currentIndex = (this.currentIndex + 1) % 26;
        return letter;
    }

    static subIndex() {
        this.currentIndex = (this.currentIndex - 1) % 26;
    }
}
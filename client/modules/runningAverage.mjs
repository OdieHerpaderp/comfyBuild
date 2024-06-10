class RunningAverage {
    lastValues;
    currentIndex = 0;

    value = 0;

    constructor(numValues = 5) {
        this.lastValues = Array.from({length: numValues}, () => 0);
    }

    addNumber(number) {
        if (typeof number !== "number" || isNaN(number)) { return; }

        this.lastValues[this.currentIndex] = number;
        this.currentIndex++;
        this.currentIndex %= this.lastValues.length;

        this.value = this.lastValues.reduce((prev, curr) => prev + curr) / this.lastValues.length;
    }
}

export { RunningAverage };
export default RunningAverage;
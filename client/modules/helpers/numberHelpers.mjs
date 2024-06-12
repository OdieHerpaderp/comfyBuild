class MovingAverage {
    lastValues;
    currentIndex = 0;

    value = 0;

    constructor(numValues = 5) {
        this.lastValues = Array.from({ length: numValues }, () => 0);
    }

    addNumber(number) {
        if (typeof number !== "number" || isNaN(number)) { return; }

        this.lastValues[this.currentIndex] = number;
        this.currentIndex++;
        this.currentIndex %= this.lastValues.length;

        this.value = this.lastValues.reduce((prev, curr) => prev + curr) / this.lastValues.length;
    }
}

class ExponentialMovingAverage {
    alpha;
    get beta() { return 1 - this.alpha; }
    
    value;

    constructor(alpha = 0.1, startingValue = 0) {
        this.alpha = alpha;
        this.value = startingValue;
    }

    addNumber(number) {
        if (typeof number !== "number" || isNaN(number)) { return; }
        this.value = (this.value * this.beta) + (number * this.alpha);
        return this.value;
    }
}

class RollingNumber {
    amount;
    displayAmount;
    speed;

    constructor(startAmount = 0, speed = 0.1) {
        this.amount = startAmount;
        this.displayAmount = startAmount;
        this.displayAmountRounded = Math.round(startAmount);
        this.speed = speed;
    }

    displayTick() {
        if (Math.abs(this.amount - this.displayAmount) < 0.05) { this.displayAmount = this.amount; }
        if (this.amount == this.displayAmount) { return; }
        this.displayAmount += (this.amount - this.displayAmount) * this.speed;
    }
}

export { MovingAverage, ExponentialMovingAverage, RollingNumber };
import { getHTMLTemplate, useTemplate } from "templateHelper";
import { ExponentialMovingAverage, RollingNumber } from "numberHelpers";

let template = await getHTMLTemplate("client/modules/resources/resources.html", "longResource");
let listTemplate = await getHTMLTemplate("client/modules/resources/resources.html", "longResourceList");

class LongResourceDisplay {
    name;
    amount;
    change;
    isVisible = false;

    amountCalculator;
    changeCalculator;

    constructor(name = "[unknown]", amount = 0) {
        useTemplate.bind(this)(template);

        this.name = name;

        this.amountCalculator = new RollingNumber(amount, 0.1);
        this.amount = this.amountCalculator.displayAmount;

        this.changeCalculator = new ExponentialMovingAverage(0.05, 0);
        this.change = 0;

        this.changeColorElement = this.domElement.querySelector("#changeColor");
    }

    setAmount(newAmount) {
        if (typeof newAmount !== "number") { return; }

        this.change = this.changeCalculator.addNumber(newAmount - this.amountCalculator.amount);
        if (this.change >= 0.05) { 
            this.changePrefix = "+"; 
            this.setChangeColor("green");
        }
        else if (this.change < -0.05) { 
            this.changePrefix = ""; 
            this.setChangeColor("red");
        }
        else { 
            this.change = 0;
            this.changePrefix = "±" 
            this.setChangeColor("");
        }

        this.amountCalculator.amount = newAmount;
    }

    setChangeColor(colorClass) {
        if (!this.changeColorElement) { return; }
        this.changeColorElement.classList = [colorClass];
    }

    displayTick() {
        this.amountCalculator.displayTick();
        this.amount = this.amountCalculator.displayAmount;
    }
}

class LongResourceDisplayList {
    resourceDisplays = {};
    resources = [];

    constructor() {
        useTemplate.bind(this)(listTemplate);
    }

    clearResources() {
        let resource = this.resources.pop();
        while (resource) {
            resource.isVisible = false;
            resource = this.resources.pop();
        }
    }

    setResources(resources) {
        this.clearResources();
        this.updateResources(resources);
    }

    updateResources(resources) {
        for (const [name, amount] of Object.entries(resources)) {
            this.updateResource(name, amount);
        }
    }

    updateResource(name, amount) {
        if (this.resourceDisplays[name] === undefined) {
            this.resourceDisplays[name] = new LongResourceDisplay(name, amount);
        }
        else {
            this.resourceDisplays[name].setAmount(amount);
        }

        if (!this.resourceDisplays[name].isVisible && amount > 0) {
            this.resources.push(this.resourceDisplays[name]);
            this.resourceDisplays[name].isVisible = true;
        }
    }

    displayTick() {
        this.resources.forEach((resource) => {
            resource.displayTick();
        });
    }
}

export { LongResourceDisplay, LongResourceDisplayList };
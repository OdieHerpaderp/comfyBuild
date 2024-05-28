class BuildingData {
    constructor(name, data, infoField) {
        this.name = name;
        this.age = this.default(data.age, -1);
        this.info = this.default(data.info, "[no info available]");
        this.node = data.node;
        this.build = this.default(data.build, {});
        this.consume = this.default(data.consume, {});
        this.produce = this.default(data.produce, {});

        this.HTML = document.querySelector("template#building-data-template")
            .content.cloneNode(true).firstElementChild;

        this.fillProperty("name", this.name);
        this.fillProperty("age", this.age);
        this.fillProperty("info", this.info);
        if (this.node) {
            this.fillProperty("node", this.node);
        }
        this.fillProperty("build", this.getResourceInfo(this.build));
        this.fillProperty("consume", this.getResourceInfo(this.consume));
        this.fillProperty("produce", this.getResourceInfo(this.produce));

        var buildButton = this.HTML.querySelector("[data-action=build]");
        console.log(buildButton);
        buildButton.onclick = () => { buildTower(this.name); };

        if (infoField) {
            this.HTML.addEventListener("mouseover", () => { infoField.innerHTML = this.name + ": " + this.info; });
            this.HTML.addEventListener("mouseout", () => { infoField.innerHTML = String.fromCharCode(160); });
        }
    }

    default(variable, defaultValue) {
        if (typeof variable !== "undefined")
            return variable;
        return defaultValue;
    }

    getResourceInfo(list) {
        var result = "";
        for (const resource in list) {
            result += `${resource}: ${list[resource]}<br />`;
        }
        return result;
    }

    fillProperty(propertyName, value) {
        var element = this.HTML.querySelector("[data-property=" + propertyName + "]");
        if (element) {
            element.innerHTML = value;
        }
    }
}

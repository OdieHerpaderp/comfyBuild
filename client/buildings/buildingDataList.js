class BuildingDataList {
    buildingDatas = [];

    constructor(buildings) {
        this.HTML = document.querySelector("template#building-data-list-template")
            .content.cloneNode(true).firstElementChild;

        let infoField = this.HTML.querySelector("#infoField");

        for (const buildingName in buildings) {
            this.buildingDatas.push(new BuildingData(buildingName, buildings[buildingName], infoField));
        }

        this.buildingDatas.sort((a, b) => {
            if (a.age !== b.age) {
                return a.age - b.age;
            }
            return a.name.localeCompare(b.name);
        });

        var element = this.HTML.querySelector("[data-property=buildingData]");
        if (!element) {
            element = this.HTML;
        }

        this.buildingDatas.forEach((buildingData) => {
            element.appendChild(buildingData.HTML);
        });
    }
}


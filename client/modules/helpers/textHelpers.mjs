class HighlightableText {
    value;
    domElement;

    constructor(text) {
        this.domElement = document.createElement("span");
        this.value = text;
        this.domElement.innerText = text;
    }

    searchAndHighlight(searchText) {
        if (typeof searchText !== "string" || searchText === "") {
            this.domElement.textContent = this.value;
            return true;
        }

        const regex = new RegExp(searchText, 'gi');
        this.domElement.innerHTML = this.value.replace(regex, '<mark>$&</mark>');

        return this.value.toLowerCase().includes(searchText);
    }
}

export { HighlightableText };
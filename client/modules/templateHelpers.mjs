async function getHtmlTemplate(location) {
    var templateHTML = await (await fetch(location)).text();
    var parser = new DOMParser();
    return parser.parseFromString(templateHTML, "text/html").querySelector("template");
}

function setDisplayValue(element, value) {
    if (element) { element.innerHTML = value }
}

var templateMixin = {
    loadTemplate: function () {
        if (!this.constructor.template) { return; }
        this.propertyElements = {};
        this.inputElements = {};
        this.HTML = this.constructor.template.content.cloneNode(true);
    },
    registerProperty: function (propertyName, initialvalue) {
        if (!this.HTML) { return; }
        this.propertyElements[propertyName] = this.HTML.querySelector(`[data-property=${propertyName}]`);
        if (initialvalue) {
            this.setProperty(propertyName, initialvalue);
        }
    },
    setProperty: function(propertyName, value) {
        if (!this.propertyElements[propertyName]) { return; }
        this.propertyElements[propertyName].innerHTML = value;
    },
    appendChildToProperty: function(propertyName, child) {
        if (!this.propertyElements[propertyName]) { return; }
        this.propertyElements[propertyName].appendChild(child);
    },
    prependChildToProperty: function(propertyName, child) {
        if (!this.propertyElements[propertyName]) { return; }
        this.propertyElements[propertyName].insertBefore(child, this.propertyElements[propertyName].firstChild);
    },
    addClassToProperty: function(propertyName, className) {
        if (!this.propertyElements[propertyName]) { return; }
        this.propertyElements[propertyName].classList.add(className);
    },
    removeClassFromProperty: function(propertyName, className) {
        if (!this.propertyElements[propertyName]) { return; }
        this.propertyElements[propertyName].classList.remove(className);
    },
    registerAction: function (actionName, action) {
        if (!this.HTML) { return; }
        var element = this.HTML.querySelector(`[data-action=${actionName}]`);
        if (!element) { return; }
        element.onclick = action;
    },
    registerInput: function(inputName) {
        if (!this.HTML) { return; }
        this.inputElements[inputName] = this.HTML.querySelector(`[data-input=${inputName}]`);
    },
    getInput: function(inputName) {
        if (!this.inputElements[inputName]) { return; }
        return this.inputElements[inputName].value;
    }
};

export { getHtmlTemplate, setDisplayValue, templateMixin };
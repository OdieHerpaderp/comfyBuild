async function getHtmlTemplate(location) {
    var templateHTML = await (await fetch(location)).text();
    var parser = new DOMParser();
    return parser.parseFromString(templateHTML, "text/html").querySelector("template");
}

function setDisplayValue(element, value) {
    if (element) { element.innerHTML = value }
}

var templateMixin = {
    propertyElements: {},
    loadTemplate: function () {
        if (!this.constructor.template) { return; }
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
    registerAction: function (actionName, action) {
        if (!this.HTML) { return; }
        var element = this.HTML.querySelector(`[data-action=${actionName}]`);
        if (!element) { return; }
        element.onclick = action;
    }
};

export { getHtmlTemplate, setDisplayValue, templateMixin };
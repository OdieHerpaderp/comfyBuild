async function getHtmlTemplate(location) {
    var templateHTML = await (await fetch(location)).text();
    var parser = new DOMParser();
    return parser.parseFromString(templateHTML, "text/html").querySelector("template");
}

function setDisplayValue(element, value) {
    if (element) { element.innerHTML = value }
}


function highlightText(element, searchText) {
    if (!element.hasChildNodes()) {
        return;
    }

    for (const node of element.childNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            highlightText(node, searchText);
        }
        else if (node.nodeType == Node.TEXT_NODE) {
            const regex = new RegExp(searchText, 'gi');
            let text = element.innerHTML;
            // This shouldn't work but it does
            text = text.replace(/(<mark class="highlight">|<\/mark>)/gim, '');
            if (searchText !== "") {
                text = text.replace(regex, '<mark class="highlight">$&</mark>');
            }
            element.innerHTML = text;
        }
    }
}

var templateMixin = {
    loadTemplate: function () {
        if (!this.constructor.template) { return; }
        this.propertyElements = {};
        this.inputElements = {};
        this.HTML = this.constructor.template.content.cloneNode(true).firstElementChild;
    },
    registerProperty: function (propertyName, initialvalue) {
        if (!this.HTML) { return; }
        if (this.HTML.getAttribute("data-property") == propertyName) {
            this.propertyElements[propertyName] = this.HTML;
        }
        else {
            this.propertyElements[propertyName] = this.HTML.querySelector(`[data-property=${propertyName}]`);
        }
        if (initialvalue) {
            this.setProperty(propertyName, initialvalue);
        }
    },
    setProperty: function (propertyName, value) {
        if (!this.propertyElements[propertyName]) { return; }
        if (value === undefined) { value = "" };
        this.propertyElements[propertyName].innerHTML = value;
    },
    highlightPropertyText: function(propertyName, searchText) {
        if (!this.propertyElements[propertyName]) { return; }
        highlightText(this.propertyElements[propertyName], searchText);
    },
    appendChildToProperty: function (propertyName, child) {
        if (!this.propertyElements[propertyName]) { return; }
        this.propertyElements[propertyName].appendChild(child);
    },
    prependChildToProperty: function (propertyName, child) {
        if (!this.propertyElements[propertyName]) { return; }
        this.propertyElements[propertyName].insertBefore(child, this.propertyElements[propertyName].firstChild);
    },
    replacePropertyWithChild: function (propertyName, child) {
        if (!this.propertyElements[propertyName]) { return; }
        this.propertyElements[propertyName].replaceChildren(child);
    },
    addClassToProperty: function (propertyName, className) {
        if (!this.propertyElements[propertyName]) { return; }
        this.propertyElements[propertyName].classList.add(className);
    },
    removeClassFromProperty: function (propertyName, className) {
        if (!this.propertyElements[propertyName]) { return; }
        this.propertyElements[propertyName].classList.remove(className);
    },
    registerAction: function (actionName, action) {
        if (!this.HTML) { return; }
        var element;
        if (this.HTML.getAttribute("data-action") == actionName) {
            element = this.HTML;
        }
        else {
            element = this.HTML.querySelector(`[data-action=${actionName}]`);
        }
        if (!element) { return; }
        element.onclick = action;
    },
    registerInput: function (inputName) {
        if (!this.HTML) { return; }
        if (this.HTML.getAttribute("data-input") == inputName) {
            this.inputElements[inputName] = this.HTML;
        }
        else {
            this.inputElements[inputName] = this.HTML.querySelector(`[data-input=${inputName}]`);
        }
    },
    getInput: function (inputName) {
        if (!this.inputElements[inputName]) { return; }
        return this.inputElements[inputName].value;
    },
    addEventListenerToInput: function(inputName, eventName, callback) {
        if (!this.inputElements[inputName]) { return; }
        this.inputElements[inputName].addEventListener(eventName, callback);
    }
};

export { getHtmlTemplate, setDisplayValue, templateMixin };
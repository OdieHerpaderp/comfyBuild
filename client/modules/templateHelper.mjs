class BindingContainer {
    bindings = [];
    _value;
    get value() { return this._value; }
    set value(newValue) {
        if (this._value === newValue) { return; }
        this._value = newValue;
        this.bindings.forEach((binding) => { binding.value = newValue; });
    }

    addBinding(binding) {
        this.bindings.push(binding);
        binding.value = this.value;
        if (binding instanceof InputBinding) {
            binding.addEventListener("input", (event) => { this.value = event.target.value; });
        }
    }

    removeBinding(binding) {
        this.bindings.remove(binding);
    }
}

class ListBindingContainer {
    bindings = [];
    _value = [];
    get value() {
        return this._value;
    }
    set value(newValue) {
        if (newValue === undefined) { newValue = []; }
        if (this._value === newValue) { return; }
        if (!(newValue instanceof Array)) { newValue = [newValue]; }

        let that = this;
        const handler = {
            get(target, prop, receiver) {
                if (typeof ListBinding.prototype[prop] === "function") {
                    return function (...items) {
                        that.bindings.forEach((binding) => { binding[prop](...items); });
                        return target[prop](...items);
                    }
                }
                // TODO: implement other array functions in ListBinding or call for a replaceWith here.
                return Reflect.get(...arguments);
            }
        }

        this._value = new Proxy(newValue, handler);
        this.bindings.forEach((binding) => {
            binding.value = newValue;
        });
    }

    addBinding(binding) {
        this.bindings.push(binding);
        binding.value = this.value;
    }

    removeBinding(binding) {
        this.bindings.remove(binding);
    }
}

class ListBinding {
    set value(items) { this.replaceWith(...items); }
    constructor(element) { this.element = element; }
    convertToElement(item) {
        if (item === undefined) { return document.createTextNode(""); }
        else if (item instanceof Element) { return item; }
        else if (item.domElement instanceof Element) { return item.domElement; }
        else { return document.createTextNode(item); }
    }

    push(...items) {
        items.forEach(item => { this.element.appendChild(this.convertToElement(item)); });
    }

    pop() {
        if (!this.element.firstChild) { return; }
        this.element.removeChild(this.element.lastChild);
    }

    shift() {
        if (!this.element.firstChild) { return; }
        this.element.removeChild(this.element.firstChild);
    }

    unshift(...items) {
        let firstChild = this.element.firstChild;
        items.forEach(item => { this.element.insertBefore(this.convertToElement(item), firstChild); });
    }

    replaceWith(firstItem, ...items) {
        let firstChild = this.convertToElement(firstItem);
        this.element.appendChild(firstChild);
        this.push(...items);
        while (this.element.firstChild !== firstChild) { this.element.removeChild(this.element.firstChild); }
    }
}

class ContentBinding {
    set value(newValue) {
        newValue ??= "";
        if (typeof newValue === "number") {
            newValue = newValue.toLocaleString();
        }
        if (newValue instanceof Element) { this.element.replaceChildren(newValue); }
        else if (newValue.domElement instanceof Element) { this.element.replaceChildren(newValue.domElement); }
        else { this.element.textContent = newValue; }
    }
    constructor(element) { this.element = element; }
}

class InputBinding {
    set value(newValue) {
        newValue ??= "";
        if (this.element.value === newValue) { return; }
        this.element.value = newValue;
    }
    constructor(element) { this.element = element; }
    addEventListener() { this.element.addEventListener(...arguments); }
}

async function getHTMLTemplate(templatePath, templateId) {
    let templateHTML = await (await fetch(templatePath)).text();
    let parser = new DOMParser();
    let documentFragment = parser.parseFromString(templateHTML, "text/html");
    if (templateId) {
        return documentFragment.querySelector("template#"+templateId);    
    }
    return documentFragment.querySelector("template");
}

function parseContentAttributes(targetObject) {
    let properties = {};
    if (targetObject.domElement.dataset.content) { createBinding(targetObject.domElement, properties); }

    let elements = targetObject.domElement.querySelectorAll("[data-content]");
    elements.forEach(element => { createBinding(element, properties); });

    for (let propertyName in properties) {
        if (targetObject[propertyName] !== undefined) { properties[propertyName].value = targetObject[propertyName]; }

        Object.defineProperty(targetObject, propertyName, {
            enumerable: true,
            configurable: false,
            get() { return properties[propertyName].value; },
            set(newValue) { properties[propertyName].value = newValue; }
        });
    }
}

function createBinding(element, properties) {
    let binding = (element.nodeName == "INPUT" ? new InputBinding(element) : new ContentBinding(element));
    const propertyName = element.dataset.content;
    properties[propertyName] ??= new BindingContainer();
    properties[propertyName].addBinding(binding);
}

function parseListAttributes(targetObject) {
    let bindingContainers = {};
    if (targetObject.domElement.dataset.list) { createListBinding(targetObject.domElement, bindingContainers); }

    let elements = targetObject.domElement.querySelectorAll("[data-list]");
    elements.forEach((element) => { createListBinding(element, bindingContainers); });

    for (let propertyName in bindingContainers) {
        if (targetObject[propertyName] !== undefined) { bindingContainers[propertyName].value = targetObject[propertyName]; }

        Object.defineProperty(targetObject, propertyName, {
            enumerable: true,
            configurable: false,
            get() { return bindingContainers[propertyName].value; },
            set(newValue) { bindingContainers[propertyName].value = newValue; }
        });
    }
}

function createListBinding(element, bindingContainers) {
    bindingContainers[element.dataset.list] ??= new ListBindingContainer();
    bindingContainers[element.dataset.list].addBinding(new ListBinding(element));
}

function parseEventsAttributes(targetObject) {
    if (targetObject.domElement.dataset.events) { parseEvents(targetObject.domElement, targetObject); }
    targetObject.domElement.querySelectorAll("[data-events]").forEach(element => { parseEvents(element, targetObject); });
}

function parseEvents(element, targetObject) {
    let events = element.dataset.events.split("|");
    events.forEach(event => {
        let eventSplit = event.split(":");
        if (eventSplit.length !== 2) { return console.warn("invalid event specifier: " + event);  }
        if (typeof targetObject[eventSplit[1]] !== "function") { return console.warn(targetObject.constructor.name + "." + eventSplit[1] + " is not a function!"); }
        element.addEventListener(eventSplit[0], (...args) => { targetObject[eventSplit[1]](...args); });
    });
}

function useTemplate(template) {
    if (!this || !template || template.nodeName !== "TEMPLATE") {
        throw "Usage: useTemplate.bind(this)(template);";
    }
    this.domElement = template.content.cloneNode(true).firstElementChild;

    parseContentAttributes(this);
    parseListAttributes(this);
    parseEventsAttributes(this);
}

export { getHTMLTemplate, useTemplate };
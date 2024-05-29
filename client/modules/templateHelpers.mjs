async function getHtmlTemplate(location) {
    var templateHTML = await (await fetch(location)).text();
    var parser = new DOMParser();
    return parser.parseFromString(templateHTML, "text/html").querySelector("template");
}

export { getHtmlTemplate };
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

function romanize (num) {
    if (isNaN(num))
        return NaN;
    if (num < 1) {
        return "???";
    }
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

export { HighlightableText, romanize };
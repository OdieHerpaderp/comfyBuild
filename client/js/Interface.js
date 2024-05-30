document.addEventListener("DOMContentLoaded", (event) => {
    Split(["#chat", "#building-info", "#building-list"],{
        minSize: 250,
    });
});

console.log("*interface.js loaded.");
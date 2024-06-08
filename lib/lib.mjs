function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
};

function lerpInverse(start, end, value) {
    return (value - start) / (end - start);
}

console.log("*Lib loaded");

export { lerp, lerpInverse };

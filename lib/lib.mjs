function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
};

console.log("*Lib loaded");

export { lerp };
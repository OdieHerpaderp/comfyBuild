var lib = {};
lib.lerp = function(start, end, amt){return (1-amt)*start+amt*end};
lib.getPhaseString = function(num){
    if(num == 0) return "wait...";
    else if(num == 1) return "buildCon";
    else if(num == 2) return "build";
    else if(num == 3) return "consume";
    else if(num == 4) return "produce";
    else return "i dunno lol";
};

console.log("*Lib loaded");

export { lib };
export default lib;
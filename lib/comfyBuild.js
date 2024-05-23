comfyBuild = {};
comfyBuild.tick = function(){
    //console.log("comfyBuild logic starts here.");
    Base.populationCurrent = Math.round(Math.max(Base.population * (0.25 + Base.morale / 10000) , Base.populationAvg * (0.25 + Base.morale / 10000)));
    Base.population = 16;
    Base.constructionMultiplier = 0.75 + Math.pow(Base.Tech / 10000000, 0.25) / 1000;
    Base.morale = 10000

    for(var i in Tower.list)
    {
        var t = Tower.list[i];
        t.regenerate();
    }
    for(var i in NPC.list)
    {
        var n = NPC.list[i];
        n.regenerate();
    }

    //console.log(Base.stockpile);
    for(var i in SOCKET_LIST){
        var sucket = SOCKET_LIST[i];
        sucket.emit('stockpile', Base.stockpile);
    }
    //if (tick % 10 === 0) {Base.announce('Population :' + Base.populationCurrent + " / " + Base.population);}
    //else if (tick % 10 === 0 && Base.populationCurrent < 32) {Base.announce('Low Population! (' + Base.populationCurrent + ")");}

    if (Base.population > Base.populationAvg) Base.populationAvg++;
    else if (Base.population < Base.populationAvg && Base.populationAvg > 8) Base.populationAvg--;

    for(var i in SOCKET_LIST){
        var sucket = SOCKET_LIST[i];
        sucket.emit('gameState',{wave:Base.morale, tech:Base.Tech, health:Math.round(Base.populationCurrent),maxHealth:Math.max(Base.population , Base.populationAvg)});
    }
};
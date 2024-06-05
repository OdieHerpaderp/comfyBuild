comfyBuild = {};
comfyBuild.tick = function(){
    //console.log("comfyBuild logic starts here.");
    var bonusFromTech = (1 + Math.round(Math.pow(Base.Tech / 200, 0.45) * 10) / 100);
    Base.populationCurrent = Math.round(Math.max(Base.population * (0.25 + Base.morale / 10000 + bonusFromTech / 100) , Base.populationAvg * (0.25 + Base.morale / 10000)));
    Base.population = Math.round(24 * (0.25 + Base.morale / 10000));
    var prevMorale = Base.morale;
    Base.morale = 10000;

    for(var i in Tower.list)
    {
        var t = Tower.list[i];
        t.comfyTick();
    }
    for(var i in NPC.list)
    {
        var n = NPC.list[i];
        n.comfyTick();
    }

    //if (tick % 10 === 0) {Base.announce('Population :' + Base.populationCurrent + " / " + Base.population);}
    //else if (tick % 10 === 0 && Base.populationCurrent < 32) {Base.announce('Low Population! (' + Base.populationCurrent + ")");}
    Base.morale = (Base.morale + 10000 + prevMorale) / 3;
    if (Base.population > Base.populationAvg) Base.populationAvg += 0.1;
    else if (Base.population < Base.populationAvg && Base.populationAvg > 16) Base.populationAvg -= 0.1;
};
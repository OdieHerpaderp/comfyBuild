research = {
    housing1: {
      age: 0,
      fullName: "Housing I",
      info: "Unlocks Dolmen",
      cost: 2500,
      unlocked:false,
      requiredResearch: [ ],
      produce: { population: 3 }
    },
      tools1: {
        age: 0,
        fullName: "Tools I",
        info: "Unlocks the ability to produce toolPrimitive using the flintKnapper and woodWorker.",
        cost: 12500,
        unlocked:false,
        requiredResearch: [ ],
        produce: { population: 3 }
      },
      housing2: {
        age: 1,
        fullName: "Housing II",
        info: "Unlocks Hut",
        cost: 12500,
        unlocked:false,
        requiredResearch: [ housing1 ],
        produce: { population: 3 }
      },
}
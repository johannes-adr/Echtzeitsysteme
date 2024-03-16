

// async function main(src: string){
//     let res = src.split("\n").filter(s=>{
//         return !(s.startsWith("#") || s.startsWith(" ") || s.length == 0)
//     });


//     let parsed = res.map(line=>line.split(",").map(s=>s.trim().toLowerCase()));
//     let flowchart = new FlowChart();

//     parsed.forEach(line=>Node.parse(line,flowchart));
//     return flowchart.json();
// }



// import fs from "fs/promises"
// import { FlowChart, Node } from "./nodes";
// fs.writeFile("out.json",await main((await fs.readFile("format.csv")).toString()))


// Usage


// simulation.addObserver(observer);

import fs from "fs/promises";
import { removeSameProps } from "./utils";
import { Simulation, example } from "./simulation";

async function main(){
    const simulation = new Simulation(example);

    let file = await fs.readFile("src/testSteps.json");
    let tests: any[] = JSON.parse(file.toString());
    for(let test of tests){
        simulation.doCycle();
        let changes = simulation.findChanges();
        console.log(JSON.stringify(test) == JSON.stringify(changes));
    }
    simulation.doCycle();
    console.log(JSON.stringify(simulation.findChanges()))
}

main();

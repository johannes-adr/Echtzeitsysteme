

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
import { Simulation, type SimulationData } from "./simulation";

async function main(){
  

    for(let fname of await fs.readdir("src/tests/")){
        let file = await fs.readFile("src/tests/"+fname);
        let tests: {changelog: any[], example: SimulationData}= JSON.parse(file.toString());
        const simulation = new Simulation(tests.example);
        for (let test of tests.changelog) {
            simulation.doCycle();
            let changes = simulation.findChanges();
            
            if(JSON.stringify(test) != JSON.stringify(changes)){
                throw new Error("Error - not identical!")
            }
        }
        console.log("Done",fname)

    }
}

main();

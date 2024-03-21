import type { ColorOptions } from "./gojscode";
import type { Simulation } from "./simulation";

export function applyChanges(changes: any, myDiagram: go.Diagram, sim: Simulation, colors: ColorOptions) {
    console.dir(changes)

    for (let change in changes) {
        if (change.startsWith("activities")) {
            let act = change.split(".")[1];
            let to = changes[change].to
            var data = myDiagram.model.findNodeDataForKey(act); // Finden Sie die Node-Daten mit dem Key 1
            if (data) {
                myDiagram.model.setDataProperty(data, "backgroundColor", to == 0 ? colors.activityColor.inactive.bg : colors.activityColor.active.bg);
                myDiagram.model.setDataProperty(data, "textColor", to == 0 ? colors.activityColor.inactive.text : colors.activityColor.active.text);
                console.log('Debug :'+act,to)
                myDiagram.model.setDataProperty(data, "Cycles", to == 0 ? `` : `Cycles: ${to}`);
            }
        } else if (change.startsWith("semaphores")) {
            let toSemVal = changes[change].to.val;
            let semidstr = Number.parseInt(change.split("[")[1].split("]")[0]);
            let sems = sim.getData().semaphores[semidstr]


            if(sems.start.length==1){
                let to = sems.end;
                console.log(sems.start.length)
                console.log(sems.start, to)
                let from = sems.start[0];
                //@ts-ignore
                const link = myDiagram.model.linkDataArray.find(link => link.from === from && link.to === to);
                console.log(link)
                myDiagram.model.setDataProperty(link, "color", toSemVal == 0 ? colors.semaphoreColor.inactive.bg : colors.semaphoreColor.active.bg);
                myDiagram.model.setDataProperty(link, "value", toSemVal);
            }else{
                let keyNode:string ='null';
                let to = sems.end;
                for (let from of sems.start) {
                     //@ts-ignore
                    const link = myDiagram.model.linkDataArray.find(link => link.name === from+'-'+to);
                    myDiagram.model.setDataProperty(link, "color", toSemVal == 0 ? colors.semaphoreColor.inactive.bg : colors.semaphoreColor.active.bg);
                
                    keyNode = link.to;

                }
                console.log(keyNode)
                //@ts-ignore
                const finalLink = myDiagram.model.linkDataArray.find(link => link.from === keyNode && link.to === sems.end);
                myDiagram.model.setDataProperty(finalLink, "color", toSemVal == 0 ? colors.semaphoreColor.inactive.bg : colors.semaphoreColor.active.bg);
                myDiagram.model.setDataProperty(finalLink, "value", toSemVal);
                
                   
            }
        }
    }
}
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
                myDiagram.model.setDataProperty(data, "color", to == 0 ? colors.activityColor.inactive.bg : colors.activityColor.active.bg);
                myDiagram.model.setDataProperty(data, "textColor", to == 0 ? colors.activityColor.inactive.text : colors.activityColor.active.text);
                myDiagram.model.setDataProperty(data, "text", to == 0 ? `Activity ${act}` : `Activity ${act} - ${to}`);
            }
        } else if (change.startsWith("semaphores")) {
            let toSemVal = changes[change].to.val;
            let semidstr = Number.parseInt(change.split("[")[1].split("]")[0]);

            let sems = sim.getData().semaphores[semidstr]
            for (let from of sems.start) {
                let to = sems.end;
                //@ts-ignore
                const link = myDiagram.model.linkDataArray.find(link => link.from === from && link.to === to);
                myDiagram.model.setDataProperty(link, "color", toSemVal == 0 ? colors.semaphoreColor.inactive.bg : colors.semaphoreColor.active.bg);
                myDiagram.model.setDataProperty(link, "value", toSemVal);
            }
        }
    }
}
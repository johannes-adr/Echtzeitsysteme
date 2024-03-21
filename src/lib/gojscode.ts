import * as go from "gojs";
import { Simulation } from "./simulation";
import { download } from "./utils";
import { parseCSV, type SimulationData } from "./nodes";
interface NodeData {
    key: string;
    text: string;
    color?: string;
    parent?: string;
    group?: string;
    isGroup?: boolean
    category: string;
}

interface LinkData {
    from: string;
    to: string;
    color?: string;
    name?: string;
    value?: number;
    category: string;
}


export type gojsElementClickEventHandler = (
   event: {typ: "mutex", mutexid: string} | {typ: "semaphore", from: string,to:string} | {typ: "activity", activitName: string}
)=>void;

export type ColorOption = {
    active: {
        bg: string,
        text: string
    },
    inactive: {
        bg: string,
        text: string
    }
}

export type ColorOptions = {
    semaphoreColor: ColorOption,
    mutexColor: ColorOption,
    activityColor: ColorOption
}

export function initGo(data: SimulationData, element: HTMLDivElement, cb:  gojsElementClickEventHandler, colors: ColorOptions) {
    const $ = go.GraphObject.make;
    const myDiagram = $(go.Diagram, element, {
        "clickCreatingTool.archetypeNodeData": { text: "Node", color: "white" },
        "commandHandler.archetypeGroupData": { text: "Group", isGroup: true, color: "blue" },
        "undoManager.isEnabled": true
    });


    myDiagram.layout = $(go.ForceDirectedLayout);

    const nodeTemplate = $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle", { fill: colors.activityColor.inactive.bg},
            new go.Binding("fill", "color")),
            $(go.TextBlock, 
                { 
                  margin: 4, 
                  stroke: colors.activityColor.inactive.text // Standard-Textfarbe
                },
                // Binding für den Textinhalt
                new go.Binding("text", "text"),
                // Binding für die Textfarbe
                new go.Binding("stroke", "textColor"))
    );
    const mutex: go.Node = $(
        go.Node, "Auto",
        $(go.Shape, "Rectangle", { fill: colors.mutexColor.inactive.bg}),
        $(go.TextBlock, 
            { 
              margin: 4, 
              stroke: colors.mutexColor.inactive.text // Standard-Textfarbe
            },
            // Binding für den Textinhalt
            new go.Binding("text", "text"),
            // Binding für die Textfarbe
            new go.Binding("stroke", "textColor"))
    );
    const linkMutex: go.Link = $(go.Link, // the whole link panel
        $(go.Shape, { strokeDashArray: [10, 5] }) // the link shape with dashed pattern
    );

    const linkTemplate = $(go.Link,  // the whole link panel
        { toShortLength: 3, relinkableFrom: true, relinkableTo: true },
        $(go.Shape,  // the link shape
            { strokeWidth: 2 },
            new go.Binding("stroke", "color")),
        $(go.Shape,  // the arrowhead
            { toArrow: "Standard", stroke: null },
            new go.Binding("fill", "color")),
        $(go.Panel, "Vertical",  // panel to hold the text blocks
            $(go.TextBlock,  // the text block for the name
                {
                    font: "bold 12px sans-serif",
                    stroke: colors.semaphoreColor.inactive.text,
                    background: colors.semaphoreColor.inactive.bg,
                    textAlign: "center",
                    margin: new go.Margin(0, 4, 4, 4)  // margin to create space between the text and the line
                },
                new go.Binding("text", "name")),
            $(go.Shape, "LineH",  // horizontal line to separate the name and value
                { stroke: "#333", strokeWidth: 1, height: 1, width: 50 }),
            $(go.TextBlock,  // the text block for the value
                {
                    font: "bold 12px sans-serif",
                    stroke: colors.semaphoreColor.inactive.text,
                    background: colors.semaphoreColor.inactive.bg,
                    textAlign: "center",
                    margin: new go.Margin(4, 4, 0, 4)  // margin to create space between the line and the value
                },
                new go.Binding("text", "value"))
        ),
    );




    const mapNode: go.Map<string, go.Node> = new go.Map<string, go.Node>();
    mapNode.add("node", nodeTemplate);
    mapNode.add("mutex", mutex);
    const mapLink: go.Map<string, go.Link> = new go.Map<string, go.Link>();
    mapLink.add("normalLink", linkTemplate);
    mapLink.add("mutex", linkMutex);
    myDiagram.nodeTemplateMap = mapNode;
    myDiagram.linkTemplateMap = mapLink;

    myDiagram.addDiagramListener("ObjectSingleClicked", function(e: go.DiagramEvent) {
        const part = e.subject.part;
        if (part instanceof go.Node) { // Überprüfen, ob das geklickte Objekt ein Node ist
            const data = part.data;
            if (data.category === "mutex") {
                cb({typ: "mutex", mutexid: data.key});
            } else if (data.category === "node") {
                cb({typ: "activity", activitName: data.key});
            }
        }
        if (part instanceof go.Link) {
            const data = part.data;
            cb({typ: "semaphore", from: data.from, to: data.to});
        }
      });
    function reload() {
        const nodeDataArray: NodeData[] = [];
        const linkDataArray: LinkData[] = [];
        let sim = new Simulation(data);
        for (let activity in sim.getData().activities) {
            nodeDataArray.push({ key: activity, text: `Activity ${activity}`, category: "node" })
        }

        for (let mutex of sim.getData().mutexes) {
            let key = JSON.stringify(mutex);
            nodeDataArray.push({ key: JSON.stringify(mutex), text: `Mutex ${key}`, category: "mutex" });
            for (let act of mutex) {
                nodeDataArray.find(s => s.key == act)!.group = key;
                console.log(nodeDataArray.find(s => s.key == act)!.group)
                linkDataArray.push({ from: act, to: JSON.stringify(mutex), color: "black", category: "mutex" })
            }


        }

        for (let sems of sim.getData().semaphores) {
            for (let from of sems.start) {
                let to = sems.end;
                linkDataArray.push({ from, to, name: `${from}-${to} `, value: sems.val, category: "normalLink" })
            }
        }
        myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

        //Simulate init state
        {
            for (let sems of sim.getData().semaphores) {
                let toSemVal = sems.val;
                for (let from of sems.start) {
                    let to = sems.end;
                    //@ts-ignore
                    const link = myDiagram.model.linkDataArray.find(link => link.from === from && link.to === to);
                    myDiagram.model.setDataProperty(link, "color", toSemVal == 0 ? colors.semaphoreColor.inactive.bg : colors.semaphoreColor.active.bg);
                }
            }

        }

        sim.addObserver((c) => {
            console.log("change")
            applyChanges(c, myDiagram, sim,colors);
        })

        return sim;
    }
    return reload
}


function applyChanges(changes: any, myDiagram: go.Diagram, sim: Simulation, colors: ColorOptions) {
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
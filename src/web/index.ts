import * as go from "gojs";
import { Simulation, example } from "../simulation";
import { download } from "../utils";
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
    color: string;
    name?: string;
    value?: number;
    category: string;
}

interface GroupData {
    key: number;
    text: string;
    color: string;
    isGroup: boolean;
}

function init() {
    const $ = go.GraphObject.make;

    const myDiagram = $(go.Diagram, "myDiagramDiv", {
        "clickCreatingTool.archetypeNodeData": { text: "Node", color: "white" },
        "commandHandler.archetypeGroupData": { text: "Group", isGroup: true, color: "blue" },
        "undoManager.isEnabled": true
    });

    myDiagram.layout = $(go.ForceDirectedLayout);

    const nodeTemplate = $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle", { fill: "lightblue" },
            new go.Binding("fill", "color")),
        $(go.TextBlock, { margin: 4 },
            new go.Binding("text", "text"))
    );
    const mutex: go.Node = $(
        go.Node, "Auto",
        $(go.Shape, "Rectangle", { fill: "red" }),
        $(go.TextBlock, { margin: 4 },
            new go.Binding("text", "text"))
    );
    const linkMutex: go.Link = $(go.Link, // the whole link panel
    $(go.Shape, { strokeDashArray: [10, 5] }) // the link shape with dashed pattern
);

const linkTemplate = $(go.Link,
    $(go.Shape, 
        { strokeWidth: 2 },
        new go.Binding("stroke", "color")), // Linienfarbe basierend auf der "color"-Eigenschaft
    $(go.Shape, 
        { toArrow: "Standard", stroke: null },
        new go.Binding("fill", "color")), // Pfeilfarbe ebenfalls basierend auf der "color"-Eigenschaft
    $(go.TextBlock, 
        { textAlign: "center", margin: 4 },
        new go.Binding("text", "name"))
);


    const groupTemplate = $(go.Group, "Vertical",
        $(go.TextBlock,
            { margin: 4, font: "bold 19px sans-serif", editable: true },
            new go.Binding("text", "text"),
            new go.Binding("stroke", "color")),
        $(go.Panel, "Auto",
            $(go.Shape, "Rectangle",
                { fill: "rgba(128,128,128,0.2)", stroke: "gray", strokeWidth: 3 }),
            $(go.Placeholder, { padding: 10 }))
    );
    

    const mapNode: go.Map<string, go.Node> = new go.Map<string, go.Node>();
    mapNode.add("node", nodeTemplate);
    mapNode.add("mutex", mutex);
    const mapLink: go.Map<string, go.Link> = new go.Map<string, go.Link>();
    mapLink.add("normalLink",linkTemplate);
    mapLink.add("mutex",linkMutex);
    myDiagram.nodeTemplateMap = mapNode;
    myDiagram.linkTemplateMap = mapLink;
    myDiagram.groupTemplate = groupTemplate;
    
    const nodeDataArray: NodeData[] = [];

    const linkDataArray: LinkData[] = [];

    let sim = new Simulation(example);


    for (let activity in sim.getData().activities) {
        nodeDataArray.push({ key: activity, text: `Activity ${activity}`,category:"node" })
    }

    for (let mutex of sim.getData().mutexes) {
        let key = JSON.stringify(mutex);
        nodeDataArray.push({ key:JSON.stringify(mutex), text: `Mutex ${key}`, category: "mutex"});
        for (let act of mutex) {
            nodeDataArray.find(s => s.key == act)!.group = key;
            console.log(nodeDataArray.find(s => s.key == act)!.group)
            linkDataArray.push({ from: act, to: JSON.stringify(mutex), color: "black", category:"mutex" })
        }

        
    }

    for (let sems of sim.getData().semaphores) {
        for (let from of sems.start) {
            for (let to of sems.end) {
                linkDataArray.push({ from, to, color: "black", name: `${from}-${to} `, value: sems.val, category:"normalLink" })
            }
        }
    }

    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    function applyChanges(changes: any) {
        console.dir(changes)

        for (let change in changes) {
            if (change.startsWith("activities")) {
                let act = change.split(".")[1];
                let to = changes[change].to
                var data = myDiagram.model.findNodeDataForKey(act); // Finden Sie die Node-Daten mit dem Key 1
                if (data) {
                    myDiagram.model.setDataProperty(data, "color", to==0?"lightblue":"lime");
                    myDiagram.model.setDataProperty(data, "text", to==0?`Activity ${act}`:`Activity ${act} - ${to}`);
                }
            } else if (change.startsWith("semaphores")) {
                let toSemVal = changes[change].to.val;
                let semidstr = Number.parseInt(change.split("[")[1].split("]")[0]);

                let sems = sim.getData().semaphores[semidstr]
                for (let from of sems.start) {
                    for (let to of sems.end) {

                        //@ts-ignore
                        const link = myDiagram.model.linkDataArray.find(link => link.from === from && link.to === to);
                        myDiagram.model.setDataProperty(link, "color", toSemVal==0?"black":"red");
                    }
                }
            }
        }
    }



    //Simulate init state
    {
        for(let sems of sim.getData().semaphores){
            let toSemVal = sems.val;
            for (let from of sems.start) {
                for (let to of sems.end) {
                    //@ts-ignore
                    const link = myDiagram.model.linkDataArray.find(link => link.from === from && link.to === to);
                    myDiagram.model.setDataProperty(link, "color", toSemVal==0?"black":"red");
                }
            }
        }
       
    }

    let changelog: any[] = [];
    document.getElementById("nextCycle")!.onclick = () => {
        sim.doCycle();
        let changes = sim.findChanges()
        applyChanges(changes);
        changelog.push(changes);
    };

    
    document.getElementById("save")!.onclick = () => {
        let json = JSON.stringify({
            example: example,
            changelog
        });
        console.log("hi")
        download("changes.json",json)
    };

}

init();

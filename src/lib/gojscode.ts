import * as go from "gojs";
import { Simulation } from "./simulation";
import { download } from "./utils";
import { parseCSV, type SimulationData } from "./nodes";
import { applyChanges } from "./gojsextension";
interface NodeData {
    key: string;
    text?: string;
    color?: string;
    parent?: string;
    group?: string;
    isGroup?: boolean
    category: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    mainText?: string;
    subText?: string;
    Cycles?: string;
}

interface LinkData {
    from: string;
    to: string;
    color?: string;
    name?: string;
    value?: number;
    category: string;
    taskArrow?: string;
}

export type gojsClickEvent = {typ: "mutex", mutexid: string} | {typ: "semaphore", from: string,to:string} | {typ: "activity", activitName: string};
export type gojsElementClickEventHandler = (
   event: gojsClickEvent
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
    { desiredSize: new go.Size(100, 75) }, // Setzt die feste Größe der Node
    $(go.Shape, "RoundedRectangle",
      new go.Binding("fill", "backgroundColor"), // Bindung für die allgemeine Hintergrundfarbe
    ),
    $(go.Panel, "Vertical", 
      // Panel, das die TextBlöcke vertikal anordnet
      { margin: 4 },
      $(go.TextBlock,
        {
          margin: 4, 
          font: "18px sans-serif", // Schriftgröße für den Haupttext
          wrap: go.TextBlock.WrapFit,
          textAlign: "center"
        },
        new go.Binding("text", "mainText"), // Binding für den Haupttext
        new go.Binding("stroke", "textColor") // Bindung für die Textfarbe
      ),
      $(go.TextBlock,
        {
          margin: 4, 
          font: "12px sans-serif", // Schriftgröße für den mittleren Text
          wrap: go.TextBlock.WrapFit,
          textAlign: "center"
        },
        new go.Binding("text", "subText"), // Binding für den Untertext
        new go.Binding("stroke", "textColor") // Gleiche Bindung für die Textfarbe wie oben
      ),
      $(go.TextBlock,  // Hinzufügen eines dritten TextBlocks
        {
          margin: 4, 
          font: "11px sans-serif", // Schriftgröße für den untersten Text
          wrap: go.TextBlock.WrapFit,
          textAlign: "center"
        },
        new go.Binding("text", "Cycles"), // Binding für den zusätzlichen Text
        new go.Binding("stroke", "textColor") // Gleiche Bindung für die Textfarbe
      )
    )
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
    const orLink = $(go.Link,  // the whole link panel
    { toShortLength: 3, relinkableFrom: true, relinkableTo: true },
    $(go.Shape,  // the link shape
        { strokeWidth: 2 },
        new go.Binding("stroke", "color"))
    );

    const VirtualNode: go.Node = $(go.Node, "Position", 
    { visible: true },  // Mach die virtuelle Node unsichtbar
  );
    const linkTemplate = $(go.Link,  // the whole link panel
        { toShortLength: 3, relinkableFrom: true, relinkableTo: true },
        $(go.Shape,  // the link shape
            { strokeWidth: 2 },
            new go.Binding("stroke", "color")),
        $(go.Shape,  // the arrowhead
            { toArrow: "OpenTriangle", stroke: null },
            new go.Binding("fill", "color"),
            new go.Binding("toArrow", "taskArrow")),
        $(go.Panel, "Vertical",  // panel to hold the text blocks
            $(go.TextBlock,  // the text block for the name
                {
                    font: "bold 12px sans-serif",
                    stroke: colors.semaphoreColor.inactive.text,
                    background: "transparent",
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
                    background: "transparent",
                    textAlign: "center",
                    margin: new go.Margin(4, 4, 0, 4)  // margin to create space between the line and the value
                },
                new go.Binding("text", "value"))
        ),
    );




    const mapNode: go.Map<string, go.Node> = new go.Map<string, go.Node>();
    mapNode.add("node", nodeTemplate);
    mapNode.add("mutex", mutex);
    mapNode.add("VirtualNode", VirtualNode);
    const mapLink: go.Map<string, go.Link> = new go.Map<string, go.Link>();
    mapLink.add("normalLink", linkTemplate);
    mapLink.add("mutex", linkMutex);
    mapLink.add("orLink", orLink);
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
    function reload(data_loc: SimulationData = data) {
        const nodeDataArray: NodeData[] = [];
        const linkDataArray: LinkData[] = [];
        let sim = new Simulation(data_loc);
        
        for (let activity in sim.getData().activities) {
            const parts = activity.split('_');
            const Activity = parts.shift()!; // Entfernt und gibt den ersten Teil zurück
            const Task = parts.pop()!; // Entfernt und gibt den letzten Teil zurück
            nodeDataArray.push({ key: activity, subText: `Activity ${Activity}`,mainText:`Task ${Task} `, category: "node" , backgroundColor: colors.activityColor.inactive.bg, textColor: colors.activityColor.inactive.text,Cycles:" "});
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
            let key = { from: sems.start, to: sems.end };
            if(sems.start.length > 1){
                nodeDataArray.push({ key: JSON.stringify(key), text: '', category: "VirtualNode"});
            }
            for (let from of sems.start) {
                let to = sems.end;
                const partsfrom = from.split('_');
                const Taskfrom = partsfrom.pop()!; // Entfernt und gibt den letzten Teil zurück
                const partto = to.split('_')
                const Taskto = partto.pop()
                console.log("to:",Taskto, "from: ", Taskfrom)
                if(sems.start.length == 1){
                    if(Taskfrom == Taskto){
                        linkDataArray.push({ from, to, name: `${from}-${to} `, value: sems.val, category: "normalLink",taskArrow:"Chevron" })
                    
                    }else{
                        linkDataArray.push({ from, to, name: `${from}-${to} `, value: sems.val, category: "normalLink",taskArrow:"Standard" })
                    }
                    
                }else{
                    linkDataArray.push({from,to:JSON.stringify(key), name: `${from}-${to}`, value: sems.val, category: "orLink" })
                }
            }
            if (sems.start.length > 1){
                linkDataArray.push({ from: JSON.stringify(key), name: 'or_'+sems.end,to: sems.end, color: colors.semaphoreColor.inactive.bg,value:sems.val, category: "normalLink" })
                console.log(linkDataArray,nodeDataArray)
            }
            
    }
        myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

        //Simulate init state
        {
            for (let sems of sim.getData().semaphores) {
                if(sems.start.length == 1){
                let toSemVal = sems.val;
                let to = sems.end;
                let from = sems.start[0];
                //@ts-ignore
                const links = myDiagram.model.linkDataArray.find(link => link.from === from && link.to === to);
                myDiagram.model.setDataProperty(links, "color", toSemVal == 0 ? colors.semaphoreColor.inactive.bg : colors.semaphoreColor.active.bg);
                }
                if(sems.start.length > 1){
                    let toSemVal = sems.val;
                    let to = sems.end;
                    let keyNode:string = 'null';
                    for (let from of sems.start) {
                    
                        console.log(from+'-'+to)
                        //@ts-ignore
                        const link = myDiagram.model.linkDataArray.find(link => link.name === from+'-'+to);
                        myDiagram.model.setDataProperty(link, "color", toSemVal == 0 ? colors.semaphoreColor.inactive.bg : colors.semaphoreColor.active.bg);
                        keyNode = link.to;
                    }
                     
                    console.log()
                    // @ts-ignore
                    const finalLink = myDiagram.model.linkDataArray.find(link => link.from === keyNode && link.to === sems.end);
                    myDiagram.model.setDataProperty(finalLink, "color", toSemVal == 0 ? colors.semaphoreColor.inactive.bg : colors.semaphoreColor.active.bg);
                }
            }

        }

        sim.addObserver((c) => {
            console.log("change")
            applyChanges(c, myDiagram, sim,colors);
        })

        setTimeout(()=>{
            let bounds = myDiagram.documentBounds.copy();
            bounds.bottom = 0;
            let padding = 50; // Adjust padding as needed
            bounds.inflate(padding, padding);
        
            // Zoom to the new padded bounds
            myDiagram.zoomToRect(bounds);
        },0);
        return sim;
    }
    return reload;
}



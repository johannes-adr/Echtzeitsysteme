export class FlowChart {
    tasks: Map<string, Task> = new Map()
    semaphores: Semaphore[] = []
    mutexes: Mutex[] = [];

    json() {
        return JSON.stringify({
            tasks: Array.from(this.tasks.values()),
            semaphores: this.semaphores,
            mutexes: this.mutexes
        }, null, 0)
    }

    findActivity(name:string): Activity{
        for (let task of this.tasks.values()){
            let res = task.activities.find(s=>s.name == name);
            if(res)return res;
        }

        throw new Error("Activity '" + name + "' not defined")
    }
}

export abstract class Node {

    static parse(line: string[], nodes: FlowChart) {
        console.log(line)

        let type = line.shift();
        switch (type) {
            case "task":
                Task.parse(line, nodes);
                break;
            case "sema":
                Semaphore.parse(line, nodes);
                break;
            case "mutex":
                Mutex.parse(line, nodes);
                break;
            default:
                throw new Error("Unknown Typ: " + type)
        }
    }
}

export class Activity {
    constructor(readonly name: string, readonly cycles: number, private task: Task) { }

    toJSON(){
        return this.name
    }
}

export class Task extends Node {
    readonly activities: Activity[];

    constructor(readonly name: string, ...activities: Activity[]) {
        super()
        this.activities = activities
    }

    toJSON(){
        return {
            name: this.name,
            activities: this.activities.map(a=>{return {name: a.name, cycles: a.cycles}})
        }
    }

    static parse(s: string[], nodes: FlowChart) {
        let [name, activity, cycles] = s;
        let task = nodes.tasks.get(name)
        if (!task) {
            task = new Task(name);
            nodes.tasks.set(name, task);
        }

        let activityObj: Activity = new Activity(activity, Number.parseInt(cycles),task);
        task.activities.push(activityObj);

    }
}


class Semaphore extends Node{
    constructor(public startVal: number,readonly startActivity: Activity[], readonly endActivity: Activity){
        super()
    }

    static parse(s: string[], nodes: FlowChart) {
        let [startVal, endActivity, ...startActivity] = s;


        nodes.semaphores.push(new Semaphore(
            Number.parseInt(startVal),
            startActivity.map(name=>nodes.findActivity(name)),
            nodes.findActivity(endActivity)    
        ))
    }
}

class Mutex extends Node{
    constructor(readonly activities: Activity[]){
        super()
    }

    static parse(s: string[], nodes: FlowChart) {
        nodes.mutexes.push(new Mutex(s.map(name=>nodes.findActivity(name))))
    }
}
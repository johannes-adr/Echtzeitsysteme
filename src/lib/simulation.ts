import type { SimulationData } from "./nodes";
import { removeSameProps } from "./utils";


export const EXAMPLE_CSV = `# Activity, activity_task, Duration

Activity, a_1, 3
Activity, a_2, 1
Activity, a_3, 1
Activity, a_4, 1
Activity, a_5, 3
Activity, b_5, 3
Activity, a_6, 2

# Semaphore, Wert, Endwert, Startwert +,
Semaphore, 0, b_5, a_5
Semaphore, 1, a_5, b_5
Semaphore, 1, a_1, b_5
Semaphore, 0, a_2, a_1
Semaphore, 0, a_4, a_2
Semaphore, 0, a_3, a_1
Semaphore, 0, a_6, a_3
Semaphore, 0, a_6, a_4
Semaphore, 0, a_5, a_6

# Mutex, Prioritäten Aktivitäten
Mutex, a_2,a_3,a_4`

// export const example: SimulationData = {
//     activities: { a_1: 3, a_2: 5, a_3: 1, a_4: 3, a_5: 2, b_5: 2, a_6: 2 },
//     semaphores: [
//         { start: ["a_5"], end: "b_5", val: 0 },
//         { start: ["b_5"], end: "a_5", val: 1 },
//         { start: ["b_5"], end: "a_1", val: 1 },
//         { start: ["a_1"], end: "a_3", val: 0 },
//         { start: ["a_1"], end: "a_2", val: 0 },
//         { start: ["a_2"], end: "a_4", val: 0 },
//         // { start: ["a3","a4"], end: ["a6"], val: 0 },
//         { start: ["a_3"], end: "a_6", val: 0 },
//         { start: ["a_4"], end: "a_6", val: 0 },
//         { start: ["a_6"], end: "a_5", val: 0 }
//     ],
//     mutexes: [
//         ["a_2", "a_3", "a_4"],
//         ["a_1", "a_2", "a_3"]
//     ],
// };


type Observer = (changes: Record<string, any>) => void;


export class Simulation {
    private observers: Observer[] = [];

    //@ts-ignore
    private blueprint: SimulationData;
      //@ts-ignore
    private prevState: SimulationData;
      //@ts-ignore
    private front: SimulationData;
    constructor(front: SimulationData) {
        this.loadData(front)
    }

    loadData(data: SimulationData){
        this.blueprint = data
        this.front = JSON.parse(JSON.stringify(data)) as SimulationData;
        if(!this.prevState)this.prevState = JSON.parse(JSON.stringify(data)) as SimulationData;

        for (let key in data.activities) {
            this.front.activities[key] = 0;
        }
    }

    getState() {
        return this.front;
    }

    addObserver(observer: Observer) {
        this.observers.push(observer);
    }

    notifyObservers() {
        const changes = this.findChanges();
        for (let observer of this.observers) {
            observer(changes);
        }
    }

    findChanges() {

        const changes: Record<string, any> = {};

        // Check for changes in activities
        for (let key in this.front.activities) {
            if (this.front.activities[key] !== this.prevState.activities[key]) {
                changes[`activities.${key}`] = {
                    from: this.prevState.activities[key],
                    to: this.front.activities[key]
                };
            }
        }

        // Check for changes in semaphores
        this.front.semaphores.forEach((sem, index) => {
            const prevSem = this.prevState.semaphores[index];
            if (JSON.stringify(sem) !== JSON.stringify(prevSem)) {
                let prevChanges = removeSameProps(prevSem, sem);
                let toChanges = removeSameProps(sem, prevSem);
                changes[`semaphores[${index}]`] = {
                    from: prevChanges,
                    to: toChanges
                };
            }
        });

        // Check for changes in mutexes
        this.front.mutexes.forEach((mutex, index) => {
            const prevMutex = this.prevState.mutexes[index];
            if (JSON.stringify(mutex) !== JSON.stringify(prevMutex)) {
                changes[`mutexes[${index}]`] = {
                    from: prevMutex,
                    to: mutex
                };
            }
        });

        return changes;
    }

    findSemaphoresWhereActIsStart(act: string) {
        return this.front.semaphores.filter(s =>
            s.start.includes(act)
        )
    }

    setState(state: SimulationData){
        this.prevState = this.front;
        this.front = state
    }

    doCycle() {
        this.prevState = JSON.parse(JSON.stringify(this.front));

        let doLater: Map<string, () => void> = new Map;

        activityLoop:
        for (let act in this.front.activities) {
            let mutex = this.front.mutexes.find(m => m.includes(act));

            if (mutex) for (let actNameInMutex of mutex) {
                if (actNameInMutex == act) break;
                if (this.front.activities[actNameInMutex] != 0) {
                    continue activityLoop;
                }
            }


            let val = this.front.activities[act];
            if (val > 0) {
                doLater.set(`dec act ${act}`, () => {
                    this.front.activities[act]--;
                    //If task is now 0, start other semaphores
                    if (this.front.activities[act] == 0) {
                        let sems = this.findSemaphoresWhereActIsStart(act);
                        sems.forEach(sem => {
                            if (sem.val == 0) sem.val = 1;
                        })
                    }
                })
            } else {
                let sems = this.front.semaphores.filter(s => s.end == act);
                let isReady = sems.find(sem => sem.val == 0) == undefined;

                //Every semaphore is != 0 => ready
                if(isReady){
                    sems.forEach(s=>s.val--);
                    this.front.activities[act] = this.blueprint.activities[act];
                }
            }
        }

        doLater.forEach(action => action());

        this.notifyObservers();  // Notify observers after all actions in the cycle
    }

    getData() {
        return this.front;
    }
}




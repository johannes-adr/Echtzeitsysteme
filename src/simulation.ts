import { removeSameProps } from "./utils";

type Semaphore = { start: string[], end: string[], val: number }
type SimulationData = {
    activities: { [key: string]: number },
    semaphores: Semaphore[],
    mutexes: string[][];
}

export const example: SimulationData = {
    activities: { a1: 3, a2: 5, a3: 1, a4: 3, a5: 2, b5: 2, a6: 2 },
    semaphores: [
        { start: ["a5"], end: ["b5"], val: 0 },
        { start: ["b5"], end: ["a5"], val: 1 },
        { start: ["b5"], end: ["a1"], val: 1 },
        { start: ["a1"], end: ["a3"], val: 0 },
        { start: ["a1"], end: ["a2"], val: 0 },
        { start: ["a2"], end: ["a4"], val: 0 },
        // { start: ["a3","a4"], end: ["a6"], val: 0 },
        { start: ["a3"], end: ["a6"], val: 0 },
        { start: ["a4"], end: ["a6"], val: 0 },
        { start: ["a6"], end: ["a5"], val: 0 }
    ],
    mutexes: [
        ["a2", "a3", "a4"]
    ]
};


interface Observer {
    update: (changes: Record<string, any>) => void;
}

export class Simulation {
    private blueprint: SimulationData;
    private observers: Observer[] = [];
    private prevState: SimulationData;

    constructor(private front: SimulationData) {
        this.blueprint = JSON.parse(JSON.stringify(front)) as SimulationData;
        this.prevState = JSON.parse(JSON.stringify(front)) as SimulationData;

        for (let key in front.activities) {
            front.activities[key] = 0;
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
            observer.update(changes);
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

    doCycle() {
        this.prevState = JSON.parse(JSON.stringify(this.front));

        let doLater: Map<string, () => void> = new Map;

        activityLoop:
        for (let act in this.front.activities) {
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
                let mutex = this.front.mutexes.find(m => m.includes(act));

                if (mutex) for (let actNameInMutex of mutex) {
                    if (actNameInMutex == act) break;
                    if (this.front.activities[actNameInMutex] != 0) {
                        continue activityLoop;
                    }
                }

                let sems = this.front.semaphores.filter(s => s.end.includes(act));
                let isReady = sems.find(sem => sem.val == 0) == undefined;

                //Every semaphore is != 0 => ready
                if(isReady){
                    sems.forEach(s=>s.val--);
                    console.log("down", act)
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




import { parseCSV } from "./src/lib/nodes";
import {Simulation} from "./src/lib/simulation"

const EXAMPLE = `#Activity, activity_task, Duration
Activity, a_1, 1
Activity, a_2, 1
Activity, a_3, 1
Activity, a_4, 4
Activity, a_5, 4
Activity, a_6, 4
Activity, a_7, 10

#Semaphore, Wert, Endwert, Startwert +,
Semaphore, 0, a_2, a_1
Semaphore, 0, a_3, a_2
Semaphore, 0, a_6, a_1
Semaphore, 0, a_4, a_2
Semaphore, 0, a_5, a_3
Semaphore, 0, a_7, a_4
Semaphore, 0, a_7, a_5
Semaphore, 0, a_7, a_6
Semaphore, 1, a_1, a_7

#Mutex, Prioritäten Aktivitäten
Mutex, a_4,a_5,a_6`;



let sim = new Simulation(parseCSV(EXAMPLE));


sim.addObserver(change=>{
    console.log(change);
});


sim.doCycle();
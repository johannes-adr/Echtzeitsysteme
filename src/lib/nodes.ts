export type Semaphore = { start: string[], end: string, val: number }
export type Activities = { [key: string]: number }
export type Priorities = { [key: string]: number }
export type Mutex = string[]


export type Coord = {x:number,y:number}

export type SimulationData = {
    activities: Activities,
    semaphores: Semaphore[],
    priorities: Priorities
    mutexes: Mutex[],
    position?: {
        activities: {[key: string]: Coord},
        semaphores: Coord[],
        mutex: Coord[]
    }
}


export function parseCSV(csv: string) {
    let res = csv.split("\n").filter(s => {
        return !(s.startsWith("#") || s.startsWith(" ") || s.length == 0)
    });

    let parsed = res.map(line => line.split(",").map(s => s.trim().toLowerCase()));


    let data: SimulationData = {
        activities: {},
        priorities: {},
        semaphores: [],
        mutexes: []
    }


    for (let line of parsed) {
        try {
            let type = line.shift();

            switch (type) {
                case "activity":
                    parseActivity(data.activities,data.priorities,line);
                    break;
                case "semaphore":
                    data.semaphores.push(parseSemaphore(line))
                    break;
                case "mutex":
                    data.mutexes.push(parseMutex(line))
                    break;

                default:
                    throw new Error(`Type '${type}' is not valid`,{cause: "parseError"})
            }
        } catch (error) {
            if (error instanceof Error && error.cause == "parseError") {
                console.error(error.message);
            } else {
                throw error
            }
        }
    }

    //Now sort mutex based on priority of its activities

    data.mutexes.forEach(mutex=>{
        mutex.sort((a1,a2)=>{
            return data.priorities[a2] - data.priorities[a1]
        })
    });

    return data;
}



function parseActivity(activities: Activities, priorities: Priorities, lines: string[]) {
    let [name, value, priority] = lines;
    //assert that an activity
    activities_valid(name);
    priorities[name] = Number.parseInt(priority)
    activities[name] = Number.parseInt(value);
}

function parseSemaphore(lines: string[]): Semaphore {
    let value = lines.shift();
    let endact = lines.shift();
    let startsact = lines;
    if (startsact.length == 0) {
        throw new Error("Semaphore needs at least one activity", { cause: "parseError" })
    }
    activities_valid(endact!, ...startsact);

    return { end: endact!, start: startsact, val: Number.parseInt(value!) }
}

function parseMutex(lines: string[]): Mutex {
    activities_valid(...lines);
    return lines;
}



function activities_valid(...act_names: string[]) {
    let regex = /^([a-zA-Z]+)_([0-9]+)$/;

    for (let act_name of act_names) {
        if (typeof act_name !== "string") {
            throw new Error("Activity name has to be a string", { cause: "parseError" })
        }
        let match = act_name.match(regex)!;
        if (!match[0]) {
            throw new Error("Activity has to follow following regex pattern: ^([a-zA-Z]+)_([0-9]+)$", { cause: "parseError" });
        }
    }
}
export function extractChanges(obj1: any, obj2: any): any {
    const changes: any = {};

    // Helper function to check if the value is an object for recursion
    const isObject = (obj: any) => obj && typeof obj === 'object' && !Array.isArray(obj);

    Object.keys({ ...obj1, ...obj2 }).forEach(key => {
        const val1 = obj1[key];
        const val2 = obj2[key];

        // If both values are objects, recursively find changes
        if (isObject(val1) && isObject(val2)) {
            const nestedChanges = extractChanges(val1, val2);
            if (Object.keys(nestedChanges).length > 0) {
                changes[key] = nestedChanges;
            }
        } else if (val1 !== val2) {
            // If values are different and not both objects, record the change
            changes[key] = { from: val1, to: val2 };
        }
    });

    return changes;
}

export function removeSameProps(obj1: any, obj2: any){
    const isObject = (obj: any) => obj && typeof obj === 'object' && !Array.isArray(obj);

    let obj1cpy = JSON.parse(JSON.stringify(obj1));
    for(let key in obj1){
        if(key in obj2){
            let val1 = obj1[key];
            let val2 = obj2[key];
            if(JSON.stringify(val1) == JSON.stringify(val2)){
                delete obj1cpy[key];
            }
        }
    }
    return obj1cpy;
}
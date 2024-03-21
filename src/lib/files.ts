import { get, writable } from "svelte/store";
import { EXAMPLE_CSV } from "./simulation";

export let activeFile = writable<string | null>(localStorage.getItem("activeFile"));
export let files = writable<{ [name: string]: { changed: boolean; content: string } }>({});


const snameprefix = "csv_file/";

export function localSname(name: string) {
    return snameprefix + name;
}

export function loadFilesFromStorage() {
    files.update((files)=>{
        files = {};

        for (let i = 0; i < localStorage.length; i++) {
            let fname = localStorage.key(i)!;
            if (fname.startsWith(snameprefix)) {
                files[fname.replace(snameprefix, "")] = {
                    changed: false,
                    content: localStorage.getItem(fname)!,
                };
            }
        }
        if (Object.keys(files).length == 0) {
            files["example.csv"] = { changed: false, content: EXAMPLE_CSV };
            saveFile("example.csv");
        }

        return files;
    });
}


export function saveFile(fname: string) {
    localStorage.setItem(localSname(fname), get(files)[fname].content);
}

export function createFile(fname: string) {
    files.update(files=>{
        files[fname] = { changed: false, content: "" };
        localStorage.setItem(localSname(fname), "");
        return files
    })
}

export function deleteFile(fname: string) {
    files.update(files=>{
        delete files[fname];
        localStorage.removeItem(localSname(fname));
        if(get(activeFile) == fname){
            activeFile.set(null);
            localStorage.removeItem("activeFile");

        }
        return files
    })
}

loadFilesFromStorage();
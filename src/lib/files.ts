import { get, writable } from "svelte/store";
import { EXAMPLE_CSV } from "./simulation";
import { browser } from "$app/environment";



export let activeFile = writable<string | null>(browser?localStorage.getItem("activeFile"):null);
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

            saveFile("example.csv",files);

        }

        return files;
    });
}
if(browser)loadFilesFromStorage();



export function saveFile(fname: string, files_loc = get(files)) {
    let file = files_loc[fname];
    if(!file){
        throw new Error("Save file failed: " + fname + " not defined")
    }

    localStorage.setItem(localSname(fname), file.content);
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

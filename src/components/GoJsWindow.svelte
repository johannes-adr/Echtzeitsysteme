<script lang="ts">
    import { DarkTheme } from "$lib/colorthemes";
    import { activeTab, goJsElementClickHandlers, sim } from "$lib/global";
    import { activeFile, activeParseContent, files } from "$lib/files";
    import { initGo, type gojsElementClickEventHandler } from "$lib/gojscode";
    import { parseCSV, type SimulationData } from "$lib/nodes";
    import { EXAMPLE_CSV, Simulation } from "$lib/simulation";
    import { onMount } from "svelte";
    import { derived, get } from "svelte/store";

    
    let root: HTMLDivElement;

    let handler: gojsElementClickEventHandler = (ev) => {
        activeTab.set("Viewer");
        setTimeout(()=>Object.values(goJsElementClickHandlers).forEach(cb=>cb(ev)),10)
    };
    let reload: (sim?: SimulationData)=>Simulation;
    onMount(()=>{
        activeParseContent.subscribe(content=>{
        if(content){
            let simg = get(sim);
            if(simg === undefined){
                reload = initGo(content, root, handler, DarkTheme)
                sim.set(reload())
            }else{
                sim.set(reload(content));
            }
        }
    })

    })

    
    let history: string[] = [];
    let cycleIndex = 0;
    function next() {
        if(!$sim)return;

        history.push(JSON.stringify($sim.getState()));
        if (history.length > 20) {
            history.shift();
        }
        history = history;
        $sim.doCycle();
        cycleIndex += 1;
    }

    function back() {
        if(!$sim)return;

        let bef = history.pop();
        if (bef !== undefined) $sim.setState(JSON.parse(bef));
        $sim.notifyObservers();
        history = history;
        cycleIndex -= 1;
    }
</script>

<!-- GOJs Element -->
<div
    class="gojswin mockup-window rounded-xl min-w-96 w-1/2 bg-base-200 relative overflow-hidden"
>
    <div class="absolute top-3 w-full h-7 grid grid-cols-5 text-center items-center px-3">
        <span></span>
        <div class="flex justify-center gap-2 bg-base-100 col-span-3 rounded-lg">
            <span>{$activeFile}</span>
            -
            <span>{cycleIndex}</span>
        </div>
        <div class="flex justify-end">
            <button
                class="material-symbols-outlined"
                class:hidden={history.length == 0}
                on:click={back}
            >
                arrow_back_ios
            </button>

            <button class="material-symbols-outlined" on:click={next}>
                arrow_forward_ios
            </button>
        </div>
    </div>
    <div class="absolute top-3 right-5 h-7"></div>
    <div bind:this={root} class="w-full h-full bg-base-300"></div>
</div>

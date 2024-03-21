<script lang="ts">
    import { DarkTheme, LightTheme } from "$lib/colorthemes";
    import { initGo, type gojsElementClickEventHandler } from "$lib/gojscode";
    import { parseCSV, type SimulationData } from "$lib/nodes";
    import { EXAMPLE_CSV, Simulation } from "$lib/simulation";
    import { onMount } from "svelte";
    import CsvEditor from "../components/CSVEditor.svelte";
    import SlidingSelect from "../components/SlidingSelect.svelte";
    import Controller from "../components/Controller.svelte";
    import Viewer from "../components/Viewer.svelte";

    let root: HTMLDivElement;
    let sim: Simulation;

    let activeTab = 1;
    let activeFile: string | undefined;

    let handler: gojsElementClickEventHandler = (ev) => {
        console.log(ev);
        activeTab = tabs.findIndex((a) => a == "Viewer");
    };
    onMount(() => {
        let reload = initGo(parseCSV(EXAMPLE_CSV), root, handler, DarkTheme);
        sim = reload();
    });

    function loadData(data: SimulationData) {
        console.log(1, data);
        sim.loadData(data);
        console.log(2, data);
        sim.notifyObservers();
        console.log(3, data);
    }

    let history: string[] = [];
    let cycleIndex = 0;
    function next() {
        history.push(JSON.stringify(sim.getState()));
        if (history.length > 20) {
            history.shift();
        }
        history = history;
        sim.doCycle();
        cycleIndex += 1;
    }

    function back() {
        let bef = history.pop();
        if (bef !== undefined) sim.setState(JSON.parse(bef));
        sim.notifyObservers();
        history = history;
        cycleIndex -= 1;
    }

    let tabs = ["Controller", "Editor", "Viewer"];
    let theme = localStorage.getItem("theme") ?? "light";
    $:localStorage.setItem("theme",theme);
    let activeTabName = tabs[activeTab];
    $: activeTabName = tabs[activeTab];
</script>

<div class="flex flex-row h-full w-full gap-5 p-5">
    <!-- GOJs Element -->
    <div
        class="gojswin mockup-window rounded-xl min-w-96 w-1/2 bg-base-200 relative overflow-hidden"
    >
        <div class="absolute top-3 w-full h-7 grid grid-cols-5 text-center items-center px-3">
            <span></span>
            <div class="flex justify-center gap-2 bg-base-100 col-span-3 rounded-lg">
                <span>{activeFile}</span>
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

    <div class="bg-base-300 flex-grow flex flex-col rounded-xl overflow-hidden">
        <div class="bg-base-200 p-1 shadow-md z-10 w-full min-w-fit">
            <SlidingSelect bind:tabs bind:activeTab></SlidingSelect>
        </div>
        {#if activeTabName === "Controller"}
            <Controller />
        {:else if activeTabName === "Editor"}
            <CsvEditor goLoad={loadData}  bind:activeFile/>
        {:else if activeTabName === "Viewer"}
            <Viewer />
        {/if}
    </div>
</div>

<label class="swap swap-rotate fixed top-1 right-1 z-10 scale-75">
  
    <!-- this hidden checkbox controls the state -->
    <input type="checkbox" class="theme-controller" value="light" />
    
    <!-- sun icon -->
    <svg class="swap-off fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>
    
    <!-- moon icon -->
    <svg class="swap-on fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
    
  </label>

<style>
    .gojswin {
        max-width: 50vw;
    }
</style>

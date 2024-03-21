<script lang="ts">
    import { DarkTheme, LightTheme } from "$lib/colorthemes";
    import { initGo, type gojsElementClickEventHandler } from "$lib/gojscode";
    import { parseCSV } from "$lib/nodes";
    import { EXAMPLE_CSV, Simulation } from "$lib/simulation";
    import { onMount } from "svelte";
    import CsvEditor from "../components/CSVEditor.svelte";
    import SlidingSelect from "../components/SlidingSelect.svelte";
    import Controller from "../components/Controller.svelte";
    import Viewer from "../components/Viewer.svelte";

    let root: HTMLDivElement;
    let sim: Simulation;

    let activeTab = 1;

    let handler: gojsElementClickEventHandler = (ev) => {
        console.log(ev);
    };
    onMount(() => {
        let reload = initGo(parseCSV(EXAMPLE_CSV), root, handler, DarkTheme);
        sim = reload();
    });

    function next() {
        console.log("hi");
        sim.doCycle();
    }

    function back() {
        console.log("back");
    }

    let tabs = ["Controller", "Editor", "Viewer"];

    let activeTabName = tabs[activeTab];
    $:activeTabName = tabs[activeTab];
</script>

<div class="grid grid-cols-7 grid-rows-1 h-full w-full gap-10 p-5">
    <!-- GOJs Element -->
    <div class="mockup-window col-span-4 bg-base-200 relative overflow-hidden">
        <div class="absolute top-3 right-5 h-7">
            <button class="material-symbols-outlined" on:click={back}>
                arrow_back_ios
            </button>

            <button class="material-symbols-outlined" on:click={next}>
                arrow_forward_ios
            </button>
        </div>
        <div bind:this={root} class="w-full h-full bg-base-300"></div>
    </div>

    <div class="bg-base-300 col-span-3 flex flex-col rounded-xl overflow-hidden">
        <div class="bg-base-200 p-1 shadow-md z-10">
            <SlidingSelect bind:tabs bind:activeTab></SlidingSelect>
        </div>
            {#if activeTabName === "Controller"}
            <Controller />
            {:else if activeTabName === "Editor"}
            <CsvEditor />
            {:else if activeTabName === "Viewer"}
            <Viewer />
        {/if}

    </div>
</div>

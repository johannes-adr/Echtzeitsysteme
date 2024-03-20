<script lang="ts">
    import {
        initGo,
        type gojsElementClickEventHandler,
        type ColorOptions,
    } from "$lib/gojscode";
    import { parseCSV } from "$lib/nodes";
    import { EXAMPLE_CSV, Simulation } from "$lib/simulation";
    import { onMount } from "svelte";

    const colors: ColorOptions = {
        semaphoreColor: {
            active: {
                bg: "#f00",
                text: "#fff",
            },
            inactive: {
                bg: "#fff",
                text: "#f00",
            },
        },
        mutexColor: {
            active: {
                bg: "#0f0",
                text: "#fff",
            },
            inactive: {
                bg: "#fff",
                text: "#0f0",
            },
        },
        activityColor: {
            active: {
                bg: "#00f",
                text: "#fff",
            },
            inactive: {
                bg: "#fff",
                text: "#00f",
            },
        },
    };
    let root: HTMLDivElement;

    let handler: gojsElementClickEventHandler = (ev) => {
        console.log(ev);
    };
    let sim: Simulation;
    onMount(() => {
        let reload = initGo(parseCSV(EXAMPLE_CSV), root, handler, colors);
        sim = reload();
    });


    function next(){
        console.log("hi")
        sim.doCycle();
    }

    function back(){
        console.log("back")
    }
</script>

<div class="grid grid-cols-3 grid-rows-1 h-full w-full gap-10 p-5">
    <!-- GOJs Element -->
    <div class="mockup-window col-span-2 border bg-base-200 relative">
        <div class="absolute top-3 right-5 h-7">
            <button class="material-symbols-outlined" on:click={back}> arrow_back_ios </button>

            <button class="material-symbols-outlined" on:click={next}> arrow_forward_ios </button>
        </div>
        <div bind:this={root} class="w-full h-full bg-base-300"></div>
    </div>
</div>

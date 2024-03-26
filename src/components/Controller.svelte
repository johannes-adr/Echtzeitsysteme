<script context="module" lang="ts">
    export let autoCycleInterval: NodeJS.Timeout | undefined;
</script>

<script lang="ts">
    import { sim } from "$lib/global";
    import { onDestroy } from "svelte";
    import { get } from "svelte/store";
    let changeHistory: any[] = [];
    sim.subscribe((sim) => {
        sim?.addObserver((change) => {
            changeHistory.unshift(change);
            if (changeHistory.length > 10) {
                changeHistory.pop();
            }
            changeHistory = changeHistory;
        });
    });
    let autoCycle = autoCycleInterval !== undefined;
    let interval = "1000";


    $: {
        console.log(autoCycle);
        if (autoCycleInterval !== undefined) {
            clearInterval(autoCycleInterval);
            autoCycleInterval = undefined;
        }

        if (autoCycle) {
            autoCycleInterval = setInterval(() => {
                get(sim)?.doCycle();
            }, Number.parseInt(interval));
        }
    }

    // onDestroy(()=>{
    //     if(autoCycleInterval !== undefined)clearInterval(autoCycleInterval);
    // })
</script>

<div class="w-full h-full p-3">
    <div class="grid w-full h-full grid-rows-11 lg:grid-rows-1 lg:grid-cols-11">
        <div
            class="flex flex-col card items-start row-span-5 lg:row-span-1 lg:col-span-5 w-full h-full"
        >
            <h1 class="w-full text-center">Actions</h1>
            <section>
                <h2>
                    <span>AutoCycle</span><input
                        type="checkbox"
                        class="toggle"
                        bind:checked={autoCycle}
                    />
                </h2>

                <div class="flex flex-col">
                    <input
                        type="range"
                        min="10"
                        max="2000"
                        bind:value={interval}
                        class="range"
                    />
                    <label
                        class="input input-bordered flex items-center gap-2 indicator mt-4"
                    >
                        Interval
                        <input type="number" class="grow" bind:value={interval} />
                        <span class="indicator-item badge badge-secondary">ms</span>
                    </label>
                </div>
            </section>
        </div>
        <div class="divider lg:divider-horizontal row-span-1 col-span-1"></div>
        <div
            class="flex flex-col card items-center row-span-5 lg:row-span-1 lg:col-span-5 w-full h-full"
        >
            <h1>History</h1>
            <div
                class=" bg-base-200 px-2 py-1 w-full h-full rounded-lg flex flex-col text-xs gap-3"
            >
                {#each changeHistory as change}
                    <span>{JSON.stringify(change)}</span>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    section {
        @apply p-2 border w-full border-base-200 bg-base-100 rounded-md mt-5;
    }

    section > h2 {
        @apply text-lg mb-5 pb-3 border-b border-base-300 flex flex-row items-center justify-between;
    }
</style>

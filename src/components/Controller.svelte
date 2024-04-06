<script context="module" lang="ts">
    export let autoCycleInterval: NodeJS.Timeout | undefined;
</script>

<script lang="ts">
    import { sim } from "$lib/global";
    import { get } from "svelte/store";
    import CpuCore from "./CPUCore.svelte";
    import { showNameLinkStore } from "$lib/gojscode";
    let changeHistory: any[] = [];

    let activeThreads: string[] = [];

    sim.subscribe((sim) => {
        sim?.addObserver((change, threads) => {
            changeHistory.unshift(change);
            if (changeHistory.length > 10) {
                changeHistory.pop();
            }
            activeThreads = threads;
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

    function addThread(count: number){
        if($sim)$sim.threads += count;
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

            <section>
                <h2>Show Links</h2>
                <input
                        type="checkbox"
                        class="toggle"
                        bind:checked={$showNameLinkStore}
                    />
            </section>

            <section>
                <h2 class="flex justify-between">
                    <span>Threads ({activeThreads.length}/{$sim?.threads ?? 0})</span>
                    <span class="flex flex-row gap-3">
                        <button class=" bg-base-300 w-7 text-center rounded" on:click={()=>addThread(1)}>+</button> 
                        <button class=" bg-base-300 w-7 text-center rounded" on:click={()=>addThread(-1)}>-</button>
                    </span>
                </h2>
                <div class=" grid grid-cols-2 threadgrid">
                    {#each activeThreads as activity, id}
                        <CpuCore {id} {activity} />
                    {/each}
                    {#each { length: ($sim?.threads ?? 0) - activeThreads.length } as _, id}
                        <CpuCore id={activeThreads.length + id} />
                    {/each}
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

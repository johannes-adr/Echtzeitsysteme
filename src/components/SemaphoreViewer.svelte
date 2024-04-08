<script lang="ts">
    import type { SimulationData } from "$lib/nodes";
    import ViewerItem from "./ViewerItem.svelte";

    export let currentSimData: SimulationData;
    export let immutSimData: SimulationData;
    export let from: string;
    export let to: string | string[];

    function parseTo(){
        if(typeof to === "string"){
            to = to.startsWith("{")?JSON.parse(to).from:[to]
        }
    }

    parseTo();

    $:{parseTo();to};
</script>

<div class="bg-base-300 col-span-2 gap-3 flex flex-col px-5">
    <div class=" col-span-2">
        <h1 class=" font-semibold">From</h1>
        <ViewerItem title="Activity {from.split("_")[0]}">
            Task {from.split("_")[1]}
        </ViewerItem>
    </div>
    <h1 class="col-span-2 font-semibold">To</h1>
    
    {#each to as toL}
    <ViewerItem title="Activity {toL.split("_")[0]}">
        Task {toL.split("_")[1]}
    </ViewerItem>
    {/each}
</div>

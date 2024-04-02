<script lang="ts">
    import type { SimulationData } from "$lib/nodes";
    import ViewerItem from "./ViewerItem.svelte";

    export let currentSimData: SimulationData;
    export let immutSimData: SimulationData;
    export let from: string;
    export let to: string;


    function parseTo(to: string){
        return to.startsWith("{")?JSON.parse(to).from:[to]
    }

    let to_processed = parseTo(to);

    $:parseTo(to)
console.log("To;",to_processed,"from",from)
</script>

<div class="bg-base-300 col-span-2 gap-3 flex flex-col">
    <div class=" col-span-2">
        <h1>From</h1>
        <ViewerItem title="Activity {from.split("_")[0]}">
            Task {from.split("_")[1]}
        </ViewerItem>
    </div>
    <h1 class="col-span-2">To</h1>
    
    {#each to_processed as to}
    <ViewerItem title="Activity {to.split("_")[0]}">
        Task {to.split("_")[1]}
    </ViewerItem>
    {/each}
</div>

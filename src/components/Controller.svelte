<script lang="ts">
    import { sim } from "$lib/global";
    let changeHistory: any[] = []
    sim.subscribe(sim=>{
        sim?.addObserver(change=>{
            changeHistory.push(change);
            changeHistory = changeHistory;
        })
    })

</script>

<div class="w-full h-full p-3">
    <div class="grid w-full  h-full grid-rows-11 lg:grid-rows-1 lg:grid-cols-11">
        <div class="flex flex-col card items-center row-span-5 lg:row-span-1 lg:col-span-5 w-full h-full">
            <h1>
                Actions
            </h1>
        </div> 
        <div class="divider lg:divider-horizontal row-span-1 col-span-1"></div> 
        <div class="flex flex-col card items-center row-span-5 lg:row-span-1 lg:col-span-5  w-full h-full">
            <h1>
                History
            </h1>
            <div class=" bg-base-200 px-2 py-1 w-full h-full rounded-lg flex flex-col text-xs gap-3 ">
                {#each changeHistory as change}
                    <span>{JSON.stringify(change)}</span>
                {/each}
            </div>
        </div>
      </div>
</div>
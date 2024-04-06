<script lang="ts">
    import { sim } from "$lib/global";
    import Centered from "./Centered.svelte";

    export let activity: string | undefined = undefined;
    export let id: number
</script>
<div class="group flex flex-col h-24 border rounded m-2 p-2 relative ">
    <h2 class="font-bold">Core {id + 1}</h2>
    <Centered>
        {#if activity}
        <span class=" text-success">{activity}</span>
        {:else}
        <span class=" font-bold text-warning">Idle</span>
        {/if}
    </Centered>
</div>
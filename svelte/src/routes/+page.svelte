<script lang="ts">
    import { initGo, type gojsElementClickEventHandler } from "$lib/gojscode";
    import { parseCSV } from "$lib/nodes";
    import { EXAMPLE_CSV } from "$lib/simulation";
    import { onMount } from "svelte";

    let root: HTMLDivElement;


    let handler: gojsElementClickEventHandler = (ev)=>{

    }

    onMount(()=>{
        let reload = initGo(parseCSV(EXAMPLE_CSV),root, handler)
        let sim = reload();

        // setInterval(()=>sim.doCycle(),1000)
    })
</script>


<!-- GOJs Elemet -->
<div bind:this={root} class="w-screen h-screen"></div>
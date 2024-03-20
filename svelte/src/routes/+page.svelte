<script lang="ts">
    import { initGo, type gojsElementClickEventHandler, type ColorOptions } from "$lib/gojscode";
    import { parseCSV } from "$lib/nodes";
    import { EXAMPLE_CSV } from "$lib/simulation";
    import { onMount } from "svelte";

    const colors: ColorOptions = {
        semaphoreColor: {
            active: {
                bg: "#f00",
                text: "#fff"
            },
            inactive: {
                bg: "#fff",
                text: "#f00"
            }
        },
        mutexColor: {
            active: {
                bg: "#0f0",
                text: "#fff"
            },
            inactive: {
                bg: "#fff",
                text: "#0f0"
            }
        },
        activityColor: {
            active: {
                bg: "#00f",
                text: "#fff"
            },
            inactive: {
                bg: "#fff",
                text: "#00f"
            }
        }
    }
    let root: HTMLDivElement;
   

    let handler: gojsElementClickEventHandler = (ev)=>{
        console.log(ev)
    }

    onMount(()=>{
        let reload = initGo(parseCSV(EXAMPLE_CSV),root, handler,colors )
        let sim = reload();

        // setInterval(()=>sim.doCycle(),1000)
    })
</script>


<!-- GOJs Elemet -->
<div bind:this={root} class="w-screen h-screen"></div>
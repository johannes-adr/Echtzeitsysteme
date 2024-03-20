<script lang="ts">
    import { initGo } from "$lib/gojscode";
    import { parseCSV } from "$lib/nodes";
    import { onMount } from "svelte";

    let root: HTMLDivElement;

    let csv = `# Activity, activity_task, Duration

Activity, a_1, 3
Activity, a_2, 1
Activity, a_3, 1
Activity, a_4, 1
Activity, a_5, 3
Activity, b_5, 3
Activity, a_6, 2

# Semaphore, Wert, Endwert, Startwert +,
Semaphore, 0, b_5, a_5
Semaphore, 1, a_5, b_5
Semaphore, 1, a_1, b_5
Semaphore, 0, a_2, a_1
Semaphore, 0, a_4, a_2
Semaphore, 0, a_3, a_1
Semaphore, 0, a_6, a_3
Semaphore, 0, a_6, a_4
Semaphore, 0, a_5, a_6

# Mutex, Prioritäten Aktivitäten
Mutex, a_2,a_3,a_4`

    onMount(()=>{
        let reload = initGo(parseCSV(csv),root, (ev)=>{})
        let sim = reload();

        // setInterval(()=>sim.doCycle(),1000)
    })
</script>


<!-- GOJs Elemet -->
<div bind:this={root} class="w-screen h-screen"></div>
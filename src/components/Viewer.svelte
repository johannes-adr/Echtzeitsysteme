<script context="module" lang="ts">
    type SchemaType = "semaphore" | "mutex" | "activity";

    type HasSchema<T> = T extends { typ: SchemaType } ? T : never;

    const NAMES: { [key in SchemaType]: string } = {
        activity: "Aktivity / Task",
        mutex: "Mutex",
        semaphore: "Semaphore",
    };

    const TOOLTIP: { [key in SchemaType]: string } = {
        semaphore: `Ein Semaphore ist eine Variable oder ein abstraktes Datenelement, das verwendet
        wird, um den Zugriff auf eine gemeinsame Ressource in einem parallelen
        Programmierumfeld zu steuern. Es dient dazu, kritische Abschnitte zu
        synchronisieren, indem es die Anzahl der Threads oder Prozesse beschränkt, die
        gleichzeitig auf die Ressource zugreifen können. Semaphoren können zählend sein,
        wobei der Semaphore-Wert die Anzahl der Threads angibt, die gleichzeitig auf die
        Ressource zugreifen können, oder binär (auch bekannt als Mutex), wobei der Wert
        nur 0 oder 1 sein kann, um gegenseitigen Ausschluss zu gewährleisten.`,
        mutex: `Ein Mutex ist eine spezielle Art von Semaphore, der speziell für den gegenseitigen
        Ausschluss konzipiert ist. Er dient dazu, sicherzustellen, dass nur ein Thread
        oder Prozess zu einem Zeitpunkt auf eine Ressource zugreifen kann. Ein Mutex hat
        nur zwei Zustände: gesperrt und entsperrt. Wenn ein Thread eine Ressource mittels
        eines Mutex sperrt, wird jedem anderen Thread, der versucht, den Mutex zu sperren,
        der Zugriff verweigert, bis der Mutex wieder freigegeben wird.`,
        activity: `In Echtzeitsystemen bezieht sich eine Aktivität oder Task auf eine Einheit der
        Arbeit oder einen Prozess, der ausgeführt werden muss. Tasks können
        unterschiedliche Prioritäten haben und werden nach einem bestimmten Zeitplan oder
        aufgrund von Ereignissen aktiviert. Sie sind grundlegende Bausteine in
        Echtzeitsystemen, wobei jede Task eine spezifische Funktion oder Aufgabe erfüllt.
        In einem Multitasking-System können mehrere Tasks gleichzeitig ausgeführt werden,
        entweder parallel auf Mehrkernsystemen oder quasi-parallel durch Zeitscheiben auf
        Einzelkernsystemen.`,
    };
</script>

<script lang="ts">
    import { activeParseContent } from "$lib/files";
    import { goJsElementClickHandlers, sim } from "$lib/global";
    import type { gojsClickEvent } from "$lib/gojscode";
    import type { SimulationData } from "$lib/nodes";
    import SemaphoreViewer from "./SemaphoreViewer.svelte";
    import ViewerItem from "./ViewerItem.svelte";

    let ev: HasSchema<gojsClickEvent> | undefined;
        $:console.log(ev);
    ev = { typ: "semaphore",from: "a_1",to: "{\"from\":[\"b_5\",\"a_3\"],\"to\":\"a_1\"}" };
    goJsElementClickHandlers["$$ViewerAdsZgK"] = (evloc) => (ev = evloc);

    let immutSimData: SimulationData | undefined;
    let currentSimData: SimulationData | undefined;

    sim.subscribe((sim) => {
        if (!sim) return;
        sim.addObserver((_) => {
            console.log("hi", $sim);
            currentSimData = sim.getData();
            console.log("currentsimdatra");
        });
    });

    $: {
        immutSimData = $activeParseContent;
        if(currentSimData == undefined){
            currentSimData = immutSimData;
        }
    }
</script>

{#if immutSimData == undefined || currentSimData == undefined}
    <h1>No Data Available</h1>
{:else if ev === undefined}
    <h1>Select an Element</h1>
{:else}
    <div class="title">
        <span>{NAMES[ev.typ]}</span>
        <div>
            <div class="tooltip tooltip-bottom" data-tip={TOOLTIP[ev.typ]}>
                <button class="material-symbols-outlined"> info </button>
            </div>
        </div>
        <span />
    </div>
        {#if ev.typ == "activity"}
    <div class="defgrid [&>*]:bg-base-100 [&>*]:rounded-lg">

            <ViewerItem title="Task" icon="account_tree"
                >{ev.activitName.split("_")[1] ?? "?"}</ViewerItem
            >
            <ViewerItem title="Activity" icon="memory"
                >{ev.activitName.split("_")[0]}</ViewerItem
            >
            <ViewerItem title="Priority" icon="priority_high"
                >{(currentSimData?.priorities[ev.activitName] ?? 0)}</ViewerItem
            >

            <ViewerItem
                title="Cyles"
                icon="cycle"
                desc={"of " + (immutSimData?.activities[ev.activitName] ?? "?")}
                >{currentSimData?.activities[ev.activitName] ??
                    "?"}</ViewerItem
            >

            <ViewerItem title="Active" icon="toggle_on"
                >{(currentSimData?.activities[ev.activitName] ?? 0) !== 0}</ViewerItem
            >
            
            </div>
        {:else if ev.typ == "mutex"}
    <div class="defgrid [&>*]:bg-base-100 [&>*]:rounded-lg">

                    {#each (immutSimData ?? []).mutexes.find(ex=>
                            //@ts-ignore
                            JSON.stringify(ex) == ev.mutexid) ?? [] as actname,num}

                        <div class=" col-span-2">
                            <ViewerItem title="Priority {num+1}">
                                Task {actname.split("_")[1]} Activity {actname.split("_")[0]}
                            </ViewerItem>
                        </div>
                    {/each}
    </div>
        {:else if ev.typ == "semaphore"}
            <SemaphoreViewer from={ev.from} to={ev.to} bind:currentSimData={currentSimData} bind:immutSimData={immutSimData} />
        {/if}
        <span class="bg-base-100"></span>
{/if}

<style>
    .defgrid {
        @apply grid grid-cols-2 gap-2 m-3;
    }

    .defgrid > *{
        @apply bg-base-100 rounded-lg
    }

    .title {
        @apply grid grid-cols-7 items-center w-full justify-between py-3 px-4 my-3 border-b border-b-base-100;
    }

    .title > span {
        @apply text-2xl col-span-3;
    }
</style>

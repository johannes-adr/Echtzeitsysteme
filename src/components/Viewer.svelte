<script lang="ts">
    import { activeParseContent } from "$lib/files";
    import { goJsElementClickHandlers } from "$lib/global";
    import type { gojsClickEvent } from "$lib/gojscode";
    import type { SimulationData } from "$lib/nodes";

    let ev: gojsClickEvent | undefined;
    goJsElementClickHandlers["$$ViewerAdsZgK"] = (evloc) => (ev = evloc);

    let simData: SimulationData | undefined;
    $:simData = $activeParseContent
</script>

{#if simData == undefined}
    <h1>No Data Available</h1>
{:else if ev === undefined}
    <h1>Select an Element</h1>
{:else if ev.typ == "activity"}
    <h1>Activity</h1>
    {JSON.stringify(simData.activities[ev.activitName])}
    <!-- {simul} -->

    <section class="desc">
        In Echtzeitsystemen bezieht sich eine Aktivität oder Task auf eine Einheit der
        Arbeit oder einen Prozess, der ausgeführt werden muss. Tasks können
        unterschiedliche Prioritäten haben und werden nach einem bestimmten Zeitplan oder
        aufgrund von Ereignissen aktiviert. Sie sind grundlegende Bausteine in
        Echtzeitsystemen, wobei jede Task eine spezifische Funktion oder Aufgabe erfüllt.
        In einem Multitasking-System können mehrere Tasks gleichzeitig ausgeführt werden,
        entweder parallel auf Mehrkernsystemen oder quasi-parallel durch Zeitscheiben auf
        Einzelkernsystemen.
    </section>
{:else if ev.typ == "mutex"}
    <h1>Mutex</h1>
    <section class="desc">
        Ein Mutex ist eine spezielle Art von Semaphore, der speziell für den gegenseitigen
        Ausschluss konzipiert ist. Er dient dazu, sicherzustellen, dass nur ein Thread
        oder Prozess zu einem Zeitpunkt auf eine Ressource zugreifen kann. Ein Mutex hat
        nur zwei Zustände: gesperrt und entsperrt. Wenn ein Thread eine Ressource mittels
        eines Mutex sperrt, wird jedem anderen Thread, der versucht, den Mutex zu sperren,
        der Zugriff verweigert, bis der Mutex wieder freigegeben wird.
    </section>
{:else if ev.typ == "semaphore"}
    <h1>Semaphore</h1>
    <section class="desc">
        Ein Semaphore ist eine Variable oder ein abstraktes Datenelement, das verwendet
        wird, um den Zugriff auf eine gemeinsame Ressource in einem parallelen
        Programmierumfeld zu steuern. Es dient dazu, kritische Abschnitte zu
        synchronisieren, indem es die Anzahl der Threads oder Prozesse beschränkt, die
        gleichzeitig auf die Ressource zugreifen können. Semaphoren können zählend sein,
        wobei der Semaphore-Wert die Anzahl der Threads angibt, die gleichzeitig auf die
        Ressource zugreifen können, oder binär (auch bekannt als Mutex), wobei der Wert
        nur 0 oder 1 sein kann, um gegenseitigen Ausschluss zu gewährleisten.
    </section>
{/if}

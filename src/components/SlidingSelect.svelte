<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    let tabsContainer: HTMLElement;
    export let tabs: string[];
    export let activeTab: number; // the currently selected tab

    let { offsetLeft, offsetWidth } = { offsetLeft: 0, offsetWidth: 0 };
    function resize(){
        let loc = tabsContainer.children[activeTab] as HTMLElement;
        offsetWidth = loc.offsetWidth;
        offsetLeft = loc.offsetLeft
    }

    onMount(()=>{
        resize();
    })

    if(browser)window.addEventListener("resize",resize);
    $: {
        activeTab;
        if (browser && tabsContainer)resize()
    }
</script>

<div
    class="flex flex-nowrap relative items-center rounded-lg tabs w-full"
    bind:this={tabsContainer}
>
    {#each tabs as tab, i}
        <button
            class="text-base-content whitespace-nowrap relative px-2 py-1 m-1 tab {activeTab ===
            i
                ? 'active text-neutral-content'
                : ''}"
            on:click={() => (activeTab = i)}
        >
            {tab}
        </button>
    {/each}
    {#if tabsContainer}
        <div
            class="tab-slider bg-neutral"
            style="left: {offsetLeft}px;
           width: {offsetWidth}px"
        />
    {/if}
</div>

<style>
    .active {
        transition: 0.3s;
    }

    .tab:not(.active) {
        filter: grayscale(0.5);
        transition: filter 0.3s;
    }
    .tab {
        z-index: 1;
        width: 100%;
    }
    .tab-slider {
        position: absolute;
        bottom: 0;
        height: 80%;
        border-radius: 6px;
        top: 50%;
        transform: translateY(-50%);
        transition:
            left 0.15s ease-in-out,
            width 0.15s ease-in-out;
        box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
    }
</style>

<script lang="ts">
    import { activeFile, createFile, files, localSname } from "$lib/files";
    import { parseCSV, type SimulationData } from "$lib/nodes";
    import FileItem from "./FileItem.svelte";
    $: if (
        $activeFile !== null &&
        localStorage.getItem(localSname($activeFile)) == undefined
    ) {
        $activeFile = null;
        localStorage.removeItem("activeFile");
    }

    $: if ($activeFile) {
        localStorage.setItem("activeFile", $activeFile);
    } else {
        localStorage.removeItem("activeFile");
    }

    
    $: {
        if ($activeFile && localStorage) {
            if (
                $files[$activeFile].content !== localStorage.getItem(localSname($activeFile))
            ) {
                $files[$activeFile].changed = true;
            } else {
                $files[$activeFile].changed = false;
            }
        }
    }

    export let goLoad: (data: SimulationData)=>void;

    function syncActiveFileWithGo(){
        if(!$activeFile){
            alert("No active file")

            return;
        }

        let parsed = parseCSV($files[$activeFile].content);
        goLoad(parsed);
    }

    function onRename(fname_old: string, fname_new: string) {
        let fcontent = $files[fname_old];
        localStorage.removeItem(localSname(fname_old));
        delete $files[fname_old];
        $files[fname_new] = fcontent;
        localStorage.setItem(localSname(fname_new), fcontent.content);
        if ($activeFile == fname_old) {
            $activeFile = fname_new;
        }
        $files = $files;
    }
</script>

<div class="flex flex-row h-full w-full">
    <div class="flex flex-col pt-2 h-full w-min min-w-fit bg-base-200 relative">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="absolute top-0 left-0 w-full h-full"
            on:click={() => ($activeFile = null)}
        />

        <div class="px-1 flex justify-between z-10">
            <button
                class="material-symbols-outlined font-thin"
                on:click={() => createFile("new.csv")}
            >
                new_window
            </button>
            <button
                class="material-symbols-outlined font-thin"
                on:click={syncActiveFileWithGo}
            >
                sync
            </button>
        </div>

        {#each Object.keys($files) as fname}
            <div class="button-root z-10">
                <div class="group relative" class:active={$activeFile == fname}>
                    <FileItem
                        {fname}
                        {onRename}
                    />
                </div>
            </div>
        {/each}
    </div>
    {#if $activeFile !== null}
        <textarea
            bind:value={$files[$activeFile].content}
            wrap="off"
            class="h-full w-full bg-transparent focus:outline-none resize-none px-2 text-sm"
        />
    {:else}
        <div class="col-span-2 h-full items-center">
            <div class=" w-full h-full flex flex-row items-center">
                <img src="/Questions-rafiki.svg" alt="" />
            </div>
        </div>
    {/if}
</div>

<style>
    .active {
        @apply bg-base-content bg-opacity-15;
    }

    .button-root:not(:last-child) {
        @apply border-b border-base-content border-opacity-20 pb-1 mb-1;
    }
</style>

<script lang="ts">
    export let activeFile: string | null;
    export let fname: string;
    export let changed: boolean;
    let fnameold = fname;
    export let deleteFile: (fname: string) => void;
    export let saveFile: (fname:string)=>void;
    let editName = false;

    export let onRename: (fname_old: string, fname_new: string) => void;
    $: {
        if (fname != fnameold) {
            onRename(fnameold, fname);
            fnameold = fname;
        }
    }
</script>

<button
    class="text-left pt-0.5 py-1 px-1 w-full flex flex-row rounded-l justify-between items-center"
    on:click={() => (activeFile = fname)}
>
    <div class="flex flex-row items-center">
        <span class="material-symbols-outlined font-thin"> description </span>
        {#if !editName}
            <button on:dblclick={() => (editName = true)}>{fname}</button>
        {:else}
            <input
                on:mouseleave={() => (editName = false)}
                on:keypress={(ev) => (ev.key == "Enter" ? (editName = false) : "")}
                type="text"
                bind:value={fname}
                class=" w-full"
            />
        {/if}
    </div>

    {#if changed}
        <button
            class="hidden group-hover:block material-symbols-outlined" on:click={()=>saveFile(fname)}
        >
            save
        </button>
        <div
            class="block group-hover:hidden indicator-item badge badge-warning badge-xs mr-1"
        />
    {/if}

    <button
        on:click={() => deleteFile(fname)}
        class="material-symbols-outlined hidden group-hover:block text-error font-thin"
    >
        delete
    </button>
</button>

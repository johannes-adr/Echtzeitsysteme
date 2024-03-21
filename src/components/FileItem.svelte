<script lang="ts">
    import { activeFile,deleteFile,files, saveFile } from "$lib/files";

    export let fname: string;
    let fnameold = fname;

    let changed: boolean = false;
    let editName = false;


    let input: HTMLInputElement;


    export let onRename: (fname_old: string, fname_new: string) => void;
    $: {
        if (fname != fnameold) {
            onRename(fnameold, fname);
            fnameold = fname;
        }
    }

    $:changed = $files[fname]?.changed ?? false;
    $:setTimeout(()=>{if(editName){resizeInput();input.focus()}},0)

    function getWidthOfInput() {
        var tmp = document.createElement("span");
        tmp.className = "input-element tmp-element";
        tmp.innerHTML = fname
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        tmp.style.visibility = "hidden";
        tmp.style.whiteSpace = "pre";
        document.body.appendChild(tmp);
        var theWidth = tmp.getBoundingClientRect().width;
        document.body.removeChild(tmp);
        return theWidth;
    }

    function resizeInput() {
        if (input) input.style.width = getWidthOfInput() + "px";
    }
</script>

<button
    class="text-left pt-0.5 py-1 px-1 w-full flex flex-row rounded-l justify-between items-center"
    on:click={() => ($activeFile = fname)}
>
    <div class="flex flex-row items-center">
        <span class="material-symbols-outlined font-thin"> description </span>
        {#if !editName}
            <button on:dblclick={() => (editName = true)}>{fname}</button>
        {:else}
            <input
                bind:this={input}
                on:blur={() => (editName = false)}
                on:keypress={(ev) => {
                    resizeInput();
                    ev.key == "Enter" ? (editName = false) : "";
                }}
                on:keyup={resizeInput}
                on:keydown={(e) => {
                    if (fname.length == 0) {
                        e.preventDefault();
                    } else {
                        resizeInput();
                    }
                }}
                type="text"
                bind:value={fname}
                class=" w-full"
            />
        {/if}
    </div>
    <div class="flex flex-row gap-0 justify-end w-12">
        {#if changed}
            <button
                class="hidden group-hover:block material-symbols-outlined font-thin"
                on:click={() => saveFile(fname)}
            >
                save
            </button>
            <div
                class="block group-hover:hidden indicator-item badge badge-warning badge-xs mr-1.5"
            />
        {/if}

        <button
            on:click={() => deleteFile(fname)}
            class="material-symbols-outlined hidden group-hover:block text-error font-thin"
        >
            delete
        </button>
    </div>
</button>

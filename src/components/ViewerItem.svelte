<script lang="ts">
    import Centered from "./Centered.svelte";

    export let icon: string | undefined = undefined;
    export let title: string | undefined = undefined;
    export let desc: string | undefined = "";
</script>

<div class="stat">
    <div class="stat-figure text-primary">
        {#if icon}
        <div class="inline-block text-center ">
            <Centered>  <span class="material-symbols-outlined text-4xl "> {icon} </span></Centered>
        </div>
          
        {/if}
    </div>
    <div class="stat-title">{title}</div>
    <div class="stat-value text-primary"><slot /></div>
    <div class="stat-desc">{desc}</div>
</div>

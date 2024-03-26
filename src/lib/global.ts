import { writable } from "svelte/store";
import { Simulation } from "./simulation";

export let sim = writable<Simulation | undefined>();
export let activeTab = writable<string>("Controller");
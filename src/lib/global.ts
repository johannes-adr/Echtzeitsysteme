import { writable } from "svelte/store";
import { Simulation } from "./simulation";
import type { gojsElementClickEventHandler } from "./gojscode";

export let sim = writable<Simulation | undefined>();
export let activeTab = writable<string>("Controller");

export let goJsElementClickHandlers: {[key: string]: gojsElementClickEventHandler} = {};
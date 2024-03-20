import type { ColorOptions } from "./gojscode";


export const LightTheme: ColorOptions = {
    
    semaphoreColor: {
        active: {
            bg: "#f00",
            text: "#000"
        },
        inactive: {
            bg: "#ddd",
            text: "#333"
        }
    },
    mutexColor: {
        active: {
            bg: "#0f0",
            text: "#000"
        },
        inactive: {
            bg: "#ddd",
            text: "#333"
        }
    },
    activityColor: {
        active: {
            bg: "#00f",
            text: "#000"
        },
        inactive: {
            bg: "#ddd",
            text: "#333"
        }
    }
}
export const DarkTheme:ColorOptions ={
    semaphoreColor: {
        active: {
            bg: "#900",
            text: "#fff"
        },
        inactive: {
            bg: "#222",
            text: "#aaa"
        }
    },
    mutexColor: {
        active: {
            bg: "#090",
            text: "#fff"
        },
        inactive: {
            bg: "#222",
            text: "#aaa"
        }
    },
    activityColor: {
        active: {
            bg: "#009",
            text: "#fff"
        },
        inactive: {
            bg: "#222",
            text: "#aaa"
        }
    }
}

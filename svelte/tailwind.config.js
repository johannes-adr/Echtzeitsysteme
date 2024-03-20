/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", "dark", "valentine", {
      "memories":{
         "primary":"#9b59b6",
         "primary-content": "#fff",
         "secondary":"#051920",
         "secondary-content":"#fff",
         "accent":"#111827",
         "neutral":"#050302",
         "base-100":"#f9f5f4",
         "base-200":"#ffffff",
         "base-300":"#585858",
         "info":"#111827",
         "success":"#00cf90",
         "warning":"#fcd34d",
         "error":"#f87171"
      },
      "memories-dark":{
        "primary":"#3f8dfb",
        "primary-content": "#fff",
        "secondary":"#fff",
        "accent":"#111827",
        "neutral":"#050302",
        "base-300":"#4d4d4d",
        "base-200":"#2c2d2f",
        "base-100":"#000",
        "info":"#111827",
        "success":"#00cf90",
        "warning":"#fcd34d",
        "error":"#f87171"
     }
   }],
  },
  plugins: [
    require('daisyui'),
  ],
}


import { createApp, ref } from "./vue.js";

const app = createApp({
  async setup() {
    const message = ref("Ini coba aja");
    // const result = await fetch("/gate");
    // const gates = await result.json();
    // console.log(gates);
    return { message };
  },
});

app.mount("#app");

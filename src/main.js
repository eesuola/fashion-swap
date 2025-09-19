import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";  // ✅ add this

createApp(App)
  .use(router)
  .use(store)  // ✅ enable Vuex
  .mount("#app");

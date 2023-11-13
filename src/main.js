import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@mdi/font/css/materialdesignicons.css";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../registerServiceWorker.js") // Ruta correcta del service worker
    .then(() => {})
    .catch(() => {});
}

const app = createApp(App);
app.use(router);
app.use(store);

store.dispatch("autoLogin").then(() => {
  app.mount("#app");
});

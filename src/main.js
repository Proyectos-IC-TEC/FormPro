import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../registerServiceWorker.js") // Ruta correcta del service worker
    .then((registration) => {
      console.log("Service Worker registrado con éxito:", registration);
    })
    .catch((error) => {
      console.error("Error al registrar el Service Worker:", error);
    });
}

const app = createApp(App);
app.use(router);
app.use(store);

store.dispatch("autoLogin").then(() => {
  app.mount("#app");
});

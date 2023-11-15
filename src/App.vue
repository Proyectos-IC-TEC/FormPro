<template>
  <div id="app">
    <div v-if="isAuthenticated">
      <nav>
        <router-link to="/reports">Reportes</router-link>
        <router-link to="/form-builder">Crear Nuevo Formulario</router-link>
        <button class="logout-button" @click="handleLogout">
          <svg-icon type="mdi" :path="path"></svg-icon>
        </button>
      </nav>
      <router-view />
    </div>
    <router-view v-else />
  </div>
</template>

<script>
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiLogout } from "@mdi/js";
import "@/styles/styles.css";
export default {
  components: {
    SvgIcon,
  },
  data() {
    return {
      path: mdiLogout,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    handleLogout() {
      this.$store
        .dispatch("logout")
        .then(() => {
          this.$router.push("/login");
        })
        .catch((error) => {
          console.error("Error al cerrar sesión:", error.message);
        });
    },
  },
};
</script>

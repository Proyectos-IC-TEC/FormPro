<template>
  <div id="app">
    <div v-if="isAuthenticated">
      <!-- Navbar y otros componentes autenticados aquí -->
      <nav>
        <router-link to="/reports">Reportes</router-link>
        <router-link to="/form-builder">Crear Nuevo Formulario</router-link>
        <button @click="handleLogout">Cerrar Sesión</button>
      </nav>
      <router-view />
    </div>
    <router-view v-else />
  </div>
</template>

<script>
export default {
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
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Error al cerrar sesión:", error.message);
        });
    },
  },
};
</script>

<style>
/* Estilos para el navbar */
nav {
  background-color: #007bff;
  padding: 10px;
  color: white;
  display: flex;
  justify-content: space-around;
}

nav a {
  color: white;
  text-decoration: none;
  margin: 0 10px;
}
</style>

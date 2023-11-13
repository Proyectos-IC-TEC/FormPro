<template>
  <div class="login">
    <h2>Login</h2>
    <button class="google-button" @click="loginWithGoogle">
      <svg-icon type="mdi" :path="path" class="google-icon"></svg-icon>
      <p class="google-text">Continuar con Google</p>
    </button>
  </div>
</template>

<script>
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiGoogle } from '@mdi/js';
import "../components/styles.css";
export default {
  components: {
    SvgIcon
  },
  data() {
    return {
      path: mdiGoogle,
    }
  },
  methods: {
    async loginWithGoogle() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      try {
        // Inicia sesión con Google utilizando una ventana emergente
        await signInWithPopup(auth, provider);
        // Redirige al usuario a la página de reports después del login
        this.$router.push("/reports");
      } catch (error) {
        // Manejar errores de autenticación, por ejemplo, mostrar un mensaje de error al usuario
        console.error("Error de autenticación:", error.message);
      }
    },
  },
};
</script>

<template>
  <div>
    <h2>Login</h2>
    <button @click="loginWithGoogle">Continuar con Google</button>
  </div>
</template>

<script>
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default {
  methods: {
    async loginWithGoogle() {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      try {
        // Inicia sesión con Google utilizando una ventana emergente
        await signInWithPopup(auth, provider);
        console.log("Usuario autenticado");
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

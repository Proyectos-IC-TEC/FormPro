import { createStore } from "vuex";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import app from "@/firebaseConfig";

export default createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      const auth = getAuth(app);
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        commit("setUser", user);
        return user;
      } catch (error) {
        console.error("Error de autenticación:", error.message);
        throw error;
      }
    },
    async logout({ commit }) {
      console.log("Deslogueando...");
      const auth = getAuth(app);
      try {
        await signOut(auth);
        commit("setUser", null);
      } catch (error) {
        console.error("Error al cerrar sesión:", error.message);
        throw error;
      }
    },
    async autoLogin({ commit }) {
      const auth = getAuth(app);
      return new Promise((resolve) => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            commit("setUser", user);
          } else {
            commit("setUser", null);
          }
          resolve(user);
        });
      });
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
});

<template>
  <div>
    <h2 class="tittle-form">Reportes</h2>
    <!-- Listado de formularios -->
    <ul class="form-list">
      <li v-for="formulario in formularios" :key="formulario.id" class="form-item">
        {{ formulario.nombre }}
        <div class="form-buttons">
          <button @click="verRespuestas(formulario.id)">Ver Respuestas</button>
          <button @click="generarEnlace(formulario.id)">Generar enlace para responder</button>
          <button @click="eliminarFormulario(formulario.id)">Eliminar Formulario</button>
        </div>
      </li>
    </ul>

    <!-- Modal para mostrar el enlace generado -->
    <div class="modal" v-if="enlaceModalVisible">
      <div class="modal-content">
        <span class="close" @click="cerrarModal">&times;</span>
        <h3>Enlace para Responder el Formulario:</h3>
        <p>{{ enlaceGenerado }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import "../components/styles.css";
import app from "@/firebaseConfig";
import { onAuthStateChanged, getAuth } from "firebase/auth";

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const auth = getAuth(app);
let usuarioActual = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    // El usuario está autenticado
    usuarioActual = user.uid;
  } else {
    // El usuario no está autenticado
    usuarioActual = null;
  }
});

export default {
  data() {
    return {
      formularios: [],
      enlaceModalVisible: false,
      rutaCompleta: window.location.href,
      enlaceGenerado: "",
    };
  },
  mounted() {
    // Recuperar la lista de formularios al cargar el componente
    this.recuperarFormularios();
  },
  methods: {
    async recuperarFormularios() {
      const db = getFirestore();
      const formulariosRef = collection(db, "formularios");

      // Consulta para recuperar solo los formularios del usuario actual
      const q = query(formulariosRef, where("usuario", "==", usuarioActual));

      try {
        const querySnapshot = await getDocs(q);

        // Almacenar los formularios en el estado del componente
        this.formularios = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
        }));
      } catch (error) {
        console.error("Error al recuperar formularios:", error);
      }
    },
    async verRespuestas(formularioId) {
      this.$router.push({
        name: "AnswersView",
        params: { formId: formularioId },
      });
    },
    async generarEnlace(formularioId) {
      // Lógica para generar el enlace único con formularioId
      const rutaRaiz = this.rutaCompleta.replace(/\/[^/]*$/, "");
      this.enlaceGenerado = `${rutaRaiz}/answer-form/${formularioId}`;

      // Muestra el modal con el enlace generado
      this.enlaceModalVisible = true;
    },
    async cerrarModal() {
      this.enlaceModalVisible = false;
    },
    async eliminarFormulario(formularioId) {
      const db = getFirestore();
      const formularioRef = doc(db, "formularios", formularioId);

      try {
        await deleteDoc(formularioRef);
        console.log("Formulario eliminado correctamente.");

        // Actualizar la lista de formularios después de eliminar uno
        this.recuperarFormularios();
      } catch (error) {
        console.error("Error al eliminar el formulario:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Estilos para el modal */
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  position: relative;
}

.close {
  color: #aaa;
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>

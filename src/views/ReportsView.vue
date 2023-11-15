<template>
  <div>
    <h2 class="tittle-form">Reportes</h2>
    <!-- Listado de formularios -->
    <ul class="form-list">
      <li
        v-for="formulario in formularios"
        :key="formulario.id"
        class="form-item"
      >
        {{ formulario.nombre }}
        <div class="form-buttons">
          <button class="btn-show" @click="verRespuestas(formulario.id)">
            Ver Respuestas
          </button>
          <button class="btn-link" @click="generarEnlace(formulario.id)">
            Generar enlace para responder
          </button>
          <button class="btn-delete" @click="eliminarFormulario(formulario.id)">
            Eliminar Formulario
          </button>
        </div>
      </li>
    </ul>

    <!-- Modal para mostrar el enlace generado -->
    <div class="report-modal" v-if="enlaceModalVisible">
      <div class="report-modal-content">
        <button class="report-modal-close" @click="cerrarModal">Cerrar</button>
        <h3>Enlace para Responder el Formulario:</h3>
        <p>{{ enlaceGenerado }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import "@/styles/styles.css";
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

<template>
  <div>
    <h2>Respuestas del Formulario</h2>
    <table class="responses-table">
      <thead>
        <tr>
          <th>Nombre completo</th>
          <th>Correo electrónico</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in todaData" :key="index">
          <td>{{ data.respuestas[0].respuesta }}</td>
          <td>{{ data.respuestas[1].respuesta }}</td>
          <td>
            <button @click="verDetalles(data)">Ver Detalles</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para mostrar detalles -->
    <div v-if="modalVisible" class="modal">
      <div class="modal-content">
        <!-- Contenido del modal -->
        <h3>Detalles del Formulario</h3>
        <ul>
          <li v-for="(pregunta, index) in data.preguntas" :key="index">
            {{ pregunta.label }} :
            <span v-if="pregunta.tipo === 'archivo'">
              <a :href="data.respuestas[index].respuesta" target="_blank"
                >Ver Archivo</a
              >
            </span>
            <span v-else-if="pregunta.multiple">
              {{ mostrarRespuestasMultiples(data.respuestas[index].respuesta) }}
            </span>
            <span v-else>
              {{ data.respuestas[index].respuesta }}
            </span>
          </li>
        </ul>
        <!-- Botón para cerrar el modal -->
        <button class="close-button" @click="cerrarModal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "@/styles/styles.css";
export default {
  data() {
    return {
      formularioId: null,
      todaData: [],
      modalVisible: false,
      data: null,
    };
  },
  created() {
    // Recuperar formularioId de la ruta
    this.formularioId = this.$route.params.formId;

    // Cargar respuestas del formulario
    this.cargarTodaData();
  },
  methods: {
    async cargarTodaData() {
      const db = getFirestore();
      const respuestasRef = collection(db, "respuestas");
      const q = query(respuestasRef, where("idForm", "==", this.formularioId));

      try {
        const querySnapshot = await getDocs(q);
        this.todaData = querySnapshot.docs.map((doc) => doc.data());
      } catch (error) {
        console.error("Error al cargar respuestas:", error);
      }
    },
    verDetalles(data) {
      // Abrir el modal y mostrar detalles
      this.modalVisible = true;
      this.data = data;
    },
    mostrarRespuestasMultiples(respuestasMultiples) {
      if (Array.isArray(respuestasMultiples)) {
        return respuestasMultiples.join(", ");
      } else {
        return respuestasMultiples;
      }
    },
    cerrarModal() {
      // Cerrar el modal
      this.modalVisible = false;
      this.data = null; // Limpiar los datos después de cerrar el modal
    },
  },
};
</script>

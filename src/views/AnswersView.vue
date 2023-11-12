<template>
  <div>
    <h2>Respuestas del Formulario</h2>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
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
    <div v-if="modalVisible">
      <div>
        <!-- Contenido del modal -->
        <h3>Detalles del Formulario</h3>
        <p>Nombre: {{ data.respuestas[0].respuesta }}</p>
        <p>Correo: {{ data.respuestas[1].respuesta }}</p>
        <ul>
          <li v-for="(pregunta, index) in data.preguntas" :key="index">
            {{ pregunta.label }} : {{ data.respuestas[index].respuesta }}
          </li>
        </ul>
        <!-- Botón para cerrar el modal -->
        <button @click="cerrarModal">Cerrar</button>
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
    cerrarModal() {
      // Cerrar el modal
      this.modalVisible = false;
      this.data = null; // Limpiar los datos después de cerrar el modal
    },
  },
};
</script>

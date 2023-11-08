<template>
  <div>
    <h2>Constructor de Formularios</h2>
    <label>Pregunta:</label>
    <input type="text" v-model="preguntaActual.label" />
    <label>Tipo de Respuesta:</label>
    <select v-model="preguntaActual.tipo">
      <option value="texto">Texto</option>
      <option value="numero">Número</option>
      <option value="archivo">Archivo</option>
      <option value="combobox">Combobox</option>
      <!-- Agrega otros tipos de preguntas según tus necesidades -->
    </select>

    <template v-if="preguntaActual.tipo === 'combobox'">
      <label>Seleccione el tipo de selección:</label>
      <select v-model="preguntaActual.multiple">
        <option value="true">Múltiple</option>
        <option value="false">Única</option>
      </select>
      <label>Opciones:</label>
      <input type="text" v-model="opcion" @keyup.enter="agregarOpcion" />
      <button @click="agregarOpcion">Agregar Opción</button>
      <ul>
        <li v-for="(opcion, index) in preguntaActual.opciones" :key="index">
          {{ opcion.label }}
        </li>
      </ul>
    </template>

    <button @click="agregarPregunta">Agregar Pregunta</button>

    <h3>Vista Previa del Formulario</h3>
    <div v-for="(pregunta, index) in preguntas" :key="index">
      <div>
        <form-field
          :pregunta="pregunta"
          @file-selected="handleFileSelected"
        ></form-field>
        <button @click="eliminarPregunta(index)">Eliminar Pregunta</button>
      </div>
    </div>

    <button @click="guardarFormulario">Guardar Formulario</button>
  </div>
</template>

<script>
import FormField from "@/components/FormField.vue"; // Asegúrate de importar el componente FormField

export default {
  components: {
    FormField,
  },
  data() {
    return {
      preguntaActual: {
        label: "", // Texto de la pregunta
        tipo: "texto", // Tipo de respuesta esperada (por defecto, texto)
        multiple: false, // Para combobox, indica si es selección múltiple o única
        opciones: [], // Para combobox, almacena las opciones
      },
      preguntas: [], // Almacena las preguntas y sus tipos
      opcion: "", // Almacena temporalmente las opciones del combobox
    };
  },
  methods: {
    agregarOpcion() {
      // Agregar una nueva opción al combobox
      if (this.opcion.trim() !== "") {
        this.preguntaActual.opciones.push({
          label: this.opcion,
          valor: this.opcion,
        });
        this.opcion = "";
      }
    },
    agregarPregunta() {
      // Agregar la pregunta actual al arreglo de preguntas
      this.preguntas.push({
        label: this.preguntaActual.label,
        tipo: this.preguntaActual.tipo,
        multiple: this.preguntaActual.multiple,
        opciones: this.preguntaActual.opciones,
      });
      // Reiniciar la pregunta actual para agregar una nueva
      this.preguntaActual = {
        label: "",
        tipo: "texto",
        multiple: false,
        opciones: [],
      };
    },
    eliminarPregunta(index) {
      // Eliminar una pregunta del formulario
      this.preguntas.splice(index, 1);
    },
    handleFileSelected(file) {
      // Manejar el archivo seleccionado
      console.log("Archivo seleccionado:", file);
    },
    guardarFormulario() {
      // Enviar preguntas a tu backend
    },
  },
};
</script>

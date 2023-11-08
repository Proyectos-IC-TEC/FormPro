<template>
  <div>
    <label>{{ pregunta.label }}</label>
    <template v-if="pregunta.tipo === 'texto'">
      <input type="text" v-model="respuesta" />
    </template>
    <template v-else-if="pregunta.tipo === 'numero'">
      <input type="number" v-model="respuesta" />
    </template>
    <template v-else-if="pregunta.tipo === 'archivo'">
      <input type="file" @change="onFileChange" />
    </template>
    <template v-else-if="pregunta.tipo === 'combobox'">
      <select v-model="respuesta" :multiple="pregunta.multiple">
        <option
          v-for="(opcion, index) in pregunta.opciones"
          :value="opcion.valor"
          :key="index"
        >
          {{ opcion.label }}
        </option>
      </select>
    </template>
    <!-- Agrega otros tipos de campos según tus necesidades -->
  </div>
</template>

<script>
export default {
  props: {
    pregunta: Object, // Objeto que contiene la pregunta y su tipo
  },
  data() {
    return {
      respuesta: null,
    };
  },
  methods: {
    onFileChange(event) {
      const selectedFile = event.target.files[0];
      // Aquí puedes hacer algo con 'selectedFile', como enviarlo a través de un evento o guardarlo en el estado del componente si es necesario.
      this.$emit("file-selected", selectedFile); // Emitir el evento con el archivo seleccionado
    },
  },
};
</script>

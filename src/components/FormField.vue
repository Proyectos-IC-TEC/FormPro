<template>
  <div class="form-field-container">
    <label class="form-label">{{ pregunta.label }}</label>
    <template v-if="pregunta.tipo === 'texto'">
      <input type="text" class="form-input" @input="onInputChange" @blur="onInputBlur" />
    </template>
    <template v-else-if="pregunta.tipo === 'numero'">
      <input type="number" class="form-input" @input="onInputChange" @blur="onInputBlur" />
    </template>
    <template v-else-if="pregunta.tipo === 'archivo'">
      <input type="file" class="form-file-input" @change="onFileChange" />
    </template>
    <template v-else-if="pregunta.tipo === 'combobox'">
      <select class="form-select" @change="onComboboxChange" :multiple="pregunta.multiple">
        <option v-for="(opcion, index) in pregunta.opciones" :value="opcion.valor" :key="index">
          {{ opcion.label }}
        </option>
      </select>
    </template>
  </div>
</template>

<script>
import "../components/styles.css";
export default {
  props: {
    pregunta: Object,
  },
  data() {
    return {
      respuesta: null,
      entradaCompletada: false,
    };
  },
  methods: {
    onInputChange(event) {
      this.respuesta = event.target.value;
      this.entradaCompletada = false;
    },
    onInputBlur() {
      this.entradaCompletada = true;
      if (this.entradaCompletada) {
        this.$emit("respuesta-cambiada", this.respuesta);
      }
    },
    onFileChange(event) {
      const selectedFile = event.target.files[0];
      this.$emit("file-selected", selectedFile);
    },
    onComboboxChange(event) {
      // Si es un combobox de selección única
      if (!this.pregunta.multiple) {
        this.respuesta = event.target.value;
        this.$emit("respuesta-cambiada", this.respuesta);
      } else {
        // Si es un combobox de selección múltiple, obtenemos las opciones seleccionadas
        const selectedOptions = Array.from(event.target.selectedOptions).map(
          (option) => option.value
        );
        this.respuesta = selectedOptions;
        this.$emit("respuesta-cambiada", this.respuesta);
      }
    },
  },
};
</script>

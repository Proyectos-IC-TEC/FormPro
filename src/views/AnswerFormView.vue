<template>
  <div v-if="formData">
    <h2>Responder Formulario</h2>
    <p><strong>Nombre del Formulario:</strong> {{ formData.nombre }}</p>
    <div>
      <form-field
        ref="formFieldComponent"
        v-for="(pregunta, index) in formData.preguntas"
        :key="index"
        :pregunta="pregunta"
        @respuesta-cambiada="guardarRespuesta(index, $event)"
        @file-selected="guardarArchivo(index, $event)"
      ></form-field>
      <br />
    </div>
    <hr />
    <button :disabled="!formCompletado" @click="enviarForm">Enviar</button>
  </div>
</template>

<script>
import FormField from "@/components/FormField.vue"; // Asegúrate de importar el componente FormField
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
  components: {
    FormField,
  },

  props: {
    formId: String,
    pregunta: Object,
  },

  data() {
    return {
      formData: null, // Almacena los datos del formulario obtenidos desde Firebase
      respuestas: [], // Array para almacenar las respuestas
      formCompletado: false,
    };
  },

  created() {
    this.$store
      .dispatch("logout")
      .then(() => {
        this.$router.push(`/answer-form/${this.formId}`);
      })
      .catch((error) => {
        console.error("Error al cerrar sesión para llenar form", error.message);
      });
  },

  mounted() {
    this.traerFormulario();
  },

  methods: {
    traerFormulario() {
      // Realiza la consulta a Firebase para obtener los datos del formulario
      const db = getFirestore();
      const formularioRef = doc(db, "formularios", this.formId);

      getDoc(formularioRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            // Si el formulario existe en Firebase, almacena los datos en formData
            this.formData = docSnap.data();
          } else {
            // Si el formulario no existe, puedes redirigir al usuario a una página de error o mostrar un mensaje adecuado
            console.error("El formulario no existe.");
          }
        })
        .catch((error) => {
          // Maneja los errores de consulta a Firebase
          console.error("Error al obtener el formulario:", error);
        });
    },

    guardarRespuesta(index, respuesta) {
      // Almacena la respuesta en el array de respuestas
      this.respuestas[index] = { pregunta: index, respuesta };
      let todosDefinidos = true;
      if (this.formData.preguntas.length === this.respuestas.length) {
        for (let i = 0; i < this.respuestas.length; i++) {
          if (this.respuestas[i] === undefined) {
            todosDefinidos = false;
            break;
          }
        }
        if (todosDefinidos) {
          this.formCompletado = true;
        } else {
          this.formCompletado = false;
        }
      } else {
        this.formCompletado = false;
      }
    },

    async guardarArchivo(index, file) {
      // lógica para almacenar archivo en storage
      if (file) {
        try {
          const storage = getStorage();
          const storageRef = ref(storage, `files/${file.name}`);

          await uploadBytes(storageRef, file);

          const downloadURL = await getDownloadURL(storageRef);

          if (downloadURL) {
            window.alert("¡Archivo subido exitosamente!");
            this.respuestas[index] = {
              pregunta: index,
              resultado: downloadURL,
            };
            let todosDefinidos = true;
            if (this.formData.preguntas.length === this.respuestas.length) {
              for (let i = 0; i < this.respuestas.length; i++) {
                if (this.respuestas[i] === undefined) {
                  todosDefinidos = false;
                  break;
                }
              }
              if (todosDefinidos) {
                this.formCompletado = true;
              } else {
                this.formCompletado = false;
              }
            } else {
              this.formCompletado = false;
            }
          } else {
            this.formCompletado = false;
          }
        } catch (error) {
          console.error(
            "Error al subir el archivo o al obtener la URL de descarga:",
            error
          );
          throw error;
        }
      } else {
        console.log("No seleccionó archivo para subir");
      }
    },

    enviarForm() {
      if (this.formCompletado) {
        // Copia el formData y agrega los atributos de respuesta y ID del formulario
        const respuestasData = {
          ...this.formData,
          respuestas: this.respuestas,
          idForm: this.formId,
        };

        const db = getFirestore();
        const respuestasCollectionRef = collection(db, "respuestas");
        console.log("Data de la respuesta", respuestasData);
        addDoc(respuestasCollectionRef, respuestasData)
          .then(() => {
            window.alert("¡Respuesta enviada correctamente!");
            // Puedes redirigir al usuario a una página de éxito o realizar otras acciones después de enviar las respuestas
            window.location.reload();
          })
          .catch((error) => {
            console.error("Error al enviar respuestas a Firestore:", error);
          });
      } else {
        window.alert("¡Error, El form no esta completo");
      }
    },
  },
};
</script>

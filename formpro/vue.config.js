const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./", // Ajusta esto según tu configuración
  productionSourceMap: false, // Desactiva los mapas de origen en producción
  pwa: {
    name: "Mi Aplicación", // Cambia el nombre a tu aplicación
    themeColor: "#4DBA87", // Cambia el color del tema
    msTileColor: "#000000", // Color de la barra de tareas de Windows
    appleMobileWebAppCapable: "yes", // Habilita la instalación en dispositivos iOS
    appleMobileWebAppStatusBarStyle: "black", // Estilo de la barra de estado en iOS

    // Configura el modo del complemento Workbox
    workboxPluginMode: "InjectManifest", // 'GenerateSW' o 'InjectManifest'

    workboxOptions: {
      // swSrc es obligatorio en el modo InjectManifest
      swSrc: "src/registerServiceWorker.js", // Ruta al archivo Service Worker personalizado

      // ...otras opciones de Workbox...
    },
  },
});

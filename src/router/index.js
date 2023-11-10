import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import ReportsView from "@/views/ReportsView.vue";
import FormBuilderView from "@/views/FormBuilderView.vue";
import AnswerFormView from "@/views/AnswerFormView.vue";
import app from "@/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth(app);
const routes = [
  {
    path: "/",
    name: "Root",
    beforeEnter: (to, from, next) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          next("/reports");
        } else {
          next("/login");
        }
        unsubscribe();
      });
    },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "/reports",
    name: "Reports",
    component: ReportsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/form-builder",
    name: "FormBuilder",
    component: FormBuilderView,
    meta: { requiresAuth: true },
  },
  {
    path: "/answer-form/:formId",
    name: "AnswerFormView",
    component: AnswerFormView,
    props: true,
    meta: { requiresAuth: false },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth) {
    // Verifica el estado de autenticación del usuario usando onAuthStateChanged
    await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        // Si el usuario está autenticado, permite el acceso a la ruta protegida
        if (user) {
          unsubscribe(); // Deja de escuchar cambios de autenticación
          resolve();
        } else {
          // Si el usuario no está autenticado, redirige al usuario a la página de login
          next("/");
        }
      });
    });
  }

  // Si la ruta no requiere autenticación, permite el acceso directamente
  next();
});

export default router;

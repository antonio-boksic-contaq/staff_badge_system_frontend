import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

const routes = [
  // CUSTOM PAGES
  //home
  // END CUSTOM PAGES

  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: {
      authRequired: false,
      roles: [],
      title: "Login",
    },
  },
    {
    path: "/home",
    name: "home",
    component: () => import("@/views/home/HomeView.vue"),
    meta: {
      authRequired: true,
      roles: ["Admin","Staff"],
      title: "Home",
    },
  },
    {
    path: "/calendario-startup",
    name: "calendario-startup",
    component: () => import("@/views/home/CalendarView.vue"),
    meta: {
      authRequired: true,
      roles: ["Admin","Staff"],
      title: "Calendario startup",
    },
  },    
  {
    path: "/calendario",
    name: "calendario",
    component: () => import("@/views/home/CalendarView.vue"),
    meta: {
      authRequired: true,
      roles: ["Admin","Staff"],
      title: "Calendario",
    },
  },
  //   {
  //   path: "/staff-overview",
  //   name: "staff-overview",
  //   component: () => import("@/views/home/StaffOverviewView.vue"),
  //   meta: {
  //     authRequired: true,
  //     roles: ["Admin"],
  //     title: "Staff Overview",
  //   },
  // },
  {
    path: "/utenti",
    name: "utenti",
    component: () => import("@/views/home/UsersView.vue"),
    meta: {
      authRequired: true,
      roles: ["Admin"],
      title: "Utenti",
    },
  },
    {
    path: "/timbrature-da-convalidare",
    name: "timbrature-da-convalidare",
    component: () => import("@/views/home/PunchesToConvalidateView.vue"),
    meta: {
      authRequired: true,
      roles: ["Admin"],
      title: "Timbrature Da Convalidare",
    },
  },
    {
    path: "/impostazioni-profilo",
    name: "impostazioni-profilo",
    component: () => import("@/views/home/SettingsView.vue"),
    meta: {
      authRequired: true,
      roles: ["Admin","Staff"],
      title: "Impostazioni Profilo",
    },
  },
  {
    path: "/recupera-password",
    name: "recupera-password",
    component: () => import("@/views/auth/PasswordRecoveryView.vue"),
    meta: {
      authRequired: false,
      roles: [],
      title: "Recupera password",
    },
  },
  {
    path: "/non-autorizzato",
    name: "non-autorizzato",
    component: () => import("@/views/auth/UnauthorizedView.vue"),
    meta: {
      authRequired: false,
      roles: [],
      title: "Non autorizzato",
    },
  },
  {
  path: '/',
  name: 'root-redirect',
  beforeEnter: (to, from, next) => {
    const authStore = useAuthStore();
    if (authStore.isLoggedIn) {
      next('/calendario');
    } else {
      next('/login');
    }
  },
  meta: {
    title: "Redirect"
  }
}
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0,
      left: 0,
      behavior: "smooth",
    };
  },
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  document.title = "Timbrature Ayvens - " + to.meta.title;
  if (to.meta.authRequired === true) {
    if (authStore.isLoggedIn === false) router.push("/login");
    if (to.meta.roles.includes(authStore.user.role)) return next();
    router.push("/non-autorizzato");
  } else {
    return next();
  }
});

export default router;

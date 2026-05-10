/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { ref } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
    if (
        err?.message?.includes?.("Failed to fetch dynamically imported module")
    ) {
        if (localStorage.getItem("vuetify:dynamic-reload")) {
            console.error(
                "Dynamic import error, reloading page did not fix it",
                err,
            );
        } else {
            console.log("Reloading page to fix dynamic import error");
            localStorage.setItem("vuetify:dynamic-reload", "true");
            location.assign(to.fullPath);
        }
    } else {
        console.log(err);
    }
});

router.isReady().then(() => {
    localStorage.removeItem("vuetify:dynamic-reload");
});

const isAuthenticated = ref(localStorage.getItem("authToken") !== null);
router.beforeEach((to, from, next) => {
    isAuthenticated.value = localStorage.getItem("authToken") !== null;
    console.log(
        "Navigating to:",
        localStorage.getItem("authToken"),
        "Authenticated:",
        isAuthenticated.value,
    );

    if (
        to.path !== "/login" &&
        to.path !== "/register" &&
        !isAuthenticated.value
    ) {
        next("/register");
    } else if (
        (to.path === "/login" || to.path === "/register") &&
        isAuthenticated.value
    ) {
        next("/");
    }
    return next();
});

export default router;

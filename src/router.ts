import { createWebHistory, createRouter } from 'vue-router'

import Home from "./pages/Home.vue"
import Login from "./pages/Login.vue"
import Register from "./pages/Register.vue"
import {useAuthStore} from "../store/authStore.ts";
import Profile from "./pages/Profile.vue";
import Dashboard from "./pages/admin/Dashboard.vue";
const routes = [
    // *** USER ROUTES
    {path : '/', component : Home, meta : {requiresAuth : true} },
    {path : '/profile', component : Profile, meta : {requiresAuth : true} },
    {path : '/login', component : Login,  meta : {requiresGuest : true} },
    {path : '/register', component : Register,  meta : {requiresGuest : true} },
    {path : '/chat/:id', component : Home,  meta : {requiresAuth : true}, name : "chat" },
    // *** ADMIN ROUTES

    {path : '/admin/dashboard', component : Dashboard,  meta : {requiresAdmin : true} },
]

export const router = createRouter({
    history : createWebHistory(),
    routes: routes
})



// Navigation guard to protect routes
router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        // Redirect to login if the route requires authentication and the user is not authenticated
        next('/login');
    }
    // @ts-ignore
    else if (to.meta.requiresAdmin && (!authStore.isAuthenticated || authStore.user?.role !== "admin")) {
        console.log(authStore.user)
        next('/unauthorized'); // Redirect to unauthorized page or home
    }
    // Check if the route requires a guest and the user is authenticated
    else if (to.meta.requiresGuest && authStore.isAuthenticated) {
        next('/');
    }
    // Otherwise, proceed to the requested route
    else {
        next();
    }
});
import { createRouter, createWebHistory } from 'vue-router'
import Login from "../templates/Login.vue";
import First from "../templates/First.vue";
import Focus from "../templates/First.vue";
import { authStore } from '../stores/auth';


const routes = [
    {
        path: '/',
        name: 'home',
        meta: { layout: First, 'par': '', 'name': 'Home' },
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/user-login',
        name: 'userLogin',
        meta: { layout: Login, 'par': '', 'name': 'Login' },
        component: () => import('../views/LoginView.vue')
    },
    {
        path: '/user-register',
        name: 'userRegister',
        meta: { layout: Login, 'par': '', 'name': 'Register' },
        component: () => import('../views/RegisterView.vue')
    },
    {
        path: '/user-activation',
        name: 'userActivation',
        meta: { layout: Login, 'par': '', 'name': 'Activation' },
        component: () => import('../views/ActivationView.vue')
    },
    {
        path: "/user-browse",
        name: 'userBrowse',
        meta: { layout: First, 'par': 'User', 'name': 'Browse' },
        component: () => import('../views/UserProfileView.vue')
    },
    {
        path: '/user-profile',
        name: 'userProfile',
        meta: { layout: First, 'par': 'User', 'name': 'Profile' },
        component: () => import('../views/UserProfileView.vue')
    },
    {
        path: '/user-password',
        name: 'userPassword',
        meta: { layout: First, 'par': 'User', 'name': 'Password' },
        component: () => import('../views/UserPasswordView.vue')
    },
    {
        path: '/product-browse',
        name: 'productBrowse',
        meta: { layout: First, 'par': 'Product', 'name': 'Browse' },
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/product-stock',
        name: 'productStock',
        meta: { layout: First, 'par': 'Product', 'name': 'Stock' },
        component: () => import('../views/UserPasswordView.vue')
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach(async to => {
    window.document.title = `Inv - ${to.meta.name}`;
    console.log(`Go to: ${to.name}`);

    const token = window.$cookies.get('token');
    const store = authStore();

    if (to.path === '/user-login') {
        if (token) { router.push('/'); }
    } else if (to.path === '/user-register') {
        if (token) { router.push('/'); }
    } else if (to.path === '/user-activation') {
        if (token) { router.push('/'); }
    } else {
        store.getUser();
    }
});

export default router

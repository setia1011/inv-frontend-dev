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
        component: () => import('../views/UserBrowseView.vue')
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
        component: () => import('../views/ProductBrowseView.vue')
    },
    {
        path: '/product-stock',
        name: 'productStock',
        meta: { layout: First, 'par': 'Product', 'name': 'Stock' },
        component: () => import('../views/ProductStockView.vue')
    },
    {
        path: '/product-category',
        name: 'productCategory',
        meta: { layout: First, 'par': 'Product', 'name': 'Category' },
        component: () => import('../views/ProductCategoryView.vue')
    },
    {
        path: '/product-unit',
        name: 'productUnit',
        meta: { layout: First, 'par': 'Product', 'name': 'Unit' },
        component: () => import('../views/ProductUnitView.vue')
    },
    {
        path: '/buy-transaction',
        name: 'buyTransaction',
        meta: { layout: First, 'par': 'Buy', 'name': 'Transaction' },
        component: () => import('../views/BuyTransactionView.vue')
    },
    {
        path: '/buy-browse',
        name: 'buyBrowse',
        meta: { layout: First, 'par': 'Buy', 'name': 'Browse' },
        component: () => import('../views/BuyBrowseView.vue')
    },
    {
        path: '/buy-summary',
        name: 'buySummary',
        meta: { layout: First, 'par': 'Buy', 'name': 'Summary' },
        component: () => import('../views/BuySummaryView.vue')
    },
    {
        path: '/sell-transaction',
        name: 'sellTransaction',
        meta: { layout: First, 'par': 'Sell', 'name': 'Transaction' },
        component: () => import('../views/SellTransactionView.vue')
    },
    {
        path: '/sell-browse',
        name: 'sellBrowse',
        meta: { layout: First, 'par': 'Sell', 'name': 'Browse' },
        component: () => import('../views/SellBrowseView.vue')
    },
    {
        path: '/sell-summary',
        name: 'sellSummary',
        meta: { layout: First, 'par': 'Sell', 'name': 'Summary' },
        component: () => import('../views/SellSummaryView.vue')
    },
    {
        path: '/report-all',
        name: 'report',
        meta: { layout: First, 'par': 'Report', 'name': 'All' },
        component: () => import('../views/ReportView.vue')
    },
    {
        path: '/report-stock',
        name: 'reportStock',
        meta: { layout: First, 'par': 'Report', 'name': 'Stock' },
        component: () => import('../views/ReportStockView.vue')
    },
    {
        path: '/report-buy',
        name: 'reportBuy',
        meta: { layout: First, 'par': 'Report', 'name': 'Buy' },
        component: () => import('../views/ReportBuyView.vue')
    },
    {
        path: '/report-sell',
        name: 'reportSell',
        meta: { layout: First, 'par': 'Report', 'name': 'Sell' },
        component: () => import('../views/ReportSellView.vue')
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

router.beforeEach(async to => {
    const y5 = to.meta.par ? '-' : ''
    window.document.title = `Inv : ${to.meta.par } ${y5} ${to.meta.name}`;
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

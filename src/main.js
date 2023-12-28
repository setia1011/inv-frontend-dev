// import './assets/main.css'
import '@/assets/libs/fontawesome6/css/all.min.css'
import '@/assets/libs/bulma/bulma.css'
import '@/assets/css/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import { LoadingPlugin } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import PageHeader from "./components/PageHeader.vue"
import {Tabs, Tab} from 'vue3-tabs-component'
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

import * as ConfirmDialog from 'vuejs-confirm-dialog'

import VueCountdown from '@chenfengyuan/vue-countdown';

const app = createApp(App)

app.use(createPinia())
app.use(router)
const toastificationOptions = {}
app.use(Toast, toastificationOptions)
app.use(ConfirmDialog)
app.use(VueAxios, axios)
app.use(VueCookies, { expires: '1d'})
app.use(LoadingPlugin)
app.component('page-header', PageHeader)
app.component(VueCountdown.name, VueCountdown)
app.component('tabs', Tabs)
app.component('tab', Tab)

app.mount('#app')

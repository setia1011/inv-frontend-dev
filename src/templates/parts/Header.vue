<template>
    <loading class="loading" v-model:active="isLoading"
        :can-cancel="false"
        :background-color="'white'"
        :opacity="1"
        :height="25"
        :width="25"
        :z-index="99999"
        :loader="'spinner'"
        :is-full-page="true">
    </loading>
    <div id="header">
        <div class="container has-background-dark is-fluid is-dark p-32x">
            <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
                <div class="navbar-brand">
                    <router-link class="navbar-item" to="/">
                        <img alt="Logo" src="../../assets/images/logo.png" height="28">
                    </router-link>
                    <a role="button" data="1" id="nav1" class="navix navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>
                
                <div class="navbar-menu">
                    <div class="navbar-start">
                        <template v-for="(item, index) in store?.userInfo?.menus" :key="index">
                            <template v-if="Object.keys(item.children).length === 0">
                                <template v-if="item.show == 'true'">
                                    <router-link class="navbar-item" :to="item.to">{{ item.label }}</router-link>
                                </template>
                            </template>
                            <template v-else>
                                <div class="navbar-item has-dropdown is-hoverable">
                                    <div class="navbar-link">{{ item.label }}</div>
                                    <div class="navbar-dropdown">
                                        <template v-for="(i, x) in item.children" :key="x">
                                            <template v-if="i.show == 'true'">
                                                <router-link :to="i.to" class="navbar-item" v-on:click="smClicked($event)">{{ i.label }}</router-link>
                                                <template v-if="i.to == '/product-stock'">
                                                    <hr class="navbar-divider">
                                                </template>
                                            </template>
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </template>
                    </div>
                    
                    <div class="navbar-end">
                        <div class="navbar-item">
                            <div class="buttons">
                                <a class="button is-small has-background-white has-text-dark">
                                    <strong>Hi.. {{ store?.userInfo?.name }}</strong>
                                </a>
                                <span class="button is-small is-outlined is-danger" v-on:click="userExit">
                                    <i class="fa-solid fa-right-from-bracket"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- mobile sidebar -->
                <Sidebar />
            </nav>
        </div>
    </div>
</template>

<script>
import { xaxios, setAuthHeaderX } from "../../utils/xaxios";
import { authStore } from '@/stores/auth';
import Sidebar from './Sidebar.vue';
import Loading from "vue-loading-overlay";

export default {
    name: "Header",
    components: {
        Loading,
        Sidebar
    },
    setup() {
        const store = authStore();
        return { store };
    },
    data() {
        return {
            menus: {},
            isLoading: false
        };
    },
    mounted() {
    },
    methods: {
        userExit: async function () {
            this.store.userExit();
        },
        smClicked: function(e) {
            // console.log(this.$event);
        }
    }
}
</script>
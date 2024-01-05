<template>
    <div id="main" class="container is-max-desktop p-32 mt-5">
        <div class="columns is-mobile m-0 p-0" style="position: fixed; top: 45%; left: 50%; transform: translate(-50%, -50%); -webkit-transform: translate(-50%, -50%); flex: auto; width: 100%;">
            <div class="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-one-third-widescreen is-one-third-fullhd m-auto">
                <div>
                    <figure class="image is-64x64">
                        <img src="../assets/images/logo.png" height="28">
                    </figure>
                </div>
                <div class="mt-6 mb-4 is-size-6"><i class="fa-thin fa-arrow-right-long"></i> Please fill out the form below to register</div>
                <div class="field">
                    <p class="control has-icons-left has-icons-right">
                        <input class="input" type="text" v-model="name" placeholder="Name">
                        <span class="icon is-small is-left">
                            <i class="fa-regular fa-user"></i>
                        </span>
                    </p>
                </div>
                <div class="field">
                    <p class="control has-icons-left has-icons-right">
                        <input class="input" type="text" v-model="username" placeholder="Username">
                        <span class="icon is-small is-left">
                            <i class="fa-regular fa-user-alien"></i>
                        </span>
                        <span class="icon is-small is-right">
                            <i class="fas fa-check"></i>
                        </span>
                    </p>
                </div>
                <div class="field">
                    <p class="control has-icons-left">
                        <input class="input" type="password" v-model="password" placeholder="Password">
                        <span class="icon is-small is-left">
                            <i class="fa-sharp fa-solid fa-key"></i>
                        </span>
                    </p>
                </div>
                <div class="field">
                    <p class="control has-icons-left">
                        <input class="input" type="email" v-model="email" placeholder="Email">
                        <span class="icon is-small is-left">
                            <i class="fa-sharp fa-regular fa-envelope"></i>
                        </span>
                    </p>
                </div>
                <div class="columns">
                    <div class="column is-4 mt-1" style="min-width: 168px;">
                        <button ref="lg" class="button is-info" v-on:click="userRegister">
                            <span>{{ textLogin }}</span>
                        </button>
                        <img v-show="isLoading" src="../assets/images/loading.gif" style="width: 40px; margin-left: 10px;">
                    </div>
                    <div class="column has-text-right">
                        <span class="is-size-6 has-text-danger is-underlined">{{ error }}</span>
                    </div>
                </div>

                <div class="columns">
                    <div class="column">
                        Already have an account? <router-link to="/user-login" class="has-text-weight-bold has-text-link">Login</router-link> or <router-link to="/user-activation" class="has-text-weight-bold has-text-link">Activate</router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="container is-max-desktop">
            <div class="columns is-mobile m-0 p-0" style="position: fixed; bottom: 0; left: 50%; transform: translate(-50%, -50%); -webkit-transform: translate(-50%, -50%); flex: auto; width: 100%;">
                <div class="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-one-third-widescreen is-one-third-fullhd m-auto">
                    <p style="padding-top: 17px; border-top: 1px solid hsl(153deg 9.91% 81.81% / 45%);">by <a href="https://codex.id" target="_blank" class="has-text-info"><u>Codex</u></a></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { authStore } from "@/stores/auth";
import router from "../router";
import cookies from "vue-cookies";
import { xaxios, setAuthHeaderX } from "../utils/xaxios";
export default {
    name: 'Register',
    setup() {
        const store = authStore();
        return { store };
    },
    data() {
        return {
            isLoading: false,
            textLogin: 'Register',
            username: null,
            password: null,
            name: null,
            email: null,
            error: null,
            success: null
        }
    },
    mounted() {
    },
    methods: {
        async userRegister() {
            if (this.name && this.username && this.password && this.email) {
                let lg = this.$refs.lg;
                lg.disabled = true;
                this.isLoading = true;
                await xaxios.post("/user/register", {
                    name: this.name,
                    username: this.username,
                    password: this.password,
                    email: this.email
                }).then((res) => {
                    setTimeout(() => {
                        // if (res.data.access_token) {
                        //     cookies.set('token', res.data.access_token);
                        //     router.push('/');
                        // } 
                        this.error = res.data.detail;
                        lg.disabled = false;
                        this.isLoading = false;
                    }, 300);
                }).catch((err) => {
                    console.log(err);
                    setTimeout(() => {
                        if (err.response.data.detail) {
                            this.error = err.response.data.detail;
                        } else {
                            this.error = "Failed";
                        }
                        
                        // cookies.remove('token');
                        // this.store.userInfo = null;
                        // router.push('/login');
                        lg.disabled = false;
                        this.isLoading = false;
                    }, 300);

                    setTimeout(() => {
                        this.error = null;
                    }, 10000);
                })
            }
        }
    }
}
</script>

<style>
    @media screen and (max-width: 768px) {
        .column.is-three-quarters-mobile {
            flex: none;
            width: 95%;
    }
}

</style>
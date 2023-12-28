import router from "../router";
import cookies from "vue-cookies";
import { defineStore } from "pinia";
import { xaxios, setAuthHeaderX } from "../utils/xaxios";

export const authStore = defineStore("auth", {
    state: () => ({
        userInfo: null
    }),
    getters: {
        getUserInfo: (state) => state.userInfo
    },
    actions: {
        getUser() {
            setAuthHeaderX(cookies.get('token'));
            xaxios.get("/user/info-ex", {
            }).then((res) => {
                this.userInfo = res.data;
                return this.userInfo;
            }).catch((res) => {
                cookies.remove('token');
                cookies.userInfo = null;
                router.push('/user-login');
            })
        },
        async userLogin(username, password) {
            await xaxios.post("/user/login", {
                username: username,
                password: password
            }).then((res) => {
                if (res.data.access_token) {
                    cookies.set('token', res.data.access_token);
                    router.push('/');
                }
            }).catch((res) => {
                cookies.remove('token');
                this.userInfo = null;
                router.push('/user-login');
            })
        },
        async userExit() {
            cookies.remove('token');
            this.userInfo = null;
            router.push('/user-login');
        }
    }
})
<template>
    <div ref="main" id="main" class="container is-fluid mt-5 p-32">
        <page-header></page-header>
        <!-- {{ store.userInfo }} -->
        <div class="columns">
            <div class="column">
                <article class="message is-success is-inline-block">
                    <div class="message-body p-1 pl-2" style="border-width: 0 0 0 2.5px;">
                        Silahkan melakukan update password Anda
                    </div>
                </article>
                <hr class="m-0 mb-4">
                <div class="">
                    <div class="field is-horizontal">
                        <div class="field-label is-normal has-text-left">
                            <label class="label">Current Password</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                            <p class="control">
                                <input class="input" type="text" v-model="c_password">
                            </p>
                            </div>
                        </div>
                    </div>
                    <div class="field is-horizontal">
                        <div class="field-label is-normal has-text-left">
                            <label class="label">New Password</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                            <p class="control">
                                <input class="input" type="text" v-model="n_password">
                            </p>
                            </div>
                        </div>
                    </div>
                    <div class="field is-horizontal">
                        <div class="field-label is-normal has-text-left">
                            <label class="label">New Password (confirm)</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                            <p class="control">
                                <input class="input" type="email" v-model="cn_password">
                            </p>
                            </div>
                        </div>
                    </div>
                    <div class="field is-horizontal">
                        <div class="field-label is-normal has-text-left">
                            <label class="label"></label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                            <p class="control">
                                <span class="button is-info" @click="updatePassword">Save changes</span>
                            </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="column"></div> -->
        </div>
    </div>
</template>

<script>
import _ from 'lodash';
import moment from 'moment-timezone';
import { xaxios } from "../utils/xaxios";
import vSelect from "vue-select";
import { useToast } from "vue-toastification";
import ModalDialog from "@/components/ModalDialog.vue";
import { createConfirmDialog } from 'vuejs-confirm-dialog';
import { authStore } from '@/stores/auth';
export default {
    name: 'PasswordView',
    components: {
      vSelect
   },
    setup() {
        const toast = useToast();
        const store = authStore();
        return { toast, store }
    },
    data() {
        return {
            c_password: null,
            n_password: null,
            cn_password: null
        }
    },
    methods: {
        updatePassword: function() {
            const dialog = createConfirmDialog(ModalDialog);
            dialog.onConfirm(() => {
                this.isConfirmed = true;
                xaxios.patch(`user/password`, {
                    "old_password": this.c_password,
                    "new_password": this.n_password,
                    "confirm_new_password": this.cn_password
                    }).then((r) => {
                    this.toast.success(r.data.detail, {
                        position: "bottom-right",
                        timeout: 5000,
                        closeOnClick: true,
                        pauseOnFocusLoss: true,
                        pauseOnHover: true,
                        draggable: true,
                        draggablePercent: 0.6,
                        showCloseButtonOnHover: false,
                        hideProgressBar: true,
                        closeButton: "button",
                        icon: true,
                        rtl: false
                        }
                    );
                }).catch((r) => {
                    // console.log(r.response.data?.detail);
                    this.toast.error(r.response.data?.detail, {
                        position: "bottom-right",
                        timeout: 5000,
                        closeOnClick: true,
                        pauseOnFocusLoss: true,
                        pauseOnHover: true,
                        draggable: true,
                        draggablePercent: 0.6,
                        showCloseButtonOnHover: false,
                        hideProgressBar: true,
                        closeButton: "button",
                        icon: true,
                        rtl: false
                        }
                    );
                })
            });
            dialog.reveal();
        }
    }
}
</script>
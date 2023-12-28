<template>
    <div ref="main" id="main" class="container is-fluid mt-5 p-32">
        <page-header></page-header>
        <!-- {{ store.userInfo }} -->
        <div class="columns">
            <div class="column">
                <article class="message is-success is-inline-block">
                    <div class="message-body p-1 pl-2" style="border-width: 0 0 0 2.5px;">
                        Pastikan data profile Anda sudah sesuai
                    </div>
                </article>
                <hr class="m-0 mb-4">
                <div class="">
                    <div class="field is-horizontal">
                        <div class="field-label is-normal has-text-left">
                            <label class="label">Username</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                            <p class="control">
                                <input class="input" type="text" v-model="username" readonly disabled>
                            </p>
                            </div>
                        </div>
                    </div>
                    <div class="field is-horizontal">
                        <div class="field-label is-normal has-text-left">
                            <label class="label">Name</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                            <p class="control">
                                <input class="input" type="text" v-model="name">
                            </p>
                            </div>
                        </div>
                    </div>
                    <div class="field is-horizontal">
                        <div class="field-label is-normal has-text-left">
                            <label class="label">ID</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                            <p class="control">
                                <div class="field has-addons">
                                    <p class="control">
                                        <span class="">
                                            <v-select 
                                                class="v-selectx is-uppercase" style="width: 10rem !important;" 
                                                label="id_type"
                                                v-model="id_type" 
                                                :reduce="id_type => id_type.id" 
                                                placeholder="Select ID Type"
                                                @search="getUserIdType"
                                                @update:modelValue="idTypeChanged"
                                                :options="id_types">
                                            </v-select>
                                        </span>
                                    </p>
                                    <p class="control is-expanded">
                                        <input class="input" type="text" v-model="id_number">
                                    </p>
                                </div>
                            </p>
                            </div>
                        </div>
                    </div>
                    <div class="field is-horizontal">
                        <div class="field-label is-normal has-text-left">
                            <label class="label">Phone/WA</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                            <p class="control">
                                <input class="input" type="text" v-model="phone">
                            </p>
                            </div>
                        </div>
                    </div>
                    <div class="field is-horizontal">
                        <div class="field-label is-normal has-text-left">
                            <label class="label">Email</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                            <p class="control">
                                <input class="input" type="email" v-model="email">
                            </p>
                            </div>
                        </div>
                    </div>
                    <div class="field is-horizontal">
                        <div class="field-label is-normal has-text-left">
                            <label class="label">Address</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                            <p class="control">
                                <input class="input" type="text" v-model="address">
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
                                <span class="button is-info" @click="updateProfile">Save changes</span>
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
    name: 'Profile',
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
            id_type: null,
            id_types: [],
            id_number: null,
            username: null,
            name: null,
            email: null,
            phone: null,
            address: null
        }
    },
    mounted() {
        this.id_number = this.store.userInfo?.id_number;
        this.username = this.store.userInfo?.username;
        this.name = this.store.userInfo?.name;
        this.email = this.store.userInfo?.email;
        this.phone = this.store.userInfo?.phone;
        this.address = this.store.userInfo?.address;
        this.getUserIdType();
    },
    methods: {
        getUserIdType: function() {
            xaxios.get(`reference/user-id-type`).then((r) => {
                this.id_types = r.data;
                let y = null;
                this.id_types.forEach((e) => {
                    if (e.id_type === this.store.userInfo?.ref_user_id_type?.id_type) {
                        y = e.id;
                    }
                })
                this.id_type = y;
            })
        },
        idTypeChanged: function(id) {
            this.id_type = id;
        },
        updateProfile: function() {
            const dialog = createConfirmDialog(ModalDialog);
            dialog.onConfirm(() => {
                this.isConfirmed = true;
                xaxios.put(`user/update`, {
                "email": this.email,
                "name": this.name,
                "id_type": this.id_type,
                "id_number": this.id_number,
                "phone": this.phone,
                "address": this.address
                }).then((r) => {
                    this.id_type = r.data.id_type;
                    this.id_number = r.data.id_number;
                    this.name = r.data.name;
                    this.email = r.data.email;
                    this.phone = r.data.phone;
                    this.address = r.data.address;

                    this.toast.success("Successfully update profile", {
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
                    this.toast.error("Failed to update profile", {
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

<style>
@import "vue-select/dist/vue-select.css";

.v-selectx {
   width: 100% !important;
}
.v-select.dropdown {
   width: 450px;
}
.v-select .selected-tag {
   position: absolute;
}
.v-select input.form-control {
   width: 100%;
}
.v-selectx .vs__dropdown-toggle {
    border-radius: 2px 0 0 2px !important;
}
</style>
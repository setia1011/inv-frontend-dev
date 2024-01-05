<template>
   <div ref="main" id="main" class="container is-fluid mt-5 p-32">
      <page-header></page-header>
      <article class="message is-inline-block" :class="[
      {'is-info': col == 'list' },
      {'is-success': col == 'create' }, 
      {'is-warning': col == 'edit'}]">
         <div class="message-body p-1 pl-2 pr-2" style="border-width: 0 0 0 2.5px;">
            {{ colinfo }}
         </div>
      </article>
      <div class="columns">
         <div class="column x-list" v-if="col == 'list'">
            <div class="box is-success is-light title is-size-5 is-underlined p-2 mb-2">
               <div class="field has-addons">
                  <p class="control">
                     <a class="button">
                        <div class="icon is-small is-left" @click="asc = !asc" style="color: hsl(207deg, 61%, 53%);">
                           <i class="fa-solid" :class="[asc === true ? 'fa-arrow-down-wide-short' : 'fa-arrow-up-wide-short']"></i>
                        </div>
                     </a>
                  </p>
                  <p class="control is-expanded">
                     <input class="input" v-model="q" type="text" placeholder=".. nama">
                  </p>
                  <div class="button is-success is-light is-outlined ml-2" @click="changeCol('create')">
                     <span class="icon">
                        <i class="fa-regular fa-circle-plus"></i>
                     </span>
                  </div>
               </div>
            </div>
            <div class="box table-container p-2">
               <table class="table is-narrow mb-3 table-header is-fullwidth">
                  <thead>
                     <tr>
                        <th class="pl-0">No</th>
                        <th>Nama</th>
                        <th>ID</th>
                        <th>Role</th>
                        <th>Alamat</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Terdaftar</th>
                        <th width="90px">Status</th>
                        <th class="pr-0" width="112px"></th>
                     </tr>
                  </thead>
                  <tbody class="is-relative">
                     <loading v-model:active="isListLoading"
                     :can-cancel="false"
                     :background-color="'white'"
                     :opacity="1"
                     :height="25"
                     :width="25"
                     :z-index="25"
                     :loader="'spinner'"
                     :is-full-page="false">
                     </loading>
                     <tr v-for="(i, index) in users" :key="i.id">
                        <td class="pl-0">{{ (page * pageSize) - pageSize + index + 1 }}.</td>
                        <td>{{ i.name }}</td>
                        <td>{{ i.id_number }} <span class="is-uppercase">({{ i.user_id_type?.id_type }})</span></td>
                        <td><span class="tag is-info is-light is-capitalized">{{ i.role?.role.split("_").join(" ") }}</span></td>
                        <td>{{ i.address }}</td>
                        <td>{{ i.email }}</td>
                        <td>{{ i.phone }}</td>
                        <td>{{ dateTimeFormat(i.created_at) }}</td>
                        <td>
                           <span class="tag is-light" :class="[{'is-danger': i.status == 'false'}, {'is-success': i.status == 'true' }]">
                              <template v-if="i.status == 'true'">Aktif</template>
                              <template v-else>Tidak Aktif</template>
                           </span>
                        </td>
                        <td class="pr-0">
                           <div class="tags is-right">
                              <span class="button tag is-warning is-light is-outlined ml-1" style="border-radius: 2px;" v-on:click="changeCol('edit', i.id)">
                                 <span class="icon is-small">
                                    <i class="fa-sharp fa-solid fa-pencil"></i>
                                 </span>
                              </span>
                              <span class="button tag is-danger is-light is-outlined ml-1" style="border-radius: 2px;" v-on:click="delUser(i.id)">
                                 <span class="icon is-small">
                                    <i class="fa-regular fa-trash-can"></i>
                                 </span>
                              </span>
                           </div>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <div class="level">
                  <div class="level-left is-hidden-mobile">
                     <div class="level-item">
                        <div class="button is-small">
                           Page {{ page }}/{{ totalPages }} of {{ totalItems }} total items
                        </div>
                     </div>
                  </div>
                  <div class="level-right">
                     <div class="level-item">
                           <nav class="pagination is-right is-small">
                              <paginate
                              v-model="page"
                              :page-count="totalPages"
                              :page-range="3"
                              :margin-pages="0"
                              :click-handler="clickCallback"
                              :prev-link-class="'pagination-link'"
                              :page-link-class="'pagination-link'"
                              :next-link-class="'pagination-link'"
                              :prev-text="'<i class=\'fa-solid fa-arrow-left\'></i>'"
                              :next-text="'<i class=\'fa-solid fa-arrow-right\'></i>'"
                              :no-li-surround="true"
                              :active-class="'is-current'"
                              :first-last-button="true"
                              :first-button-text="'<i class=\'fa-solid fa-arrow-left-long-to-line\'></i>'"
                              :last-button-text="'<i class=\'fa-solid fa-arrow-right-long-to-line\'></i>'"
                              :hide-prev-next="true"
                              :container-class="'pagination-list'"
                              >
                              </paginate>
                           </nav>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div class="column x-list" v-if="col == 'create' || col == 'edit'">
            <Form :validation-schema="valUser" @submit="createUser">
               <p class="block m-0 mt-1 button is-small is-info is-outlined" style="background-color: transparent; border: none;">
                  <span v-if="isEdit">
                     <span class="has-text-weight-normal"></span>
                  </span>
                  <span v-else>
                     <span class="has-text-weight-normal">
                     </span>
                  </span>
               </p>
               <div class="box button is-small is-dark is-pulled-right mb-2" @click="changeCol('list')">
                  <span class="icon">
                     <i class="fa-regular fa-arrow-left-long"></i>
                  </span>
               </div>
               <div class="is-divider mt-4 mb-2"></div>
               <div class="box pt-0 pl-2 pb-4 pr-2 mb-2">
                  <div class="columns is-multiline is-variable is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd mt-0">
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Username</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_username" v-model="username" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_username" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Password</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_password" v-model="password" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_password" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Nama</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_name" v-model="name" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_name" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Alamat</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="textarea" as="textarea" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_address" v-model="address" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_address" />
                           </p>
                        </div>
                     </div>
                  </div>

                  <hr class="mb-2 mt-0">

                  <div class="columns is-multiline is-variable is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd mt-0">
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Email</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_email" v-model="email" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_email" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Phone</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_phone" v-model="phone" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_phone" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Jenis ID</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <v-select 
                                 class="v-selectx is-uppercase" 
                                 label="id_type"
                                 v-model="id_type" 
                                 :reduce="id_type => id_type.id" 
                                 placeholder="Pilih jenis ID"
                                 @search="getIdTypes"
                                 @update:modelValue="idTypeChanged"
                                 :options="id_types">
                              </v-select>
                              <Field class="input" type="hidden" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_id_type" v-model="id_type" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_id_type" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Nomor ID</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_id_number" v-model="id_number" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_id_number" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Role</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <v-select 
                                 class="v-selectx is-capitalized" 
                                 label="label"
                                 v-model="role_id" 
                                 :reduce="role => role.id" 
                                 placeholder="Pilih role"
                                 @search="getRoles"
                                 @update:modelValue="roleChanged"
                                 :options="roles">
                              </v-select>
                              <Field class="input" type="hidden" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_role_id" v-model="role_id" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_role_id" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Status</label>
                           <div class="field-body is-relative">
                              <loading class="loading" v-model:active="isEditLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <v-select 
                                 class="v-selectx"
                                 label="label"
                                 v-model="status" 
                                 :reduce="label => label.code" 
                                 placeholder="Pilih status"
                                 @update:modelValue="statusChanged"
                                 :options="statuses">
                              </v-select>
                           </div>
                           <Field class="input" type="hidden" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_status" v-model="status" />
                           <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_status" />
                        </div>
                     </div>
                  </div>
               </div>
               <div class="box is-inline-block m-0" style="padding: 2px;">
                  <button class="button is-success" v-if="col == 'create'">Save</button>
                  <button class="button is-warning" v-if="col == 'edit'">Save</button>
               </div>
            </Form>
         </div>
      </div>
   </div>
</template>
 
<script>
import _ from 'lodash';
import moment from "moment";
import * as yup from "yup";
import Loading from "vue-loading-overlay";
import Paginate from "vuejs-paginate-next";
import ModalDialog from "@/components/ModalDialog.vue";
import vSelect from "vue-select";
import { xaxios } from '@/utils/xaxios';
import { useToast } from "vue-toastification";
import { createConfirmDialog } from 'vuejs-confirm-dialog';
import { Form, Field, ErrorMessage } from "vee-validate";
import { toDbDateTime, toDbDate, createMask, destroyMask, formatCurrency } from '../utils/useful';
import { ref } from "vue";

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
export default {
   name: 'UserManage',
   components: {
      Loading, Paginate, Form, Field, ErrorMessage, vSelect, VueDatePicker
   },
   setup() {
      const toast = useToast();
      const valUser = ref(
         yup.object({
            v_username: yup.string().required().label('Username'),
            v_password: yup.string().required().label('Password'),
            v_email: yup.string().required().label('Email'),
            v_name: yup.string().required().label('Nama'),
            v_role_id: yup.number().integer().required().label('Role'),
            v_id_type: yup.number().integer().required().label('Jenis ID'),
            v_id_number: yup.string().required().label('Nomor ID'),
            v_phone: yup.string().required().label('Phone'),
            v_address: yup.string().required().label('Alamat'),
            v_status: yup.string().required().label('Status')
         })
      );
      return { toast, valUser }
   },
   data() {
      return {
         col: 'list',
         colinfo: 'Daftar user',
         q: null,
         order: 'asc',
         asc: true,
         page: 1,
         totalPages: 0,
         pageSize: 5,
         totalItems: null,
         user: null,
         users: [],
         // 
         statuses: [
            { code: "true", label: "Aktif" },
            { code: "false", label: "Tidak Aktif" }
         ],
         // 
         isEdit: false,
         isListLoading: false,
         isEditLoading: false,
         // 
         menus: [],
         roles: [],
         id_types: [],
         // 
         username: null,
         password: null,
         email: null,
         name: null,
         role_id: null,
         id_type: null,
         id_number: null,
         phone: null,
         address: null,
         status: null

      }
   },
   watch: {
      asc: function() {
         if (this.asc) {
            this.order = 'asc';
            this.getUsers();
         } else {
            this.order = 'desc';
            this.getUsers();
         }
      },
      q: _.debounce(function(v) {
         this.q = v;
         this.getUsers();
      }, 500),
   },
   mounted() {
      this.getUsers();
      this.getIdTypes();
      this.getRoles();
   },
   methods: {
      changeCol: function(a, x = null, y = null) {
         this.col = a;
         if (a == 'list') {
            this.colinfo = 'Daftar user';
            this.getUsers();
         }
         if (a == 'create') {
            this.isEdit = false;
            this.colinfo = 'Tambah user';
         }
         if (a == 'edit') {
            this.valUser.fields.v_password = yup.string().nullable().label('Password');
            this.isEdit = true;
            this.colinfo = 'Edit user';
            this.getUser(x);
         }
      },
      dateTimeFormat: function(d) {
         return moment(d).format('DD/MM/YYYY HH:mm:ss');
      },
      dateFormat: function(d) {
         return moment(d).format('DD/MM/YYYY');
      },
      getUsers: function() {
         this.isListLoading = true;
         xaxios.get(`users-px?q=${this.q ? this.q : ''}&page=${this.page}&per_page=${this.pageSize}&order=${this.order}`).then((res) => {
            this.users = res.data.items;
            this.totalPages = res.data.total_pages;
            this.totalItems = res.data.total_items;
            setTimeout(() => {
               this.isListLoading = false;
            }, 500);
         })
      },
      clickCallback: function(pageNum) {
         this.page = pageNum;
         this.getUsers();
      },
      getIdTypes: function(q) {
         xaxios.get(`reference/user-id-type?q=${q ? q : ''}`).then((res) => {
            this.id_types = res.data;
         })
      },
      idTypeChanged: function() {

      },
      getRoles: function(q) {
         xaxios.get(`reference/role?q=${q ? q : ''}`).then((res) => {
            this.roles = res.data;
            this.roles.forEach((e, i) => {
               this.roles[i]['label'] = e.role.split("_").join(" ")
            })
         })
      },
      getUser: function(id) {
         xaxios.get("user/"+id).then((res) => {
            this.user = res.data;
            this.username = this.user.username;
            // this.password: this.user.username;
            this.email = this.user.email;
            this.name = this.user.name;
            this.role_id = this.user.role?.id;
            this.id_type = this.user.user_id_type?.id;
            this.id_number = this.user.id_number;
            this.phone = this.user.phone;
            this.address = this.user.address;
            this.status = this.user.status;
         })
      },
      roleChanged: function() {

      },
      statusChanged: function() {

      },
      createUser: function(f) {
         if (this.col == 'create') {
            xaxios.post("user", {
               username: f['v_username'],
               password: f['v_password'],
               email: f['v_email'],
               name: f['v_name'],
               role_id: f['v_role_id'],
               id_type: f['v_id_type'],
               id_number: f['v_id_number'],
               phone: f['v_phone'],
               address: f['v_address'],
               status: f['v_status']
            }).then((res) => {

            })
         }

         if (this.col == 'edit') {
            xaxios.put("user", {
               username: f['v_username'],
               password: f['v_password'],
               email: f['v_email'],
               name: f['v_name'],
               role_id: f['v_role_id'],
               id_type: f['v_id_type'],
               id_number: f['v_id_number'],
               phone: f['v_phone'],
               address: f['v_address'],
               status: f['v_status']
            }).then((res) => {

            })
         }
      },
      delUser: function(id) {
         const dialog = createConfirmDialog(ModalDialog);
         dialog.onConfirm(() => {
            this.isConfirmed = true;
            xaxios.delete("user/"+id).then((res) => {
               this.toast.success("Berhasil menghapus user", {
                  position: "bottom-right",
                  timeout: 1000,
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
               this.changeCol("list");
               this.getBuys();
            }).catch((err) => {
               this.toast.error("Gagal menghapus user", {
                  position: "bottom-right",
                  timeout: 1000,
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
@import "bulma-extensions/bulma-divider/dist/css/bulma-divider.min.css";
</style>

<style scoped>
.v-selectx {
   width: 100% !important;
}
.table-header > tbody > tr:last-child {
   border-bottom: 1px solid #e4dede !important;
}
.table-header tr th:nth-child(2) {
   background-color: #f1f1e5;
}
.table-header tr td:nth-child(2) {
   background-color: #f0f0f06c;
}
.loading {
   border: 1px solid #cdcdcd;
   border-radius: 4px;
   padding-top: 6px;
   justify-content: left !important;
   padding-left: 12px !important;
}
</style>
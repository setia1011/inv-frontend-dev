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
                     <input class="input" v-model="q" type="text" placeholder=".. perusahaan">
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
                        <th>Perusahaan</th>
                        <th>Alamat</th>
                        <th>Kategori</th>
                        <th>Bank</th>
                        <th>No. Rekening</th>
                        <th>Atas Nama</th>
                        <th>Email</th>
                        <th>Phone/WA</th>
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
                     <tr v-for="(i, index) in suppliers" :key="i.id">
                        <td class="pl-0">{{ (page * pageSize) - pageSize + index + 1 }}.</td>
                        <td>{{ i.company }}</td>
                        <td>{{ i.address }}</td>
                        <td>{{ i.category }}</td>
                        <td>{{ i.bank }}</td>
                        <td>{{ i.bank_account_number }}</td>
                        <td>{{ i.bank_account_name }}</td>
                        <td>{{ i.email }}</td>
                        <td>{{ i.phone }}</td>
                        <td class="pr-0">
                           <div class="tags is-right">
                              <span class="button tag is-warning is-light is-outlined ml-1" style="border-radius: 2px;" v-on:click="changeCol('edit', i.id)">
                                 <span class="icon is-small">
                                    <i class="fa-sharp fa-solid fa-pencil"></i>
                                 </span>
                              </span>
                              <span class="button tag is-danger is-light is-outlined ml-1" style="border-radius: 2px;" v-on:click="del(i.id)">
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
            <Form :validation-schema="valForm" @submit="submitFrom">
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
                           <label class="label">Perusahaan</label>
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
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_company" v-model="company" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_company" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Kategori</label>
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
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_category" v-model="category" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_category" />
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
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-third-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Bank</label>
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
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_bank" v-model="bank" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_bank" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-third-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">No. Rekening</label>
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
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_bank_account_number" v-model="bank_account_number" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_bank_account_number" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-third-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Atas Nama (Rekening)</label>
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
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_bank_account_name" v-model="bank_account_name" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_bank_account_name" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-third-widescreen pb-1 pt-1">
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
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-third-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Phone/WA</label>
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
   name: 'Supplier',
   components: {
      Loading, Paginate, Form, Field, ErrorMessage, vSelect, VueDatePicker
   },
   setup() {
      const toast = useToast();
      const valForm = ref(
         yup.object({
            v_company: yup.string().required().label('Perusahaan'),
            v_category: yup.string().required().label('Kategori'), 
            v_bank: yup.string().required().label('Bank'), 
            v_bank_account_number: yup.string().required().label('No. Rekening'),
            v_bank_account_name: yup.string().required().label('Atas Nama'),
            v_email: yup.string().required().label('Email'),
            v_phone: yup.string().required().label('Phone'), 
            v_address: yup.string().required().label('Alamat')
         })
      );
      return { toast, valForm }
   },
   data() {
      return {
         col: 'list',
         colinfo: 'Daftar supplier',
         q: null,
         order: 'asc',
         asc: true,
         page: 1,
         totalPages: 0,
         pageSize: 5,
         totalItems: null,
         isEdit: false,
         isListLoading: false,
         isEditLoading: false,
         suppliers: null,
         supplier: null,
         id: null,
         // 
         company: null,
         category: null, 
         bank: null, 
         bank_account_number: null,
         bank_account_name: null,
         email: null,
         phone: null, 
         address: null
      }
   },
   watch: {
      asc: function() {
         if (this.asc) {
            this.order = 'asc';
            this.getSuppliers();
         } else {
            this.order = 'desc';
            this.getSuppliers();
         }
      },
      q: _.debounce(function(v) {
         this.q = v;
         this.getSuppliers();
      }, 500),
   },
   mounted() {
      this.getSuppliers();
   },
   methods: {
      changeCol: function(a, x = null, y = null) {
         this.col = a;
         if (a == 'list') {
            this.reset();
            this.colinfo = 'Daftar supplier';
            this.getSuppliers();
         }
         if (a == 'create') {
            this.isEdit = false;
            this.colinfo = 'Tambah supplier';
         }
         if (a == 'edit') {
            this.isEdit = true;
            this.colinfo = 'Edit supplier';
            this.getSupplier(x);
         }
      },
      reset: function() {
         this.company = null;
         this.category = null; 
         this.bank = null; 
         this.bank_account_number = null;
         this.bank_account_name = null;
         this.email = null;
         this.phone = null; 
         this.address = null;
      },
      dateTimeFormat: function(d) {
         return moment(d).format('DD/MM/YYYY HH:mm:ss');
      },
      dateFormat: function(d) {
         return moment(d).format('DD/MM/YYYY');
      },
      getSupplier: function(id) {
         this.isEditLoading = true;
         xaxios.get("inventory/supplier/"+id).then((res) => {
            this.supplier = res.data;
            // 
            this.id = this.supplier.id;
            this.company = this.supplier.company;
            this.category = this.supplier.category; 
            this.bank = this.supplier.bank; 
            this.bank_account_number = this.supplier.bank_account_number;
            this.bank_account_name = this.supplier.bank_account_name;
            this.email = this.supplier.email;
            this.phone = this.supplier.phone; 
            this.address = this.supplier.address;
            setTimeout(() => {
               this.isEditLoading = false;
            }, 500)
         })
      },
      getSuppliers: function() {
         this.isListLoading = true;
         xaxios.get(`inventory/suppliers-px?q=${this.q ? this.q : ''}&page=${this.page}&per_page=${this.pageSize}&order=${this.order}`).then((res) => {
            this.suppliers = res.data.items;
            this.totalPages = res.data.total_pages;
            this.totalItems = res.data.total_items;
            setTimeout(() => {
               this.isListLoading = false;
            }, 500);
         })
      },
      clickPage: function(pageNum) {
         this.page = pageNum;
         this.getSuppliers();
      },
      submitFrom: function(f) {
         if (this.col == 'create') {
            xaxios.post("inventory/supplier", {
               company: f['v_company'],
               category: f['v_category'], 
               bank: f['v_bank'], 
               bank_account_number: f['v_bank_account_number'],
               bank_account_name: f['v_bank_account_name'],
               email: f['v_email'],
               phone: f['v_phone'], 
               address: f['v_address']
            }).then((res) => {
               this.toast.success("Berhasil menambahkan supplier", {
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
               });
               this.changeCol("list");
            }).catch((e) => {
               this.toast.error("Gagal menambahkan supplier", {
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
               });
            })
         }
         if (this.col == 'edit') {
            xaxios.patch("inventory/supplier", {
               id: this.id,
               company: f['v_company'],
               category: f['v_category'], 
               bank: f['v_bank'], 
               bank_account_number: f['v_bank_account_number'],
               bank_account_name: f['v_bank_account_name'],
               email: f['v_email'],
               phone: f['v_phone'], 
               address: f['v_address']
            }).then((res) => {
               this.toast.success("Berhasil edit supplier", {
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
               });
               this.changeCol("list");
            }).catch((e) => {
               this.toast.error("Gagal edit supplier", {
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
               });
            })
         }
      },
      del: function(id) {
         const dialog = createConfirmDialog(ModalDialog);
         dialog.onConfirm(() => {
            this.isConfirmed = true;
            xaxios.delete("inventory/supplier/"+id).then((res) => {
               this.toast.success("Berhasil menghapus supplier", {
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
            }).catch((err) => {
               this.toast.error("Gagal menghapus supplier", {
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
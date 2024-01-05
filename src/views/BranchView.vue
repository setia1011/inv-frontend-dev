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
               <table class="table mb-3 table-header is-fullwidth">
                  <thead>
                     <tr>
                        <th class="pl-0">No</th>
                        <th>Nama</th>
                        <th>Alamat</th>
                        <th>Kepala</th>
                        <th>Email</th>
                        <th>Phone/WA</th>
                        <th>Status</th>
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
                     <tr v-for="(i, index) in branches" :key="i.id">
                        <td class="pl-0">{{ (page * pageSize) - pageSize + index + 1 }}.</td>
                        <td>{{ i.name }}</td>
                        <td>{{ i.address }}</td>
                        <td>{{ i.responsible }}</td>
                        <td>{{ i.email }}</td>
                        <td>{{ i.phone }}</td>
                        <td>{{ i.status }}</td>
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
                              :click-handler="clickPage"
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
                     <div class="column is-full-mobile is-full-tablet is-full-desktop is-full-widescreen pb-1 pt-1">
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
                     <div class="column is-full-mobile is-full-tablet is-full-desktop is-full-widescreen pb-1 pt-1">
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
                              <Field class="textarea" as="textarea" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_address" v-model="address" rows="2" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_address" />
                           </p>
                        </div>
                     </div>
                  </div>
                  <hr class="mb-2 mt-0">
                  <div class="columns is-multiline is-variable is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd mt-0">
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-third-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Status</label>
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
                                 class="v-selectx"
                                 label="label"
                                 v-model="status" 
                                 :reduce="label => label.code" 
                                 placeholder="Pilih status"
                                 @update:modelValue="statusChanged"
                                 :options="statuses">
                              </v-select>
                              <Field class="input" type="hidden" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_status" v-model="status" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_status" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-two-thirds-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Kepala Cabang</label>
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
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_responsible" v-model="responsible" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_responsible" />
                           </p>
                        </div>
                     </div>
                  </div>
                  <hr class="mb-2 mt-0">
                  <div class="columns is-multiline is-variable is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd mt-0">
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-third-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">RT</label>
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
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_rt" v-model="rt" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_rt" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-third-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">RW</label>
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
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_rw" v-model="rw" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_rw" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-third-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Provinsi</label>
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
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_provinsi" v-model="provinsi" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_provinsi" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-third-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Kabupaten</label>
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
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_kabupaten" v-model="kabupaten" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_kabupaten" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-third-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Kecamatan</label>
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
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_kecamatan" v-model="kecamatan" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_kecamatan" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-third-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Kelurahan</label>
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
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_kelurahan" v-model="kelurahan" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_kelurahan" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-third-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Pos</label>
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
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_postcode" v-model="postcode" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_postcode" />
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
                     <div class="column is-full-mobile is-full-tablet is-full-desktop is-full-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Keterangan</label>
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
                              <Field class="textarea" as="textarea" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_info" v-model="info" rows="2" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_info" />
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
   name: 'Branch',
   components: {
      Loading, Paginate, Form, Field, ErrorMessage, vSelect, VueDatePicker
   },
   setup() {
      const toast = useToast();
      const valForm = ref(
         yup.object({
            v_name: yup.string().required().label('Nama'),
            v_status: yup.string().required().label('Status'),
            v_responsible: yup.string().required().label('Kepala Cabang'),
            v_email: yup.string().required().label('Email'),
            v_phone: yup.string().required().label('Phone/WA'),
            v_address: yup.string().required().label('Alamat'),
            v_rt: yup.number().required().label('RT'),
            v_rw: yup.number().required().label('RW'),
            v_kelurahan: yup.string().required().label('Kelurahan'),
            v_kecamatan: yup.string().required().label('Kecamatan'),
            v_kabupaten: yup.string().required().label('Kabupaten'),
            v_provinsi: yup.string().required().label('Provinsi'),
            v_postcode: yup.string().required().label('Pos'),
            v_info: yup.string().nullable().label('Keterangan')
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
         branches: null,
         branch: null,
         id: null,
         // 
         statuses: [
            { code: "aktif", label: "Aktif" },
            { code: "pasif", label: "Pasif" }
         ],
         // 
         name: null,
         status: null,
         responsible: null,
         email: null,
         phone: null,
         address: null,
         rt: null,
         rw: null,
         kelurahan: null,
         kecamatan: null,
         kabupaten: null,
         provinsi: null,
         postcode: null,
         info: null,
      }
   },
   watch: {
      asc: function() {
         if (this.asc) {
            this.order = 'asc';
            this.getBranches();
         } else {
            this.order = 'desc';
            this.getBranches();
         }
      },
      q: _.debounce(function(v) {
         this.q = v;
         this.getBranches();
      }, 500),
   },
   mounted() {
      this.getBranches();
   },
   methods: {
      changeCol: function(a, x = null, y = null) {
         this.col = a;
         if (a == 'list') {
            this.reset();
            this.colinfo = 'Daftar supplier';
            this.getBranches();
         }
         if (a == 'create') {
            this.isEdit = false;
            this.colinfo = 'Tambah supplier';
         }
         if (a == 'edit') {
            this.isEdit = true;
            this.colinfo = 'Edit supplier';
            this.getBranch(x);
         }
      },
      reset: function() {
         this.name = null;
         this.status = null;
         this.responsible = null;
         this.email = null;
         this.phone = null;
         this.address = null;
         this.rt = null;
         this.rw = null;
         this.kelurahan = null;
         this.kecamatan = null;
         this.kabupaten = null;
         this.provinsi = null;
         this.postcode = null;
         this.info = null;
      },
      dateTimeFormat: function(d) {
         return moment(d).format('DD/MM/YYYY HH:mm:ss');
      },
      dateFormat: function(d) {
         return moment(d).format('DD/MM/YYYY');
      },
      getBranch: function(id) {
         this.isEditLoading = true;
         xaxios.get("inventory/branch/"+id).then((res) => {
            this.branch = res.data;
            // 
            this.id = this.branch.id;
            this.name = this.branch.name;
            this.status = this.branch.status;
            this.responsible = this.branch.responsible;
            this.email = this.branch.email;
            this.phone = this.branch.phone;
            this.address = this.branch.address;
            this.rt = this.branch.rt;
            this.rw = this.branch.rw;
            this.kelurahan = this.branch.kelurahan;
            this.kecamatan = this.branch.kecamatan;
            this.kabupaten = this.branch.kabupaten;
            this.provinsi = this.branch.provinsi;
            this.postcode = this.branch.postcode;
            this.info = this.branch.info;
            setTimeout(() => {
               this.isEditLoading = false;
            }, 500)
         })
      },
      getBranches: function() {
         this.isListLoading = true;
         xaxios.get(`inventory/branches-px?q=${this.q ? this.q : ''}&page=${this.page}&per_page=${this.pageSize}&order=${this.order}`).then((res) => {
            this.branches = res.data.items;
            this.totalPages = res.data.total_pages;
            this.totalItems = res.data.total_items;
            setTimeout(() => {
               this.isListLoading = false;
            }, 500);
         })
      },
      clickPage: function(pageNum) {
         this.page = pageNum;
         this.getBranches();
      },
      submitFrom: function(f) {
         console.log(f);
         if (this.col == 'create') {
            xaxios.post("inventory/branch", {
               name: f['v_name'],
               status: f['v_status'],
               responsible: f['v_responsible'],
               email: f['v_email'],
               phone: f['v_phone'],
               address: f['v_address'],
               rt: f['v_rt'],
               rw: f['v_rw'],
               kelurahan: f['v_kelurahan'],
               kecamatan: f['v_kecamatan'],
               kabupaten: f['v_kabupaten'],
               provinsi: f['v_provinsi'],
               postcode: f['v_postcode'],
               info: f['v_info']
            }).then((res) => {
               this.toast.success("Berhasil menambahkan cabang", {
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
               this.toast.error("Gagal menambahkan cabang", {
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
            xaxios.patch("inventory/branch", {
               id: this.id,
               name: f['v_name'],
               status: f['v_status'],
               responsible: f['v_responsible'],
               email: f['v_email'],
               phone: f['v_phone'],
               address: f['v_address'],
               rt: f['v_rt'],
               rw: f['v_rw'],
               kelurahan: f['v_kelurahan'],
               kecamatan: f['v_kecamatan'],
               kabupaten: f['v_kabupaten'],
               provinsi: f['v_provinsi'],
               postcode: f['v_postcode'],
               info: f['v_info']
            }).then((res) => {
               this.toast.success("Berhasil edit cabang", {
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
               this.toast.error("Gagal edit cabang", {
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
            xaxios.delete("inventory/branch/"+id).then((res) => {
               this.toast.success("Berhasil menghapus cabang", {
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
               this.toast.error("Gagal menghapus cabang", {
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
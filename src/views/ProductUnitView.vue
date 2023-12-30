<template>
   <div ref="main" id="main" class="container is-fluid mt-5 p-32">
     <page-header></page-header>
     <article class="message is-success is-inline-block">
         <div class="message-body p-1 pl-2 pr-2" style="border-width: 0 0 0 2.5px;">
            {{ colinfo }}
         </div>
      </article>
      <div class="columns">
         <div class="column is-6 x-list" v-if="colshow == 'list'">
            <div>
               <div class="box is-success is-light title is-size-5 is-underlined p-2 mb-2">
                  <div class="field has-addons">
                     <div class="control has-icons-left">
                        <div class="select">
                           <select v-model="order">
                              <option value="asc">Ascending</option>
                              <option value="desc">Descending</option>
                           </select>
                        </div>
                        <div class="icon is-small is-left" style="color: hsl(207deg, 61%, 53%);">
                           <i class="fa-light" :class="[order === 'asc' ? 'fa-arrow-down-wide-short' : 'fa-arrow-up-wide-short']"></i>
                        </div>
                     </div>
                     <p class="control is-expanded">
                        <input class="input" v-model="q" type="text" placeholder=".. by unit">
                     </p>
                     <div class="button is-success ml-2" @click="changeCol('create')">
                        <span class="icon">
                           <i class="fa-regular fa-circle-plus"></i>
                        </span>
                     </div>
                  </div>
               </div>
               <div class="box p-2">
                  <table class="table is-narrow is-striped is-hoverable mb-3 table-units is-fullwidth">
                     <thead>
                        <tr>
                           <th style="width: 40px;" class="">No</th>
                           <th>Unit</th>
                           <!-- <th>Sub-units</th> -->
                           <th class=""></th>
                        </tr>
                     </thead>
                     <tbody class="is-relative">
                        <loading class="loading" v-model:active="isListLoading"
                        :can-cancel="false"
                        :background-color="'white'"
                        :opacity="1"
                        :height="25"
                        :width="25"
                        :z-index="25"
                        :loader="'spinner'"
                        :is-full-page="false">
                        </loading>
                        <tr v-for="(i, index) in units" :key="i.id">
                           <td class="">{{ (page * pageSize) - pageSize + index + 1 }}.</td>
                           <td><span class="x-text">{{ i.unit }}</span></td>
                           <td class="">
                              <div class="tags is-right">
                                 <span class="button tag is-warning is-light is-outlined" style="border-radius: 2px;" v-on:click="changeCol('edit', i.id)">
                                    <span class="icon is-small">
                                       <i class="fa-regular fa-pencil"></i>
                                    </span>
                                 </span>
                                 <span class="button tag is-danger is-light is-outlined" style="border-radius: 2px;" v-on:click="deleteUnit(i.id)">
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
         </div>
         <div class="column x-create" v-if="colshow == 'create' || colshow == 'edit'">
            <Form :validation-schema="valUnitSchema" @submit="createUnit">
               <p class="block m-0 mt-1 button is-small is-info is-outlined" style="background-color: transparent; border: none;">
                  <span v-if="isEdit">
                     <span class="has-text-weight-normal"></span>
                  </span>
                  <span v-else>
                     <span class="has-text-weight-normal">
                     </span>
                  </span>
               </p>
               <div class="box button is-small is-danger is-light is-pulled-right mb-2" style="//border-radius: 100%;" @click="colshow = 'list'">
                  <span class="icon">
                     <i class="fa-solid fa-times"></i>
                  </span>
               </div>
               <div class="is-divider mt-4 mb-2"></div>
               <div class="box pt-1 pl-2 pr-2 pb-2 mb-2">
                  <div>
                     <div class="field">
                        <label class="label has-text-weight-semibold">Unit</label>
                        <div class="hix control is-relative">
                           <Field as="textarea" class="textarea" rows="2" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_unit" v-model="unit" />
                           <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_unit" />
                        </div>
                     </div>
                  </div>
               </div>
               <div class="box is-inline-block m-0" style="padding: 2px;">
                  <button class="button is-success">Save</button>
               </div>
            </Form>
         </div>
      </div>
   </div>
</template>
 
<script>
import _ from 'lodash';
import * as yup from "yup";
import Loading from "vue-loading-overlay";
import Paginate from "vuejs-paginate-next";
import ModalDialog from "@/components/ModalDialog.vue";
import { xaxios } from '@/utils/xaxios';
import { useToast } from "vue-toastification";
import { createConfirmDialog } from 'vuejs-confirm-dialog';
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref } from "vue";
export default {
   name: 'ProductUnit',
   components: {
      Loading, Paginate, Form, Field, ErrorMessage
   },
   setup() {
      const toast = useToast();

      const valUnitSchema = ref(
         yup.object({
            v_unit: yup.string().required().label('Unit')
         })
      );
      return { toast, valUnitSchema }
   },
   data() {
      return {
         colshow: 'list',
         colinfo: 'List of product units',
         q: null,
         order: 'asc',
         page: 1,
         totalPages: 0,
         pageSize: 5,
         totalItems: null,
         units: [],
         isListLoading: false,
         id: null,
         unit: null,
         isEdit: false,
         unitToEdit: null,
      }
   },
   watch: {
      order: function() {
         this.getProductUnits();
      },
      q: _.debounce(function(v) {
         this.q = v;
         this.getProductUnits();
      }, 500)
   },
   mounted() {
      this.getProductUnits();
   },
   methods: {
      resetUnit: function() {
         this.id = null;
         this.unit = null;
      },
      changeCol: function(a, x = null, y = null) {
         this.colshow = a;
         if (a === 'list') {
            this.resetUnit();
            this.colinfo = "List of product units";
         }
         if (a === 'create') {
            this.resetUnit();
            this.colinfo = "Create a new product unit";
            this.isEdit = false;
         }
         if (a === 'edit') {
            this.resetUnit();
            this.getProductUnit(x);
            this.colinfo = "Edit a product unit";
            this.isEdit = true;
         }
      },
      getProductUnits: function() {
         this.isListLoading = true;
         xaxios.get(`inventory/product-unit?q=${this.q ? this.q : ''}&page=${this.page}&per_page=${this.pageSize}&order=${this.order}`).then((res) => {
            this.units = res.data.items;
            this.totalPages = res.data.total_pages;
            this.totalItems = res.data.total_items;
            setTimeout(() => {
               this.isListLoading = false;
            }, 400);
         })
      },
      clickCallback: function (pageNum) {
         this.page = pageNum;
         this.getProductUnits();
      },
      createUnit: function(f) {
         if (this.colshow == 'create') {
            xaxios.post(`inventory/product-unit`, {
               unit: f['v_unit']
            }).then((res) => {
               this.toast.success("Create data successful", {
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
               this.colshow = 'list';
               this.getProductUnits();
            }).catch((err) => {
               this.toast.error("Create data failed", {
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
         }

         if (this.colshow == 'edit') {
            xaxios.patch(`inventory/product-unit`, {
               id: this.id,
               unit: f['v_unit']
            }).then((res) => {
               this.toast.success("Update data successful", {
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
               this.colshow = 'list';
               this.getProductUnits();
            }).catch((err) => {
               this.toast.error("Update data failed", {
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
         }
      },
      getProductUnit: function(id) {
         xaxios.get(`inventory/product-unit/${id}`).then((res) => {
            this.unitToEdit = res.data;
            this.id = res.data.id;
            this.unit = res.data.unit;
         })
      },
      deleteUnit: function(id) {
         const dialog = createConfirmDialog(ModalDialog);
         dialog.onConfirm(() => {
            this.isConfirmed = true;
            xaxios.delete(`inventory/product-unit/${id}`).then((res) => {
               this.toast.success(res.data.detail, {
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
               if (this.page > 1 && this.units.length == 1) {
                  this.page = this.page - 1;
               }
               this.colshow = 'list';
               this.getProductUnits();
            }).catch((err) => {
               this.toast.error(err.response.data.detail, {
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


<style scoped>
.table-units > tbody > tr:last-child {
   border-bottom: 1px solid #e4dede !important;
}
</style>
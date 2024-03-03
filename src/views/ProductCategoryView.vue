<template>
   <div ref="main" id="main" class="container is-fluid mt-5 p-32">
      <page-header></page-header>
      <article class="message is-success is-inline-block">
         <div class="message-body p-1 pl-2 pr-2" style="border-width: 0 0 0 2.5px;">
            {{ colinfo }}
         </div>
      </article>
      <div class="columns">
         <div class="column x-list" v-if="colshow == 'list'">
            <div>
               <div class="box box-flat is-success is-light title is-size-5 is-underlined p-1 mb-3">
                  <div class="field has-addons">
                     <p class="control">
                        <a class="button">
                           <div class="icon is-small is-left" @click="asc = !asc" style="color: hsl(207deg, 61%, 53%);">
                              <i class="fa-solid" :class="[asc === true ? 'fa-arrow-down-wide-short' : 'fa-arrow-up-wide-short']"></i>
                           </div>
                        </a>
                     </p>
                     <p class="control is-expanded">
                        <input class="input" v-model="qcategory" type="text" placeholder=".. by category">
                     </p>
                     <div class="button is-success is-light is-outlined ml-2" @click="changeCol('create')">
                        <span class="icon">
                           <i class="fa-regular fa-circle-plus"></i>
                        </span>
                     </div>
                  </div>
               </div>
               <div class="box box-flat p-1">
                  <table class="table mb-3 table-categories is-fullwidth">
                     <thead>
                        <tr>
                           <th class="pl-0">No</th>
                           <th>Kategori</th>
                           <th>Sub-kategori</th>
                           <th class="pr-0"></th>
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
                        <tr v-for="(i, index) in categories" :key="i.id">
                           <td class="pl-0">{{ (page * pageSize) - pageSize + index + 1 }}.</td>
                           <td><span class="has-text-grey-dark is-underlined is-clickable x-text" @click="changeCol('edit', i.id)">{{ i.category }} ({{ i.code }}) <i class="fa-light fa-pencil fa-2xs"></i></span></td>
                           <td>
                              <template v-for="j in i.sub_categories" :key="j.id"><span><span @click="changeCol('editsub', i.id, j.id)" class="has-text-grey-dark is-underlined is-clickable x-text">{{ j.sub_category }} ({{ j.code }}) <i class="fa-light fa-pencil fa-2xs"></i></span>, </span></template>
                              <span class="has-text-weight-bold">({{ i.sub_categories && i.sub_categories.length ? i.sub_categories.length : 0 }})</span>
                           </td>
                           <td class="pr-0">
                              <div class="tags is-right">
                                 <span class="button tag is-success is-light is-outlined" style="border-radius: 2px;" v-on:click="changeCol('createsub', i.id)">
                                    <span class="icon is-small">
                                       <i class="fa-sharp fa-solid fa-plus"></i>
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
            <Form :validation-schema="valCategorySchema" @submit="createCategory">
               <p class="block m-0 mt-1 button is-small is-info is-outlined" style="background-color: transparent; border: none;">
                  <span v-if="isEdit">
                     <span class="has-text-weight-normal"></span>
                  </span>
                  <span v-else>
                     <span class="has-text-weight-normal">
                     </span>
                  </span>
               </p>
               <div class="box button is-small is-dark is-pulled-right mb-2" @click="colshow = 'list'">
                  <span class="icon">
                     <i class="fa-regular fa-arrow-left-long"></i>
                  </span>
               </div>
               <div class="is-divider mt-4 mb-2"></div>
               <div class="box box-flat pt-1 pl-2 pr-2 pb-2 mb-2">
                  <div>
                     <div class="field">
                        <label class="label has-text-weight-semibold">Kategori</label>
                        <div class="hix control is-relative">
                           <Field as="textarea" class="textarea" rows="2" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_category" v-model="category" />
                           <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_category" />
                        </div>
                     </div>
                     <div class="field">
                        <label class="label has-text-weight-semibold">Keterangan</label>
                        <div class="hix control is-relative">
                           <Field as="textarea" class="textarea" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" rows="3" name="v_category_description" v-model="category_description" />
                           <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_category_description" />
                        </div>
                     </div>
                  </div>
               </div>
               <div class="box is-inline-block m-0" style="padding: 2px;">
                  <button class="button is-success">Save</button>
               </div>
               <div v-if="colshow == 'edit'" class="box is-inline-block m-0 ml-1" style="padding: 2px;">
                  <div class="button is-danger" @click="deleteCategory">
                     <span class="icon">
                        <i class="fa-regular fa-trash-can"></i>
                     </span>
                  </div>
               </div>
            </Form>
         </div>
         <div class="column x-edit" v-if="colshow == 'createsub' || colshow == 'editsub'">
            <Form :validation-schema="valSubCategorySchema" @submit="createSubCategory">
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
               <div class="box box-flat pt-1 pl-2 pr-2 pb-2 mb-2">
                  <div>
                     <div class="field">
                        <label class="label has-text-weight-semibold">Sub-kategori</label>
                        <div class="hix control is-relative">
                           <Field as="textarea" class="textarea" rows="2" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_sub_category" v-model="sub_category" />
                           <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_sub_category" />
                        </div>
                     </div>
                     <div class="field">
                        <label class="label has-text-weight-semibold">Keterangan</label>
                        <div class="hix control is-relative">
                           <Field as="textarea" class="textarea" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" rows="3" name="v_sub_category_description" v-model="sub_category_description" />
                           <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_sub_category_description" />
                        </div>
                     </div>
                  </div>
               </div>
               <div class="box is-inline-block m-0" style="padding: 2px;">
                  <button class="button is-success">Save</button>
               </div>
               <div v-if="colshow == 'editsub'" class="box is-inline-block m-0 ml-1" style="padding: 2px;">
                  <div class="button is-danger" @click="deleteSubCategory">
                     <span class="icon">
                        <i class="fa-regular fa-trash-can"></i>
                     </span>
                  </div>
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
   name: 'ProductCategory',
   components: {
      Loading, Paginate, Form, Field, ErrorMessage
   },
   setup() {
      const toast = useToast();

      const valCategorySchema = ref(
         yup.object({
            v_category: yup.string().required().label('Kategori'),
            v_category_description: yup.string().required().label('Keterangan')
         })
      );
      const valSubCategorySchema = ref(
         yup.object({
            v_sub_category: yup.string().required().label('Kategori'),
            v_sub_category_description: yup.string().required().label('Keterangan')
         })
      );
      return { toast, valCategorySchema, valSubCategorySchema }
   },
   data() {
      return {
         colshow: 'list',
         colinfo: 'Daftar kategori',
         qcategory: null,
         order: 'asc',
         asc: true,
         page: 1,
         totalPages: 0,
         pageSize: 5,
         totalItems: null,
         categories: [],
         isListLoading: false,
         id: null,
         sid: null,
         category: null,
         category_description: null,
         isEdit: false,
         categoryToEdit: null,
         sub_category: null,
         sub_category_description: null,
      }
   },
   watch: {
      asc: function() {
         if (this.asc) {
            this.order = 'asc';
         } else {
            this.order = 'desc';
         }
      },
      order: function() {
         this.getProductCategories();
      },
      qcategory: _.debounce(function(v) {
         this.qcategory = v;
         this.getProductCategories();
      }, 500)
   },
   mounted() {
      this.getProductCategories();
   },
   methods: {
      resetCategory: function() {
         this.id = null;
         this.category = null;
         this.category_description = null;
      },
      resetSubCategory: function() {
         this.id = null;
         this.sid = null;
         this.sub_category = null;
         this.sub_category_description = null;
      },
      changeCol: function(a, x = null, y = null) {
         this.colshow = a;
         if (a === 'list') {
            this.resetCategory();
            this.resetSubCategory();
            this.colinfo = "Daftar kategori";
         }
         if (a === 'create') {
            this.resetCategory();
            this.resetSubCategory();
            this.colinfo = "Tambah kategori";
            this.isEdit = false;
         }
         if (a === 'edit') {
            this.resetCategory();
            this.resetSubCategory();
            this.getProductCategory(x);
            this.colinfo = "Edit kategori";
            this.isEdit = true;
         }
         if (a === 'createsub') {
            this.resetCategory();
            this.resetSubCategory();
            this.getProductCategory(x);
            this.colinfo = "Tambah sub-kategori";
            this.isEdit = false;
         }
         if (a === 'editsub') {
            this.resetCategory();
            this.resetSubCategory();
            this.sid = y;
            this.getProductCategory(x);
            this.colinfo = "Edit sub-kategori";
            this.isEdit = true;
         }
      },
      getProductCategories: function() {
         this.isListLoading = true;
         xaxios.get(`inventory/product-category-ex?q=${this.qcategory ? this.qcategory : ''}&page=${this.page}&per_page=${this.pageSize}&order=${this.order}`).then((res) => {
            this.categories = res.data.items;
            this.totalPages = res.data.total_pages;
            this.totalItems = res.data.total_items;
            setTimeout(() => {
               this.isListLoading = false;
            }, 400);
         })
      },
      clickCallback: function (pageNum) {
         this.page = pageNum;
         this.getProductCategories();
      },
      createCategory: function(f) {
         if (this.colshow == 'create') {
            xaxios.post(`inventory/product-category`, {
               category: f['v_category'],
               category_description: f['v_category_description']
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
               this.getProductCategories();
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
            xaxios.patch(`inventory/product-category`, {
               id: this.id,
               category: f['v_category'],
               category_description: f['v_category_description']
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
               this.getProductCategories();
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
      getProductCategory: function(id) {
         xaxios.get(`inventory/product-category/${id}`).then((res) => {
            this.categoryToEdit = res.data;
            this.id = res.data.id;
            this.category = res.data.category;
            this.category_description = res.data.category_description;

            res.data.sub_categories.forEach((e) => {
               if (e.id == this.sid) {
                  this.sub_category = e.sub_category;
                  this.sub_category_description = e.sub_category_description;
               }
            });
         })
      },
      deleteCategory: function() {
         const dialog = createConfirmDialog(ModalDialog);
         dialog.onConfirm(() => {
            this.isConfirmed = true;
            xaxios.delete(`inventory/product-category/${this.id}`).then((res) => {
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
               if (this.page > 1 && this.categories.length == 1) {
                  this.page = this.page - 1;
               }
               this.colshow = 'list';
               this.getProductCategories();
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
      },
      createSubCategory: function(f) {
         if (this.colshow == 'createsub') {
            xaxios.post(`inventory/product-sub-category`, {
               category_id: this.id,
               sub_category: f['v_sub_category'],
               sub_category_description: f['v_sub_category_description']
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
               this.getProductCategories();
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

         if (this.colshow == 'editsub') {
            xaxios.patch(`inventory/product-sub-category`, {
               id: this.sid,
               category_id: this.id,
               sub_category: f['v_sub_category'],
               sub_category_description: f['v_sub_category_description']
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
               this.getProductCategories();
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
      deleteSubCategory: function() {
         const dialog = createConfirmDialog(ModalDialog);
         dialog.onConfirm(() => {
            this.isConfirmed = true;
            xaxios.delete(`inventory/product-sub-category/${this.sid}`).then((res) => {
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
               this.colshow = 'list';
               this.getProductCategories();
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
.table-categories > tbody > tr:last-child {
   border-bottom: 1px solid #e4dede !important;
}
/* .table-categories tr th:nth-last-child(-n+2),  */
/* .table-categories tr td:nth-last-child(-n+2) {
   background-color: #f0f0f0;
} */
.table-categories tr th:nth-child(2) {
   background-color: #f1f1e5;
}
.table-categories tr td:nth-child(2) {
   background-color: #f0f0f06c;
}
.x-text:hover {
   color: hsl(348deg, 86%, 61%) !important
}
</style>
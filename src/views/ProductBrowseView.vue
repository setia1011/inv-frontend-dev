<template>
   <div ref="main" id="main" class="container is-fluid mt-5 p-32">
     <page-header></page-header>
     <article class="message is-inline-block" :class="[
      {'is-info': colshow == 'list' },
      {'is-success': colshow == 'header' }, 
      {'is-warning': colshow == 'editheader'}, 
      {'is-info': colshow == 'listx' },
      {'is-success': colshow == 'details' }, 
      {'is-warning': colshow == 'editdetails'}]">
         <div class="message-body p-1 pl-2 pr-2" style="border-width: 0 0 0 2.5px;">
            {{ colinfo }}
         </div>
      </article>
      <div class="columns">
         <div class="column x-list" v-if="colshow == 'list'">
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
                     <input class="input" v-model="q" type="text" placeholder=".. nomor faktur">
                  </p>
                  <div class="button is-success is-light is-outlined ml-2" @click="changeCol('header')">
                     <span class="icon">
                        <i class="fa-regular fa-circle-plus"></i>
                     </span>
                  </div>
               </div>
            </div>
            <div class="box table-container p-2">
               <table class="table is-striped mb-3 table-header is-fullwidth">
                  <thead>
                     <tr>
                        <th class="pl-0">No</th>
                        <th>SKU</th>
                        <th>Kategori</th>
                        <th>Sub Kategori</th>
                        <th>Kode</th>
                        <th>Produk</th>
                        <th>Isi</th>
                        <th>Satuan</th>
                        <th>Harga Beli</th>
                        <th>Margin</th>
                        <th>Harga Jual</th>
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
                     <tr v-for="(i, index) in products" :key="i.id">
                        <td class="pl-0">{{ (page * pageSize) - pageSize + index + 1 }}.</td>
                        <td>{{ i.sku }}</td>
                        <td><span class="is-capitalized">{{ i.product_category?.category }}</span></td>
                        <td><span class="is-capitalized">{{ i.product_sub_category?.sub_category }}</span></td>
                        <td>{{ i.code ? i.code : '-' }}</td>
                        <td>{{ i.product_name }}</td>
                        <td><span class="has-text-weight-bold is-underlined">{{ parseFloat(i.quantity) }}</span></td>
                        <td><span class="is-capitalized">{{ i.unit?.unit }}</span></td>
                        <td><span v-if="i.price_buy">{{ toIdr(i.price_buy) }}</span><span v-else>{{ toIdr(0) }}</span></td>
                        <td>{{ parseFloat(i.margin) }}%</td>
                        <td><span v-if="i.price_sell">{{ toIdr(i.price_sell) }}</span><span v-else>{{ toIdr(0) }}</span></td>
                        <td>
                           <span class="tag" :class="[{'is-danger': i.status == 'false'}, {'is-success': i.status == 'true' }]">
                              <template v-if="i.status == 'true'">Aktif</template>
                              <template v-else>Tidak Aktif</template>
                           </span>
                        </td>
                        <td class="pr-0">
                           <div class="tags is-right">
                              <span class="button tag is-success is-light is-outlined" style="border-radius: 2px;" v-on:click="changeCol('listx', i.id)">
                                 <span class="icon is-small">
                                    <i class="fa-regular fa-table-list"></i>
                                 </span>
                              </span>
                              <span class="button tag is-warning is-light is-outlined ml-1" style="border-radius: 2px;" v-on:click="changeCol('editheader', i.id)">
                                 <span class="icon is-small">
                                    <i class="fa-sharp fa-solid fa-pencil"></i>
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
         <div class="column x-edit" v-if="colshow == 'edit'"></div>
         <div class="column x-listx" v-if="colshow == 'listx'"></div>
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
   name: 'ProductBrowse',
   components: {
      Loading, Paginate, Form, Field, ErrorMessage, vSelect, VueDatePicker
   },
   setup() {
      const toast = useToast();
      const valHeader = ref(
         yup.object({
            v_invoice_number: yup.string().required().label('No. Faktur'),
            v_invoice_date: yup.string().required().label('Tgl. Faktur'),
            v_supplier_id: yup.string().required().label('Supplier'),
            v_weight_kg_total: yup.string().nullable().label('Berat Total'),
            v_shipping_fee: yup.string().nullable().label('Ongkir'),
            v_admin_fee: yup.string().nullable().label('Admin'),
            v_discount: yup.string().nullable().label('Diskon'),
            v_tax: yup.string().nullable().label('PPN'),
            v_price_buy_total: yup.string().nullable().label('Harga Total'),
            v_price_buy_total_final: yup.string().nullable().label('Harga Final'),
            v_orderer_id: yup.string().required().label('Pemesan'),
            v_recipient_id: yup.string().required().label('Penerima'),
            v_status: yup.string().required().label('Status'),
         })
      );
      const valDetails = ref(
         yup.object({
            v_buy_header_id: yup.string().required().label('Faktur'),
            v_product_category_id: yup.string().required().label('Kategori'),
            v_product_sub_category_id: yup.string().required().label('Sub Kategori'),
            v_product_name: yup.string().required().label('Produk'),
            v_quantity: yup.string().required().label('Jumlah'),
            v_unit_id: yup.string().required().label('Satuan'),
            v_price_per_unit: yup.string().required().label('Harga Satuan'),
            v_price_total: yup.string().required().label('Harga Total'),
            v_weight_kg_per_unit: yup.string().nullable().label('Berat (KG)'),
            v_weight_kg_total: yup.string().nullable().label('Berat Total (KG)'),
            v_volume_cm: yup.string().nullable().label('Volume (CM)')
         })
      );
      return { toast, valHeader, valDetails }
   },
   mounted() {
   },
   data() {
      return {
         colshow: 'list',
         colinfo: 'Daftar produk',
         isListLoading: false,
         isEditLoading: false,
         isEdit: false,
         // 
         q: null,
         order: 'asc',
         asc: true,
         page: 1,
         totalPages: 0,
         pageSize: 5,
         totalItems: null,
         // product
         products: [],
         product: null,

         _level: [
            { code: "1", label: "1" },
            { code: "2", label: "2" },
            { code: "3", label: "3" },
            { code: "4", label: "4" }
         ],
         _status: [
            { code: "true", label: "Aktif" },
            { code: "false", label: "Tidak Aktif" },
         ],
         id: null,
         sku: null,
         buy_header_id: null,
         product_category_id: null,
         product_sub_category_id: null,
         code: null,
         product_name: null,
         quantity: null,
         unit_id: null,
         price_buy: null,
         margin: null,
         price_sell: null,
         weight_kg: null,
         volume_cm: null,
         status: null,
         level: null
      }
   },
   mounted() {
      this.getProducts();
   },
   methods: {
      changeCol: function(a, x = null, y = null) {
         this.colshow = a;
         if (a === 'list') {
            this.reset();
            this.colinfo = "Daftar produk";
            this.isEdit = false;
            this.getProducts();
         }
         if (a === 'edit') {
            this.getProduct(x);
            this.colinfo = "Edit produk";
            this.isEdit = true;
         }
         if (a === 'listx') {
            this.getDetails(x);
            this.colinfo = "Detil";
            this.isEdit = false;
         }
      },
      toIdr: function(e) {
         return formatCurrency(e, 'id', 'IDR');
      },
      dateTimeFormat: function(d) {
         return moment(d).format('DD/MM/YYYY HH:mm:ss');
      },
      dateFormat: function(d) {
         return moment(d).format('DD/MM/YYYY');
      },
      getProducts: function() {
         xaxios.get(`inventory/products-px?q=${this.q ? this.q : ''}&page=${this.page}&per_page=${this.pageSize}&order=${this.order}`).then((r) => {
            this.products = r.data.items;
            this.totalPages = r.data.total_pages;
            this.totalItems = r.data.total_items;
         })
      },
      clickCallback: function (pageNum) {
         this.page = pageNum;
         this.getProducts();
      },
      getProduct: function(id) {
         xaxios.get("inventory/product/"+id).then((r) => {
            this.product = r.data;
         })
      },
      getDetails: function(id) {

      }
   }
}
</script>
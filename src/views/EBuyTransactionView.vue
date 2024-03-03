<template>
   <div ref="main" id="main" class="container is-fluid mt-5 p-32">
      <page-header></page-header>
      <article class="message is-inline-block" :class="[
      {'is-info': colshow == 'list' },
      {'is-warning': colshow == 'order'}]">
         <div class="message-body p-1 pl-2 pr-2" style="border-width: 0 0 0 2.5px;">
            {{ colinfo }}
         </div>
      </article>
      <!-- <div class="box p-1 field has-addons sticky-button">
         <div class="control">
               <a class="button is-small p-2 is-dark">
               <i class="fa-light fa-bag-shopping"></i>&nbsp;&nbsp;<span style="font-size: .7rem;">PROSES PESANAN</span>
            </a>
         </div>
         <div class="control">
            <input class="input is-small has-text-weight-bold has-text-centered"  type="text" :value="total_quantity_order" placeholder="0" style="width: 50px;">
         </div>
      </div> -->
      <div class="columns">
         <div class="column x-list" v-if="colshow == 'list'">
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
                     <input class="input" v-model="q" type="text" placeholder=".. nomor faktur">
                  </p>
                  <!-- <div class="button is-success is-light is-outlined ml-2" @click="changeCol('header')">
                     <span class="icon">
                        <i class="fa-regular fa-circle-plus"></i>
                     </span>
                  </div> -->
               </div>
            </div>
            <div class="box box-flat table-container p-1 pb-0 mb-2" style="border-top: none;">
               <table class="table is-striped mb-0 table-header is-fullwidth">
                  <thead>
                     <tr>
                        <th class="pl-0">No</th>
                        <th>Faktur</th>
                        <th>Tanggal</th>
                        <th>Produk</th>
                        <th>Berat</th>
                        <th>Admin</th>
                        <th>Ongkir</th>
                        <th>Harga</th>
                        <th>Diskon</th>
                        <th>Harga Final</th>
                        <th>Pembayaran</th>
                        <th>Status</th>
                        <th width="140px"></th>
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
                     <tr v-for="(i, index) in items" :key="i.id">
                        <td class="pl-0">{{ (page * pageSize) - pageSize + index + 1 }}.</td>
                        <td>{{ i.number }}</td>
                        <td>{{ dateFormat(i.invoice_date) }}</td>
                        <td>{{ i?.items.length }}</td>
                        <td>{{ parseFloat(i.weight_kg_total) }} KG</td>
                        <td><span v-if="i.admin_fee">{{ toIdr(i.admin_fee) }}</span><span v-else>{{ toIdr(0) }}</span></td>
                        <td><span v-if="i.shipping_fee">{{ toIdr(i.shipping_fee) }}</span><span v-else>{{ toIdr(0) }}</span></td>
                        <td><span v-if="i.price_sell_total">{{ toIdr(i.price_sell_total) }}</span><span v-else>{{ toIdr(0) }}</span></td>
                        <td><span>{{ i?.discount ? parseFloat(i?.discount) : '0' }}%</span></td>
                        <td><span v-if="i.price_sell_total_final">{{ toIdr(i.price_sell_total_final) }}</span><span v-else>{{ toIdr(0) }}</span></td>
                        <td><span class="tag is-capitalized" :class="[{'is-info': i.payment_status == 'belum'}, {'is-link': i.payment_status == 'cicil'}, {'is-primary': i.payment_status == 'lunas'}, {'is-warning': i.payment_status == null}]">{{ i?.payment_status ? i?.payment_status : '-' }}</span></td>
                        <td><span class="is-capitalized tag" :class="[{'is-info': i.order_status == 'pesan'}, {'is-link': i.order_status == 'proses'}, {'is-primary': i.order_status == 'kirim'}, {'is-warning': i.order_status == 'terima'}, {'is-success': i.order_status == 'selesai'}]">{{ i.order_status }}</span></td>
                        <td class="pr-0"><span class="is-pulled-right button tag is-light is-outlined is-small is-success" v-on:click="getMyTransaction(i.id)"><i class="fa-regular fa-file-lines"></i></span></td>
                     </tr>
                  </tbody>
               </table>

               <div class="level mt-5">
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
         <div class="column" v-if="colshow == 'details'">
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
            <div class="columns">
               <div class="column">
                  <div class="list is-block">
                     <!-- <div class="list-item is-inline-flex">
                        <div class="list-item-image  m-0 p-0 mr-1" style="width: 90px;">Tanggal<span class="is-pulled-right">:</span></div>
                        <div class="list-item-content m-0 p-0">{{ dateFormat(new Date()) }}</div>
                     </div>
                     <br> -->
                     <div class="list-item is-inline-flex">
                        <div class="list-item-image  m-0 p-0 mr-1" style="width: 90px;">Pemesan<span class="is-pulled-right">:</span></div>
                        <div class="list-item-content m-0 p-0">{{ item?.orderer?.name }}</div>
                     </div>
                     <br>
                     <div class="list-item is-inline-flex">
                        <div class="list-item-image  m-0 p-0 mr-1" style="width: 90px;">Cabang<span class="is-pulled-right">:</span></div>
                        <div class="list-item-content m-0 p-0">{{ item?.branch?.name }} / {{ item?.branch?.responsible }}</div>
                     </div>
                     <br>
                     <div class="list-item is-inline-flex">
                        <div class="list-item-image m-0 p-0 mr-1" style="width: 90px;">Alamat<span class="is-pulled-right">:</span></div>
                        <div class="list-item-content m-0 p-0">{{ item?.branch?.address }}, RT {{ item?.branch?.rt }} RW {{ item?.branch?.rw }}, Kel. {{ item?.branch?.kelurahan }} Kec. {{ item?.branch?.kecamatan }} - {{ item?.branch?.postcode }}</div>
                     </div>
                  </div>
               </div>
            </div>
            <table class="table is-striped mb-0 table-header table-headerx is-fullwidth">
               <thead>
                  <tr>
                     <th class="">No</th>
                     <th>Kategori</th>
                     <th>Kode</th>
                     <th>Produk</th>
                     <th>Berat</th>
                     <th>Jumlah</th>
                     <th>Satuan</th>
                     <th>Harga</th>
                     <th class="pr-0">Total</th>
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
                  <tr v-for="(i, index) in item?.items" :key="i.id">
                     <td class="">{{ (page * pageSize) - pageSize + index + 1 }}.</td>
                     <td>
                        <nav class="breadcrumb is-capitalized" aria-label="breadcrumbs">
                           <ul>
                              <li><a href="#" style="cursor: default !important;">{{ i?.product_category?.category }}</a></li>
                              <li class="is-active"><a href="#" aria-current="page">{{ i?.product_sub_category?.sub_category }}</a></li>
                           </ul>
                        </nav>
                     </td>
                     <td>{{ i.code ? i.code : '-' }}</td>
                     <td>{{ i.product_name }}</td>
                     <td>{{ parseFloat(i.weight_kg) }} KG</td>
                     <td>{{ parseFloat(i.quantity) }}</td>
                     <td><span class="is-capitalized">{{ i?.unit?.unit }}</span></td>
                     <td><span v-if="i.price">{{ toIdr(i.price) }}</span><span v-else>{{ toIdr(0) }}</span></td>
                     <td>{{ toIdr(i.quantity * i.price) }}</td>
                  </tr>
                  <tr style="background-color: rgb(255, 255, 255)" class="tr-extended">
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-white"></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-info-light">Sub-total</td>
                     <td class="has-background-info-light">
                        <span class="h">{{ item?.price_sell_total ? toIdr(item?.price_sell_total) : toIdr(0) }}</span>
                     </td>
                  </tr>
                  <tr style="background-color: rgb(255, 255, 255)" class="tr-extended">
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-white"></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-info-light">Diskon ({{ item?.discount ? parseFloat(item?.discount) : 0 }}%)</td>
                     <td class="has-background-info-light">
                        <span class="has-text-success">{{ ((item?.discount ? parseFloat(item?.discount) : 0) * parseFloat(item?.price_sell_total)) ? toIdr((item?.discount ? parseFloat(item?.discount) : 0) * parseFloat(item?.price_sell_total) * 0.01) : toIdr(0) }}</span>
                     </td>
                  </tr>
                  <tr style="background-color: rgb(255, 255, 255)" class="tr-extended">
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-white"></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-info-light">Admin</td>
                     <td class="has-background-info-light">
                        <span class="h">{{ item?.admin_fee ? toIdr(item?.admin_fee) : toIdr(0) }}</span>
                     </td>
                  </tr>
                  <tr style="background-color: rgb(255, 255, 255)" class="tr-extended">
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-white"></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-info-light">Ongkir</td>
                     <td class="has-background-info-light">
                        <span class="h">{{ item?.shipping_fee ? toIdr(item?.shipping_fee) : toIdr(0) }}</span>
                     </td>
                  </tr>
                  <tr style="background-color: rgb(255, 255, 255)">
                     <td></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-white"></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-info-light">Grand Total</td>
                     <td class="has-background-info-light">
                        <span class="h">{{ item?.price_sell_total_final ? toIdr(item?.price_sell_total_final) : toIdr(0) }}</span>
                     </td>
                  </tr>
               </tbody>
            </table>
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
 import { toDbDateTime, toDbDate, createMask, destroyMask, formatCurrency, formatCurrencyToFloat, toIdDate } from '../utils/useful';
 import { ref } from "vue";
 import VueDatePicker from '@vuepic/vue-datepicker';
 import '@vuepic/vue-datepicker/dist/main.css';
 import { authStore } from '@/stores/auth';
 
 export default {
   name: 'EBuyTransaction',
   components: {
      Loading, Paginate, Form, Field, ErrorMessage, vSelect, VueDatePicker
   },
   setup() {
      const store = authStore();
      const toast = useToast();
      const valProduct = ref(
         yup.object({
         })
      );
      return { store, toast, valProduct }
   },
   data() {
      return {
         colshow: 'list',
         colinfo: 'Faktur',
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

         items: null,
         item: null,
         total_quantity_order: null,
         total_price_order: null,
         total_weight_order: null
      }
   },
   watch: {
      q: _.debounce(function(v) {
         this.q = v;
         this.getMyTransactions();
      }, 500),
      asc: function() {
         if (this.asc) {
            this.order = 'asc';
            this.getMyTransactions();
         } else {
            this.order = 'desc';
            this.getMyTransactions();
         }
      },
   },
   mounted() {
      this.getMyTransactions();
   },
   methods: {
      toIdr: function(e) {
         return formatCurrency(e, 'id', 'IDR');
      },
      currToFloat: function(s) {
         return formatCurrencyToFloat(s);
      },
      dateTimeFormat: function(d) {
         return moment(d).format('DD/MM/YYYY HH:mm:ss');
      },
      dateFormat: function(d) {
         return moment(d).format('DD/MM/YYYY');
      },
      getMyTransaction: function(id) {
         this.colshow = "details";
         xaxios.get(`/inventory/sell-header/${id ? id : null}`).then((r) => {
            this.item = r.data;
         })
      },
      changeCol: function(a, x = null, y = null) {
         this.colshow = a;
         if (a === 'list') {
            this.colinfo = "Faktur";
            this.isEdit = false;
            this.getMyTransactions();
         }
         if (a === 'details') {
            this.colinfo = "Produk";
            this.isEdit = true;
         }
      },
      clickCallback: function (pageNum) {
         this.page = pageNum;
         this.getMyTransactions();
      },
      getMyTransactions: function() {
         xaxios.get(`inventory/sell-headers-px?q=${this.q ? this.q : ''}&page=${this.page}&per_page=${this.pageSize}&order=${this.order}&status=true`).then((r) => {
            this.items = r.data.items;
            this.totalPages = r.data.total_pages;
            this.totalItems = r.data.total_items;
         })
      }
   }
 }
 </script>
 
 <style>
 @import "vue-select/dist/vue-select.css";
 @import "bulma-list/css/bulma-list.css";
 @import "bulma-extensions/bulma-divider/dist/css/bulma-divider.min.css";
 
 .v-edit .vs__dropdown-toggle {
   border: var(--vs-border-width) var(--vs-border-style) hsl(153deg, 53%, 53%) !important;
 }
 </style>
 
 <style scoped>
 
.sticky-button {
   position: fixed;
   right: 0;
   top: 150px;
   z-index: 99999;
}
.list-item {
   padding: .25em 0 .25em 0!important;
   border-bottom: 1px solid #e4dede !important;
}
.list-item:not(:last-child) {
   border-bottom: 1px solid #e4dede !important;
}
.v-selectx {
   width: 100% !important;
}

/* Chrome, Safari, Edge, Opera */
/* input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
-webkit-appearance: none;
margin: 0;
} */

/* Firefox */
/* input[type=number] {
-moz-appearance: textfield;
} */
input[type=number]::-webkit-inner-spin-button {
   opacity: 1;
}

.table-headerx > thead > tr {
   border-top: 1px solid #e4dede !important;
}

.table-header > tbody > tr:last-child {
   border-bottom: 1px solid #e4dede !important;
}
/* .table-header tr th:nth-child(4), .table-header tr th:nth-child(10), .table-header tr th:nth-child(11) {
background-color: #f1f1e5;
}
.table-header tr td:nth-child(4), .table-header tr td:nth-child(10), .table-header tr td:nth-child(11) {
background-color: #f0f0f06c;
} */

.tr-extended td:nth-child(-n+7) {
   border-bottom: 1px dotted hsla(0, 29%, 25%, 0.24);
}

.box {
   //box-shadow: .5px .5px .5px .5px hsl(0deg, 0%, 71%);
}
 </style>
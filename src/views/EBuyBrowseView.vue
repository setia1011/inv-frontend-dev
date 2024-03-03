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
                     <input class="input" v-model="q" type="text" placeholder=".. nama produk">
                  </p>
                  <!-- <div class="button is-success is-light is-outlined ml-2" @click="changeCol('header')">
                     <span class="icon">
                        <i class="fa-regular fa-circle-plus"></i>
                     </span>
                  </div> -->
               </div>
            </div>
            <div class="level mb-2">
               <div class="level-left is-hidden-mobile">
                  <div class="level-item">
                     <div class="button is-small">
                        {{ page }}/{{ totalPages }} - {{ totalItems }}
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
            <div class="box box-flat table-container p-1 pb-0 mb-2">
               <!-- <div class="level">
                  <div class="level-left is-hidden-mobile">
                     <div class="level-item">
                        <div class="button is-small">
                           {{ page }}/{{ totalPages }} - {{ totalItems }}
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
               </div> -->
               <table class="table is-striped mb-0 table-header is-fullwidth">
                  <thead>
                     <tr>
                        <th class="pl-0">No</th>
                        <th>Kategori</th>
                        <th>Kode</th>
                        <th>Produk</th>
                        <th>Satuan</th>
                        <th>Isi</th>
                        <th>Berat</th>
                        <th>Stok</th>
                        <th>Min.</th>
                        <th>Harga</th>
                        <th class="pr-0" width="140px">Pesan</th>
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
                        <td>
                           <nav class="breadcrumb is-capitalized" aria-label="breadcrumbs">
                              <ul>
                                 <li><a href="#" style="cursor: default !important;">{{ i.product_category?.category }}</a></li>
                                 <li class="is-active"><a href="#" aria-current="page">{{ i.product_sub_category?.sub_category }}</a></li>
                              </ul>
                           </nav>
                        </td>
                        <td>{{ i.code ? i.code : '-' }}</td>
                        <td>{{ i.product_name }}</td>
                        <td><span class="is-capitalized">{{ i.unit?.unit }}</span></td>
                        <td><span class="is-capitalized">{{ parseFloat(i.buy_product_hub?.buy_details?.quantity_per_unit) }}</span></td>
                        <td>{{ parseFloat(i.weight_kg) }} KG</td>
                        <td><span class="has-text-weight-semibold">{{ parseFloat(i.quantity) }}</span></td>
                        <td><span>{{ i?.min_buy }}</span></td>
                        <td><span v-if="i.price_sell">{{ toIdr(i.price_sell) }}</span><span v-else>{{ toIdr(0) }}</span></td>
                        <td>
                           <div class="field has-addons is-pulled-right is-block" style="width: 100%;">
                              <p class="control">
                                 <input :disabled="store?.userInfo?.branch_id == null" class="input is-small has-text-centered has-text-weight-bold" ref="item" v-on:change="uItems(i.id)" :product_id="i.id" :buy_product_hub_id="i.buy_product_hub_id" :buy_header_id="i.buy_header_id" :buy_details_id="i?.buy_product_hub?.buy_details_id" :stock="i.quantity" type="number" min="0" :max="parseFloat(i.quantity)" :value="i?.sell_temp ? i?.sell_temp?.quantity : parseFloat(0)">
                              </p>
                           </div>
                        </td>
                     </tr>
                     <tr style="background-color: rgb(255, 255, 255)">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="has-background-white"></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="has-background-info-light"><span class="has-text-weight-semibold">{{ total_price_order ? toIdr(total_price_order) : toIdr(0) }}</span></td>
                        <td class="has-background-info-light">
                           <div class="field has-addons">
                              <div class="control">
                                 <input :disabled="store?.userInfo?.branch_id == null" class="input is-small has-text-weight-bold has-text-centered" type="text" readonly :value="total_quantity_order" placeholder="0" style="width: 115px; padding-right: 24px;">
                              </div>
                           </div>
                        </td>
                     </tr>
                     <!-- <tr style="background-color: rgb(255, 255, 255)">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="has-background-white"></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="has-background-white"></td>
                        <td class="has-background-white">
                           <div class="field is-pulled-right is-block" style="width: 100%;">
                              <div class="control">
                                    <a class="button is-small is-fullwidth is-success is-active is-outlined">
                                    <span style="font-size: .7rem;">CHECKOUT</span>
                                 </a>
                              </div>
                           </div>
                        </td>
                     </tr> -->
                  </tbody>
               </table>
            </div>
            <div class="level">
                  <div class="level-left is-hidden-mobile">
                     <div class="level-item">
                        <div class="icon-text mt-0">
                           <span class="icon has-text-info">
                              <i class="fas fa-info-circle"></i>
                           </span>
                           <span>Hanya user/pengguna dari Kantor Cabang yang bisa melakukan pemesanan</span>
                        </div>
                     </div>
                  </div>
                  <div class="level-right">
                     <div class="level-item">
                        <div class="box p-1 mr-6">
                           <div class="field is-pulled-right is-block" style="width: 100%;">
                              <div class="control">
                                 <a class="button is-small is-fullwidth is-success" :class="[{'is-static': total_quantity_order == null || store?.userInfo?.branch_id == null}, {'is-active': total_quantity_order != null && store?.userInfo?.branch_id != null}]" v-on:click="changeCol('order')">
                                    <span class="" style="font-size: .7rem;">CHECKOUT</span>
                                 </a>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
         </div>
         <div class="column" v-if="colshow == 'order'">
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
                        <div class="list-item-content m-0 p-0">{{ items[0]?.user?.name }}</div>
                     </div>
                     <br>
                     <div class="list-item is-inline-flex">
                        <div class="list-item-image  m-0 p-0 mr-1" style="width: 90px;">Cabang<span class="is-pulled-right">:</span></div>
                        <div class="list-item-content m-0 p-0">{{ items[0]?.user?.branch?.name }} / {{ items[0]?.user?.branch?.responsible }}</div>
                     </div>
                     <br>
                     <div class="list-item is-inline-flex">
                        <div class="list-item-image m-0 p-0 mr-1" style="width: 90px;">Alamat<span class="is-pulled-right">:</span></div>
                        <div class="list-item-content m-0 p-0">{{ items[0]?.user?.branch?.address }}, RT {{ items[0]?.user?.branch?.rt }} RW {{ items[0]?.user?.branch?.rw }}, Kel. {{ items[0]?.user?.branch?.kelurahan }} Kec. {{ items[0]?.user?.branch?.kecamatan }} - {{ items[0]?.user?.branch?.postcode }}</div>
                     </div>
                  </div>
               </div>
            </div>
            <table class="table is-striped mb-0 table-header is-fullwidth">
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
                  <tr v-for="(i, index) in items" :key="i.id">
                     <td class="">{{ (page * pageSize) - pageSize + index + 1 }}.</td>
                     <td>
                        <nav class="breadcrumb is-capitalized" aria-label="breadcrumbs">
                           <ul>
                              <li><a href="#" style="cursor: default !important;">{{ i?.product?.product_category?.category }}</a></li>
                              <li class="is-active"><a href="#" aria-current="page">{{ i?.product?.product_sub_category?.sub_category }}</a></li>
                           </ul>
                        </nav>
                     </td>
                     <td>{{ i.code ? i.code : '-' }}</td>
                     <td>{{ i.product_name }}</td>
                     <td>{{ parseFloat(i.weight_kg) }} KG</td>
                     <td>{{ i.quantity }}</td>
                     <td><span class="is-capitalized">{{ i?.product?.unit?.unit }}</span></td>
                     <td><span v-if="i.price">{{ toIdr(i.price) }}</span><span v-else>{{ toIdr(0) }}</span></td>
                     <td>{{ toIdr(i.quantity * i.price) }}</td>
                  </tr>
                  <tr style="background-color: rgb(255, 255, 255)" class="tr-extended">
                     <td></td>
                     <td></td>
                     <td class="has-background-white"></td>
                     <td class="has-background-white"></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-info-light">Sub-total</td>
                     <td class="has-background-info-light">
                        <span class="h">{{ total_price_order ? toIdr(total_price_order) : toIdr(0) }}</span>
                     </td>
                  </tr>
                  <tr style="background-color: rgb(255, 255, 255)" class="tr-extended">
                     <td></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-white"></td>
                     <td class="has-background-white"></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-info-light">Diskon</td>
                     <td class="has-background-info-light">
                        <span class="h">-</span>
                     </td>
                  </tr>
                  <!-- <tr style="background-color: rgb(255, 255, 255)">
                     <td></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-white"></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-info-light">Berat</td>
                     <td class="has-background-info-light">
                        <span class="h">{{ total_weight_order }} KG</span>
                     </td>
                  </tr> -->
                  <tr style="background-color: rgb(255, 255, 255)" class="tr-extended">
                     <td></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-white"></td>
                     <td class="has-background-white"></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-info-light">Admin</td>
                     <td class="has-background-info-light">
                        <span class="h">-</span>
                     </td>
                  </tr>
                  <tr style="background-color: rgb(255, 255, 255)" class="tr-extended">
                     <td></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-white"></td>
                     <td class="has-background-white"></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-info-light">Ongkir</td>
                     <td class="has-background-info-light">
                        <span class="h">-</span>
                     </td>
                  </tr>
                  <tr style="background-color: rgb(255, 255, 255)">
                     <td></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-white"></td>
                     <td class="has-background-white"></td>
                     <td></td>
                     <td></td>
                     <td class="has-background-info-light">Grand Total</td>
                     <td class="has-background-info-light">
                        <span class="h">{{ total_price_order ? toIdr(total_price_order) : toIdr(0) }}</span>
                     </td>
                  </tr>
               </tbody>
            </table>
            <div class="columns">
               <div class="column">
                  <div class="icon-text mt-2">
                     <span class="icon has-text-info">
                        <i class="fas fa-info-circle"></i>
                     </span>
                     <span>Belum termasuk biaya Admin (handling fee) dan Ongkir</span>
                  </div>
               </div>
               <div class="column">
                  <div class="button is-small is-success mt-2 is-pulled-right" v-on:click="orderx">PROSES PESANAN SEKARANG</div>
               </div>
            </div>
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
import { toDbDateTime, toDbDate, createMask, destroyMask, formatCurrency, formatCurrencyToFloat } from '../utils/useful';
import { ref } from "vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { authStore } from '@/stores/auth';

export default {
   name: 'EBuyBrowse',
   components: {
      Loading, Paginate, Form, Field, ErrorMessage, vSelect, VueDatePicker
   },
   setup() {
      const store = authStore();
      const toast = useToast();
      const valProduct = ref(
         yup.object({
            v_id: yup.string().required().label('Id'),
            v_code: yup.string().required().label('Kode'),
            v_unit_id: yup.string().required().label('Satuan'),
            v_price_buy: yup.string().required().label('Harga Beli'),
            v_margin: yup.string().nullable().label('Margin'),
            v_price_sell: yup.string().required().label('Harga Jual'),
            v_weight_kg: yup.string().label('Berat (KG)'),
            v_volume_cm: yup.string().label('Volume (CM)'),
            v_min_buy: yup.string().nullable().label('Min'),
            v_level: yup.string().nullable().label('Level'),
            v_status: yup.string().label('Status')
         })
      );
      return { store, toast, valProduct }
   },
   data() {
      return {
         colshow: 'list',
         colinfo: 'Produk',
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

         s_items: null,
         items: null,
         total_quantity_order: null,
         total_price_order: null,
         total_weight_order: null
      }
   },
   watch: {
      q: _.debounce(function(v) {
         this.q = v;
         this.getProducts();
      }, 500),
      asc: function() {
         if (this.asc) {
            this.order = 'asc';
            this.getProducts();
         } else {
            this.order = 'desc';
            this.getProducts();
         }
      },
   },
   mounted() {
      this.getProducts();
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
      getSellTemps: function() {
         xaxios.get("/inventory/sell-temp-all").then((r) => {
            this.items = r.data;
         })
      },
      uItems: function(id) {
         let o = false;
         let data = null;
         let el = this.$refs.item;
         el.forEach((e) => {
            if (parseInt(e.getAttribute('product_id')) === parseInt(id)) {
               if (parseFloat(e.value) > parseFloat(e.getAttribute('stock'))) {
                  document.querySelector(`[product_id="${id}"]`).value = e.getAttribute("stock");
                  o = false;
               }
               if (parseFloat(e.value) < 0 || parseFloat(e.value) > parseFloat(e.getAttribute('stock'))) { o = false; } else {
                  data = {
                     "product_id": id,
                     "buy_product_hub_id": parseInt(e.getAttribute("buy_product_hub_id")),
                     "buy_header_id": parseInt(e.getAttribute("buy_header_id")),
                     "buy_details_id": parseInt(e.getAttribute("buy_details_id")),
                     "quantity": parseFloat(e.value)
                  }
                  o = true;
               }
            }
         });
         
         if (o) {
            xaxios.post("/inventory/sell-temp", data).then((r) => {
               this.getProducts();
            })
         } else {
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
         }
      },
      changeCol: function(a, x = null, y = null) {
         this.colshow = a;
         if (a === 'list') {
            // this.reset();
            this.colinfo = "Produk";
            this.isEdit = false;
            this.getProducts();
         }
         if (a === 'order') {
            // this.getProduct(x);
            this.colinfo = "Order";
            this.isEdit = true;
            // this.getProducts();
         }
      },
      getProducts: function() {
         xaxios.get(`inventory/products-px?q=${this.q ? this.q : ''}&page=${this.page}&per_page=${this.pageSize}&order=${this.order}&status=true`).then((r) => {
            let px = r.data.items;
            this.totalPages = r.data.total_pages;
            this.totalItems = r.data.total_items;

            xaxios.get("/inventory/sell-temp-all").then((r) => {
               this.items = r.data;
               if (px && this.items) {
                  this.items.forEach((e) => {
                     px.forEach((f, i) => {
                        if (e.product_id == f.id) {
                           px[i]['sell_temp'] = e;
                        }
                     })
                  })
               }
               this.products = px;
               
               let cx = null;
               let ax = null;
               let bx = null;
               this.items.forEach((e) => {
                  cx += e.quantity;
                  ax += e.price * e.quantity;
                  bx += e.quantity * e.weight_kg;
               });

               this.total_quantity_order = cx;
               this.total_price_order = ax;
               this.total_weight_order = bx;
               // console.log(this.products);
            });
         })
      },
      clickCallback: function (pageNum) {
         this.page = pageNum;
         this.getProducts();
      },
      orderx: function() {
         let i = this.items;
         let ix = [];
         i.forEach((e) => {
            ix.push({
               "sell_header_id": null,
               "product_id": e?.product_id,
               "buy_product_hub_id": e?.buy_product_hub_id,
               "product_category_id": e?.product?.product_category_id,
               "product_sub_category_id": e?.product?.product_sub_category_id,
               "product_name": e?.product_name,
               "sku": e?.sku,
               "code": e?.product?.code,
               "quantity": e?.quantity,
               "unit_id": e?.unit_id,
               "price": e?.price,
               "weight_kg": e?.weight_kg,
               "volume_cm": e?.volume_cm
            })
         });
         let data = {
            "branch_id": i[0]?.user?.branch_id,
            "shipping_fee": null,
            "weight_kg_total": this.total_weight_order,
            "admin_fee": null,
            "discount": null,
            "price_sell_total": this.total_price_order,
            "price_sell_total_final": this.total_price_order,
            "orderer_id": i[0]?.creator,
            "recipient_id": null,
            "full_payment_date": null,
            "payment_status": null,
            "order_status": "pesan",
            "items": ix
         }

         xaxios.post(`/inventory/e-buy`, data).then((r) => {
            this.colshow = "list";
            this.getProducts();
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

.table-header > thead > tr {
   //border-top: 1px solid #e4dede !important;
}.table-header > tbody > tr:last-child {
   //border-bottom: 1px solid #e4dede !important;
}
.table-header tr th:nth-child(4), .table-header tr th:nth-child(10), .table-header tr th:nth-child(11) {
   background-color: #f1f1e5;
}
.table-header tr td:nth-child(4), .table-header tr td:nth-child(10), .table-header tr td:nth-child(11) {
   background-color: #f0f0f06c;
}
.tr-extended td:nth-child(-n+7) {
   border-bottom: 1px dotted hsla(0, 29%, 25%, 0.24);
}
</style>
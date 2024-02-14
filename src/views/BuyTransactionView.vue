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
                        <th>No. Faktur</th>
                        <th>Tgl. Faktur</th>
                        <th>Tgl. Rekam</th>
                        <th>Supplier</th>
                        <th>Penerima</th>
                        <th>Pemesan</th>
                        <th>Total Harga</th>
                        <th>Jml. Produk</th>
                        <th width="90px">Status</th>
                        <th class="pr-0" width="112px"></th>
                     </tr>
                  </thead>
                  <tbody class="is-relative">
                     <loading v-model:active="isHeaderLoading"
                     :can-cancel="false"
                     :background-color="'white'"
                     :opacity="1"
                     :height="25"
                     :width="25"
                     :z-index="25"
                     :loader="'spinner'"
                     :is-full-page="false">
                     </loading>
                     <tr v-for="(i, index) in buy_headers" :key="i.id">
                        <td class="pl-0">{{ (page * pageSize) - pageSize + index + 1 }}.</td>
                        <td>{{ i.invoice_number }}</td>
                        <td>{{ dateFormat(i.invoice_date) }}</td>
                        <td>{{ dateTimeFormat(i.created_at) }}</td>
                        <td>{{ i.supplier.company }}</td>
                        <td>{{ i.recipient.name }}</td>
                        <td>{{ i.orderer.name }}</td>
                        <td><span v-if="i.price_buy_total_final">{{ toIdr(i.price_buy_total_final) }}</span><span v-else>{{ toIdr(0) }}</span></td>
                        <td>{{ i.products?.length }}</td>
                        <td><span class="tag" :class="[{'is-danger': i.status == 'belum'}, {'is-warning': i.status == 'cicil' }, {'is-success': i.status == 'lunas' }]">{{ i.status }}</span></td>
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
                              <span class="button tag is-danger is-light is-outlined ml-1" style="border-radius: 2px;" v-on:click="delHeader(i.id)">
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
         <div class="column x-header" v-if="colshow == 'header' || colshow == 'editheader'">
            <Form :validation-schema="valHeader" @submit="createHeader">
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
                           <label class="label">No. Faktur</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditHeaderLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_invoice_number" v-model="invoice_number" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_invoice_number" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Tgl. Faktur</label>
                           <p class="control is-inline-block is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditHeaderLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <VueDatePicker v-model="invoice_date" :highlight-week-days="[0, 6]" :enable-time-picker="false" :format="'dd/MM/yyyy'" position="left"></VueDatePicker>
                              <Field class="input" type="hidden" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_invoice_date" v-model="invoice_date" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_invoice_date" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Supplier</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditHeaderLoading"
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
                                 label="company"
                                 v-model="supplier_id" 
                                 :reduce="_supplier => _supplier.id" 
                                 placeholder="Pilih Supplier"
                                 @search="getSuppliers"
                                 @update:modelValue="supplierChanged"
                                 :options="_suppliers">
                              </v-select>
                              <Field class="input" type="hidden" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_supplier_id" v-model="supplier_id" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_supplier_id" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Penerima</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditHeaderLoading"
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
                                 label="name"
                                 v-model="recipient_id" 
                                 :reduce="_recipient => _recipient.id" 
                                 placeholder="Pilih Penerima"
                                 @search="getrecipients"
                                 @update:modelValue="recipientChanged"
                                 :options="_recipients">
                              </v-select>
                              <Field class="input" type="hidden" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_recipient_id" v-model="recipient_id" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_recipient_id" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Pemesan</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditHeaderLoading"
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
                                 label="name"
                                 v-model="orderer_id" 
                                 :reduce="_orderer => _orderer.id" 
                                 placeholder="Pilih Pemesan"
                                 @search="getOrderes"
                                 @update:modelValue="ordererChanged"
                                 :options="_orderers">
                              </v-select>
                              <Field class="input" type="hidden" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_orderer_id" v-model="orderer_id" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_orderer_id" />
                           </p>
                        </div>
                     </div>
                  </div>

                  <hr class="mb-3">

                  <div class="columns is-multiline is-variable is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd mt-0">
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Berat Total (KG)</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditHeaderLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" placeholder="0" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_weight_kg_total" v-model="weight_kg_total" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_weight_kg_total" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Ongkir</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditHeaderLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" placeholder="0" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_shipping_fee" v-model="shipping_fee" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_shipping_fee" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Admin</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditHeaderLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" placeholder="0" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_admin_fee" v-model="admin_fee" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_admin_fee" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Diskon</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditHeaderLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" placeholder="0" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_discount" v-model="discount" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_discount" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">PPN</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditHeaderLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" placeholder="0" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_tax" v-model="tax" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_tax" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Harga Total</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditHeaderLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" placeholder="0" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_price_buy_total" v-model="price_buy_total" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_price_buy_total" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Harga Final</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditHeaderLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" placeholder="0" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_price_buy_total_final" v-model="price_buy_total_final" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_price_buy_total_final" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Status</label>
                           <div class="field-body is-relative">
                              <loading class="loading" v-model:active="isEditHeaderLoading"
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
                                 placeholder="Pilih Status"
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
                  <button class="button is-success" v-if="colshow == 'header'">Save</button>
                  <button class="button is-warning" v-if="colshow == 'editheader'">Save</button>
               </div>
            </Form>
         </div>
         <div class="column x-details" v-if="colshow == 'listx'">
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
            <div class="columns mb-0">
               <div class="column is-4 pt-3 pb-0">
                  <div class="field mb-2">
                     <div class="control">
                        <Field class="input" type="hidden" placeholder="0" name="v_buy_header_id" v-model="buy_header_id" />
                        <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_buy_header_id" />
                        <input disabled class="input is-light has-text-dark has-text-weight-bold has-background-white" type="text" :value="buy_header?.invoice_number + '  I  ' + dateFormat(buy_header?.invoice_date)" style="border-style: outset !important;">
                     </div>
                  </div>
                  <div class="field">
                     <div class="control">
                        <Field class="input" type="hidden" placeholder="0" name="v_buy_header_id" v-model="buy_header_id" />
                        <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_buy_header_id" />
                        <input disabled class="input is-light has-text-dark has-text-weight-bold has-background-white" type="text" :value="buy_header?.supplier.company" style="border-style: outset !important;">
                     </div>
                  </div>
               </div>
            </div>
            <div class="is-divider mt-2 mb-2"></div>
            <div class="box is-success is-light title is-size-5 is-underlined p-2 mb-2">
               <div class="field has-addons">
                  <p class="control">
                     <a class="button">
                        <div class="icon is-small is-left" @click="_asc = !_asc" style="color: hsl(207deg, 61%, 53%);">
                           <i class="fa-solid" :class="[_asc === true ? 'fa-arrow-down-wide-short' : 'fa-arrow-up-wide-short']"></i>
                        </div>
                     </a>
                  </p>
                  <p class="control is-expanded">
                     <input class="input" v-model="_q" type="text" placeholder=".. nama produk">
                  </p>
                  <div class="button is-success is-light is-outlined ml-2" @click="changeCol('details', buy_header_id)">
                     <span class="icon">
                        <i class="fa-regular fa-circle-plus"></i>
                     </span>
                  </div>
               </div>
            </div>
            <div class="box p-2 table-container">
               <table class="table is-narrow is-striped mb-3 table-header is-fullwidth">
                  <thead>
                     <tr>
                        <th class="pl-0">No</th>
                        <th>Produk</th>
                        <th>Kategori</th>
                        <th>Sub Kategori</th>
                        <th>Jumlah</th>
                        <th>Satuan</th>
                        <th>Isi</th>
                        <th>Harga Total</th>
                        <!-- <th>Berat Satuan (KG)</th> -->
                        <th>Berat Total (KG)</th>
                        <th>Volume (CM)</th>
                        <th class="pr-0"></th>
                     </tr>
                  </thead>
                  <tbody class="is-relative">
                     <loading v-model:active="isDetailsLoading"
                     :can-cancel="false"
                     :background-color="'white'"
                     :opacity="1"
                     :height="25"
                     :width="25"
                     :z-index="25"
                     :loader="'spinner'"
                     :is-full-page="false">
                     </loading>
                     <tr v-for="(i, index) in buy_details" :key="i.id">
                        <td class="pl-0">{{ (page * pageSize) - pageSize + index + 1 }}.</td>
                        <td>{{ i.product_name }}</td>
                        <td>{{ i.product_category?.category }}</td>
                        <td>{{ i.product_sub_category?.sub_category }}</td>
                        <td>{{ parseFloat(i.quantity) }}</td>
                        <td>{{ i.unit?.unit }}</td>
                        <td>{{ parseFloat(i.quantity_per_unit) }}</td>
                        <td><span v-if="i.price_total">{{ toIdr(i.price_total) }}</span><span v-else>{{ toIdr(0) }}</span></td>
                        <!-- <td>{{ i.weight_kg_per_unit }}</td> -->
                        <td>{{ parseFloat(i.weight_kg_total) }}</td>
                        <td>{{  i.volume_cm }}</td>
                        <td class="pr-0">
                           <div class="tags is-right">
                              <span class="button tag is-warning is-light is-outlined" style="border-radius: 2px;" v-on:click="changeCol('editdetails', i.id)">
                                 <span class="icon is-small">
                                    <i class="fa-sharp fa-solid fa-pencil"></i>
                                 </span>
                              </span>
                              <span class="button tag is-danger is-light is-outlined ml-1" style="border-radius: 2px;" v-on:click="delDetails(i.id)">
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
                           Page {{ _page }}/{{ _totalPages }} of {{ _totalItems }} total items
                        </div>
                     </div>
                  </div>
                  <div class="level-right">
                     <div class="level-item">
                           <nav class="pagination is-right is-small">
                              <paginate
                              v-model="_page"
                              :page-count="_totalPages"
                              :page-range="3"
                              :margin-pages="0"
                              :click-handler="_clickCallback"
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
         <div class="column x-details" v-if="colshow == 'details' || colshow == 'editdetails'">
            <Form :validation-schema="valDetails" @submit="createDetails">
               <p class="block m-0 mt-1 button is-small is-info is-outlined" style="background-color: transparent; border: none;">
                  <span v-if="isEdit">
                     <span class="has-text-weight-normal"></span>
                  </span>
                  <span v-else>
                     <span class="has-text-weight-normal">
                     </span>
                  </span>
               </p>
               <div class="box button is-small is-dark is-pulled-right mb-2" @click="changeCol('listx', buy_header_id)">
                  <span class="icon">
                     <i class="fa-regular fa-arrow-left-long"></i>
                  </span>
               </div>
               <div class="is-divider mt-4 mb-2"></div>
               <div class="columns mb-0">
                  <div class="column is-4 pt-3 pb-0">
                     <div class="field mb-2">
                        <div class="control">
                           <Field class="input" type="hidden" placeholder="0" name="v_buy_header_id" v-model="buy_header_id" />
                           <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_buy_header_id" />
                           <input disabled class="input is-light has-text-dark has-text-weight-bold has-background-white" type="text" :value="buy_header?.invoice_number + '  I  ' + dateFormat(buy_header?.invoice_date)" style="border-style: outset !important;">
                        </div>
                     </div>
                     <div class="field">
                        <div class="control">
                           <Field class="input" type="hidden" placeholder="0" name="v_buy_header_id" v-model="buy_header_id" />
                           <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_buy_header_id" />
                           <input disabled class="input is-light has-text-dark has-text-weight-bold has-background-white" type="text" :value="buy_header?.supplier.company" style="border-style: outset !important;">
                        </div>
                     </div>
                  </div>
               </div>
               <div class="is-divider mt-2 mb-2"></div>
               <div class="box pt-0 pl-2 pb-4 pr-2 mb-2">
                  <div class="columns is-multiline is-variable is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd mt-0">
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Kategori</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditDetailsLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <v-select :disabled="real_quantity !== curr_quantity"
                                 class="v-selectx is-capitalized" 
                                 label="category"
                                 v-model="product_category_id" 
                                 :reduce="category => category.id" 
                                 placeholder="Pilih kategori"
                                 @search="getCategories"
                                 @update:modelValue="categoryChanged"
                                 :options="_categories">
                              </v-select>
                              <Field class="input" type="hidden" name="v_product_category_id" v-model="product_category_id" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_product_category_id" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Sub Kategori</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditDetailsLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <v-select :disabled="real_quantity !== curr_quantity"
                                 class="v-selectx is-capitalized" 
                                 label="sub_category"
                                 v-model="product_sub_category_id" 
                                 :reduce="sub_category => sub_category.id" 
                                 placeholder="Pilih Sub Kategori"
                                 @search="getSubCategories"
                                 @update:modelValue="subCategoryChanged"
                                 :options="_sub_categories">
                              </v-select>
                              <Field class="input" type="hidden" name="v_product_sub_category_id" v-model="product_sub_category_id" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_product_sub_category_id" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Produk</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditDetailsLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <span class="tag is-danger is-light mb-2">Pilih dari produk yang sudah ada</span>
                              <v-select 
                                 class="v-selectx v-select-product is-capitalized mb-2"
                                 label="product_name"
                                 v-model="product_name" 
                                 :reduce="product => product.product_name" 
                                 placeholder="Pilih Produk"
                                 @search="getProducts"
                                 @update:modelValue="productChanged"
                                 :options="products">
                              </v-select>
                              <hr class="p-0 mb-3 mt-1">
                              <Field class="textarea" as="textarea" row="1" name="v_product_name" v-model="product_name" style="min-height: 70px;" :disabled="real_quantity !== curr_quantity"/>
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_product_name" />
                           </p>
                        </div>
                     </div>
                  </div>

                  <hr class="mb-3">

                  <div class="columns is-multiline is-variable is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd mt-0">
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Jumlah</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditDetailsLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" placeholder="0" name="v_quantity" v-model="quantity" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_quantity" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Satuan</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditDetailsLoading"
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
                                 label="unit"
                                 v-model="unit_id" 
                                 :reduce="unit => unit.id" 
                                 placeholder="Pilih Satuan"
                                 @search="getUnits"
                                 @update:modelValue="unitChanged"
                                 :options="_units">
                              </v-select>
                              <Field class="input" type="hidden" name="v_unit_id" v-model="unit_id" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_unit_id" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Isi</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditDetailsLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" placeholder="0" name="v_quantity_per_unit" v-model="quantity_per_unit" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_quantity_per_unit" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Harga (Satuan)</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditDetailsLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" placeholder="0" name="v_price_per_unit" v-model="price_per_unit" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_price_per_unit" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Harga (Total)</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditDetailsLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" placeholder="0" name="v_price_total" v-model="price_total" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_price_total" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Berat/Satuan (KG)</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditDetailsLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" placeholder="0" name="v_weight_kg_per_unit" v-model="weight_kg_per_unit" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_weight_kg_per_unit" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Berat Total (KG)</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditDetailsLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" placeholder="0" name="v_weight_kg_total" v-model="weight_kg_total" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_weight_kg_total" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Volume (CM)</label>
                           <p class="control is-expanded is-relative">
                              <loading class="loading" v-model:active="isEditDetailsLoading"
                              :can-cancel="false"
                              :background-color="'white'"
                              :opacity="1"
                              :height="25"
                              :width="25"
                              :z-index="25"
                              :loader="'dots'"
                              :is-full-page="false">
                              </loading>
                              <Field class="input" placeholder="0" name="v_volume_cm" v-model="volume_cm" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_volume_cm" />
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="box is-inline-block m-0" style="padding: 2px;">
                  <button class="button is-success" v-if="colshow == 'details'">Save</button>
                  <button class="button is-warning" v-if="colshow == 'editdetails'">Save</button>
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
   name: 'BuyTransaction',
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
            v_quantity_per_unit: yup.string().required().label('Isi'),
            v_price_per_unit: yup.string().required().label('Harga Satuan'),
            v_price_total: yup.string().required().label('Harga Total'),
            v_weight_kg_per_unit: yup.string().nullable().label('Berat (KG)'),
            v_weight_kg_total: yup.string().nullable().label('Berat Total (KG)'),
            v_volume_cm: yup.string().nullable().label('Volume (CM)')
         })
      );
      return { toast, valHeader, valDetails }
   },
   data() {
      return {
         colshow: 'list',
         colinfo: 'Daftar transaksi',
         isHeaderLoading: false,
         isEditHeaderLoading: false,
         isDetailsLoading: false,
         isEditDetailsLoading: false,
         // 
         q: null,
         order: 'asc',
         asc: true,
         page: 1,
         totalPages: 0,
         pageSize: 5,
         totalItems: null,
         isEdit: false,
         // 
         _q: null,
         _order: 'asc',
         _asc: true,
         _page: 1,
         _totalPages: 0,
         _pageSize: 5,
         _totalItems: null,
         _isEdit: false,
         // 
         buy_header: null,
         buy_headers: [],
         buy_detail: null,
         buy_details: [],
         // 
         statuses: [
            { code: "belum", label: "Belum" },
            { code: "cicil", label: "Cicil" },
            { code: "lunas", label: "Lunas" }
         ],
         _supplier: null,
         _suppliers: [],
         _recipient: null,
         _recipients: [],
         _orderer: null,
         _orderers: [],
         _categories: [],
         _sub_categories: [],
         _units: [],
         // header
         isHeaderLoading: false,
         invoice_number: null,
         invoice_date: null,
         supplier_id: null,
         shipping_fee: null,
         weight_kg_total: null,
         admin_fee: null,
         tax: null,
         discount: null,
         price_buy_total: null,
         price_buy_total_final: null,
         orderer_id: null,
         recipient_id: null,
         status: null,
         // details
         buy_header_id: null,
         product_category_id: null,
         product_sub_category_id: null,
         product_name: null,
         quantity: null,
         unit_id: null,
         quantity_per_unit: null,
         price_per_unit: null,
         price_total: null,
         weight_kg_per_unit: null,
         weight_kg_total: null,
         volume_cm: null,
         real_quantity: null,
         curr_quantity: null,
         // products
         products: [],
         product: null
      }
   },
   watch: {
      asc: function() {
         if (this.asc) {
            this.order = 'asc';
            this.getBuys();
         } else {
            this.order = 'desc';
            this.getBuys();
         }
      },
      q: _.debounce(function(v) {
         this.q = v;
         this.getBuys();
      }, 500),
      _asc: function() {
         if (this._asc) {
            this._order = 'asc';
            this.getBuyDetails();
         } else {
            this._order = 'desc';
            this.getBuyDetails();
         }
      },
      _q: _.debounce(function(v) {
         this._q = v;
         this.getBuyDetails();
      }, 500)
   },
   mounted() {
      this.getSuppliers();
      this.getrecipients();
      this.getOrderes();
      this.getBuys();

      this.getCategories();
      this.getSubCategories();
      this.getUnits();
   },
   methods: {
      changeCol: function(a, x = null, y = null) {
         this.colshow = a;
         if (a === 'list') {
            this.resetHeader();
            this.resetDetails();
            this.colinfo = "Daftar transaksi";
            this.isEdit = false;
            this.getBuys();
         }
         if (a === 'header') {
            this.colinfo = "Rekam pembelian";
            this.isEdit = false;
         }
         if (a === 'editheader') {
            this.buy_header_id = x;
            this.getBuySingle();
            this.colinfo = "Edit pembelian";
            this.isEdit = true;
         }
         if (a === 'listx') {
            this.resetDetails();
            this.buy_header_id = x;
            this.getBuySingle();
            this.getBuyDetails();
            this.colinfo = "Daftar produk";
            this.isEdit = false;
         }
         if (a === 'details') {
            this.buy_header_id = x;
            this.getBuySingle();
            this.colinfo = "Rekam produk transaksi";
            this.isEdit = false;
         }
         if (a === 'editdetails') {
            // this.buy_header_id = x;
            this.getDetailsOne(x);
            this.colinfo = "Edit produk";
            this.isEdit = false;
         }
      },
      resetHeader: function() {
         this.invoice_number = null;
         this.invoice_date = null;
         this.supplier_id = null;
         this.weight_kg_total = null;
         this.shipping_fee = null;
         this.admin_fee = null;
         this.discount = null;
         this.tax = null;
         this.price_buy_total = null;
         this.price_buy_total_final = null;
         this.orderer_id = null;
         this.recipient_id = null;
         this.status = null;
      },
      resetDetails: function() {
         this.real_quantity = null;
         this.curr_quantity = null;
         this.buy_detail = null;
         this.buy_header_id = null;
         this.product_category_id = null;
         this.product_sub_category_id = null;
         this.product_name = null;
         this.quantity = null;
         this.unit_id = null;
         this.quantity_per_unit = null;
         this.price_per_unit = null;
         this.price_total = null;
         this.weight_kg_per_unit = null;
         this.weight_kg_total = null;
         this.volume_cm = null;
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
      getSuppliers: function(q) {
         xaxios.get(`inventory/suppliers?q=${q ? q : ''}`).then((res) => {
            this._suppliers = res.data;
         })
      },
      supplierChanged: function() {

      },
      getrecipients: function(q) {
         xaxios.get(`users?q=${q ? q : ''}`).then((res) => {
            this._recipients = res.data;
         })
      },
      recipientChanged: function() {

      },
      getOrderes: function(q) {
         xaxios.get(`users?q=${q ? q : ''}`).then((res) => {
            this._orderers = res.data;
         })
      },
      ordererChanged: function() {

      },
      getCategories: function(q) {
         xaxios.get(`inventory/product-categories?q=${q ? q : ''}`).then((r) => {
            this._categories = r.data;
         })
      },
      categoryChanged: function() {
      },
      getSubCategories: function(q) {
         xaxios.get(`inventory/product-sub-categories?q=${q ? q : ''}`).then((r) => {
            this._sub_categories = r.data;
         })
      },
      subCategoryChanged: function() {
      },
      getUnits: function(q) {
         xaxios.get(`inventory/product-units?q=${q ? q : ''}`).then((r) => {
            this._units = r.data;
         })
      },
      unitChanged: function() {
      },
      categoryUnit: function() {
      },
      statusChanged: function() {

      },
      getBuys: function() {
         this.isHeaderLoading = true;
         xaxios.get(`inventory/buy-headers-px?q=${this.q ? this.q : ''}&page=${this.page}&per_page=${this.pageSize}&order=${this.order}`).then((res) => {
            this.buy_headers = res.data.items;
            this.totalPages = res.data.total_pages;
            this.totalItems = res.data.total_items;
            setTimeout(() => {
               this.isHeaderLoading = false;
            }, 400);
         })
      },
      clickCallback: function (pageNum) {
         this.page = pageNum;
         this.getBuys();
      },
      getBuySingle: function() {
         this.isEditHeaderLoading = true;
         xaxios.get(`inventory/buy-header/${this.buy_header_id ? this.buy_header_id : ''}`).then((r) => {
            this.buy_header = r.data;
            if (this.colshow == 'editheader') {
               this.invoice_number = this.buy_header?.invoice_number;
               this.invoice_date = new Date(this.buy_header?.invoice_date);
               this.supplier_id = this.buy_header?.supplier_id;
               this.weight_kg_total = this.buy_header?.weight_kg_total? parseFloat(this.buy_header?.weight_kg_total) : null;
               this.shipping_fee = this.buy_header?.shipping_fee ? parseFloat(this.buy_header?.shipping_fee) : null;
               this.admin_fee = this.buy_header?.admin_fee ? parseFloat(this.buy_header?.admin_fee) : null;
               this.discount = this.buy_header?.discount ? parseFloat(this.buy_header?.discount) : null;
               this.tax = this.buy_header?.tax ? parseFloat(this.buy_header?.tax) : null;
               this.price_buy_total = this.buy_header?.price_buy_total ? parseFloat(this.buy_header?.price_buy_total) : null;
               this.price_buy_total_final = this.buy_header?.price_buy_total_final ? parseFloat(this.buy_header?.price_buy_total_final) : null;
               this.orderer_id = this.buy_header?.orderer_id;
               this.recipient_id = this.buy_header?.recipient_id;
               this.status = this.buy_header?.status;
               setTimeout(() => {
                  this.isEditHeaderLoading = false;
               }, 600);
            }
         })
      },
      getBuyDetails: function() {
         this.isDetailsLoading = true;
         xaxios.get(`inventory/buy-details-px?buy_header_id=${this.buy_header_id}&q=${this._q ? this._q : ''}&page=${this._page}&per_page=${this._pageSize}&order=${this._order}`).then((res) => {
            this.buy_details = res.data.items;
            this._totalPages = res.data.total_pages;
            this._totalItems = res.data.total_items;
            setTimeout(() => {
               this.isDetailsLoading = false;
            }, 500);
         })
      },
      _clickCallback: function(_pageNum) {
         this._page = _pageNum;
         this.getBuyDetails();
      },
      getDetailsOne: function(id) {
         this.isEditDetailsLoading = true;
         xaxios.get(`inventory/buy-details/${id ? id : ''}`).then((r) => {
            this.buy_detail = r.data;
            this.buy_header_id = this.buy_detail?.buy_header_id;
            this.product_category_id = this.buy_detail?.product_category_id;
            this.product_sub_category_id = this.buy_detail?.product_sub_category_id;
            this.product_name = this.buy_detail?.product_name;
            this.quantity = this.buy_detail?.quantity ? parseFloat(this.buy_detail?.quantity) : null;
            this.unit_id = this.buy_detail?.unit_id;
            this.quantity_per_unit = this.buy_detail?.quantity_per_unit ? parseFloat(this.buy_detail?.quantity_per_unit) : null;
            this.price_per_unit = this.buy_detail?.price_per_unit ? parseFloat(this.buy_detail?.price_per_unit) : null;
            this.price_total = this.buy_detail?.price_total ? parseFloat(this.buy_detail?.price_total) : null;
            this.weight_kg_per_unit = this.buy_detail?.weight_kg_per_unit ? parseFloat(this.buy_detail?.weight_kg_per_unit) : null;
            this.weight_kg_total = this.buy_detail?.weight_kg_total ? parseFloat(this.buy_detail?.weight_kg_total) : null;
            this.volume_cm = this.buy_detail?.volume_cm;

            this.curr_quantity = this.buy_detail?.quantity ? parseFloat(this.buy_detail?.quantity) : null;
            this.real_quantity = this.buy_detail?.buy_product_hub?.quantity ? parseFloat(this.buy_detail?.buy_product_hub?.quantity) : null;
            setTimeout(() => {
               this.isEditDetailsLoading = false;
            }, 500)
         })
      },
      getBuy: function(q) {
         xaxios.get(`inventory/buy-headers?q=${q ? q : ''}`).then((r) => {
            console.log(r.data);
         })
      },
      buyChanged: function() {
      },
      getProducts: function(q) {
         xaxios.get(`inventory/products-fx?q=${q ? q : ''}`).then((r) => {
            this.products = r.data;
         })
      },
      productChanged: function(v) {
         this.product = v;
         if (v) {
            this.products.forEach((e) => {
               if (e.product_name == v) {
                  this.product_category_id = e.product_category_id;
                  this.product_sub_category_id = e.product_category_id;
               }
            });
         } else {
            this.product_category_id = null;
            this.product_sub_category_id = null;
         }
         
      },
      createHeader: function(f) {
         if (this.colshow == "header") {
            xaxios.post(`inventory/buy-header`, {
               invoice_number: f['v_invoice_number'],
               invoice_date: toDbDate(f['v_invoice_date']),
               supplier_id: f['v_supplier_id'],
               shipping_fee: f['v_shipping_fee'],
               weight_kg_total: f['v_weight_kg_total'],
               admin_fee: f['v_admin_fee'],
               discount: f['v_discount'],
               price_buy_total: f['v_price_buy_total'],
               price_buy_total_final: f['v_price_buy_total_final'],
               orderer_id: f['v_orderer_id'],
               recipient_id: f['v_recipient_id'],
               status: f['v_status']
            }).then((r) => {
               this.toast.success("Berhasil menambahkan transaksi", {
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
            }).catch((e) => {
               this.toast.error("Gagal edit transaksi", {
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
         if (this.colshow == "editheader") {
            xaxios.patch(`inventory/buy-header`, {
               id: this.buy_header_id,
               invoice_number: f['v_invoice_number'],
               invoice_date: toDbDate(f['v_invoice_date']),
               supplier_id: f['v_supplier_id'],
               shipping_fee: f['v_shipping_fee'],
               weight_kg_total: f['v_weight_kg_total'],
               admin_fee: f['v_admin_fee'],
               discount: f['v_discount'],
               price_buy_total: f['v_price_buy_total'],
               price_buy_total_final: f['v_price_buy_total_final'],
               orderer_id: f['v_orderer_id'],
               recipient_id: f['v_recipient_id'],
               status: f['v_status']
            }).then((r) => {
               this.toast.success("Berhasil edit transaksi", {
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
            }).catch((e) => {
               this.toast.success("Gagal edit transaksi", {
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
      createDetails: function(f){
         if (this.colshow == "details") {
            xaxios.post(`inventory/buy-details`, {
               buy_header_id: f['v_buy_header_id'],
               product_category_id: f['v_product_category_id'],
               product_sub_category_id: f['v_product_sub_category_id'],
               product_name: f['v_product_name'],
               quantity: f['v_quantity'],
               unit_id: f['v_unit_id'],
               quantity_per_unit: f['v_quantity_per_unit'],
               price_per_unit: f['v_price_per_unit'],
               price_total: f['v_price_total'],
               weight_kg_per_unit: f['v_weight_kg_per_unit'],
               weight_kg_total: f['v_weight_kg_total'],
               volume_cm: f['v_volume_cm']
            }).then((r) => {
               this.toast.success("Berhasil menambahkan produk", {
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
               this.changeCol("listx", f['v_buy_header_id']);
            }).catch((e) => {
               this.toast.error("Gagal edit produk", {
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
         if (this.colshow == "editdetails") {
            xaxios.patch(`inventory/buy-details`, {
               id: this.buy_detail.id,
               buy_header_id: f['v_buy_header_id'],
               product_category_id: f['v_product_category_id'],
               product_sub_category_id: f['v_product_sub_category_id'],
               product_name: f['v_product_name'],
               quantity: f['v_quantity'],
               unit_id: f['v_unit_id'],
               quantity_per_unit: f['v_quantity_per_unit'],
               price_per_unit: f['v_price_per_unit'],
               price_total: f['v_price_total'],
               weight_kg_per_unit: f['v_weight_kg_per_unit'],
               weight_kg_total: f['v_weight_kg_total'],
               volume_cm: f['v_volume_cm']
            }).then((r) => {
               this.toast.success("Berhasil edit produk", {
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
               this.changeCol("listx", f['v_buy_header_id']);
            }).catch((e) => {
               this.toast.error("Gagal edit produk", {
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
      delHeader: function(id) {
         const dialog = createConfirmDialog(ModalDialog);
         dialog.onConfirm(() => {
            this.isConfirmed = true;
            xaxios.delete("inventory/buy-header/"+id).then((res) => {
               this.toast.success("Berhasil menghapus transaksi", {
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
               this.toast.error("Gagal menghapus transaksi", {
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
      delDetails: function(id) {
         const dialog = createConfirmDialog(ModalDialog);
         dialog.onConfirm(() => {
            this.isConfirmed = true;
            xaxios.delete("inventory/buy-details/"+id).then((res) => {
               this.toast.success("Berhasil menghapus produk", {
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
               this.changeCol("listx", this.buy_header?.id);
               this.getBuys();
            }).catch((err) => {
               this.toast.error("Gagal menghapus produk", {
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

<style>
.v-select-product .vs__dropdown-toggle {
   border-color: #a14e4d71 !important;
}
</style>
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
            <div class="box box-flat table-container p-1">
               <table class="table is-striped mb-3 table-header is-fullwidth">
                  <thead>
                     <tr>
                        <th class="pl-0">No</th>
                        <th>SKU</th>
                        <th>Kategori</th>
                        <th>Sub Kategori</th>
                        <th>Kode</th>
                        <th>Produk</th>
                        <th>Stok</th>
                        <th>Satuan</th>
                        <th>Isi</th>
                        <th>Harga Beli</th>
                        <th>Margin</th>
                        <th>Harga Jual</th>
                        <th>Min</th>
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
                        <td><span class="has-text-weight-bold">{{ parseFloat(i.quantity) }}</span></td>
                        <td><span class="is-capitalized">{{ i.unit?.unit }}</span></td>
                        <td><span class="is-capitalized">{{ parseFloat(i.buy_product_hub?.buy_details?.quantity_per_unit) }}</span></td>
                        <td><span v-if="i.price_buy">{{ toIdr(i.price_buy) }}</span><span v-else>{{ toIdr(0) }}</span></td>
                        <td>{{ i.margin ? parseFloat(i.margin) : 0 }}%</td>
                        <td><span v-if="i.price_sell">{{ toIdr(i.price_sell) }}</span><span v-else>{{ toIdr(0) }}</span></td>
                        <td><span class="has-text-weight-bold">{{ i?.min_buy }}</span></td>
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
                              <span class="button tag is-warning is-light is-outlined ml-1" style="border-radius: 2px;" v-on:click="changeCol('edit', i.id)">
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
         <div class="column x-edit" v-if="colshow == 'edit'">
            <Form :validation-schema="valProduct" @submit="updateProduct">
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
               <div class="box box-flat pt-0 pl-2 pb-4 pr-2 mb-2">
                  <div class="columns is-multiline is-variable is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd mt-0">
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
                              <input class="input is-capitalized" :value="product?.product_category?.category" readonly/>
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Sub Kategori</label>
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
                              <input class="input is-capitalized" :value="product?.product_sub_category?.sub_category" readonly/>
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">SKU</label>
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
                              <input class="input is-capitalized" :value="product?.sku" readonly/>
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Kode</label>
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
                              <Field class="input is-success has-text-weight-bold is-uppercase" placeholder="0" name="v_code" v-model="code" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_code" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Produk
                           </label>
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
                              <textarea class="textarea" row="1" style="min-height: 70px;" readonly>{{ product?.product_name }}</textarea>
                           </p>
                        </div>
                     </div>
                  </div>

                  <hr class="mb-1">

                  <div class="columns is-multiline is-variable is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd mt-0">
                     <div class="column is-full pb-0 pt-1">
                        <span class="is-clickable" v-on:click="refProducts">
                           <span class="is-underlined has-text-weight-semibold">Ubah referensi produk</span>&nbsp; <span class="is-clickable"><i class="fa-solid fa-pen-to-square" style="color: #d765a2;"></i></span><br>_
                        </span>
                     </div>
                  </div>
                  
                  <div class="columns is-multiline is-variable is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd mt-0">
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Satuan</label>
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
                              <input class="input is-info is-capitalized" :value="product?.unit?.unit" readonly/>
                              <Field class="input" type="hidden" placeholder="0" name="v_unit_id" v-model="unit_id" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_unit_id" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Isi</label>
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
                              <input class="input is-info is-capitalized" :value="parseFloat(product?.ref_products[0]?.buy_details?.quantity_per_unit)" readonly/>
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Harga Beli</label>
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
                              <Field class="input is-info" placeholder="0" name="v_price_buy" v-model="price_buy" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_price_buy" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Margin (%)</label>
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
                              <Field class="input is-success" type="number" name="v_margin" v-model="margin" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_margin" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Harga Jual</label>
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
                              <Field class="input is-info" placeholder="0" name="v_price_sell" v-model="price_sell" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_price_sell" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Berat (KG)</label>
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
                              <Field class="input is-info" placeholder="0" name="v_weight_kg" v-model="weight_kg" readonly/>
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_weight_kg" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Volume (CM)</label>
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
                              <Field class="input is-info" placeholder="0" name="v_volume_cm" v-model="volume_cm" readonly/>
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_volume_cm" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Min. Pembelian</label>
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
                              <Field class="input is-success" type="number" placeholder="0" name="v_min_buy" v-model="min_buy" min="1"/>
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_min_buy" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Level</label>
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
                                 class="v-selectx v-edit"
                                 label="label"
                                 v-model="level" 
                                 :reduce="label => label.code" 
                                 placeholder="Pilih Level"
                                 @update:modelValue="levelChanged"
                                 :options="_level">
                              </v-select>

                              <Field class="input" type="hidden" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_level" v-model="level" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_level" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-half-desktop is-one-quarter-widescreen pb-1 pt-1">
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
                              <v-select :disabled="code == null"
                                 class="v-selectx v-edit"
                                 label="label"
                                 v-model="status" 
                                 :reduce="label => label.code" 
                                 placeholder="Pilih Status"
                                 @update:modelValue="statusChanged"
                                 :options="_status">
                              </v-select>

                              <Field class="input" type="hidden" :class="[{'is-warning': isEdit == true}, {'is-success': isEdit == false}]" name="v_status" v-model="status" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_status" />
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
               <Field type="hidden" placeholder="0" name="v_id" v-model="id" />
               <div class="box is-inline-block m-0" style="padding: 2px;">
                  <button class="button is-success">Save</button>
               </div>
            </Form>
         </div>
         <div class="column x-listx" v-if="colshow == 'listx'">
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
            <div class="is-divider mt-4 mb-0"></div>
            <div class="list">
               <div class="list-item pl-0 pr-0" v-for="(i, index) in product?.ref_products" :key="i.id">
                  <div class="list-item-image">
                     {{ index + 1 }}&nbsp;
                  </div>
                  <div class="list-item-content">
                     <div class="list-item-description">{{ i?.buy_header?.invoice_number }} | {{ dateFormat(i?.buy_header?.invoice_date) }}</div>
                     <div class="list-item-title has-text-weight-normal mb-1">{{ i?.buy_details?.product_name }}</div>
                     <div class="list-item-description"><span class="tag">Kategori > {{ i?.buy_details
?.product_category?.category }}</span> <span class="tag">Kategori > {{ i?.buy_details
?.product_sub_category?.sub_category }}</span></div>
                     <div class="list-item-description mt-1">
                        <span class="tag is-success is-light mr-1 mb-1">Stok > {{ parseFloat(i?.quantity) }}</span>
                        <span class="tag is-link is-light is-capitalized mr-1 mb-1">Satuan > {{ i?.buy_details?.unit?.unit }}</span>
                        <span class="tag is-link is-light mr-1 mb-1">Isi > {{ parseFloat(i?.buy_details?.quantity_per_unit) }}</span>
                        <span class="tag is-warning is-light mr-1 mb-1">Harga satuan > {{ toIdr(parseFloat(i?.buy_details?.price_per_unit)) }}</span>
                        <span class="tag is-warning is-light mr-1 mb-1">Harga total > {{ toIdr(parseFloat(i?.buy_details?.price_total)) }}</span>
                        <span class="tag is-warning is-light mr-1 mb-1">Berat satuan > {{ parseFloat(i?.buy_details?.weight_kg_per_unit) }} KG</span>
                        <span class="tag is-warning is-light mr-1 mb-1">Berat total > {{ parseFloat(i?.buy_details?.weight_kg_total) }} KG</span>
                        <span class="tag is-warning is-light">Volume _CM > {{ i?.buy_details?.volume_cm }}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <!-- modal -->
      <div ref="refx" class="modal" style="min-width: 80%;">
         <div class="modal-background"></div>
         <div class="modal-card">
            <header class="modal-card-head pt-3 pb-3">
               <p class="modal-card-title is-size-6 has-text-weight-semibold">Produk</p>
               <button class="delete" aria-label="close" v-on:click="closeModal"></button>
            </header>
            <section class="modal-card-body pt-1">
               <div class="list has-visible-pointer-controls">
                  <div class="list-item" v-for="(i, index) in product?.ref_products" :key="i.id">
                     <div class="list-item-content">
                        <div class="list-item-description">{{ i?.buy_header?.invoice_number }} | {{ dateFormat(i?.buy_header?.invoice_date) }}</div>
                        <div class="list-item-title has-text-weight-normal mb-1">{{ i?.buy_details?.product_name }}</div>
                        <div class="list-item-description"><span class="tag">Kategori > {{ i?.buy_details
?.product_category?.category }}</span> <span class="tag">Kategori > {{ i?.buy_details
?.product_sub_category?.sub_category }}</span></div>
                     <div class="list-item-description mt-1">
                        <span class="tag is-success is-light mr-1 mb-1">Stok > {{ parseFloat(i?.quantity) }}</span>
                        <span class="tag is-link is-light is-capitalized mr-1 mb-1">Satuan > {{ i?.buy_details?.unit?.unit }}</span>
                        <span class="tag is-link is-light mr-1 mb-1">Isi > {{ parseFloat(i?.buy_details?.quantity_per_unit) }}</span>
                        <span class="tag is-warning is-light mr-1 mb-1">Harga beli > {{ toIdr(parseFloat(i?.buy_details?.price_per_unit)) }}</span>
                        <span class="tag is-warning is-light mr-1 mb-1">Berat > {{ parseFloat(i?.buy_details?.weight_kg_per_unit) }} KG</span>
                        <span class="tag is-warning is-light">Volume _CM > {{ i?.buy_details?.volume_cm }}</span>
                     </div>
                     </div>

                     <div class="list-item-controls">
                        <div class="buttons is-right">
                           <template v-if="buy_product_hub_id !== i?.id">
                              <button class="button is-outlined" :class="[{'is-success': buy_product_hub_id == i?.id}, {'is-dark': buy_product_hub_id != i?.id}]" v-on:click="selectHubId(i?.id)">
                                 <span class="icon">
                                    <i class="fa-regular fa-square fa-lg"></i>
                                 </span>
                              </button>
                           </template>
                           <template v-else>
                              <button class="button is-outlined" :class="[{'is-success': buy_product_hub_id == i?.id}, {'is-dark': buy_product_hub_id != i?.id}]">
                                 <span class="icon">
                                    <i class="fa-regular fa-square-check fa-lg"></i>
                                 </span>
                              </button>
                           </template>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
            <!-- <footer class="modal-card-foot pt-2 pb-2">
               <button class="button is-small" v-on:click="closeModal">Cancel</button>
            </footer> -->
         </div>
      </div>
   </div>
</template>
 
<script>
import _ from 'lodash';
import * as XLSX from 'xlsx';
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
export default {
   name: 'ProductBrowse',
   components: {
      Loading, Paginate, Form, Field, ErrorMessage, vSelect, VueDatePicker
   },
   setup() {
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
      return { toast, valProduct }
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
         buy_product_hub_id: null,

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
         code: null,
         quantity: null,
         quantity_per_unit: null,
         unit_id: null,
         price_buy: null,
         margin: null,
         price_sell: null,
         weight_kg: null,
         volume_cm: null,
         min_buy: null,
         level: null,
         status: null
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
      margin: function(v) {
         this.price_sell = parseFloat(v) > 0 ? this.toIdr((this.currToFloat(this.price_buy) * parseFloat(v) * 0.01) + this.currToFloat(this.price_buy)) : this.toIdr(this.currToFloat(this.price_buy));
      },
      price_buy: function(v) {
         this.price_sell = parseFloat(this.margin) > 0 ? this.toIdr((this.currToFloat(v) * parseFloat(this.margin) * 0.01) + this.currToFloat(v)) : this.toIdr(this.currToFloat(v));
      }
   },
   mounted() {
      this.getProducts();
   },
   methods: {
      changeCol: function(a, x = null, y = null) {
         this.colshow = a;
         if (a === 'list') {
            // this.reset();
            this.colinfo = "Produk";
            this.isEdit = false;
            this.getProducts();
         }
         if (a === 'edit') {
            this.getProduct(x);
            this.colinfo = "Edit";
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
      currToFloat: function(s) {
         return formatCurrencyToFloat(s);
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

            // var wb = XLSX.utils.book_new();
            // var ws = XLSX.utils.json_to_sheet(r.data.items);
            // XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
            // XLSX.utils.book_append_sheet(wb, ws);
            // XLSX.writeFile(wb, "baka" + ".xlsx");
         })
      },
      clickCallback: function (pageNum) {
         this.page = pageNum;
         this.getProducts();
      },
      getProduct: function(id) {
         xaxios.get("inventory/product/"+id).then((r) => {
            this.product = r.data;
            this.id = this.product?.id;
            this.quantity = this.product?.quantity ? parseFloat(this.product?.quantity) : null;
            // this.quantity_per_unit = this.product?.quantity_per_unit ? parseFloat(this.product?.quantity_per_unit) : null;
            this.price_buy = this.product?.price_buy > 0 ? this.toIdr(this.product?.price_buy) : this.toIdr(0);
            this.price_sell = this.product?.price_sell > 0 ? this.toIdr(this.product?.price_sell) : this.toIdr(this.product?.price_buy);
            this.margin = parseFloat(this.product?.margin);
            this.code = this.product?.code;
            this.weight_kg = parseFloat(this.product?.weight_kg);
            this.volume_cm = this.product?.volume_cm;
            this.level = this.product?.level;
            this.status = this.product?.status;
            this.unit_id = this.product?.unit_id;
            this.min_buy = this.product?.min_buy;
            this.buy_product_hub_id = this.product?.buy_product_hub_id;
         })
      },
      getDetails: function(id) {
         xaxios.get("inventory/product/"+id).then((r) => {
            this.product = r.data;
         })
      },
      statusChanged: function(v) { this.status = v; },
      levelChanged: function(v) { this.level = v; },
      updateProduct: function(f) {
         let d = {};
         d['id'] = f['v_id'];
         d['code'] = f['v_code'] ? f['v_code'].toUpperCase() : null;
         d['unit_id'] = f['v_unit_id'];
         d['price_buy'] = this.currToFloat(f['v_price_buy']);
         d['margin'] = f['v_margin'] ? f['v_margin'] : null;
         d['price_sell'] = this.currToFloat(f['v_price_sell']);
         d['weight_kg'] = f['v_weight_kg'];
         d['volume_cm'] = f['v_volume_cm'];
         d['buy_product_hub_id'] = this.buy_product_hub_id;
         d['min_buy'] = f['v_min_buy'] ? f['v_min_buy'] : null;
         d['status'] = f['v_status'];
         d['level'] = f['v_level'];
         xaxios.patch("inventory/product/", d).then((r) => {
            this.toast.success("Berhasil update produk", {
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
            this.getProducts();
         }).catch((e) => {
            this.toast.error("Gagal update produk", {
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
            this.getProducts();
         })
      },
      refProducts: function() {
         var refx = this.$refs.refx;
         refx.classList.add('is-active');
      },
      closeModal: function() {
         var refx = this.$refs.refx;
         refx.classList.remove('is-active');
      },
      selectHubId: function(id) {
         this.buy_product_hub_id = id;
         this.product?.ref_products.forEach((e) => {
            if (e.id === id) {
               this.unit_id = e?.buy_details?.unit_id;
               this.unit = e?.buy_details?.unit?.unit;
               this.volume_cm = e?.buy_details?.volume_cm;
               this.price_buy = this.toIdr(parseFloat(e?.buy_details?.price_per_unit));
               this.weight_kg = parseFloat(e?.buy_details?.weight_kg_per_unit);
            }
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
</style>

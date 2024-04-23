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
         <div class="column" v-if="colshow == 'so_list'">
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
                     <input class="input" v-model="q" type="text" placeholder=".. nomor SO">
                  </p>
                  <div class="button is-success is-light is-outlined ml-2" @click="changeCol('so_create')">
                     <span class="icon">
                        <i class="fa-regular fa-circle-plus"></i>
                     </span>
                  </div>
               </div>
            </div>
            <div class="box box-flat table-container p-1">
               <table class="table is-striped mb-3 table-header is-fullwidth">
                  <thead>
                     <tr>
                        <th class="pl-0">#</th>
                        <th>No</th>
                        <th>Tanggal</th>
                        <th>Judul</th>
                        <th>Keterangan</th>
                        <th>Produk</th>
                        <th>Stockist</th>
                        <th>Penyesuaian</th>
                        <th class="pr-0" width="150px"></th>
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
                     <tr v-for="(i, index) in stock_headers" :key="i.id">
                        <td class="pl-0">{{ (page * pageSize) - pageSize + index + 1 }}.</td>
                        <td>{{ i.id }}</td>
                        <td>{{ dateFormat(i.date) }}</td>
                        <td>{{ i.title }}</td>
                        <td><span>{{ i.info }}</span></td>
                        <td>{{ i.stock_details.length }}</td>
                        <td><span class="is-capitalized">{{ i.stockist?.name }}</span></td>
                        <td><span class="tag" :class="[i.status === 'closed' ? 'is-success' : 'is-info']">{{ i.status === 'closed' ? 'Penyesuaian' : 'Tidak' }}</span></td>
                        <td class="pr-0">
                           <div class="tags is-right">
                              <span class="button tag is-link is-light is-outlined" style="border-radius: 2px;" v-on:click="changeCol('so_yuk', i.id)">
                                 <span class="icon is-small">
                                    <i class="fa-regular fa-boxes-stacked"></i>
                                 </span>
                              </span>
                              <span class="button tag is-success is-light is-outlined" style="border-radius: 2px;" v-on:click="changeCol('so_select_product', i.id)">
                                 <span class="icon is-small">
                                    <i class="fa-regular fa-plus-minus"></i>
                                 </span>
                              </span>
                              <span class="button tag is-warning is-light is-outlined ml-1" style="border-radius: 2px;" v-on:click="changeCol('so_edit', i.id)">
                                 <span class="icon is-small">
                                    <i class="fa-sharp fa-solid fa-pencil"></i>
                                 </span>
                              </span>
                              <span class="button tag is-danger is-light is-outlined ml-1" style="border-radius: 2px;" v-on:click="delSH(i.id)">
                                 <span class="icon is-small">
                                    <i class="fa-light fa-trash-can"></i>
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
         <div class="column" v-if="colshow == 'so_create' || colshow == 'so_edit'">
            <Form :validation-schema="valSH" @submit="goSH">
               <p class="block m-0 mt-1 button is-small is-info is-outlined p-0" style="background-color: transparent; border: none;">
                  <span v-if="isEdit">
                     <span class="has-text-weight-normal">
                        <i class="fa-light fa-window-minimize"></i>
                     </span>
                  </span>
                  <span v-else>
                     <span class="has-text-weight-normal">
                        <i class="fa-light fa-window-minimize"></i>
                     </span>
                  </span>
               </p>
               <div class="box button is-small is-dark is-pulled-right mb-2" @click="changeCol('so_list')">
                  <span class="icon">
                     <i class="fa-regular fa-arrow-left-long"></i>
                  </span>
               </div>
               <div class="is-divider mt-4 mb-2"></div>
               <div class="box box-flat pt-0 pl-2 pb-4 pr-2 mb-2">
                  <div class="columns is-multiline is-variable is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd mt-0">
                     <div class="column is-full-mobile is-full-tablet is-one-quarter-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Judul</label>
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
                              <Field class="textarea" as="textarea" name="v_title" v-model="title" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_title" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-one-quarter-desktop is-one-quarter-widescreen pb-1 pt-1">
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
                              <Field class="textarea" as="textarea" name="v_info" v-model="info" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_info" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-one-quarter-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Stokist</label>
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
                                 label="name"
                                 v-model="stockist_id" 
                                 :reduce="stockist_id => stockist_id.id" 
                                 placeholder="Stokist"
                                 @update:modelValue="StockistChanged"
                                 :options="stockists">
                              </v-select>

                              <Field class="input" type="hidden" name="v_stockist_id" v-model="stockist_id" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_stockist_id" />
                           </p>
                        </div>
                     </div>
                     <div class="column is-full-mobile is-full-tablet is-one-quarter-desktop is-one-quarter-widescreen pb-1 pt-1">
                        <div class="field">
                           <label class="label">Tanggal</label>
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
                              <VueDatePicker v-model="date" :highlight-week-days="[0, 6]" :enable-time-picker="false" :format="'dd/MM/yyyy'" position="left"></VueDatePicker>
                              <Field class="input" type="hidden" name="v_date" v-model="date" />
                              <ErrorMessage class="is-size-7 has-text-danger is-underlined mt-1" name="v_date" />
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="box is-inline-block m-0" style="padding: 2px;">
                  <button class="button is-success">Save</button>
               </div>
            </Form>
         </div>
         <div class="column" v-if="colshow == 'so_select_product'">
            <p class="block m-0 mt-1 button is-small is-info is-outlined p-0" style="background-color: transparent; border: none;">
               <span v-if="isEdit">
                  <span class="has-text-weight-normal">
                     <i class="fa-light fa-window-minimize"></i>
                  </span>
               </span>
               <span v-else>
                  <span class="has-text-weight-normal">
                     <i class="fa-light fa-window-minimize"></i>
                  </span>
               </span>
            </p>
            <div class="box button is-small is-dark is-pulled-right mb-2" @click="changeCol('so_list')">
               <span class="icon">
                  <i class="fa-regular fa-arrow-left-long"></i>
               </span>
            </div>
            <div class="is-divider mt-4 mb-2"></div>
            <div class="columns">
               <div class="column">
                  <div class="box box-flat is-success is-light title is-size-5 is-underlined p-1 mb-3">
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
                     </div>
                  </div>
                  <div class="box box-flat table-container p-1">
                     <table class="table is-striped mb-3 is-fullwidth">
                        <thead>
                           <tr>
                              <th class="pl-0">No</th>
                              <th>Kode</th>
                              <th>Produk</th>
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
                              <td>{{ i.code ? i.code : '-' }}</td>
                              <td>{{ i.product_name }}</td>
                              <td>
                                 <span class="tag" :class="[{'is-danger': i.status == 'false'}, {'is-success': i.status == 'true' }]">
                                    <template v-if="i.status == 'true'">Aktif</template>
                                    <template v-else>Tidak Aktif</template>
                                 </span>
                              </td>
                              <td class="pr-0">
                                 <div class="tags is-right">
                                    <span class="button tag is-success is-light is-outlined" style="border-radius: 2px;" v-on:click="addProduct(i.id)">
                                       <span class="icon is-small">
                                          <i class="fa-regular fa-arrow-right-long"></i>
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
               <div class="column">
                  <div class="box box-flat is-success is-light title is-size-5 is-underlined p-1 mb-3 is-invisible is-hidden-mobile">
                     <div class="field has-addons">
                        <p class="control"></p>
                        <p class="control is-expanded"><input class="input"></p>
                     </div>
                  </div>
                  <div class="box box-flat p-2 list has-visible-pointer-controls" v-if="stock_details_all.length">
                     <div class="list-item" style="border-bottom: none !important;" v-for="(i, index) in stock_details_all" :key="i.id">
                        <div class="list-item-content">
                           <div class="list-item-title has-text-weight-normal">
                              <span style="padding-bottom: 2px; border-bottom: 1px solid hsl(0deg 4.98% 81.92%); line-height: 20px;">
                                 {{ i.product?.code }} - {{ i.product?.product_name }}
                              </span>
                              <span class="ml-2 button is-small tag is-outlined" v-on:click="remProduct(i.id)">
                                 <i class="fa-sharp fa-solid fa-xmark"></i>
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div class="column" v-if="colshow == 'so_yuk'">
            <p class="block m-0 mt-1 button is-small is-info is-outlined p-0" style="background-color: transparent; border: none;">
               <span v-if="isEdit">
                  <span class="has-text-weight-normal">
                     <i class="fa-light fa-window-minimize"></i>
                  </span>
               </span>
               <span v-else>
                  <span class="has-text-weight-normal">
                     <i class="fa-light fa-window-minimize"></i>
                  </span>
               </span>
            </p>
            <div class="box button is-small is-dark is-pulled-right mb-2" @click="changeCol('so_list')">
               <span class="icon">
                  <i class="fa-regular fa-arrow-left-long"></i>
               </span>
            </div>
            <div class="is-divider mt-4 mb-2"></div>
            <div class="box box-flat is-success is-light title is-size-5 is-underlined p-1 mb-3">
               <div class="field has-addons">
                  <p class="control">
                     <a class="button">
                        <div class="icon is-small is-left" @click="__asc = !__asc" style="color: hsl(207deg, 61%, 53%);">
                           <i class="fa-solid" :class="[__asc === true ? 'fa-arrow-down-wide-short' : 'fa-arrow-up-wide-short']"></i>
                        </div>
                     </a>
                  </p>
                  <p class="control is-expanded">
                     <input class="input" v-model="__q" type="text" placeholder=".. nama produk">
                  </p>
               </div>
            </div>
            <div class="box box-flat table-container p-1 mb-2">
               <table class="table is-striped mb-3 table-header is-fullwidth">
                  <thead>
                     <tr>
                        <th class="pl-0">No</th>
                        <th>Kode</th>
                        <th>Produk</th>
                        <th>Satuan</th>
                        <th>Min</th>
                        <!-- <th>Isi</th> -->
                        <th>Stok</th>
                        <th>SO</th>
                        <th>Selisih</th>
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
                     <tr v-for="(i, index) in stock_details" :key="i.id">
                        <td class="pl-0">{{ (page * pageSize) - pageSize + index + 1 }}.</td>
                        <td>{{ i.product?.code ? i.product?.code : '-' }}</td>
                        <td>{{ i.product?.product_name }}</td>
                        <td><span class="is-capitalized">{{ i.product?.unit?.unit }}</span></td>
                        <td>{{ i.product?.min_buy ? parseFloat(i.product?.min_buy) : '' }}</td>
                        <!-- <td><span class="is-capitalized">{{ parseFloat(i.product?.buy_product_hub?.buy_details?.quantity_per_unit) }}</span></td> -->
                        <td><span class="has-text-weight-bold">{{ parseFloat(i?.quantity_1) }}</span></td>
                        <td>{{ i.quantity_2 === null ? '-' : (i.quantity_2  === 0 ? 0 : parseFloat(i.quantity_2)) }}</td>
                        <td>{{ i.quantity_2 ? parseFloat(i.quantity_2) - parseFloat(i.product?.quantity) : '0' }}</td>
                        <td>
                           <template v-if="i.quantity_2 !== null">
                              <template v-if="(parseFloat(i.quantity_2) >= parseFloat(i.product?.min_buy ? i.product?.min_buy : parseFloat(0)))">
                                 <span><i class="fa-regular fa-signal-bars" style="color: #359276;"></i></span>
                              </template>
                              <template v-else>
                                 <template v-if="(parseFloat(i.quantity_2) <= parseFloat(0))">
                                    <span><i class="fa-duotone fa-signal-bars-slash" style="--fa-primary-color: #ff0000; --fa-secondary-color: #ff0000;"></i></span>
                                 </template>
                                 <template v-else>
                                    <span><i class="fa-duotone fa-signal-bars-fair" style="--fa-primary-color: #f0c800; --fa-secondary-color: #f0c800;"></i></span>
                                 </template>
                              </template>
                           </template>
                           <template v-else>
                              <template v-if="(parseFloat(i.quantity_1) >= parseFloat(i.product?.min_buy ? i.product?.min_buy : parseFloat(0)))">
                                 <span><i class="fa-regular fa-signal-bars" style="color: #359276;"></i></span>
                              </template>
                              <template v-else>
                                 <template v-if="(parseFloat(i.quantity_1) <= parseFloat(0))">
                                    <span><i class="fa-duotone fa-signal-bars-slash" style="--fa-primary-color: #ff0000; --fa-secondary-color: #ff0000;"></i></span>
                                 </template>
                                 <template v-else>
                                    <span><i class="fa-duotone fa-signal-bars-fair" style="--fa-primary-color: #f0c800; --fa-secondary-color: #f0c800;"></i></span>
                                 </template>
                              </template>
                           </template>
                        </td>
                        <!-- <td>
                           <span class="tag" :class="[{'is-danger': i.product?.status == 'false'}, {'is-success': i.product?.status == 'true' }]">
                              <template v-if="i.product?.status == 'true'">Aktif</template>
                              <template v-else>Tidak Aktif</template>
                           </span>
                        </td> -->
                        <td class="pr-0">
                           <div class="tags is-right">
                              <span class="button tag is-success is-light is-outlined" style="border-radius: 2px;" v-on:click="changeCol('listx', i.product_id, i.id)">
                                 <span class="icon is-small">
                                    <i class="fa-regular fa-boxes-stacked"></i>
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
                           Page {{ __page }}/{{ __totalPages }} of {{ __totalItems }} total items
                        </div>
                     </div>
                  </div>
                  <div class="level-right">
                     <div class="level-item">
                           <nav class="pagination is-right is-small">
                              <paginate
                              v-model="__page"
                              :page-count="__totalPages"
                              :page-range="3"
                              :margin-pages="0"
                              :click-handler="__clickCallback"
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
            --
            <div class="icon-text mt-0">
               <span class="icon has-text-danger">
                  <i class="fas fa-info-circle"></i>
               </span>
               <span>Pastikan sudah benar/sesuai, stok yang telah/sudah disesuaikan tidak bisa dikembalikan</span>
            </div>
            ---
            <br>
            <div>
               <button class="button is-small" v-on:click="adjustStock" :disabled="stock_header?.status === 'closed'" :class="[stock_header?.status === 'closed' ? 'is-static': 'is-success']">
                  <span class="icon is-small">
                     <i class="fa-sharp fa-light fa-ballot-check"></i>
                  </span>
                  <span>Sesuaikan</span>
               </button>
            </div>
         </div>
         <div class="column" v-if="colshow == 'listx'">
            <p class="block m-0 mt-1 button is-small is-info is-outlined p-0" style="background-color: transparent; border: none;">
               <span v-if="isEdit">
                  <span class="has-text-weight-normal">
                     <i class="fa-light fa-window-minimize"></i>
                  </span>
               </span>
               <span v-else>
                  <span class="has-text-weight-normal">
                     <i class="fa-light fa-window-minimize"></i>
                  </span>
               </span>
            </p>
            <div class="box button is-small is-dark is-pulled-right mb-2" @click="changeCol('so_yuk', stock_header_id)">
               <span class="icon">
                  <i class="fa-regular fa-arrow-left-long"></i>
               </span>
            </div>
            <div class="is-divider mt-4 mb-0"></div>
            <div class="mt-2 button is-small" :class="[show ? 'is-success' : 'is-info']" v-on:click="show = !show">
               <template v-if="show"><i class="fa-sharp fa-solid fa-chevron-down"></i></template>
               <template v-else="show"><i class="fa-sharp fa-solid fa-chevron-up"></i></template>
            </div>
            <div>----</div>
            <div v-show="show && _stock_details?.product?.ref_products_true" class="list has-visible-pointer-controls">
               <div class="list-item pl-0 pr-0" v-for="(i, index) in _stock_details?.product?.ref_products_true" :key="i.id">
                  <div class="list-item-image">
                     {{ index + 1 }}&nbsp;
                  </div>
                  <div class="list-item-content">
                     <div class="list-item-description">{{ i?.buy_header?.invoice_number }} | {{ dateFormat(i?.buy_header?.invoice_date) }}</div>
                     <div class="list-item-title has-text-weight-normal mb-1">{{ product?.code }} - {{ i?.buy_details?.product_name }}</div>
                     <div class="list-item-description"><span class="tag">Kategori > {{ i?.buy_details
?.product_category?.category }}</span> <span class="tag">Kategori > {{ i?.buy_details
?.product_sub_category?.sub_category }}</span></div>
                     <div class="list-item-description mt-1">
                        <span class="tag is-success is-light mr-1 mb-1">Stok > {{ _stock_details?.details_ext.length > 0 ? _stock_details?.details_ext.filter((e) => e.buy_details_id === i.buy_details_id)[0]?.quantity_1 ?? null : null }}</span>
                        <span class="tag is-link is-light is-capitalized mr-1 mb-1">Satuan > {{ i?.buy_details?.unit?.unit }}</span>
                        <span class="tag is-link is-light mr-1 mb-1">Isi > {{ parseFloat(i?.buy_details?.quantity_per_unit) }}</span>
                        <span class="tag is-warning is-light mr-1 mb-1">Harga satuan > {{ toIdr(parseFloat(i?.buy_details?.price_per_unit)) }}</span>
                        <span class="tag is-warning is-light mr-1 mb-1">Harga total > {{ toIdr(parseFloat(i?.buy_details?.price_total)) }}</span>
                        <span class="tag is-warning is-light mr-1 mb-1">Berat satuan > {{ parseFloat(i?.buy_details?.weight_kg_per_unit) }} KG</span>
                        <span class="tag is-warning is-light mr-1 mb-1">Berat total > {{ parseFloat(i?.buy_details?.weight_kg_total) }} KG</span>
                        <span class="tag is-warning is-light">Volume _CM > {{ i?.buy_details?.volume_cm }}</span>
                     </div>
                  </div>

                  <div class="list-item-controls pr-0">
                     <div class="is-right">
                        <div class="field has-addons">
                           <p class="control">
                              <input style="max-width: 90px; border-bottom: 1px solid #48c78e; border-left: none; border-top: none; border-radius: 0;" class="input has-text-centered" type="number" min="0" 
                              ref="item"
                              :buy_product_hub_id="i.id" 
                              :buy_header_id="i?.buy_header_id" 
                              :buy_details_id="i?.buy_details_id"
                              :quantity_1="i?.quantity" v-on:change="itemChanged"
                              :val="_stock_details?.details_ext.length > 0 ? _stock_details?.details_ext.filter((e) => e.buy_details_id === i.buy_details_id)[0]?.quantity_2 ?? null : null" />
                           </p>
                           <p class="control">
                              <a class="button is-static" style="border-top: none; border-right: none; border-bottom: 1px solid hsl(348deg 45.75% 72.69%); background-color: transparent; border-radius: 0;">
                                 {{ _stock_details?.details_ext.length > 0 ? _stock_details?.details_ext.filter((e) => e.buy_details_id === i.buy_details_id)[0]?.quantity_2 ?? 0 : '-' }}
                              </a>
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div class="mt-2 mb-3">
               <div class="columns is-multiline is-variable is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd mt-0 mb-0">
                  <div class="column is-full-mobile is-full-tablet is-one-quarter-desktop is-one-quarter-widescreen pb-1 pt-1">
                     <div class="field">
                        <label class="label">SO</label>
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
                           <input class="input" v-model="quantity_2" type="number" min="0" />
                           <template v-if="s_quantities !== quantity_2">
                              <span class="mt-1 tag is-danger is-light">Total detil dan SO beda</span>
                           </template>
                        </p>
                     </div>
                  </div>
               </div>
               <div class="columns is-multiline is-variable is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd mt-0 mb-0">
                  <div class="column is-full-mobile is-full-tablet is-one-quarter-desktop is-one-quarter-widescreen pb-1 pt-1">
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
                           <textarea class="textarea" v-model="_info"></textarea>
                        </p>
                     </div>
                  </div>
               </div>
            </div>
            <div class="mt-0 button is-success" v-on:click="saveSD">Save</div>
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
import { toDbDateTime, toDbDate, createMask, destroyMask, formatCurrency, formatCurrencyToFloat, toDate } from '../utils/useful';
import { ref } from "vue";

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
export default {
   name: 'ProductStock',
   components: {
      Loading, Paginate, Form, Field, ErrorMessage, vSelect, VueDatePicker
   },
   setup() {
      const toast = useToast();
      const valSH = ref(
         yup.object({
            v_title: yup.string().required().label('Judul'),
            v_info: yup.string().nullable().label('Keterangan'),
            v_stockist_id: yup.string().required().label('Stockist'),
            v_date: yup.string().required().label('Tanggal')
         })
      );
      return { toast, valSH }
   },
   data() {
      return {
         colshow: 'so_list',
         colinfo: 'SO',
         isListLoading: false,
         isEditLoading: false,
         isEdit: false,
         show: false,
         // 
         q: null,
         order: 'asc',
         asc: true,
         page: 1,
         totalPages: 0,
         pageSize: 5,
         totalItems: null,

         // 
         _q: null,
         _order: 'asc',
         _asc: true,
         _page: 1,
         _totalPages: 0,
         _pageSize: 5,
         _totalItems: null,

         // 
         __q: null,
         __order: 'asc',
         __asc: true,
         __page: 1,
         __totalPages: 0,
         __pageSize: 5,
         __totalItems: null,

         products: [],
         product: null,
         
         // 
         isEditHeader: false,

         // 
         stock_header_id: null,
         title: null,
         stockist_id: null,
         date: null,
         info: null,

         stockists: [],
         stock_headers: [],
         stock_header: null,

         _stock_details: null,
         stock_details: [],
         stock_details_all: [],
         stock_details_id: null,
         _info: null,
         quantity_2: null,

         s_quantities: null
      }
   },
   watch: {
      q: _.debounce(function(v) {
         this.q = v;
         this.getStockHeaders();
      }, 500),
      asc: function() {
         if (this.asc) {
            this.order = 'asc';
            this.getStockHeaders();
         } else {
            this.order = 'desc';
            this.getStockHeaders();
         }
      },
      _q: _.debounce(function(v) {
         this._q = v;
         this.getProducts();
      }, 500),
      _asc: function() {
         if (this._asc) {
            this._order = 'asc';
            this.getProducts();
         } else {
            this._order = 'desc';
            this.getProducts();
         }
      },
      __q: _.debounce(function(v) {
         this.__q = v;
         this.getStockDetailsByStockHeaderId(this.stock_header_id);
      }, 500),
      __asc: function() {
         if (this.__asc) {
            this.__order = 'asc';
            this.getStockDetailsByStockHeaderId(this.stock_header_id);
         } else {
            this.__order = 'desc';
            this.getStockDetailsByStockHeaderId(this.stock_header_id);
         }
      },
   },
   mounted() {
      this.getStockHeaders();
      this.getStockists();
   },
   methods: {
      changeCol: function(a, x = null, y = null) {
         this.colshow = a;
         if (a === 'so_list') {
            Object.assign(this.$data, this.$options.data());
            this.getStockists();
            this.getStockHeaders();
            this.colinfo = "SO";
            this.isEditHeader = false;
         }

         if (a === 'so_create') {
            this.colinfo = "Rekam SO";
            this.isEditHeader = false;
            
         }
         
         if (a === 'so_select_product') {
            this.colinfo = "Produk";
            this.isEditHeader = false;
            this.getProducts();
            this.getStockHeader(x);
            this.getStockDetailsByStockHeaderIdAll(x);
            // this.getStockDetailsByStockHeaderId(x);
         }

         if (a === 'so_edit') {
            this.colinfo = "Edit SO";
            this.isEditHeader = true;
            this.getStockHeader(x);
            
         }

         if (a === 'so_yuk') {
            this.colinfo = "Produk";
            this.isEditHeader = false;
            this.getStockHeader(x);
            this.getStockDetailsByStockHeaderId(x);
         }

         if (a === 'listx') {
            this.stock_details_id = y;
            this.quantity_2 = null;
            this._info = null;
            this.getDetails(x);
            this.getStockDetails(y);
            this.colinfo = "SO";
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
      removeVCharacterFromKeys: function(obj) {
         const newObj = {};
         for (const key in obj) {
         const newKey = key.replace(/^v_/, '');
         newObj[newKey] = obj[key];
         }
         return newObj;
      },
      getProducts: function() {
         xaxios.get(`inventory/products-px?q=${this._q ? this._q : ''}&page=${this._page}&per_page=${this._pageSize}&order=${this._order}`).then((r) => {
            this.products = r.data.items;
            this._totalPages = r.data.total_pages;
            this._totalItems = r.data.total_items;
         })
      },
      _clickCallback: function (pageNum) {
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
            this.product_id = this.product?.id;
            this.quantity = this.product?.quantity ? parseFloat(this.product?.quantity) : null;
         })
      },
      getStockHeader: function(id) {
         xaxios.get(`inventory/stock-header/${id ? id : ''}`).then((r) => {
            this.stock_header = r.data;
            this.stock_header_id = this.stock_header.id;
            this.title = this.stock_header.title;
            this.date = this.stock_header.date;
            this.info = this.stock_header.info;
            this.stockist_id = this.stock_header.stockist_id;
         })
      },
      getStockHeaders: function() {
         this.isListLoading = true;
         xaxios.get(`inventory/stock-header-px?q=${this.q ? this.q : ''}&page=${this.page}&per_page=${this.pageSize}&order=${this.order}`).then((r) => {
            this.stock_headers = r.data.items;
            this.totalPages = r.data.total_pages;
            this.totalItems = r.data.total_items;
            setTimeout(() => {
               this.isListLoading = false;
            }, 400);
         })
      },
      clickCallback: function (pageNum) {
         this.page = pageNum;
         this.getStockHeaders();
      },
      getStockists: function(q) {
         xaxios.get(`users?q=${q ? q : ''}`).then((res) => {
            this.stockists = res.data;
         })
      },
      StockistChanged: function(v) {

      },
      goSH: function(f) {
         let y = this.removeVCharacterFromKeys(f);
         if (this.isEditHeader) {
            y['id'] = this.stock_header_id;
            xaxios.patch(`/inventory/stock-header`, y).then((r) => {
               this.colshow = 'so_list';
               this.getStockHeaders();
            })
         } else {
            xaxios.post(`/inventory/stock-header`, y).then((r) => {
               this.colshow = 'so_list';
               this.getStockHeaders();
            })
         }
      },
      delSH: function(id) {
         if (id) {
            xaxios.delete(`/inventory/stock-header/${id}`).then((r) => {
               this.colshow = 'so_list';
               this.getStockHeaders();
            })
         }
      },
      getStockDetailsByStockHeaderIdAll: function(id) {
         if (id) {
            xaxios.get(`/inventory/stock-details-x-all/${id}`).then((r) => {
               this.stock_details_all = r.data;
            })
         }
      },
      getStockDetailsByStockHeaderId: function(id) {
         if (id) {
            xaxios.get(`/inventory/stock-details-x?stock_header_id=${id}&q=${this.__q ? this.__q : ''}&page=${this.__page}&per_page=${this.__pageSize}&order=${this.__order}`).then((r) => {
               this.stock_details = r.data.items;
               this.__totalPages = r.data.total_pages;
               this.__totalItems = r.data.total_items;
            })
         }
      },
      __clickCallback: function (pageNum) {
         this.__page = pageNum;
         this.getStockDetailsByStockHeaderId(this.stock_header_id);
      },
      addProduct: function(id) {
         let y = {
            stock_header_id: this.stock_header_id,
            product_id: id
         }
         xaxios.post(`/inventory/stock-details`, y).then((r) => {
            this.getStockDetailsByStockHeaderIdAll(this.stock_header_id);
         })
      },
      remProduct: function(id) {
         xaxios.delete(`/inventory/stock-details/${id}`).then((r) => {
            this.getStockDetailsByStockHeaderIdAll(this.stock_header_id);
         })
      },
      saveSD: function() {
         let el = this.$refs.item;
         if (!el) {
            return false;
         }

         let ex = [];
         el.forEach((e) => {
            ex.push({
               id: null,
               stock_details_id: this.stock_details_id,
               buy_header_id: e.getAttribute('buy_header_id'),
               buy_details_id: e.getAttribute('buy_details_id'),
               buy_product_hub_id: e.getAttribute('buy_product_hub_id'),
               product_id: this.product.id,
               quantity_1: parseFloat(e.getAttribute('quantity_1')),
               quantity_2: parseFloat(e.value) ? parseFloat(e.value) : parseFloat(e.getAttribute("val")),
               info: null
            })
         });

         let y = {
            id: this.stock_details_id,
            quantity_2: this.quantity_2,
            info: this._info,
            details_ext: ex
         }
         
         xaxios.patch(`/inventory/stock-details`, y).then((r) => {
            this.colshow = 'so_yuk';
            this.getStockHeader(this.stock_header_id);
            this.getStockDetailsByStockHeaderId(this.stock_header_id);
         })
      },
      getStockDetails: function(id) {
         if (id) {
            xaxios.get(`/inventory/stock-details/${id}`).then((r) => {
               this._info = r.data.info;
               this.quantity_2 = r.data.quantity_2;
               this._stock_details = r.data;
               let s = 0;
               this._stock_details.details_ext.forEach((e) => {
                  s += parseInt(e.quantity_2);
               })
               this.s_quantities = s;
            })
         }
      },
      itemChanged: function() {
         let s = 0;
         let el = this.$refs.item;
         el.forEach((e) => {
            s += e.value ? parseInt(e.value) : 0;
         })
         this.s_quantities = s;
         console.log(s);
      },
      adjustStock: function() {
         const dialog = createConfirmDialog(ModalDialog);
         dialog.onConfirm(() => {
            this.isConfirmed = true;
            xaxios.post(`/inventory/stock-adjust/${this.stock_header_id}`).then((r) => {
               this.colshow = 'so_list';
               this.getStockHeaders();
               this.toast.success("Berhasil melakukan penyesuaian", {
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
            }).catch((err) => {
               this.toast.error("Gagal melakukan penyesuaian", {
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
         });
         dialog.reveal();
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
.table-header tr th:nth-child(4) {
   background-color: #f1f1e5;
}
.table-header tr td:nth-child(4) {
   background-color: #f0f0f06c;
}
.table-header tr:last-child {
   border-bottom: 1px solid #e4dede !important;
}
</style>

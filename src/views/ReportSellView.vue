<template>
   <div ref="main" id="main" class="container is-fluid mt-5 p-32">
      <page-header></page-header>

      <div class="columns is-multiline is-variable is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd mt-0">
         <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
            <div class="columns is-multiline is-variable is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd mt-0">
               <div class="column is-full-mobile is-one-quarter-tablet is-one-third-desktop is-one-fifth-widescreen pb-1 pt-1" style="min-width: 160px;">
                  <VueDatePicker v-model="date_start" :highlight-week-days="[0, 6]" :enable-time-picker="false" :format="'dd/MM/yyyy'" position="left"></VueDatePicker>
               </div>
               <div class="column is-full-mobile is-one-quarter-tablet is-one-third-desktop is-one-fifth-widescreen pb-1 pt-1" style="min-width: 160px;">
                  <VueDatePicker v-model="date_end" :highlight-week-days="[0, 6]" :enable-time-picker="false" :format="'dd/MM/yyyy'" position="left"></VueDatePicker>
               </div>
               <div class="column is-full-mobile is-one-quarter-tablet is-one-third-desktop is-one-fifth-widescreen pb-1 pt-1">
                  <p class="buttons">
                     <button class="button" style="height: 38px;" v-on:click="expExcel">
                        <span class="icon is-small">
                           <img src="../assets/images/excel.svg" style="width: 1.5rem;">
                        </span>
                     </button>
                  </p>
               </div>
            </div>
         </div>
      </div>

      <div class="columns is-multiline is-variable is-1-mobile is-1-tablet is-1-desktop is-1-widescreen is-1-fullhd mt-0">
         <div class="column is-full-mobile is-full-tablet is-full-desktop is-full-widescreen pb-1 pt-1">
            <div class="is-relative">
               <loading class="loading" v-model:active="isLoading"
                  :can-cancel="false"
                  :background-color="'white'"
                  :opacity="1"
                  :height="25"
                  :width="25"
                  :z-index="25"
                  :loader="'spinner'"
                  :is-full-page="fullPage">
                  </loading>
               <v-chart v-if="this.stats_sell_trends?.series?.length > 0"
                  :key="stats_sell_trends?.series"
                  class="chart border" 
                  style="width: 100%; height: 400px;" 
                  :option="stats_sell_trends"
                  :initOptions="initOEcharts" 
                  autoresize/>
               <div v-else class="v-charte">
                  <span>No data..</span>
               </div>
            </div>
         </div>
         <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
            <div class="is-relative">
               <loading class="loading" v-model:active="isLoading"
                  :can-cancel="false"
                  :background-color="'white'"
                  :opacity="1"
                  :height="25"
                  :width="25"
                  :z-index="25"
                  :loader="'spinner'"
                  :is-full-page="fullPage">
                  </loading>
               <v-chart v-if="this.stats_sell_payment_status?.series?.length > 0"
                  :key="stats_sell_payment_status?.series"
                  class="chart border" 
                  style="width: 100%; height: 400px;" 
                  :option="stats_sell_payment_status"
                  :initOptions="initOEcharts" 
                  autoresize/>
               <div v-else class="v-charte">
                  <span>No data..</span>
               </div>
            </div>
         </div>
         <div class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen pb-1 pt-1">
            <div class="is-relative">
               <loading class="loading" v-model:active="isLoading"
                  :can-cancel="false"
                  :background-color="'white'"
                  :opacity="1"
                  :height="25"
                  :width="25"
                  :z-index="25"
                  :loader="'spinner'"
                  :is-full-page="fullPage">
                  </loading>
               <v-chart v-if="this.stats_sell_order_status?.series?.length > 0"
                  :key="stats_sell_order_status?.series"
                  class="chart border" 
                  style="width: 100%; height: 400px;" 
                  :option="stats_sell_order_status"
                  :initOptions="initOEcharts" 
                  autoresize/>
               <div v-else class="v-charte">
                  <span>No data..</span>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
 
<script>
import { color_one, color_two, color_three, color_four, color_five } from '../utils/useful';
import { xaxios } from '@/utils/xaxios';
import _ from 'lodash';
import * as XLSX from 'xlsx';
import debounce from 'lodash.debounce';
import moment from 'moment';
import Loading from "vue-loading-overlay";
import vSelect from "vue-select";
import { use } from "echarts/core";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";
import { LineChart, BarChart, PieChart, ThemeRiverChart } from "echarts/charts";
import {
VisualMapComponent,
GridComponent,
TitleComponent,
TooltipComponent,
LegendComponent,
ToolboxComponent,
DataZoomComponent,
MarkLineComponent,
DatasetComponent,
GraphicComponent
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

use([
   DataZoomComponent,
   ToolboxComponent,
   VisualMapComponent,
   CanvasRenderer,
   GridComponent,
   DatasetComponent,
   GraphicComponent,
   LineChart,
   BarChart,
   PieChart,
   TitleComponent,
   TooltipComponent,
   LegendComponent,
   SVGRenderer,
   MarkLineComponent,
   ThemeRiverChart
]);

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
   name: 'ReportSell',
   components: {
      Loading,
      VChart,
      vSelect,
      VueDatePicker
   },
   data() {
      return {
         dataToExport: null,
         date_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
         date_end: new Date(),
         isLoading: false,
         fullPage: false,
         initOEcharts: { 
            renderer: "svg" 
         },
         stats_sell_trends: {},
         stats_sell_payment_status: {},
         stats_sell_order_status: {}
      }
   },
   watch: {
      date_start: function(v) {
         this.date_start = v;
         this.get_stats_sell_trends();
         this.get_stats_sell_payment_status();
         this.get_stats_sell_order_status();
      },
      date_end: function(v) {
         this.date_end = v;
         this.get_stats_sell_trends();
         this.get_stats_sell_payment_status();
         this.get_stats_sell_order_status();
      }
   },
   mounted() {
      this.get_stats_sell_trends();
      this.get_stats_sell_payment_status();
      this.get_stats_sell_order_status();
   },
   methods: {
      get_stats_sell_payment_status: function() {
         xaxios.get(`stats/sell-payment-status?date_start=${moment(this.date_start).format('YYYY-MM-DD HH:mm:ss')}&date_end=${moment(this.date_end).format('YYYY-MM-DD HH:mm:ss')}`).then((r) => {
            const dx = [];
            r.data.forEach((e) => {
               dx.push({'value': e.count, 'name': e.status});
            });
            this.stats_sell_payment_status = {
               title: {
                  text: 'Status Pembayaran Penjualan',
                  subtext: 'Berdasarkan data status pembayaran penjualan',
                  textStyle: {
                     color: '#615B59',
                     fontWeight: 'bold',
                     fontSize: 15
                  }
               },
               grid: {
                  show: false,
                  left: 10,
                  top: 100,
                  right: 40,
                  bottom: 10,
                  containLabel: true
               },
               legend: {
                  show: true,
                  top: '0',
                  right: '0'
               },
               tooltip: {
                  trigger: 'item',
                  // formatter: `<span class='is-underlined'>{a}</span> <br/>{b} : {c} ({d}%)`
                  formatter: `{b} : {c} ({d}%)`
               },
               toolbox: {
                  show: true,
                  top: 90,
                  orient: 'vertical',
                  feature: {
                     mark: { show: true },
                     dataView: { show: true, readOnly: false },
                     magicType: { show: true, type: ['line', 'bar'] },
                     restore: { show: true },
                     saveAsImage: { show: true }
                  }
               },
               series: [
                  {
                     name: '',
                     type: 'pie',
                     radius: [30, 85],
                     center: ['50%', '60%'],
                     roseType: 'area', // radius, area
                     data: dx,
                     color: color_five,
                     label: {
                        show: true,
                        alignTo: 'none', // labelLine, edge, none
                        formatter: '{name|{b}}\n{time|{d} %}',
                        // minMargin: 5,
                        // edgeDistance: 100,
                        lineHeight: 15,
                        rich: {
                           time: {
                              fontSize: 10,
                              color: '#999'
                           }
                        }
                     },
                     emphasis: {
                        itemStyle: {
                           shadowBlur: 10,
                           shadowOffsetX: 0,
                           shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                     }
                  }
               ]
            }
         })
      },
      get_stats_sell_order_status: function() {
         xaxios.get(`stats/sell-order-status?date_start=${moment(this.date_start).format('YYYY-MM-DD HH:mm:ss')}&date_end=${moment(this.date_end).format('YYYY-MM-DD HH:mm:ss')}`).then((r) => {
            const dx = [];
            r.data.forEach((e) => {
               dx.push({'value': e.count, 'name': e.status});
            });
            this.stats_sell_order_status = {
               title: {
                  text: 'Status Pesanan Penjualan',
                  subtext: 'Berdasarkan data status pesanan penjualan',
                  textStyle: {
                     color: '#615B59',
                     fontWeight: 'bold',
                     fontSize: 15
                  }
               },
               grid: {
                  show: false,
                  left: 10,
                  top: 100,
                  right: 40,
                  bottom: 10,
                  containLabel: true
               },
               legend: {
                  show: true,
                  top: '0',
                  right: '0'
               },
               tooltip: {
                  trigger: 'item',
                  // formatter: `<span class='is-underlined'>{a}</span> <br/>{b} : {c} ({d}%)`
                  formatter: `{b} : {c} ({d}%)`
               },
               toolbox: {
                  show: true,
                  top: 90,
                  orient: 'vertical',
                  feature: {
                     mark: { show: true },
                     dataView: { show: true, readOnly: false },
                     magicType: { show: true, type: ['line', 'bar'] },
                     restore: { show: true },
                     saveAsImage: { show: true }
                  }
               },
               series: [
                  {
                     name: '',
                     type: 'pie',
                     radius: [30, 85],
                     center: ['50%', '60%'],
                     roseType: 'area', // radius, area
                     data: dx,
                     color: color_five,
                     label: {
                        show: true,
                        alignTo: 'none', // labelLine, edge, none
                        formatter: '{name|{b}}\n{time|{d} %}',
                        // minMargin: 5,
                        // edgeDistance: 100,
                        lineHeight: 15,
                        rich: {
                           time: {
                              fontSize: 10,
                              color: '#999'
                           }
                        }
                     },
                     emphasis: {
                        itemStyle: {
                           shadowBlur: 10,
                           shadowOffsetX: 0,
                           shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                     }
                  }
               ]
            }
         })
      },
      get_stats_sell_trends: function() {
         xaxios.get(`stats/sell-trends?date_start=${moment(this.date_start).format('YYYY-MM-DD HH:mm:ss')}&date_end=${moment(this.date_end).format('YYYY-MM-DD HH:mm:ss')}`).then((r) => {
            const dx = [];
            const dates = [];
            const quantities = [];
            const prices = [];
            r.data.forEach((e) => {
               dates.push(e.date);
               quantities.push([e.date, e.quantity]);
               prices.push([e.date, e.price_total]);
               dx.push({'TGL PENJUALAN': moment(e.date).format('YYYY-MM-DD'), 'JML PENJUALAN': e.quantity ?? 0, 'NILAI PENJUALAN': e.price_total ?? 0});
            });
            this.dataToExport = dx;
            this.stats_sell_trends = {
               title: {
                  text: 'Tren Penjualan Harian',
                  subtext: 'Berdasarkan jumlah dan nilai penjualan',
                  left: '0',
                  top: '',
                  textStyle: {
                     color: '#615B59',
                     fontWeight: 'bold',
                     fontSize: 15
                  }
               },
               grid: {
                  show: false,
                  left: 10,
                  top: 100,
                  right: 10,
                  bottom: 10,
                  containLabel: true
               },
               tooltip: {
                  confine: true,
                  trigger: 'axis',
                  formatter: function (params) {
                     var f = `<div class='has-text-left is-underlined mb-2'>${moment(params[0].axisValueLabel).format('DD/MM/YYYY')}<br/></div>`+
                     `<div class='has-text-left mb-2'>${params[0].marker}&nbsp;` + new Intl.NumberFormat('id').format(params[0].value[1] ? params[0].value[1].toFixed(0) : 0) + `<br/></div>`+
                     `<div class='has-text-left mb-2'>${params[1].marker}&nbsp;IDR&nbsp;` + new Intl.NumberFormat('id').format(params[1].value[1] ? params[1].value[1].toFixed(0) : 0) + `</span><br/></div>`;
                     return f;
                  }
               },
               toolbox: {
                  show: true,
                  top: '30',
                  orient: 'horizontal',
                  feature: {
                     mark: { show: true },
                     dataView: { show: true, readOnly: true },
                     magicType: { show: true, type: ['line', 'bar'] },
                     restore: { show: true },
                     saveAsImage: { show: true }
                  }
               },
               legend: {
                  show: true,
                  top: '0',
                  right: '0'
               },
               xAxis: [
                  {
                     type: 'time',
                     // boundaryGap: true,
                     data: dates,
                     splitLine: {
                        show: false
                     },
                     axisLine: { onZero: false }
                  },
                  {
                     type: 'time',
                     show: false,
                     // boundaryGap: true,
                     data: dates,
                     splitLine: {
                        show: false
                     },
                     axisLine: { onZero: false }
                  }
               ],
               yAxis: [
                  {
                     type: 'value',
                     scale: true,
                     splitLine: {
                        show: false
                     },
                     axisPointer: {
                        snap: true
                     },
                     axisLabel: {
                        fontWeight: 'normal',
                        // color: '#37a2da'
                     }
                  },
                  {
                     type: 'value',
                     scale: true,
                     axisLabel: {
                        formatter: function(v) {
                           return new Intl.NumberFormat('id', {notation: "compact", maximumFractionDigits: 1}).format(v)
                        },
                        fontWeight: 'normal',
                        // color: '#dd6b66'
                     },
                  }
               ],
               series: [
                  {
                     name: 'Jumlah Penjualan',
                     type: 'line',
                     data: quantities,
                     color: color_one,
                     showSymbol: false,
                     smooth: true
                  },
                  {
                     name: 'Nilai Penjualan',
                     type: 'line',
                     data: prices,
                     color: color_two,
                     showSymbol: false,
                     smooth: true,
                     xAxisIndex: 1,
                     yAxisIndex: 1
                  }
               ]
            }
         })
      },
      expExcel: function() {
         var wb = XLSX.utils.book_new();
         var ws = XLSX.utils.json_to_sheet(this.dataToExport);
         XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
         XLSX.writeFile(wb, "TREN PENJUALAN" + ".xlsx");
      }
   }
}
</script>

<style>
@import "bulma-extensions/bulma-divider/dist/css/bulma-divider.min.css";
.chart {
   width: 100%;
   min-height: 400px;
   padding: 15px 13px 13px 13px;
   border-radius: 4px;
}
.loading {
   border: 1px solid #d9d9d9;
   border-radius: 4px;
}
.v-charte {
   text-align: center;
   width: 100%;
   min-height: 400px;
   border: 1px solid gainsboro;
   border-radius: 4px;
   padding-top: 170px;
}
</style>
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
                     <button class="button" style="height: 38px;">
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
                  <v-chart v-if="this.stats_buy_header_count?.series?.length > 0"
                     :key="stats_buy_header_count?.series"
                     class="chart border" 
                     style="width: 100%; height: 400px;" 
                     :option="stats_buy_header_count"
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
                  <v-chart v-if="this.stats_buy_header_prices?.series?.length > 0"
                     :key="stats_buy_header_prices?.series"
                     class="chart border" 
                     style="width: 100%; height: 400px;" 
                     :option="stats_buy_header_prices"
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
   name: 'ReportBuy',
   components: {
      Loading,
      VChart,
      vSelect,
      VueDatePicker
   },
   data() {
      return {
         date: new Date('01/01/'+new Date().getFullYear().toString()),
         date_start: new Date('01/01/'+new Date().getFullYear().toString()),
         date_end: new Date(),
         isLoading: false,
         fullPage: false,
         initOEcharts: { 
            renderer: "svg" 
         },
         stats_buy_header_count: {},
         stats_buy_header_prices: {}
      }
   },
   watch: {
      date_start: function(v) {
         this.date_start = v;
         this.get_stats_buy_header_count();
         this.get_stats_buy_header_prices();
      },
      date_end: function(v) {
         this.date_end = v;
         this.get_stats_buy_header_count();
         this.get_stats_buy_header_prices();
      }
   },
   mounted() {
      this.get_stats_buy_header_count();
      this.get_stats_buy_header_prices();
   },
   methods: {
      get_stats_buy_header_count: function() {
         xaxios.get(`stats/buy-header-count?date_start=${moment(this.date_start).format('YYYY-MM-DD HH:mm:ss')}&date_end=${moment(this.date_end).format('YYYY-MM-DD HH:mm:ss')}`).then((r) => {
            const dx = [];

            r.data.forEach((e) => {
               dx.push([e.date, e.value]);
            });

            this.stats_buy_header_count = {
               title: {
                  text: 'Transaksi Pembelian Harian',
                  subtext: 'Berdasarkan data jumlah invoice',
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
               tooltip: {
                  confine: true,
                  trigger: 'axis',
                  formatter: function (params) {
                     var f = `<div class='has-text-left mb-2'>${params[0].marker} ${moment(params[0].axisValueLabel).format('DD/MM/YYYY')}&nbsp;~&nbsp;&nbsp;` + `<span class='is-pulled-right'><b>` + new Intl.NumberFormat('id').format(params[0].value[1] ? params[0].value[1].toFixed(0) : 0) + `</b></span><br/></div>`;
                     return f;
                  }
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
               xAxis: {
                  type: 'time',
                  splitLine: {
                     show: false
                  },
                  axisLine: { onZero: false },
                  axisLabel: {
                     hideOverlap: true
                  }
               },
               yAxis: {
                  type: 'value',
                  splitLine: {
                     show: false
                  },
                  axisLabel: {
                     formatter: '{value}'
                  },
                  axisPointer: {
                     snap: true
                  }
               },
               series: [
                  {
                     name: 'Jumlah transaksi',
                     type: 'line',
                     showSymbol: false,
                     data: dx,
                     smooth: true,
                     areaStyle: {}
                  }
               ]
            }
         })
      },
      get_stats_buy_header_prices: function() {
         xaxios.get(`stats/buy-header-prices?date_start=${moment(this.date_start).format('YYYY-MM-DD HH:mm:ss')}&date_end=${moment(this.date_end).format('YYYY-MM-DD HH:mm:ss')}`).then((r) => {
            const dx = [];

            r.data.forEach((e) => {
               dx.push([e.date, e.value ?? 0]);
            });

            this.stats_buy_header_prices = {
               title: {
                  text: 'Nilai Transaksi Pembelian Harian',
                  subtext: 'Berdasarkan data nilai invoice (IDR)',
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
               tooltip: {
                  confine: true,
                  trigger: 'axis',
                  formatter: function (params) {
                     var f = `<div class='has-text-left mb-2'>${params[0].marker} ${moment(params[0].axisValueLabel).format('DD/MM/YYYY')}&nbsp;~&nbsp;&nbsp;` + `<span class='is-pulled-right'><b>` + new Intl.NumberFormat('id').format(params[0].value[1] ? params[0].value[1].toFixed(0) : 0) + `</b></span><br/></div>`;
                     return f;
                  }
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
               xAxis: {
                  type: 'time',
                  splitLine: {
                     show: false
                  },
                  axisLine: { onZero: false }
               },
               yAxis: {
                  type: 'value',
                  axisLabel: {
                     formatter: function(v) {
                        return new Intl.NumberFormat('id', {notation: "compact", maximumFractionDigits: 1}).format(v)
                     }
                  },
                  splitLine: {
                     show: false
                  },
                  axisPointer: {
                     snap: true
                  }
               },
               series: [
                  {
                     name: 'Jumlah transaksi',
                     type: 'line',
                     color: color_two,
                     showSymbol: false,
                     data: dx,
                     smooth: true,
                     areaStyle: {}
                  }
               ]
            }
         })
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
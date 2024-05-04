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
                  <v-chart v-if="this.profit_loss?.series?.length > 0"
                     :key="profit_loss?.series"
                     class="chart border" 
                     style="width: 100%; height: 400px;" 
                     :option="profit_loss"
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
GraphicComponent,
MarkAreaComponent
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
   MarkAreaComponent,
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
   name: 'ReportProfit',
   components: {
      Loading,
      VChart,
      vSelect,
      VueDatePicker
   },
   data() {
      return {
         dataToExport: null,
         date_start: new Date('01/01/'+new Date().getFullYear()),
         date_end: new Date(),
         isLoading: false,
         fullPage: false,
         initOEcharts: { 
            renderer: "svg" 
         },
         profit_loss: {}
      }
   },
   watch: {
      date_start: function(v) {
         this.date_start = v;
         this.get_profit_loss();
      },
      date_end: function(v) {
         this.date_end = v;
         this.get_profit_loss();
      }
   },
   mounted() {
      this.get_profit_loss();
   },
   methods: {
      get_profit_loss: function() {
         xaxios.get(`stats/profit-lossx?date_start=${moment(this.date_start).format('YYYY-MM-DD HH:mm:ss')}&date_end=${moment(this.date_end).format('YYYY-MM-DD HH:mm:ss')}`).then((r) => {
            const dx = [];
            const months = [];
            const buy_count = [];
            const buy_price_total = [];
            const sell_count = [];
            const sell_price_total = [];
            const profit_loss = [];
            r.data.forEach((e) => {
               months.push(e.month);
               buy_count.push([e.month, e.buy_count]);
               buy_price_total.push([e.month, e.buy_price_total]);
               sell_count.push([e.month, e.sell_count]);
               sell_price_total.push([e.month, e.sell_price_total]);
               profit_loss.push([e.month, e.profit_loss]);
               dx.push({'BULAN': e.month, 'NILAI PEMBELIAN': e.buy_price_total ?? 0, 'NILAI PENJUALAN': e.sell_price_total ?? 0, 'LABA': e.profit_loss ?? 0});
            });
            this.dataToExport = dx;
            this.profit_loss = {
               title: {
                  text: 'Laba',
                  subtext: 'Berdasarkan nilai pembelian dan penjualan',
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
                     var f = `<div class='has-text-left is-underlined mb-2'>${params[0].axisValueLabel}<br/></div>`+
                     `<div class='has-text-left mb-2'>${params[0].marker}&nbsp;IDR&nbsp;` + new Intl.NumberFormat('id').format(params[0].value[1] ? params[0].value[1].toFixed(0) : 0) + `<br/></div>`+
                     `<div class='has-text-left mb-2'>${params[1].marker}&nbsp;IDR&nbsp;` + new Intl.NumberFormat('id').format(params[1].value[1] ? params[1].value[1].toFixed(0) : 0) + `<br/></div>`+
                     `<div class='has-text-left mb-2'>${params[2].marker}&nbsp;IDR&nbsp;` + new Intl.NumberFormat('id').format(params[2].value[1] ? params[2].value[1].toFixed(0) : 0) + `</span><br/></div>`;
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
                  right: '0',
                  // data: [
                  //    { name: 'Nilai Pembelian' },
                  //    { name: 'Nilai Penjualan' },
                  //    {
                  //       name: 'Laba',
                  //       itemStyle: {
                  //          color: ''
                  //       }
                  //    }
                  // ]
               },
               xAxis: {
                  type: 'category',
                  show: true,
                  // boundaryGap: true,
                  data: months,
                  splitLine: {
                     show: false
                  },
                  axisLine: { onZero: false }
               },
               yAxis: {
                  type: 'value',
                  scale: true,
                  axisLabel: {
                     formatter: function(v) {
                        return new Intl.NumberFormat('id', {notation: "compact", maximumFractionDigits: 1}).format(v)
                     },
                     fontWeight: 'normal',
                     // color: '#dd6b66'
                  },
                  minorSplitLine: {
                     show: false
                  }
               },
               series: [
                  {
                     name: 'Nilai Pembelian',
                     type: 'bar',
                     data: buy_price_total,
                     color: color_one,
                     showSymbol: false,
                     smooth: true
                  },
                  {
                     name: 'Nilai Penjualan',
                     type: 'bar',
                     data: sell_price_total,
                     color: color_two,
                     showSymbol: false,
                     smooth: true,
                  },
                  {
                     name: 'Laba',
                     type: 'bar',
                     data: profit_loss,
                     // data: profit_loss.map(item => {
                     //    return {
                     //       value: item,
                     //       itemStyle: {
                     //          color: item[1] > 0 ? '#A3C754' : '#C754A3'
                     //       }
                     //    }
                     // }),
                     color: '',
                     lineStyle: {
                        type: 'dashed'
                     },
                     showSymbol: false,
                     smooth: true,
                     markLine: {
                        silent: true,
                        lineStyle: {
                           color: '#333',
                           // type: 'solid'
                        },
                        symbol: 'none',
                        label: {
                           show: false,
                           position: 'middle'
                        },
                        data: [
                           { yAxis: 0 },
                        ]
                     }
                  }
               ],
            }
         })
      },
      expExcel: function() {
         var wb = XLSX.utils.book_new();
         var ws = XLSX.utils.json_to_sheet(this.dataToExport);
         XLSX.utils.book_append_sheet(wb, ws, 'sheet1');
         XLSX.writeFile(wb, "LABA" + ".xlsx");
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
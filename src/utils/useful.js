import moment from "moment";
import CryptoJS from "crypto-js";
import { AES } from "crypto-js";


const toDate = (str) => {
   return moment(str).format('DD/MM/YYYY');
}

const toIdDate = (date) => {
   const year = date?.toLocaleString("id-ID", { year: "numeric" });
   const month = date?.toLocaleString("id-ID", { month: "2-digit" });
   const day = date?.toLocaleString("id-ID", { day: "2-digit" });
   const formattedDate = day + "/" + month + "/" + year;
   return formattedDate;
}

const toDbDate = (date) => {
   const year = date?.toLocaleString("id-ID", { year: "numeric" });
   const month = date?.toLocaleString("id-ID", { month: "2-digit" });
   const day = date?.toLocaleString("id-ID", { day: "2-digit" });
   const formattedDate = year + "-" + month + "-" + day;
   return formattedDate;
}

const toDbDateTime = (date) => {
   const year = date?.toLocaleString("id-ID", { year: "numeric" });
   const month = date?.toLocaleString("id-ID", { month: "2-digit" });
   const day = date?.toLocaleString("id-ID", { day: "2-digit" });
   const time = moment(new Date(date)).format("HH:mm");
   const formattedDate = year + "-" + month + "-" + day + " " + time;
   return formattedDate;
}

const toEncrypt = (text, key) => {
   return AES.encrypt(text, key).toString();
}

const toDecrypt = (encryptedText, key) => {
   return AES.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8);
}

const limitText = (text, textLength) => {
   return text.split(/\s+/).reduce(function(prev, curr) {
      if (prev.length && (prev[prev.length - 1] + ' ' + curr).length <= textLength) {
         prev[prev.length - 1] += ' ' + curr;
      }
      else {
         prev.push(curr);
      }
      return prev;
   }, [])[0] + ' ...'
}

const createMask = (string, currency) => {
   if (currency === 'IDR') {
      return string.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
   } else {
      return string.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
   }
}

// Function to convert a string number to currency format
function formatCurrency(numberString, locale = 'en-US', currency = 'USD') {
   // Parse the string to a number
   const number = parseFloat(numberString);
 
   // Check if the number is valid
   if (isNaN(number)) {
     console.error('Invalid number');
     return '';
   }
 
   // Use Intl.NumberFormat to format the number as currency
   const formatter = new Intl.NumberFormat(locale, {
     style: 'currency',
     currency: currency,
   });
 
   return formatter.format(number);
}

function formatCurrencyToFloat(s) {
   return parseFloat(s.replace(/[^\d.,]/g, '').replace('.','').replace(',','.'));
}
 
const destroyMask = (string) => {
   return string.replace(/\D/g,'');
}

// echarts themes

const color_one = ['#37A2DA','#32C5E9','#67E0E3','#9FE6B8','#FFDB5C','#ff9f7f','#fb7293','#E062AE','#E690D1','#e7bcf3','#9d96f5','#8378EA','#96BFFF']
const color_two = ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab','#91ca8c','#f49f42']
const color_three = ['#c23531','#2f4554','#61a0a8','#d48265','#91c7ae','#749f83','#ca8622','#bda29a','#6e7074','#546570','#c4ccd3']
const color_four = ["#516b91","#59c4e6","#edafda","#93b7e3","#a5e7f0","#cbb0e3"]
const color_five = ["#4ea397","#22c3aa","#7bd9a5","#d0648a","#f58db2","#f2b3c9"]

export {
   toDate,
   toIdDate,
   toDbDate,
   toDbDateTime,
   toEncrypt,
   toDecrypt,
   limitText,
   createMask,
   destroyMask,
   formatCurrency,
   formatCurrencyToFloat,
   color_one,
   color_two,
   color_three,
   color_four,
   color_five
}
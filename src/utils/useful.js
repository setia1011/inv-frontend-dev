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
 
const destroyMask = (string) => {
   return string.replace(/\D/g,'');
}

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
   formatCurrency
}
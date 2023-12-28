import axios from "axios";

const xaxios = axios.create({
   baseURL: import.meta.env.DEV ? import.meta.env.VITE_DEV_BASE_URL_API : import.meta.env.VITE_PROD_BASE_URL_API,
});

const setAuthHeaderX = (token) => {
   if (token) {
      xaxios.defaults.headers = {
         Authorization: 'Bearer ' + token
      }
   } else {
      delete xaxios.defaults.headers.Authorization;
   }
}

export {
   xaxios,
   setAuthHeaderX
}
<template>
   <div ref="main" id="main" class="container is-fluid mt-5 p-32">
     <page-header></page-header>
     ...
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
   name: 'Supplier',
   components: {
      Loading, Paginate, Form, Field, ErrorMessage, vSelect, VueDatePicker
   },
   setup() {
      const toast = useToast();
      const valForm = ref(
         yup.object({
            v_username: yup.string().required().label('Username'),
            v_password: yup.string().required().label('Password'),
            v_email: yup.string().required().label('Email'),
            v_name: yup.string().required().label('Nama'),
            v_role_id: yup.number().integer().required().label('Role'),
            v_id_type: yup.number().integer().required().label('Jenis ID'),
            v_id_number: yup.string().required().label('Nomor ID'),
            v_phone: yup.string().required().label('Phone'),
            v_address: yup.string().required().label('Alamat'),
            v_status: yup.string().required().label('Status'),

            v_company: yup.string().required().label('Username'),
            v_responsible: yup.string().required().label('Username'),
            v_category: yup.string().required().label('Username'), 
            v_bank: yup.string().required().label('Username'), 
            v_bank_account_number: yup.string().required().label('Username'),
            v_bank_account_name: yup.string().required().label('Username'),
            v_email: yup.string().required().label('Username'),
            v_phone: yup.string().required().label('Username'), 
            v_address: yup.string().required().label('Username'), 
            v_rt: yup.string().required().label('Username'), 
            v_rw: yup.string().required().label('Username'),
            v_kelurahan: yup.string().required().label('Username'), 
            v_kecamatan: yup.string().required().label('Username'), 
            v_kabupaten: yup.string().required().label('Username'), 
            v_provinsi: yup.string().required().label('Username'), 
            v_postcode: yup.string().required().label('Username'), 
            v_info: yup.string().required().label('Username')
         })
      );
      return { toast, valForm }
   },
   mounted() {
   }
}
</script>
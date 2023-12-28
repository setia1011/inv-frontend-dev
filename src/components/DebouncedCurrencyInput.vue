<template>
   <input ref="inputRef" type="text" />
 </template>
 
 <script>
 import { watch } from 'vue'
 import { useCurrencyInput } from "vue-currency-input";
 import { watchDebounced } from "@vueuse/core";
 
 export default {
   name: "DebouncedCurrencyInput",
   props: {
     modelValue: Number, // Vue 2: value
     options: Object,
   },
   setup(props, { emit }) {
     const { inputRef, numberValue, setOptions, setValue } = useCurrencyInput(props.options, false);
 
     watchDebounced(numberValue, (value) => emit("update:modelValue", value), {
       debounce: 1000,
     });

     watch(
      () => props.modelValue, // Vue 2: props.value
      (value) => {
        setValue(value)
      }
    )

    watch(
      () => props.options,
      (options) => {
        setOptions(options)
      }
    )
 
     return { inputRef };
   },
 };
 </script>
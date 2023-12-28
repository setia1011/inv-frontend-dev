<script setup>
  const emit = defineEmits(['confirm', 'cancel'])
</script>
<template>
   <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
         <section class="modal-card-body p-0" style="border-radius: 6px 6px 0 0;">
            <div class="notification is-light pl-3 pr-3">Click on <strong>Confirm</strong> if you are sure what you're doing, or click <strong>Cancel</strong> instead.</div>
         </section>
         <footer class="modal-card-foot pb-2 pt-2 pl-3 pr-3">
            <button class="button is-small is-success" @click="emit('confirm')">Confirm</button>
            <button class="button is-small" @click="emit('cancel')">Cancel</button>
         </footer>
      </div>
   </div>
</template>
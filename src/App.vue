<template>
  <component :is="this.$route.meta.layout">
     <router-view></router-view>

     <!-- Dialog -->
     <DialogsWrapper />
  </component>
</template>
  
<script>
export default {
  name: 'App'
}
</script>
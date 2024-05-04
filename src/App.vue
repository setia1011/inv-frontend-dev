<template>
  <component :is="this.$route.meta.layout">
    <router-view></router-view>
    <loading class="loading" v-model:active="isLoading"
      :can-cancel="false"
      :background-color="'white'"
      :opacity="1"
      :height="25"
      :width="25"
      :z-index="999999"
      :loader="'spinner'"
      :is-full-page="fullPage">
      <template v-slot="before">
        <img src="../src/assets/images/loading.webp" style="width: 15rem" />
      </template>
    </loading>
    <!-- Dialog -->
    <DialogsWrapper />
  </component>
</template>
  
<script>
import Loading from "vue-loading-overlay";
import { authStore } from '@/stores/auth';
export default {
  name: 'App',
  components: {
    Loading
  },
  data() {
    return {
      fullPage: true,
      isLoading: true
    }
  }, 
  setup() {
    const store = authStore();
    return { store };
  },
  mounted() {
    if (this.store?.userInfo !== null) {
      this.isLoading = false;
    } else {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 2500);
    }
  },
}
</script>
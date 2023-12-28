<template>
    <div class="mb-6 is-size-6">
        <span class="pb-2" style="border-bottom: 1px solid hsl(0deg 0% 86%); font-size: .9em;">
            <span class="is-clickable has-text-link" @click="$router.back()"><i class="fa-solid fa-arrow-left"></i>&nbsp; Back</span> &nbsp;
            <i class="fa-solid fa-pipe"></i>&nbsp; 
            {{ curRouteName }}
        </span>
    </div>
</template>

<script>
export default {
    name: 'PageHeader',
    data() {
        return {
            curRouteName: null
        }
    },
    mounted() {
        this.curRouteName = this.$route.meta.name;
    }
}
</script>
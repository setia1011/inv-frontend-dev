<template>
    <div class="mb-6 is-size-6">
        <span class="pb-2" style="border-bottom: 1px solid hsl(0deg 0% 86%); font-size: .9em;">
            <nav class="breadcrumb" aria-label="breadcrumbs">
                <ul>
                    <li><a href="#" @click="$router.back()"><i class="fa-solid fa-arrow-left"></i>&nbsp; Back</a></li>
                    <li v-if="par"><a href="#" class="has-text-dark is-active" style="cursor: auto;">{{ par }}</a></li>
                    <li class="is-active"><a href="#" aria-current="page">{{ name }}</a></li>
                </ul>
            </nav>
        </span>
    </div>
</template>

<script>
export default {
    name: 'PageHeader',
    data() {
        return {
            par: null,
            name: null
        }
    },
    mounted() {
        this.par = this.$route.meta.par;
        this.name = this.$route.meta.name;
    }
}
</script>
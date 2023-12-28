<template>
    <Header />
        <slot />
    <Footer />
</template>

<script>
import Header from '@/templates/parts/Header.vue'
import Footer from '@/templates/parts/Footer.vue'

export default {
    name: "First",
    components: {
        Header,
        Footer
    },
    methods: {
        userExit: function() {
            console.log('exit');
        }
    }
}
</script>
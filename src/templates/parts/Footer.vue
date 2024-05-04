<template>
    <footer class="footer mt-4">
        <div id="footer" class="container is-fluid p-32">
            <div class="content">
                <div class="columns is-mobile">
                    <div class="column is-half">
                        <p><a href="https://techack.id" target="_blank" class="has-text-info"><u><i class="fa-solid fa-terminal"></i></u></a></p>
                    </div>
                    <div class="column is-half">
                        <!-- <a class="is-pulled-right" href="https://bulma.io">
                        <img
                            src="../assets/images/made-with-bulma.png"
                            alt="Made with Bulma"
                            width="128"
                            height="24">
                        </a> -->
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer',
    props: {
        msg: String
    }
}
</script>
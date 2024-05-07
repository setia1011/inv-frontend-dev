<template>
   <div id="mySidenav" class="sidenav">
       <aside class="menu">
           <div class="menu-label-top">
               <a href="/" class="has-text-grey-light">
                   <img src="../../assets/images/logo.png" height="28" width="25" style="position: absolute;">
               </a>
               <span role="button" data="2" id="nav2" class="navix closebtn has-text-grey-light">
                   <i class="fa-thin fa-xmark"></i>
               </span>
           </div>
           <ul class="menu-list" style="margin-top: 15px;">
               <template v-for="(item, index) in store?.userInfo?.menus" :key="index">
                   <template v-if="Object.keys(item.children).length === 0">
                       <li>
                           <router-link :to="item.to" class="has-text-grey-lighter">
                               <i class="fa-light fa-map-pin icon-menu-parent fa-rotate-270"></i> {{ item.label }}
                           </router-link>
                       </li>
                   </template>
                   <template v-else>
                       <li>
                           <a class="menu-has-sub has-text-grey-lighter" ref="sl" :sl="index" v-on:click="Tes($event, index)">
                               <i class="fa-light fa-map-pin icon-menu-parent fa-rotate-270"></i> {{ item.label }} 
                               <span class="is-pulled-right" style="line-height: 30px; margin-top: -4px;">
                                   <i class="fa-solid fa-angle-right hidex"></i>
                                   <i class="fa-solid fa-angle-down showx"></i>
                                   <!-- <template v-if="!slshow">
                                       <i class="fa-solid fa-angle-right hidex"></i>
                                   </template>
                                   <template v-else>
                                       <i class="fa-solid fa-angle-down showx"></i>
                                   </template> -->
                               </span>
                           </a>
                           <ul class="menu-has-sub-list">
                               <template v-for="(i, x) in item.children" :key="x">
                                   <li class="p-1">
                                       <router-link :to="i.to" class="p-0 has-text-grey-light">
                                           <i class="fa-solid fa-check"></i> {{ i.label }}
                                       </router-link>
                                   </li>
                               </template>
                           </ul>
                       </li>
                   </template>
               </template>
           </ul>
       </aside>
   </div>
</template>


<script>
    import { authStore } from '@/stores/auth';
    export default {
    name: 'Sidebar',
    setup() {
        const store = authStore();
        return { store };
    },
    data() {
        return {
            menus: {},
            clickCount: 0,
            slshow: false,
            slindex: null
        }
    },
    mounted() {
        // check if numbe is odd
        function isOdd(num) { return num % 2; }
        // click counter
        let clickCount = 0;
        // click behaviour
        document.querySelectorAll(".navix").forEach(function (el) {
            el.addEventListener("click", function () {
                clickCount += 1;
                if (isOdd(clickCount)) {
                    document.getElementById("mySidenav").style.width = "260px";
                    el.classList.add("is-active");
                    let nav = el.getAttribute("data");
                    if (nav == 2) {
                        document.getElementById("nav1").classList.remove("is-active");
                    }
                }
                else {
                    el.classList.remove("is-active");
                    document.getElementById("mySidenav").style.width = "0";
                    let nav = el.getAttribute("data");
                    if (nav == 2) {
                        document.getElementById("nav1").classList.remove("is-active");
                    }
                }
            });
        });

        const nav2 = document.getElementById('mySidenav');
        const nav1 = document.getElementById("nav1");
        document.addEventListener('click', event => {
            const isClickInsideNav2 = nav2.contains(event.target);
            const isClickInsideNav1 = nav1.contains(event.target);
            if (!isClickInsideNav2) {
                if (!isClickInsideNav1) {
                    nav1.classList.remove("is-active");
                    nav2.style.width = "0";
                    clickCount = 0;
                }
            }
        });
    },
    methods: {
        Tes: async function(e, i) {
            if (this.slindex) {
                if (this.slindex !== i) {
                    this.clickCount = 0;
                    const sls = this.$refs.sl;
                    sls.forEach((el, i) => {
                        if (parseInt(el.getAttribute('sl')) !== parseInt(this.slindex)) {  
                        } else {
                            el.nextSibling.style.display = 'none';
                            el.children[1].children[0].style.display = "block";
                            el.children[1].children[1].style.display = "none";
                        }
                    })
                } 
            } 
            
            this.slindex = i;
            function isOdd(num) { return num % 2; }
            this.clickCount += 1;

            if (isOdd(this.clickCount)) {
                this.slshow = true;
                e.target.nextSibling.style.display = 'block';
                e.target.children[1].children[0].style.display = "none";
                e.target.children[1].children[1].style.display = "block";
                // console.log('odd: ' + this.clickCount);
            }
            else {
                this.slshow = false;
                e.target.nextSibling.style.display = 'none';
                e.target.children[1].children[0].style.display = "block";
                e.target.children[1].children[1].style.display = "none";
                // console.log('even: ' + this.clickCount);
            }
        }
    }
}
</script>
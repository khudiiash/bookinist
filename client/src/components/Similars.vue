<template>
    <div v-if="store.state.similars.length" class='similars-container'>
          <div class="similars-header bordered">Similar Books</div>
          <div class="similars">
            <SimilarsItem v-for="(similar,i) in store.state.similars.filter((e,i) => i < 16)" 
                :key="i"
                :index="i"
                :cover="similar.cover"
                :title="similar.title"
                :author="similar.author"
                :description="similar.description"
                :url="similar.url"
              />
          </div>
    </div>
</template>

<script lang="ts">
import { watchEffect, defineComponent } from 'vue';
import store from '../store'
import SimilarsItem from './SimilarsItem.vue'
import gsap from 'gsap'
import ScrollToPlugin from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin)
export default defineComponent({
  name: 'Similars',
  setup() {
    watchEffect(() => {
      if (store.state.similars.length && !document.querySelector('.similars-container')) {
         setTimeout(() => {
           gsap.to('.similars-header', .5, {clipPath: 'inset(0 0% 0 0)'})
           gsap.to('.similars-item', .5, {y: 0, opacity: 1, stagger: .1, ease: 'power4.out'})
         }, 0)
      }
    })
    return {store}
  },
  
  components: {SimilarsItem},
  methods: {

  }
})
</script>

<style scoped>
.similars-container {
  width: 100%;
  display: block;
  height: fit-content;
  margin-top: 20px;
}
.similars-header {
  font-size: 30px;
  font-weight: 900;
  text-align: left;
  margin-left: 16px;
  font-family: 'Playfair Display', serif;
  clip-path: inset(0 100% 0 0);
  border-top: 1px solid inherit;
  border-bottom: 1px solid inherit;
}
.similars {
  width: 100%;
  margin-top: 10px;
  height: fit-content;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
}

@media screen and (max-width: 600px) {
  .similars {
    flex-wrap: nowrap;
      -webkit-mask-image: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%);;
      mask-image: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%);;
      -webkit-mask-mode: alpha;
      mask-mode: alpha;
  }

}

</style>
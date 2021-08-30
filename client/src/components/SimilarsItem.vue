<template>
    <div class='similars-item' :id="'similar-'+index" @click="select" :data-url="url">
        <div class='similars-cover'>
            <img :src="cover" :alt="title">
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '../store'
import api from '../api'
import gsap from 'gsap'
import ScrollToPlugin from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin)
export default defineComponent({
  name: 'SimilarsItem',
  props: {
    title: String,
    author: String,
    cover: String,
    description: String,
    index: Number,
    url: String,
  },
  setup() {

      return {store}
  },
  mounted() {
        const el = document.getElementById('similar-' + this.index) as HTMLElement
        const similars = document.querySelector('.similars') as HTMLElement
        if (!el) return
        el.onmouseover = function() {
            // gsap.to(`.similars-item:not(#${el.id})`, .1, {filter: 'brightness(0.8)', scale: 1})
            // gsap.to(el, .1, {filter: 'brightness(1)', scale: 1.1})
        }
        similars.onmouseleave = function() {
            // gsap.to('.similars-item', .1, {filter: 'brightness(1)', scale: 1})
        }

    
  },
  methods: {
     
      select(event: Event) {
          const t = event.target as HTMLElement
          if (!t.classList.contains('similars-item')) return     
          store.hideBookScreen()     
          store.state.isLoading = true
          if (this.title && this.cover && this.url && this.author)
            api.select({title: this.title as string, cover: this.cover as string, url: this.url as string, author: this.author as string})
      }
  }
})
</script>

<style scoped>
.similars-item {
  display: flex;
  flex-direction: row;
  text-align: left;
  font-weight: 600;
  width: 155px;
  height: 240px;
  margin: 16px;
  cursor: pointer;
  opacity: 0;
  transform: translateY(100px);
}

.cls-1 {
    fill:none;
    stroke:#ffffff;
    stroke-miterlimit:10;
    stroke-width:3px;
}

rect {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
}

.similars-item svg {
    position: absolute;
    transform: scale(1.03);
    pointer-events: none;
}
.similars-cover {
    flex-shrink: 0;
    width: 100%;
    box-shadow: 0 0 8px rgba(0,0,0,.3);
    pointer-events: none;
}


.similars-cover img { 
    width: 100%;
    height: 100%;
}

@media screen and (max-width: 600px) {
  .similars-item {
    flex-shrink: 0;
    width: 40vw;
    height: calc(40vw * 1.4);
    margin: 6px;
  }
  .similars-item:first-child {
      margin-left: 20px;
  }

}
</style>
<template>
    <div class='search-item' :id="'book-'+id" @click="select" :data-url="url" :title="title">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 229.99"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><rect class="cls-1" x="1" y="1" width="148" height="227.99"/></g></g></svg>        <div class='book-cover'>
            <img :src="cover" :alt="title">
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import api from '../api'
import store from '../store'
import gsap from 'gsap'

export default defineComponent({
  name: 'Book',
  props: {
    id: Number,
    title: String,
    author: String,
    cover: String,
    year: String,
    index: Number,
    url: String,
    isbn: String,
    isSearch: Boolean
  },
  mounted() {
      const item = document.querySelector(`#book-${this.id}`) as HTMLElement
      item.addEventListener('mouseenter', () => {
         gsap.to(`#book-${this.id} rect`, 2, {strokeDashoffset: 0, ease: 'power2.out'})
      })
      item.addEventListener('mouseleave', () => {
         gsap.to(`#book-${this.id} rect`, 2, {strokeDashoffset: 1000, ease: 'power2.out'})
      })
  },
  methods: {
      select(event: Event) {
          const t = event.target as HTMLElement
          if (!t.classList.contains('search-item')) return
          store.state.isLoading = true
          if (this.url && this.title && this.cover && this.author) 
          api.select({url: this.url as string, title: this.title as string, cover: this.cover as string, author: this.author as string})
          gsap.timeline()
            .to(`.search-result`, .2, {autoAlpha: 0}, '<')
            .to('.search-result', 0, {height: 0})
      }
  }
})
</script>

<style scoped>
.search-item {
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  text-align: left;
  margin: 50px;
  font-weight: 600;
  box-shadow: 0 0 30px rgba(0,0,0,.3);
  width: 350px;
  height: 520px;
  cursor: pointer;
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

.search-item svg {
    transform: scale(1.03);
    pointer-events: none;
}

.book-cover {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
.book-cover img { 
    width: 100%;
    height: 100%;
}
@media screen and (max-width: 600px) {
    .search-item {
        margin: 30px auto;
    }
}
</style>
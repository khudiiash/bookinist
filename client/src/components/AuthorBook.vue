<template>
    <div class='author-book bordered' :id="'book-'+id" @click="select" :data-url="url">
        <div class='book-cover'>
            <img :src="cover" :alt="title">
        </div>
        <div class="book-text">
            <div class="book-title">{{title}}</div>
            <div class="book-author">{{author}}</div>
            <div class="book-description">{{description}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import api from '../api'
import gsap from 'gsap'
import ScrollToPlugin from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin)
export default defineComponent({
  name: 'AuthorBook',
  props: {
    id: Number,
    title: String,
    author: String,
    cover: String,
    description: String,
    year: String,
    index: Number,
    url: String,
    isbn: String,
    isSearch: Boolean
  },
  methods: {
      select(event: Event) {
          const t = event.target as HTMLElement
          if (!t.classList.contains('author-book')) return
          if (this.url && this.title && this.cover && this.author)
             api.select({url: this.url as string, title: this.title as string, cover: this.cover as string, author: this.author as string})
      }
          
  }
})
</script>

<style scoped>
.author-book {
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  text-align: left;
  font-weight: 600;
  width: 11vw;
  height: calc(11vw * .75);
  margin: 20px 0;
  border-bottom: 1px solid rgba(255, 255, 255, .1);
  padding: 0 0 14px 0;
  pointer-events: auto;
  cursor: pointer;
}
.book-cover {
    flex-shrink: 0;
    width: 45%;
    height: 100%;
    pointer-events: none;
    box-shadow: 4px 4px 15px rgba(0,0,0,.3);
}
.book-cover img { 
    width: 100%;
    height: 100%;
}

.book-text div {
    margin: 8px;
}
.book-title {
    font-size: 10px;
    font-family: 'Playfair Display', serif;
}
.book-author {
    font-size: 8px;
}

@media screen and (max-width: 600px) {
    .author-book { width: 47vw; height: calc(47vw * .75)}
    .book-title {font-size: 14px;}
    .book-author {font-size: 9px;}
}
</style>
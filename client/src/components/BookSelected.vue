<template>
  <div v-if="bookStore.state.book.title" class='book-selected'>
      <div class="left section">
        <Author/>
      </div>
      <div class="center section">
           <Book/>
           <Downloads/>
           <Similars/>
      </div>
      <div class='right section'>
            <Info/>
            <Genres/>
            <Reviews/>
      </div>
  </div>
</template>

<script land='ts'>
import { defineComponent } from 'vue';

import Book from './Book.vue'
import Author from './Author.vue'
import Info from './Info.vue'
import Similars from './Similars.vue'
import Downloads from './Downloads.vue'
import Genres from './Genres.vue'
import Reviews from './Reviews.vue'

import bookStore from '@/store'
import gsap from 'gsap'


export default defineComponent({
    name: 'BookSelected',
    components: {Book, Author, Info, Similars, Downloads, Genres, Reviews},
    setup() {
        return {bookStore}
    },
    mounted() {
        gsap.to('.book-selected', {autoAlpha: 0, scale: 0.6})
    }
})
</script>

<style scoped>

.book-selected {
    width: 100%;
    max-width: 100vw;
    height: fit-content;
    display: flex;
    opacity: 0;
}

.left {
    width: 25vw;
    height: fit-content;
    min-height: 117vh;
    margin-top: -17vh;
    box-shadow: 0 117vh 0 rgba(0, 0, 0, 0.7);
}
.center {
    width: 50vw;
    padding: 0 4vw;
}
.center * {
    border-color: rgba(0,0,0,.1)
}

.right {
    width: 25vw;
    background: rgba(0,0,0,.7);
    color: white;
    margin-top: -17vh;
    box-shadow: 0 117vh 0 rgba(0,0,0,.7);
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    overflow: hidden;
}

@media screen and (max-width: 600px) {
    .book-selected {flex-direction: column;}
    .section {width: 100vw}
    .center {order: 1; padding: 0}
    .right {order: 2; margin-top: 5vh; box-shadow: none;}
    .left {order: 3; margin-top: 0; box-shadow: none;}
}

</style>
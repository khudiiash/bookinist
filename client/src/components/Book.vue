<template>
    <div v-if="store.state.book.title" class='book' :id="'book-'+id" :data-url="url">
        <div class='book-cover'>
            <img :src="store.state.book.cover" alt="title">
            <div v-if='isMobile' class='show-description-arrow'></div>
            <div v-if='isMobile' class='show-description'>DESCRIPTION</div>
        </div>
        <div class='book-text'>
            <div class='book-title header'>{{store.state.book.title.replace(/\s\(.+\)$/,'')}}</div>
            <div class='book-year'>{{store.state.book.year}}</div>
            <div class='book-description' id='book-description' v-html="store.state.book.description"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '../store'
import gsap from 'gsap'
import ScrollToPlugin from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin)

export default defineComponent({
  name: 'Book',
  props: {
    id: Number,
    title: String,
    author: String,
    cover: String,
    year: String,
    description: String,
    index: Number,
    url: String,
    isbn: String,
    isSearch: Boolean
  },
  setup() {
    return {store}
  },

  data(){
     return {
       descriptionValue: this.description,
       authorPhoto:'',
       authorBio: '',
       info: {},
       backButton: require('../assets/backButton.png'),
       bookInfoTimeline: gsap.timeline(),
       bookTimeline: gsap.timeline(),
       isMobile: window.innerWidth < window.innerHeight
     }
  },
  methods: {
     
      showDescription() {
        const book = document.querySelector('.book') as HTMLElement
        if (!book) return
        console.log(book.offsetWidth, book.scrollWidth)
        // gsap.to(book, 1, {scrollTo: {x: 'max'}})
      }
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');

.book {
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  text-align: left;
  font-weight: 600;
  height: 460px;
  margin-top: 3vh;
  padding: 0 2vw;
  color: #000;
  width: 40vw;
}

.book-cover {
    flex-shrink: 0;
    width: 300px;
    height: 100%;
    box-shadow: 0 0 30px rgba(0,0,0,.3);
}

.book-description a {
  color: white;
}

.book-cover img { 
    width: 100%;
    height: 100%;
}
.book-text {
  flex-shrink: 0;
  width: 50%;
  height: 90%;
  margin-left: 25px;
  opacity: 1;
}
.book-title  {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-weight: 900;
  white-space: nowrap;
  overflow: scroll;
}

.book-year {  
  font-size: 30px;
  font-weight: 500;
  font-family: 'Playfair Display', serif;
}
.book-description {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    color: #222;
    font-size: 14px;
    height: 360px;
    overflow: auto;
    width: 100%;
    margin: 10px 0;
  
}





.download-links {
  display: flex;
  margin-left: 10px;
  float: right;
}
.download-links a {
  width: 35px;
  margin: 0 1px;
  cursor: pointer;
}

.book-info {
    width: 10vw;
    position: absolute;
    left: 350px;
    height: 100%;
    font-size: 7px;
    border-left: 1px solid;
    pointer-events: none;
    opacity: 0;

}
.book-info-header {
    margin-left: 5px;
    margin-bottom: 10px;
    opacity: 0;
}
.book-info-row {
    display: flex;
    padding: 5px;
    border-bottom: 1px solid;
}
.book-info-key {
    width: 30%;
    display: flex;
    align-items: center;
    
}
.book-info-value {
    width: 70%;
    margin-left: 20px;
    display: flex;
    align-items: center;

}
@media screen and (max-width: 600px) {
  .book {
    width: 100vw;
    margin: 0 auto;
    height: 120vw;
    overflow: auto;
  }
  .book-text {
    margin-top: 20px;
    width: 90%;
    padding-right: 10vw;
  }
  .book-cover {
    width: 75%;
    height: 90%;
    margin: auto calc(75% / 6);
  }
  .book-text {
    display: block;
    left: 90%;
  }
  .book-cover .show-description {
    position: absolute;
    left: 60vw;
    top: 50%;
    font-weight: 400;
    letter-spacing: 4px;
    color: #fff3;
    transform: rotate(90deg);

  }
  .show-description::after {
    content: '';
     position: absolute;
      width: 10px;
      height: 10px;
      border-top: 1px solid #fff3;
      border-right: 1px solid #fff3;
      left: calc(50% - 5px);
      top: -10px;
      transform: rotate(-45deg);
  }
}
@media screen and (max-width: 600px) {
  .book {
      overflow-x: scroll;
  }
}
</style>
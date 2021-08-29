<template>
  <div class="main">
    <div class="main-header">
      <h1>Bookinist</h1>
      <form v-on:submit.prevent v-on:input="input">
          <input id='query'>
      </form>
    </div>
    <Loading/>
    <div class='search-result'>
      <div class='search-column' v-for="(n,index) in [1,2,3,4]" :key="n"> <SearchItem v-for="(book, i) in eachNth(store.state.searchResult, index, 4)"
          :key="i"
          :title="book.title"
          :author="book.author"
          :cover="book.cover"
          :url="book.url"
          :id=" store.state.searchResult.indexOf(book)"
          :index="i"
        /></div>
   </div>
    <BookSelected/>
    <canvas id="gradient-canvas" data-js-darken-top data-transition-in></canvas>
  </div>
  
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '../store'
import api from '../api'
import gsap from 'gsap'
import BookSelected from './BookSelected.vue'
import SearchItem from './SearchItem.vue'
import Loading from './Loading.vue'
import {Gradient} from '../libs/gradient'
import eachNth from '../utils/eachNth'

let searchTimeout: ReturnType<typeof setTimeout>;


export default defineComponent({
  name: 'Main',
  setup() {
      return { store, eachNth }
  },
  mounted() {
    const container =   document.querySelector('.search-result') as HTMLInputElement
    const input = document.querySelector('#query') as HTMLInputElement
    const main = document.querySelector('.main') as HTMLInputElement
    const sections = Array.from(document.querySelectorAll('.search-column'))
    const isMobile = window.innerWidth < window.innerHeight
    sections.forEach((section,i) => {if (i === 1 || i === 3) section.classList.add('center')})

    main?.addEventListener('scroll', () => {
      if (window.innerWidth > 600) gsap.to('.center', 0, {y: main.scrollTop * .1})
    })

    gsap.timeline()
      .from('input', 1, {clipPath: 'inset(0 50% 0 50%)'})
      .from('.main-header h1', 1, {y: 15, opacity: 0})

    if (container) {
        container.addEventListener('scroll', function() {
          container.scrollLeft = 0
        })
      }
    if (input) { 
      input.focus() 
      if (isMobile)input.onclick = () => gsap.to('.main-header', .5, {marginTop: '17vh'})
    }
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
  
  },
  data() {
    return {
      backButton: require('../assets/backButton.png')
    }
  },
  components: {
    BookSelected,
    SearchItem,
    Loading
  },
  methods: {
    input: () => {
      const input = document.getElementById('query') as HTMLInputElement
      store.setSearchResult([])
      if (gsap.getProperty('.search-result', 'display') === 'none') gsap.set('.search-result', {display: 'flex'})
      if (!/[a-zA-Zа-яА-Я]/.test(input.value)) store.state.isLoading = false
      if (store.state.book.title) store.clearBook()
      gsap.set(`.search-result`, {scale: 1, autoAlpha: 1})
      if (store.state.book.title) store.hideBookScreen()
      if (store.state.isLoading) {store.state.shouldSearchAbort = true; store.state.isLoading = false}
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        api.search(input.value)
        store.state.isLoading = true
        store.state.shouldSearchAbort = false
      }, 500)
     
  }
}
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Playfair+Display:wght@400;500;600;700;900&family=Rubik+Mono+One&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');
.main {
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: scroll;
}

.main-header {
  font-family: 'Playfair Display', serif;
  font-size: 46px;
  font-weight: 900;
  margin-top: 40px;
  color: #000;
}

.main-header h1 {
  font-family: 'Playfair Display', serif;
  font-size: 46px;
  font-weight: 900;
  color: #000;
}
input {
  background: transparent;
  border: none;
  border-bottom: 1px solid #00000025;
  text-align: center;
  color: #000;
  width: 400px;
  font-size: 20px;
  font-family: 'Playfair Display', serif;
  margin-top: 20px;
}
input:focus {
  outline: 0;
}
.search-result {
  height: fit-content;
  margin-top: 30px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  
}

.search-column {
  width: 400px;
  opacity: 0;

}

#gradient-canvas {
  width:100%;
  height:100%;
  position: absolute;
  position: fixed;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: -1;
  opacity: .6;
  --gradient-color-1: #ef008f; 
  --gradient-color-2: #6ec3f4; 
  --gradient-color-3: #7038ff;  
  --gradient-color-4: #ffba27;

   /* Dark-blue theme */
  --gradient-color-1: #000000; 
  --gradient-color-2: #6ec3f4; 
  --gradient-color-3: #7038ff;  
  --gradient-color-4: #000000;

}
::-webkit-scrollbar {
  display: none;
}
@media screen and (max-width: 600px) {
  .main-header {
    margin-top: 17vh;
  }
  input {
      width: 330px;
  }
}

</style>

<template>
    <div v-if="store.state.book.title" class='book' :id="'book-'+id" :data-url="url">
        <div class='book-cover'>
            <img :src="store.state.book.cover" alt="title">
        </div>
        <div class='book-text'>
            <div class='book-title header'>{{store.state.book.title.replace(/\s\(.+\)$/,'')}}</div>
            <div class='book-year'>{{store.state.book.year}}</div>
            <div class='book-description' id='book-description' v-html="store.state.book.description"></div>
            <div class="book-buttons">
                <!-- <div class='book-button' @click.stop="findSimilar">Find Similar</div> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '../store'
import axios from 'axios'
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
       bookTimeline: gsap.timeline()
     }
  },
  methods: {
     
      findSimilar(seeMoreLink:string) {
            console.log(seeMoreLink)    
            axios.post('http://127.0.0.1:8000/similar', {seeMoreLink})
            .then(res => {
                store.setSimilars(res.data.similars)
            })
      },
     
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');

.book {
  /* background: gold; */
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  text-align: left;
  font-weight: 600;
  height: 460px;
  margin-top: 3vh;
  padding: 0 2vw;
  color: #000;
}

.book-cover {
    flex-shrink: 0;
    width: 300px;
    height: 100%;
    box-shadow: 0 0 30px rgba(0,0,0,.3);
}
.book-cover img { 
    width: 100%;
    height: 100%;
}
.book-text {
  flex-shrink: 0;
  width: calc(100% - 325px);
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
    text-align: justify;
    color: #222;
    font-size: 14px;
    height: 320px;
    overflow: auto;
    width: 100%;
    margin: 10px 0;
    
    
}

.book-buttons {
  width: 280px;
  height: 30px;
  display: flex;

  align-items: center;
  justify-content: space-between;
  text-align: center;
  color: white;
  font-size: 8px;
  border-radius: 2px;
  position: absolute;
  cursor: pointer;
}

.book-button {
  background: #2D3D50;
  width: 90px;
  height: 30px;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  font-size: 14px;
  border-radius: 2px;
  cursor: pointer;
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
    flex-direction: column;
  }
  .book-text {
    width: 90%;
  }
  .book-cover {
    width: 300px;
    margin: 0 auto;
  }
  .book-text {display: none;}

}
</style>
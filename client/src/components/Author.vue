<template>
  <div v-if="store.state.author.name" class='author bordered'>
      <div class="author-header">
          <div class='author-text'>
                <div class='author-name header'>{{store.state.author.name}}</div>
                <!-- <div class="author-details"  v-html="store.state.author.bio.split('</p>')[0] + '</p>'">
                    
                </div> -->
          </div>
          <div class="author-photo">
             <img class="author-photo-img" :src="store.state.author.photo" :alt="store.state.author.name">
             <div class="author-photo-border" ></div>
          </div>

      </div>
      <div class="author-bio" id="author-bio" v-html="store.state.author.bio?.replace(store.state.author.bio.split('</p>')[0] + '</p>', '')"></div>
      <div class='author-books' v-if="store.state.author.books && store.state.author.books.length">
          <h3 class="author-books-header bordered">{{store.state.author.name.split(' ').slice(-1).pop() + "'s"}} Best Books</h3>
          <AuthorBook v-for="book in store.state.author.books" 
          :key="book.title"
          :cover="book.cover"
          :title="book.title"
          :url="book.url"
          :author="book.author"
          :description="book.description"
          />
      </div>
  </div>
</template>

<script>
import { watchEffect, defineComponent } from 'vue';
import store from '@/store'
import AuthorBook from '@/components/AuthorBook.vue'
import gsap from 'gsap'
export default defineComponent({
    name: 'Author',
    components: {AuthorBook},
    setup() {
        watchEffect(() => {
            if (!store.state.author.details) return
            else 
            setTimeout(() => gsap.timeline()
                    .fromTo('.author-details-row', 1, {borderColor: '#2c3e5000'}, {borderColor: '#2c3e5027'})
                    .fromTo('.author-details-key', 1, {yPercent: 120}, {yPercent: 0, opacity: 1}, '<')
                    .fromTo('.author-details-value', 1, {yPercent: 120}, {yPercent: 0, opacity: 1}, '<')
            , 50)

        })
        return {store}
    }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500&display=swap');

.author {
  width: 100%;
  height: 100%;
  min-height: 117vh;
  padding-left: 2vw;
  font-weight: 500;
  opacity: 1;
  background: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 1);
  border-color: inherit;
}

.author-header {
    width: 100%;
    height: fit-content;
    padding: 15px 0 15px 0px;
    padding-top: 4vh;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.author-name {
    width: 95%;
    
    height: fit-content;
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 30px;
    margin-bottom: 15px;
}
.author-bio {
    width: 95%;
    height: fit-content;
    margin-top: 2%;
    text-align: justify;
    font-size: 14px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 300;
}
.author-bio div {
    overflow: hidden;
}

.author-photo {
    flex-shrink: 0;
    margin-top: 0px;
    width: 140px;
    height: 140px;
}
.author-photo-border {
    width: 140px;
    height: 140px;
    box-shadow:20px 20px 0px rgba(8, 122, 117, 0.5), -20px -10px 0px rgba(0, 59, 99, 0.562);
    border-radius: 57% 43% 37% 63% / 45% 52% 48% 55%;
    position: relative;
    top: -146px;
    animation: 10s linear infinite authorBorderSpin;
    transform: scale(.9);
    z-index: -1;

}
.author-photo-img {
    width: 100%;
    height: 100%;
    border-radius: 57% 43% 37% 63% / 45% 52% 48% 55%;
}
.author-text {
    width: 100%;
    height: fit-content;
}

.author-details {
    width: 93%;
    height: 120px;
    font-size: 14px;
    margin-left: 14px;
    margin-top: 10px;
    overflow: auto;
    text-align: justify;
    
}
.author-details-row {
    display: flex;
    margin: 2px 0;
    overflow: hidden;
    border-bottom: 1px solid #2c3e5000;
}
.author-details-key {
    width: 30%;
    height: 100%;
    display: flex;
    align-items: center;
    text-transform: capitalize;
    opacity: 0;
}
.author-details-value {
    width: 70%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-align: left;
    opacity: 0;
}

.author-books {
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    border-right: 1px solid #2c3e5049;
}

.author-books-header {
    font-family: 'Playfair Display', serif;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: left;
    font-size: 30px;
    height: 30px;
    margin-left: 0;
    width: 100%;
    padding: 40px 0;
    text-align: left;
    border-top: 1px solid rgba(255, 255, 255, .1);
    border-bottom: 1px solid rgba(255, 255, 255, .1);
}

.author-bio h2 {
    margin: 10px 0;
    text-align: left;

}

@keyframes authorBorderSpin {
    from {
        transform: rotate(0) scale(.9);
    }
    to {
        transform: rotate(360deg) scale(.9);
    }
}

@media screen and (max-width: 600px) {
    .author {
        padding-left: 4vw;
    }
}
</style>
<template>
    <div v-if="store.state.book.genres" class='genres bordered'>
                 <div class="genres-header">Genres</div>
                 <div class="genres-container">
                    <div class="genres-item" v-for="(genre,i) in store.state.book.genres" :key="genre.title" :id="`genre-${i}`" :data-url="genre.url">
                         <div class="genres-title">{{genre.title}}</div>
                    </div>
                 </div>
                
    </div>
</template>

<script lang='ts'>
import { watchEffect, defineComponent } from 'vue';
import store from '../store'
import axios from 'axios'
import api from '../api'
import gsap from 'gsap'

export default defineComponent({
    name: 'Genres',
    setup() {
        return {store}
    },
    mounted() {
         watchEffect(() => {
           if (!store.state.book.genres?.length) return
           setTimeout(() => {
                const genres = Array.from(document.querySelectorAll('.genres-item'))
                gsap.fromTo('.genres-item', 1, {clipPath: 'inset(0% 100% 0% 0%)'}, {clipPath: 'inset(0% 0% 0% 0%)', stagger: .2})
                for (let i = 0; i < genres.length; i++) {

                    if (!store.state.book.genres || !store.state.book.genres[i] || !genres[i]) return
                    const genre = genres[i] as HTMLElement
                    genre.onmouseover = function() {
                        gsap.to(this, .25, {height: 60})
                        gsap.to(`.genres-item:not(#${genre.id})`, .25, {height: 30})
                    }
                    genre.onmouseleave = function() {
                        gsap.to(this, .25, {height: 30})
                    }
                    if (this.requestGenre) genre.onclick = this.requestGenre
                    genre.style.width =  `${store.state.book.genres[i].amount / store.state.book.genres[0].amount * 95}%`
                    genre.style.background =  `#2c3e50${100 - (i * 8)}`
                }
           }, 10)
        })

    },
    methods: {
        requestGenre(event: Event) {
            const target: any = event.target
            const url:string = target.dataset.url
            api.genre(url)
        }
    }
})
</script>

<style scoped>

.genres {
    width: 95%;
    height: fit-content;
    margin-top: 4vh;
    font-size: 14px;
    border-left: 1px solid inherit;

}

.genres-header {
    margin-left: 5px;
    margin-bottom: 10px;
    font-size: 30px;
    font-family: 'Playfair Display', serif;
    font-weight: 900;
}
.genres-container {
    width: 100%;
    height: 90%;
    padding-left: 15px;
}
.genres-item {
    display: flex;
    min-height: 30px;
    height: fit-content;
    background: rgba(0, 0, 0, 0.466);
    color: white;
    align-items: center;
    margin: 0 5px;
    cursor: pointer;
    border-radius: 3px;
}
.genres-title {
   width: 100%;
   height: 100%;
   font-size: 16px;
   text-transform: capitalize;
   text-align: left;
   display: flex;
   align-items: center;
   margin-left: 10px;
   white-space: nowrap;
   pointer-events: none;
}

@media screen and (max-width: 600px) {
        .genres {
                width: 100%;
        }
        .genres-container {
            padding-left: 10px;
        }
}
</style>
<template>
    <div class='reviews bordered'>
        <div class="reviews-header header">Reviews</div>
        <div class="reviews-container">
            <div class="reviews-item" v-for="review in store.state.book.reviews" :key="review.name">
                <div class="reviews-item-header">
                    <div class="reviews-item-author">{{review.name}}</div>
                    <div class="reviews-item-date">{{review.date}}</div>
                </div>
                <div class="reviews-item-text">{{review.text}}</div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import { watchEffect, defineComponent } from 'vue';
import store from '../store'

export default defineComponent({
    name: 'Reviews',
    setup() {
        return {store}
    },
    mounted() {
         watchEffect(() => {
           if (!store.state.book.reviews?.length) return
           setTimeout(() => {
                const reviews = Array.from(document.querySelectorAll('.reviews-item-text'))
                reviews.map((r:any) => {
                    r.onmouseover = function() {
                        r.style.height = r.scrollHeight + 'px'
                        r.parentNode.style.height = r.scrollHeight + 60 + 'px'
                    }
                    r.onmouseleave = function() {
                        r.style.height ='140px'
                        r.parentNode.style.height = '200px'
                    }
                })
           }, 10)
         })
    }
})
</script>

<style scoped>

.reviews {
    height: fit-content;
    margin-top: 4vh;
    font-size: 14px;

}

.reviews-header {
    margin-left: 5px;
    margin-bottom: 10px;
    font-size: 30px;
    font-family: 'Playfair Display', serif;
    font-weight: 900;
}
.reviews-container {
    width: 100%;
    height: 100%;
    padding-left: 15px;
}
.reviews-item {
    height: fit-content;
    width: 95%;
    height: 200px;
    background: rgba(0, 0, 0, 0.166);
    backdrop-filter: blur(10px);
    color: rgb(223, 223, 223);
    align-items: center;
    margin: 10px 5px;
    cursor: pointer;
    border-radius: 3px;
    transition: .5s;

}

.reviews-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 35px;
    margin: 10px 5px;
    padding: 0 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.reviews-item-author {
    font-weight: 900;
}
.reviews-item-text {
    text-align: left;
     padding: 15px;
     height: 140px;
     overflow: auto;
    -webkit-mask-image: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 14px, rgba(0,0,0,1) calc(100% - 14px), rgba(0,0,0,0) 100%);;
    mask-image: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 14px, rgba(0,0,0,1) calc(100% - 14px), rgba(0,0,0,0) 100%);;
    -webkit-mask-mode: alpha;
    mask-mode: alpha;
    transition: .5s;

}
.reviews-title {
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
    .reviews-container {
            padding-left: 10px;
    }
}
</style>
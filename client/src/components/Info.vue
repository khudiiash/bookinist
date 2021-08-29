<template>
    <div v-if="store.state.info" class='info bordered'>
        <div class="info-header">About the book</div>
        <div class="info-row bordered" v-for="pair in Object.entries(store.state.info).filter(p => p[0])" :key="pair[0]">
            <div class="info-key">{{pair[0]}}</div>
            <div class="info-value">{{pair[1]}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { watchEffect, defineComponent } from 'vue';
import store from '../store'
import gsap from 'gsap'

export default defineComponent({
    name: 'Info',
    setup() {
        watchEffect(() => {
           if (store.state.info && Object.keys(store.state.info).length) {
               setTimeout(() => {
                   gsap.timeline()
                    .fromTo('.info-key', 1, {clipPath: 'inset(0 100% 0 0)'}, {clipPath: 'inset(0 0% 0 0)', stagger: .1})
                    .fromTo('.info-value', 1, {clipPath: 'inset(0 100% 0 0)'}, {clipPath: 'inset(0 0% 0 0)', stagger: .1}, '<.3')

               }, 10)
           }
        })
        return {store}
    },
   
   
    
})
</script>

<style scoped>

.info {
    width: 100%;
    /* left: 350px; */
    height: fit-content;
    margin-top: 4vh;
    margin-left: 15px;
    font-size: 14px;
    pointer-events: none;


}
.info-header {
    margin-left: 5px;
    margin-bottom: 10px;
    font-size: 30px;
    font-family: 'Playfair Display', serif;
    font-weight: 900;
}
.info-row {
    display: flex;
    width: 90%;
    padding: 5px;
    border-bottom: 1px solid rgba(255,255,255,.1);
}
.info-key {
    width: 30%;
    margin-left: 10px;
    display: flex;
    align-items: flex-start;
    text-align: left;

    
}
.info-value {
    width: 70%;
    margin-left: 20px;
    display: flex;
    align-items: center;
    text-align: left;

}
</style>
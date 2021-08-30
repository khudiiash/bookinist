<template>
    <div class='downloads bordered'>
        <div class="downloads-loader" v-if="(store.state.downloads && !Object.keys(store.state.downloads).length) || !store.state.downloads">
            <div class="downloads-loader-wheel"></div>
            <img class="downloads-loader-text" :src="searchingIcon">
        </div>
        <div class='downloads-links' v-if="store.state.downloads">
            <a class='downloads-link' v-for="pair in Object.entries(store.state.downloads)" :key="pair[0]" :href="pair[1]" download>{{pair[0]}}</a>
        </div>
    </div>
 
</template>

<script>
import { defineComponent } from "vue";
import store from '@/store'

export default defineComponent({
    name: 'Downloads',
    data() {
        return {
            searchingIcon: require('../assets/searching.png')
        }
    },
    setup() {   
        return {store}
    }
})
</script>

<style scoped>
.downloads {
    width: 100%;
    height: 10vh;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid rgba(0,0,0,.1);
    border-bottom: 1px solid rgba(0,0,0,.1);
    margin: 20px 0;
    transition: height 1s ease-in-out;
}
.downloads-links {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.downloads-link {
    color: #fff;
    font-size: 15px;
    background: #000;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 10px;
    box-shadow: 5px 5px 10px rgba(0,0,0,.2);
    transform: scale(0);
}

.downloads-loader {
  width: 100%;
  height: 60px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-content: center;
}

.downloads-loader-wheel {
  animation: spin 1s infinite linear;
  border: 2px solid rgba(255, 0, 0, 0.1);
  border-left: 2px solid rgb(255, 255, 255);
  border-radius: 50%;
  height: 50px;
  margin-top: 5px;
  width: 50px;
}

.downloads-loader-text {
    position: absolute;
    font-size: 12px;
    font-weight: 600;
    width: 80px;
    top:-10px;
    animation: 4s linear infinite spin;
}



@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media screen and (max-width: 600px) {
    .downloads { height: 12vh; }
    .downloads-link {
        width: 45px;
        height: 45px;
    }
    .downloads-loader-text {
        width: 60px;
        height: 60px;
        top: 0;
    }
     .downloads-loader-wheel {
        width: 40px;
        height: 40px;
        margin-top:10px;
    }
}
</style>
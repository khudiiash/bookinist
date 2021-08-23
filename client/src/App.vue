<template>
  <Main />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Main from './components/Main.vue';

export default defineComponent({
  name: 'App',
  components: {
    Main
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Playfair+Display:wght@400;500;600;700;900&family=Rubik+Mono+One&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500&display=swap');


body, html {
  overflow: hidden;
  height: 100vh;
  background-attachment: fixed;
}
::-webkit-scrollbar {
  display: none;
}

* {
  margin: 0;
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
  border-color: red;
}
</style>

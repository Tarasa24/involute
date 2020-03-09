<template>
  <div id="app">
    <vue-progress-bar />
    <Nav />
    <Sponsors v-if="!['/', '/partneri'].includes(this.$route.path)" />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Nav from './components/Nav.vue';
import Sponsors from './components/Sponsors.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: { Nav, Sponsors, Footer },
};
</script>

<style lang="sass">
@font-face
  font-family: 'skoda'
  src: url('./assets/fonts/SkodaPro_Regular.woff') format('woff')
  font-weight: normal
  font-style: normal

@font-face
  font-family: 'skoda'
  src: url('./assets/fonts/SkodaPro_Bold.woff') format('woff')
  font-weight: bold
  font-style: normal

@font-face
  font-family: 'skoda'
  src: url('./assets/fonts/SkodaPro_Bolder.woff') format('woff')
  font-weight: bolder
  font-style: normal

#app
  font-family: skoda, Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
body
  margin: 0
  background-color: black

h1, h2, h3, h4, h5, h6
  margin: 0
</style>

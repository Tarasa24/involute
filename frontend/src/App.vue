<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap')

@font-face
  font-family: 'skoda'
  src: url('./assets/fonts/SkodaPro-Regular.woff') format('woff')
  font-weight: normal
  font-style: normal

@font-face
  font-family: 'skoda'
  src: url('./assets/fonts/SkodaPro-Bold.woff') format('woff')
  font-weight: bold
  font-style: normal

@font-face
  font-family: 'skoda'
  src: url('./assets/fonts/SkodaPro-Bolder.woff') format('woff')
  font-weight: bolder
  font-style: normal

#app
  font-family: skoda, Roboto, Avenir, Helvetica, Arial, sans-serif
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

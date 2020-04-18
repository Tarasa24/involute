<template>
  <div id="app">
    <vue-progress-bar />
    <TopNav class="topnav" />
    <SideBar class="sidebar" />
    <router-view class="main" />
  </div>
</template>

<script>
import TopNav from './components/TopBar';
import SideBar from './components/SideBar';

export default {
  name: 'App',
  components: { SideBar, TopNav },
};
</script>

<style lang="sass">
html
  scroll-behavior: smooth

body
  margin: 0

h1, h2, h3, h4, h5, h6
  font-weight: 300

a
  text-decoration: none
  color: inherit

#app
  font-family: Roboto, Arial
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

  display: grid
  grid-template-columns: 265px auto
  grid-template-rows: calc( 38px + 2 * 7.5px ) auto
  grid-template-areas: "sidebar topnav" "sidebar main"
  @include medium-device
    grid-template-columns: 65px auto

.topnav
  grid-area: topnav

.sidebar
  grid-area: sidebar

.main
  padding: 2%
  grid-area: main
</style>

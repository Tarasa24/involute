<template>
  <div id="app">
    <vue-progress-bar />
    <TopNav class="topnav" />
    <SideBar class="sidebar" />
    <router-view />
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
body
  margin: 0

#app
  font-family: Roboto, Arial
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

  display: grid
  grid-template-columns: 265px auto

.topnav
  grid-column: 1 / span 2

.sidebar
  grid-row: 2 / span -1
  grid-column: 1
</style>

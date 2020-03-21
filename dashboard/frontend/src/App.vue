<template>
  <div id="app">
    <nav class="topnav">
      <a href="/dashboard"><h1>iNvolute</h1></a>
      <span>DASHBOARD</span>
      <a href="/" class="fas fa-sign-out-alt" />
    </nav>
    <SideBar class="sidebar" />
    <router-view />
  </div>
</template>

<script>
import SideBar from './components/SideBar';

export default {
  name: 'App',
  components: {
    SideBar,
  },
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
  width: 100%
  grid-column: 1 / span 2
  display: grid
  grid-template-columns: 265px auto 75px
  justify-items: center
  align-items: center
  background-color: $lighterGray
  h1
    font-weight: 100
    font-size: 1.8rem
    margin: 10px 0
  span
    height: fit-content
    letter-spacing: 3vw
    color: #e6e6e6
    font-weight: bold
    font-size: 1.5rem
  a
    font-size: 2rem
    text-decoration: none
    color: black
    width: 100%
    &.fas
      color: $purple
    @include transition(filter)
    &:hover
      filter: brightness(.8)

.sidebar
  grid-row: 2 / span -1
  grid-column: 1
</style>

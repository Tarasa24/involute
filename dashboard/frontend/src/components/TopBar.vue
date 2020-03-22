<template>
  <nav>
    <router-link to="/"><h1>iNvolute</h1></router-link>
    <span>DASHBOARD</span>
    <a href="/" class="fas fa-sign-out-alt" />
  </nav>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
nav
  width: 100%
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
</style>

<template>
  <nav>
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
  grid-template-columns: auto 75px
  justify-items: center
  align-items: center
  background-color: $lighterGray
  @include small-device-portrait
    grid-template-columns: auto 50px
  span
    height: fit-content
    letter-spacing: 3vw
    color: #e6e6e6
    font-weight: bold
    font-size: 1.5rem
    @include small-device-portrait
      font-size: 1.2rem
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

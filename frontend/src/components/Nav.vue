<template>
  <nav>
    <div class="wrapper">
      <router-link to="/" class="img"
        ><img src="../assets/logo.png" alt=""
      /></router-link>
      <span>
        <router-link to="/">Home</router-link>
        <router-link to="/novinky">Novinky</router-link>
        <router-link to="/hraci">Hráči</router-link>
        <router-link to="/partneri">Partneři</router-link>
        <router-link to="/oceneni">Ocenění</router-link>
        <router-link to="/eshop">Eshop</router-link>
        <router-link to="/kontakt">Kontakt</router-link>
      </span>
    </div>
  </nav>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
nav
  background-color: black
  color: white
  height: 100px

  display: grid
  justify-items: center

  @include medium-device
    padding-left: 0
    overflow-x: scroll
    overflow-y: hidden
    @include scrollbar(1px, gray, transparent)

.wrapper
  display: grid
  align-items: center
  grid-template-columns: auto auto
  column-gap: 2vw
  grid-template-areas: "logo links"

  a
    grid-area: logo
    justify-self: right
    margin: 0

  .img
    align-self: right
    @include small-device-portrait
      display: none

  span
    grid-area: links
    justify-self: start
    display: inline-table

    @include small-device
      justify-self: center

    a
      text-transform: uppercase
      text-decoration: none
      color: #B4B4B4

      padding: 0 1.5vw
      padding-bottom: 40px
      position: relative
      top: 25%

      @include transition(color)

      &:hover
        color: $purple
        border-bottom: 2px $purple solid

      @include medium-device
        padding: 40px 1%
</style>

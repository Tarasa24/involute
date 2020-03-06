<template>
  <nav>
    <router-link to="/"><img src="../assets/logo.png" alt=""/></router-link>
    <span>
      <router-link to="/">Home</router-link>
      <router-link to="/novinky">Novinky</router-link>
      <router-link to="/hraci">Hráči</router-link>
      <router-link to="/partneri">Partneři</router-link>
      <router-link to="/oceneni">Ocenění</router-link>
      <router-link to="/eshop">Eshop</router-link>
      <router-link to="/kontakt">Kontakt</router-link>
      <router-link to="/archiv">Archiv</router-link>
    </span>
  </nav>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
nav
  background-color: black
  color: white
  padding: 30px 0

  display: grid
  grid-template-columns: 1fr 2fr
  column-gap: 2vw
  grid-template-areas: "logo links"
  border-bottom: 1px #1C1717 solid

  @include medium-device
    padding-left: 0
    overflow-x: scroll
    overflow-y: hidden
    @include scrollbar(1px, gray, transparent)
  @include small-device
    display: block

a
  grid-area: logo
  justify-self: right
  margin: 0
  img
    width: 125%
    margin: auto
    position: relative
    right: 20%

    @include small-device
      display: none

span
  grid-area: links
  justify-self: start

  @include small-device
    justify-self: center

  a
    text-transform: uppercase
    text-decoration: none
    color: #B4B4B4

    padding: 40px 1.5vw
    position: relative
    top: 25%

    @include transition(color)

    &:hover
      color: $purple
      border-bottom: 2px $purple solid

    @include medium-device
      padding: 40px 1%
</style>

<template>
  <nav>
    <div class="wrapper">
      <router-link to="/" class="img"
        ><img src="../assets/img/logo.png" alt="involute logo"
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
    height: 100px
    img
      object-fit: scale-down
      max-height: 80%
      padding: 15% 0


  span
    grid-area: links
    justify-self: start
    display: inline-table


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
</style>

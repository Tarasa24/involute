<template>
  <nav>
    <span>DASHBOARD</span>
    <a :href="url"><button class="fas fa-sign-out-alt" aria-label="Odejít"/></a>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      url: process.env.NODE_ENV == 'production' ? '/' : 'http://localhost:8080',
    };
  },
};
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
  button
    background-color: transparent
    border: 0
    font-size: 2rem
    color: $purple
    width: 100%
    cursor: pointer
    &:focus
      outline: 0
    @include transition(filter)
    &:hover
      filter: brightness(.8)
</style>

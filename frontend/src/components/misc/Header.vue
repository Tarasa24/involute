<template>
  <div class="header">
    <slot />
  </div>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
.header
  background-color: transparent
  padding: 30px 0
  h1
    text-transform: uppercase
    color: $purple
    font-size: 45px
    letter-spacing: 3px
  h2
    font-weight: bolder
    font-size: 2rem
    margin-bottom: 25px
  span
    font-size: 4.5rem
    color: $purple
</style>

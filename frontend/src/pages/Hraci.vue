<template>
  <div>
    <div class="header">
      <h1>Seznamte se</h1>
      <h1>To jsme my!</h1>
    </div>
    <Players />
  </div>
</template>

<script>
import Players from '../components/players/Players.vue';

export default {
  components: { Players },
};
</script>

<style lang="sass" scoped>
.header
  background-color: $bgGray
  padding: 30px 0
  h1
    color: $purple
    font-size: 3.5rem
    text-transform: uppercase
    &:nth-child(1)
      font-size: 5rem
      @include small-device
        font-size: 3rem
    &:nth-child(2)
      letter-spacing: 1.5rem
      font-weight: bolder
      @include small-device
        font-size: 2rem
        letter-spacing: 1rem
</style>

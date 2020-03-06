<template>
  <div>
    <Nav />
    <h1>404</h1>
    <h2>Not found</h2>
  </div>
</template>

<script>
import Nav from '../components/Nav.vue';

export default {
  components: { Nav },
};
</script>

<style lang="sass" scoped>
h1
  font-size: 10rem
  color: $purple
h2
  text-transform: uppercase
  color: $textGray
</style>

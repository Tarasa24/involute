<template>
  <div class="box">
    <span :class="icon" />{{ title }}
    <h1>{{ Intl.NumberFormat().format(number) }}</h1>
  </div>
</template>

<script>
export default {
  props: ['title', 'icon', 'number'],
};
</script>

<style lang="sass" scoped>
.box
  margin: 5% 5% 0 5%
  width: calc( 100% - 20px - 10% )
  background-color: white
  box-shadow: 2px 3px 4px rgba(0, 0, 0, 0.1)
  padding: 10px
  text-align: left

  span
    margin-right: 2%
    color: $purple

  h1
    margin: 5% 0
</style>

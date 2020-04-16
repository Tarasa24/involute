<template>
  <main>
    <router-link to="/hrac/pridat" class="hrac add">
      <a class="fas fa-plus" />
    </router-link>

    <router-link
      :to="'/hrac/' + hrac.name"
      class="hrac"
      v-for="hrac in hraci"
      :key="hrac._id"
      :style="`background: url(${hrac.img}), white`"
    >
      <span>
        <a>{{ hrac.name }}</a>
      </span>
    </router-link>
  </main>
</template>

<script>
import { getData } from '../assets/js/dataFetcher';

export default {
  data() {
    return {
      hraci: [],
    };
  },
  async created() {
    this.$Progress.start();
    this.hraci = await getData('/hraci');
    this.$Progress.finish();
  },
};
</script>

<style lang="sass" scoped>
main
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr))
  grid-gap: 10px
  .hrac
    display: flex
    background-repeat: no-repeat !important
    background-size: cover !important
    background-position: top center !important
    text-decoration: none
    height: 390px
    max-height: 70vh
    border-radius: 2px
    @include transition(transform)
    span
      align-self: flex-end
      display: block
      text-align: left
      padding: 10px 0 10px 10px
      width: calc( 100% - 10px)
      color: white
      background-color: rgba(black, 0.7)
      a
        font-size: 1.25rem
        @include transition(color)
    &:hover
      transform: scale(.96)
      a
        color: $purple
  .add
    display: grid
    border: 1px solid $grayOutline
    border-radius: 2px
    .fas
      @include transition(color)
      align-self: center
      font-size: 3rem
</style>

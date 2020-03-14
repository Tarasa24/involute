<template>
  <div>
    <Basket />
    <div class="header">
      <h1>Eshop</h1>
      <h2>Vlastní a bez prostředníka</h2>
    </div>

    <main>
      <router-link
        :to="'/eshop/produkt/' + produkt._id"
        class="produkt"
        v-for="produkt in produkty"
        :key="produkt._id"
        :style="`background-image: url(${produkt.img})`"
        :disabled="produkt.stock <= 0"
      >
        <span>
          <a>{{ produkt.name }}</a>
          <h6>{{ produkt.sub }}</h6>
        </span>
      </router-link>
    </main>
  </div>
</template>

<script>
import Basket from '../components/eshop/Basket';

import { getData } from '../assets/js/dataFetcher';

export default {
  components: { Basket },
  data() {
    return {
      produkty: null,
    };
  },
  async created() {
    this.$Progress.start();
    this.produkty = await getData('/produkty');
    this.$Progress.finish();
  },
};
</script>

<style lang="sass" scoped>
div
  background-color: #e0e0e0
  display: grid
  justify-items: center
  padding-bottom: 5vh
.header
  background-color: $bgGray
  padding: 30px 0
  h1
    text-transform: uppercase
    color: $purple
    font-size: 45px
    letter-spacing: 3px
  h2
    font-weight: normal
    font-size: 25px
    margin-bottom: 25px

main
  width: $baselineWidth
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(calc( 1199px / 4 ), 1fr))
  justify-items: center
  gap: 10px
  @include large-device
    width: calc(100% - 5%)

  .produkt
    background-repeat: no-repeat !important
    background-size: cover !important
    background-position: center center !important
    background-color: white
    height: calc( 100vh / 2)
    width: 100%
    text-decoration: none
    display: flex
    @include transition(transform)
    &:hover
      transform: scale(.96)
      a
        color: $purple
    &[disabled]
      transform: scale(.96)
      filter: brightness(.7)
      a
        color: white
    span
      align-self: flex-end
      display: block
      text-align: left
      padding: 10px 0 10px 10px
      width: calc( 100% - 10px)
      color: white
      background-color: rgba(black, 0.7)
      a, h6
        margin: 0
        font-weight: normal
      a
        font-size: 20px
        @include transition(color)
        color: $textGray
        font-weight: bolder
      h6
        font-size: 15px
</style>

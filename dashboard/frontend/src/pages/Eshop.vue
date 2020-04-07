<template>
  <main>
    <div class="wrapper">
      <router-link to="/eshop/vyrizene">
        <Box title="Vyřízených objednávek" icon="fas fa-check" :number="0" />
      </router-link>
      <router-link to="/eshop/k_vyrizeni">
        <Box
          title="Objednávek k vyřízení"
          icon="fas fa-stopwatch"
          :number="0"
        />
      </router-link>
    </div>

    <h1>
      Produkty
    </h1>

    <div class="row" v-for="produkt in produkty" :key="produkt.id">
      <a class="name" :href="'/eshop/produkt/' + produkt._id">{{
        produkt.name
      }}</a>
      <i>{{ produkt.sub }}</i>
      <span>{{ Intl.NumberFormat().format(produkt.price) }} Kč</span>
      <span>{{ Intl.NumberFormat().format(produkt.stock) }} ks</span>
      <router-link :to="'/eshop/produkt/' + produkt._id" class="fas fa-edit" />
    </div>
  </main>
</template>

<script>
import Box from '../components/Box';

import { getData } from '../assets/js/dataFetcher';

export default {
  components: { Box },
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
.wrapper
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(220px + 2*10px, 1fr))

h1
  font-size: 2.5rem

.row
  display: grid
  text-align: left
  width: 80%
  margin: 0 auto
  padding: 10px
  grid-template-columns: 150px auto 100px 120px 20px
  border: 2px $grayOutline solid
  border-bottom-width: 0
  border-radius: 2px
  &:nth-of-type(odd)
    background-color: $lighterGray
  &:nth-of-type(even)
    background-color: $darkerGray
  &:last-of-type
    border-bottom-width: 2px

  .name
    &:hover
      font-weight: bold

  .fas
    justify-self: center
    color: $purple
  @include small-device
    width: calc(95% - 20px)
    i
      font-size: 0
  @include small-device-portrait
    grid-template-columns: 150px repeat(4, auto)
    span
      font-size: 0
    .fas
      justify-self: right
      padding-right: 5%
</style>

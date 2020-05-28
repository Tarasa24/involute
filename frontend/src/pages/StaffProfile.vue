<template>
  <main>
    <div class="container">
      <h1>{{ $route.params.name }}</h1>

      <h2>Publikované články</h2>
      <div class="table">
        <router-link
          :to="'/novinka/' + novinka._id"
          v-for="(novinka, index) in novinky"
          :key="novinka._id"
          class="tr"
        >
          <div class="td">{{ novinky.length - index }}.</div>
          <div class="td">{{ novinka.title }}</div>
          <div class="td">{{ novinka.sub }}</div>
          <div class="td">
            {{
              new Date(novinka.date * 1000).toLocaleDateString('cs', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            }}
          </div>
        </router-link>
      </div>
    </div>
  </main>
</template>

<script>
import { getData } from '../assets/js/dataFetcher';

export default {
  data() {
    return {
      novinky: [],
    };
  },
  async created() {
    this.$Progress.start();
    this.novinky = await getData('/staff/novinky/' + this.$route.params.name);
    this.$Progress.finish();
  },
};
</script>

<style lang="sass" scoped>
main
  background-color: $bgGray
  padding: 2% 0

h1
  color: $purple
  font-size: 2.75rem
  margin-bottom: 4%
  @include medium-device
    font-size: 2rem

h2
  text-transform: uppercase
  text-align: left
  color: $purple
  font-size: 2.2rem
  @include medium-device
    font-size: 1.5rem

.container
  width: $baselineWidth
  max-width: $maxWidth
  margin: auto
  @include medium-device
    width: 90%
  .table
    margin: auto
    background-color: $textGray
    margin-top: 20px
    width: 80%
    display: table
    @include medium-device
      width: 97.5%
      margin-top: 10px
    .tr
      display: table-row
      text-align: left
      text-decoration: none
      color: black
      @include transition(color)
      &:hover
        color: $purple
    .td
      display: table-cell
      padding: 5px
      &:nth-of-type(2)
        font-weight: bold
</style>

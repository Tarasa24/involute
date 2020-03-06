<template>
  <div>
    <Nav />
    <Sponsors />
    <News ref="News" :page="current_page" :n="length" />
    <div class="picker">
      <a v-if="current_page - 1 < 1" disabled class="fas fa-chevron-left" />
      <router-link
        v-else
        :to="'/novinky/' + (current_page - 1)"
        class="fas fa-chevron-left"
      />

      <router-link
        v-for="page in range(current_page - 3, current_page + 1)"
        :key="page"
        :enabled="page === current_page"
        :to="'/novinky/' + page"
        >{{ page }}</router-link
      >
      <router-link
        :to="'/novinky/' + pages.length"
        v-if="current_page + 2 < pages.length"
        >{{ pages.length }}</router-link
      >

      <a
        v-if="current_page + 1 > pages.length"
        disabled
        class="fas fa-chevron-right"
      />
      <router-link
        v-else
        :to="'/novinky/' + (current_page + 1)"
        class="fas fa-chevron-right"
      />
    </div>
    <Footer />
  </div>
</template>

<script>
import Nav from '../components/Nav.vue';
import Sponsors from '../components/Sponsors.vue';
import News from '../components/News.vue';
import Footer from '../components/Footer.vue';

import { getPocetNovinek } from '../assets/js/dataFetcher';

export default {
  components: { Nav, Sponsors, News, Footer },
  data() {
    return {
      pages: [],
      maxPage: 0,
      current_page: 1,
      length: 6,
    };
  },
  watch: {
    $route: 'getCurrentPage',
  },
  async created() {
    this.getCurrentPage();
    let pocetStranek = Math.ceil(
      (await getPocetNovinek()) / this.$refs.News.length
    );
    this.maxPage = pocetStranek;
    this.pages = this.range(0, pocetStranek);
  },
  methods: {
    range(min, max) {
      if (max <= 3) max = 4;
      else if (min >= this.maxPage - 4) min = this.maxPage - 5;

      if (min < 0) min = 0;
      if (max > this.maxPage) max = this.maxPage;

      var a = [];
      var b = min;

      while (b < max) {
        a.push((b += 1));
      }
      return a;
    },
    getCurrentPage() {
      this.current_page = Number(this.$attrs.page);
    },
  },
};
</script>

<style lang="sass" scoped>
.picker
  background-color: $bgGray
  padding-bottom: 5vh

  a
    font-weight: bolder
    text-decoration: none
    color: black
    display: inline-block
    border: 1px black solid
    border-left-width: 0px
    width: 3rem
    padding: 0.5rem 0
    &:first-child, &:last-child
      padding: calc( 0.5rem + 1px ) 0 calc( 0.5rem + 3px ) 0
      &[disabled]
        background-color: gray
        &:hover
          color: black
      &:not([disabled])
        color: $textGray
        border-color: $purple
        background-color: $purple
    &:first-child
      border-left-width: 1px

    &:hover
      @include transition(color)
      color: $purple
    &[enabled]
      color: $purple
</style>

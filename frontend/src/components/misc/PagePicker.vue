<template>
  <div>
    <router-link :to="url" class="next" v-if="!$route.path.includes(url)">
      <button>Zobrazit další</button>
    </router-link>

    <div class="picker" v-else>
      <a v-if="currentPage - 1 < 1" disabled class="fas fa-chevron-left" />
      <router-link
        v-else
        :to="`${url}/${currentPage - 1}`"
        class="fas fa-chevron-left"
      />

      <router-link
        v-for="page in range(currentPage - 3, currentPage + 1)"
        :key="page"
        :enabled="page === currentPage"
        :to="`${url}/${page}`"
        >{{ page }}</router-link
      >
      <router-link
        :to="`${url}/${pages.length}`"
        v-if="currentPage + 2 < pages.length"
        >{{ pages.length }}</router-link
      >

      <a
        v-if="currentPage + 1 > pages.length"
        disabled
        class="fas fa-chevron-right"
      />
      <router-link
        v-else
        :to="`${url}/${currentPage + 1}`"
        class="fas fa-chevron-right"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ['url', 'total', 'perPage'],
  data() {
    return {
      pages: [],
      currentPage: 1,
    };
  },
  watch: {
    $route: 'getCurrentPage',
    total: 'load',
  },
  computed: {
    maxPage() {
      return Math.ceil(this.total / this.perPage);
    },
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
      this.currentPage = Number(this.$route.params.page || 1);
    },
    load() {
      this.getCurrentPage();
      this.pages = this.range(0, this.maxPage);
    },
  },
};
</script>

<style lang="sass" scoped>
.picker
  background-color: transparent
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
    background-color: white
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

.next > button
  @include btn($purple, $purple)
  padding: 15px
  margin-bottom: 20px
</style>

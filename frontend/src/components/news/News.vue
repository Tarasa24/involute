<template>
  <div class="novinky">
    <div>
      <h1>Novinky</h1>
      <h2>Aktuální informace o tom, co se děje ve světě esports.</h2>
    </div>
    <div class="container">
      <router-link
        :to="'/novinka/' + novinka._id"
        class="novinka"
        v-for="novinka in novinky"
        :key="novinka._id"
        :style="'background: url(' + novinka.bg + '), white'"
      >
        <span>
          <h6>{{ novinka.game }}</h6>
          <a>{{ novinka.title }}</a>
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { getData } from '../../assets/js/dataFetcher';
import { numberOfCards } from '../../assets/js/responsive';

export default {
  props: {
    page: {
      default: 1,
    },
    n: {
      default: 9,
    },
  },
  data() {
    return {
      novinky: null,
      length: numberOfCards(this.n),
    };
  },
  watch: {
    $route: 'load',
  },
  async created() {
    window.addEventListener('resize', this.handleResize);
    this.load();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    async load() {
      this.$Progress.start();
      let skip = (this.page - 1) * this.length;
      this.novinky = await getData('/novinky', { params: [skip, this.length] });
      this.$Progress.finish();
    },
    handleResize() {
      if (this.length != numberOfCards(this.n)) {
        this.$router.go(0);
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.novinky
  background-color: $bgGray
  padding-top: 25px
  display: grid
  grid-template-columns: 1fr
  grid-template-areas: "head" "container"
  align-items: center
  justify-items: center
  @include large-device
    grid-template-columns: 100%
    padding: 5%

  h1
    text-transform: uppercase
    color: $purple
    font-size: 45px
    letter-spacing: 3px
  h2
    font-weight: normal
    font-size: 25px
    margin-bottom: 25px

  .container
    grid-area: container
    display: grid
    column-gap: 30px
    grid-template-columns: repeat(3, 1fr)
    @include large-device
      grid-template-columns: repeat(2, 1fr)
      column-gap: 15px
    @include small-device-landscape
      grid-template-columns: repeat(2, 1fr)
    @include small-device
      grid-template-columns: 1fr

    .novinka
      background-repeat: no-repeat !important
      background-size: cover !important
      background-position: center center !important
      width: 360px
      height: 230px
      position: relative
      justify-self: center
      margin-bottom: 50px

      @include small-device-landscape
        width: calc(340px - 40px)
        height: calc(230px - 40px)
      @include small-device-portrait
        width: calc(340px - 20px)
        height: calc(230px - 20px)
      @include small-device
        margin: 10px

      @include transition(transform)
      &:hover
        transform: scale(.96)
        a
          color: $purple

      span
        background-color: rgba(black, 0.7)
        color: $textGray
        text-align: left
        padding: 10px 0 10px 10px

        position: absolute
        bottom: 0
        left: 0
        width: calc(100% - 10px)

        a, h6
          margin: 0
          font-weight: normal
        a
          font-size: 20px
          @include transition(color)
          text-decoration: none
          color: $textGray
          font-weight: bolder
        h6
          font-size: 15px
</style>

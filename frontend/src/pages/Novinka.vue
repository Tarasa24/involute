<template>
  <div>
    <div
      class="header"
      v-touch:swipe="swipeHandler"
      :style="
        'background: linear-gradient(0deg, rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(' +
          staticUrl +
          novinka.bg +
          ')'
      "
    >
      <span>
        <router-link
          v-if="soused.pervious != null"
          :to="'/novinka/' + soused.pervious"
          class="fas fa-chevron-left"
        />
        <a v-else disabled class="fas fa-chevron-left" />

        <router-link
          v-if="soused.next != null"
          :to="'/novinka/' + soused.next"
          class="fas fa-chevron-right"
        />
        <a v-else disabled class="fas fa-chevron-left" />
      </span>

      <h1>{{ novinka.title }}</h1>
      <p>{{ novinka.game }}</p>
      <p>{{ novinka.sub }}</p>
    </div>

    <main v-html="novinka.text" />
  </div>
</template>

<script>
import { getData } from '../assets/js/dataFetcher';
import { staticUrl } from '../assets/js/dev';

export default {
  data() {
    return {
      novinka: {},
      soused: {},
      staticUrl: staticUrl,
    };
  },
  watch: {
    $route: 'load',
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  created() {
    this.load();
  },
  methods: {
    async load() {
      this.$Progress.start();
      this.novinka = await getData('/novinka', {
        code: true,
        params: [this.$route.params.id],
      });

      if (this.novinka === 400) {
        this.$router.replace('/novinka');
        this.$Progress.fail();
      } else {
        this.soused = await getData('/novinka', {
          params: [this.$route.params.id, 'neighbors'],
        });
        this.$Progress.finish();
      }
    },
    swipeHandler(direction) {
      if (direction === 'left' && this.soused.next != null)
        this.$router.push(`/novinka/${this.soused.next}`);
      else if (direction === 'right' && this.soused.pervious != null)
        this.$router.push(`/novinka/${this.soused.pervious}`);
    },
  },
};
</script>

<style lang="sass" scoped>
.header
  color: #d9d9d9
  padding: 5.5vh calc(30% + 20px)
  text-align: left
  background-color: #02021f
  background-repeat: no-repeat !important
  background-size: cover !important
  background-position: center center !important
  @include large-device
    padding: 5vh 15%
  @include small-device
    padding: 5%

  span
    display: grid
    grid-template-columns: 50% 50%
    grid-column-gap: 5px
    a
      align-self: center
      padding: 10px 20px
      color: white
      background-color: #A65BDA
      text-decoration: none
    a:first-child
      justify-self: right
    a:last-child
      justify-self: left
    a[disabled]
      background-color: gray
      color: black

  h1
    text-transform: uppercase
    margin-top: 5vh
    font-size: 3.5rem
    @include small-device
      font-size: 2.2rem
  p
    @include small-device
      font-size: 1rem

/deep/ main
  background-color: white
  text-align: center
  padding: 5vh calc(30% + 20px)
  @include large-device
    padding: 5vh 15%
  @include small-device
    padding: 5%

  /deep/ *:not(img, iframe)
    text-align: left
  /deep/ img, iframe
    margin: 0 aut
    max-width: 100%
</style>

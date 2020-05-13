<template>
  <div class="novinky">
    <Header>
      <h1>Novinky</h1>
    </Header>
    <div class="container">
      <section>
        <router-link
          :to="'/novinka/' + pinned[0]._id"
          class="novinka big"
          :style="'background: url(' + pinned[0].bg + '), white'"
        >
          <span :disabled="!pinned[0].game || !pinned[0].title">
            <h6>{{ pinned[0].game }}</h6>
            <a>{{ pinned[0].title }}</a>
          </span>
        </router-link>

        <router-link
          :to="'/novinka/' + novinka._id"
          class="novinka"
          v-for="novinka in novinky.slice(0, 2)"
          :key="novinka._id"
          :style="'background: url(' + novinka.bg + '), white'"
        >
          <span>
            <h6>{{ novinka.game }}</h6>
            <a>{{ novinka.title }}</a>
          </span>
        </router-link>
      </section>
      <section>
        <router-link
          :to="'/novinka/' + novinka._id"
          class="novinka"
          v-for="novinka in novinky.slice(2, 4)"
          :key="novinka._id"
          :style="'background: url(' + novinka.bg + '), white'"
        >
          <span>
            <h6>{{ novinka.game }}</h6>
            <a>{{ novinka.title }}</a>
          </span>
        </router-link>

        <router-link
          :to="'/novinka/' + pinned[1]._id"
          class="novinka big"
          :style="'background: url(' + pinned[1].bg + '), white'"
        >
          <span :disabled="!pinned[1].game || !pinned[1].title">
            <h6>{{ pinned[1].game }}</h6>
            <a>{{ pinned[1].title }}</a>
          </span>
        </router-link>
      </section>
    </div>
    <PagePicker url="/novinky" />
  </div>
</template>

<script>
import Header from './misc/Header';
import PagePicker from './misc/PagePicker';

import { getData } from '../assets/js/dataFetcher';

export default {
  components: { Header, PagePicker },
  data() {
    return {
      novinky: [],
      pinned: [{}, {}],
    };
  },
  watch: {
    $route: 'load',
  },
  async created() {
    this.load();
  },
  methods: {
    async load() {
      this.$Progress.start();
      this.novinky = await getData('/novinky/0/4');
      this.pinned = await getData('/novinky/pinned');
      if (this.pinned.length == 1) this.pinned.push({});
      this.$Progress.finish();
    },
  },
};
</script>

<style lang="sass" scoped>
.novinky
  background-color: $bgGray
  @include medium-device
    padding: 5%

.container
  width: $baselineWidth
  max-width: $maxWidth
  margin: auto
  display: flex
  section
    width: calc(50% - 5px)
    display: grid
    grid-template-columns: 50% 50%
    &:nth-of-type(1)
      margin-right: auto
    &:nth-of-type(2)
      margin-left: auto
  margin-bottom: 50px
  @include medium-device
    width: 100%
  @include small-device-portrait
    display: block
    section
      width: 100%
  @include outside-boundaries
    width: 70%

.novinka
  background-repeat: no-repeat !important
  background-size: cover !important
  background-position: center center !important
  width: calc(100% - 5px)
  justify-self: center
  height: 25vh
  max-width: 600px
  max-height: 240px
  position: relative
  margin-bottom: 10px
  @include small-device-portrait
    height: 35vh
  @include small-device-landscape
    height: 70vh

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
    &[disabled]
      padding: 0
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

.big
  grid-column: 1 / -1
  max-width: unset
  max-height: unset
  height: 35vh
  @include small-device-portrait
    height: 50vh
  @include small-device-landscape
    height: 75vh
</style>

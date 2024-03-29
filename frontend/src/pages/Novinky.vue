<template>
  <main>
    <Header>
      <h1>Novinky</h1>
      <a v-if="$route.query.tag" class="tag">{{ $route.query.tag }}</a>
      <div v-else class="tags">
        <router-link
          class="tag"
          :to="'/novinky?tag=' + tag[0]"
          v-for="tag in tags"
          :key="tag[0]"
        >
          {{ `${tag[0]} (${tag[1]})` }}
        </router-link>
      </div>
    </Header>

    <div class="pinned" v-if="!$route.query.tag">
      <router-link
        v-for="pin in pinned"
        :key="pin._id"
        :to="'/novinka/' + pin._id"
        class="novinka big"
        :style="'background: url(' + pin.bg + '), white'"
      >
        <span>
          <h6>{{ pin.tags ? pin.tags.join(', ') : '' }}</h6>
          <a>{{ pin.title }}</a>
        </span>
      </router-link>
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
          <h6>{{ novinka.tags ? novinka.tags.join(', ') : '' }}</h6>
          <a>{{ novinka.title }}</a>
        </span>
      </router-link>
    </div>
    <PagePicker url="/novinky" :total="total" :perPage="perPage" />
  </main>
</template>

<script>
import { getData } from '../assets/js/dataFetcher';

import Header from '../components/misc/Header';
import PagePicker from '../components/misc/PagePicker';

export default {
  components: { Header, PagePicker },
  props: {
    perPage: {
      default: 6,
    },
  },
  data() {
    return {
      novinky: [],
      pinned: [{}, {}],
      total: 0,
      tags: [],
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
      if (this.$route.query.tag) {
        this.total = await getData(
          `/novinky/length?tag=${this.$route.query.tag}`
        );
        this.novinky = await getData(
          `/novinky/${(this.$route.params.page - 1 || 0) * this.perPage}/${
            this.perPage
          }?tag=${this.$route.query.tag}`
        );
      } else {
        this.total = await getData('/novinky/length');
        this.tags = await getData('/novinky/tags');
        this.novinky = await getData(
          `/novinky/${(this.$route.params.page - 1 || 0) * this.perPage}/${
            this.perPage
          }`
        );
        this.pinned = await getData('/novinky/pinned');
        if (this.pinned.length == 1) this.pinned.push({});
      }
      this.$Progress.finish();
    },
  },
};
</script>

<style lang="sass" scoped>
main
  background-color: $bgGray
  @include medium-device
    padding: 5%

.tags
  width: 70vw
  margin: auto
  overflow: auto
  padding: 10px 0 12.5px 0
  @include scrollbar(5px, gray, $textGray)
  @include medium-device
    width: 100%
  a
    white-space: nowrap

.tag
  background-color: $darkPurple
  border-radius: 16px
  padding: 2px 7.5px
  margin: 7px
  color: $textGray
  text-decoration: none
  font-size: 1rem
  position: relative
  top: 5px

.container, .pinned
  grid-area: container
  display: grid
  margin: auto
  width: $baselineWidth
  max-width: $maxWidth - 80px
  grid-template-columns: repeat(3, minmax(180px, 1fr))
  column-gap: 4vw
  @include large-device
    column-gap: 10px
  @include medium-device
    grid-template-columns: repeat(2, 1fr)
    width: 100%
  @include small-device-portrait
    grid-template-columns: 1fr
    max-width: $maxWidth
    margin: 0
  @include outside-boundaries
    width: 70%

.pinned
  grid-template-columns: 50% 50%
  column-gap: 0
  margin-bottom: 12px
  border-bottom: 2px solid $textGray

.novinka
  background-repeat: no-repeat !important
  background-size: cover !important
  background-position: center center !important
  width: 100%
  justify-self: center
  height: 25vh
  max-width: 600px
  max-height: 240px
  position: relative
  margin-bottom: 10px
  @include small-device-portrait
    height: 35vh
    width: calc(100% - 10px)
  @include small-device-landscape
    height: 70vh
    width: calc(100% - 10px)
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

.big
  max-width: unset
  max-height: unset
  width: calc(100% - 7.5px)
  height: 35vh
  &:nth-of-type(1)
    justify-self: left
  &:nth-of-type(2)
    justify-self: right
</style>

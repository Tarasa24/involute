<template>
  <div class="novinka">
    <div class="header">
      <span class="arrows">
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
        <a v-else disabled class="fas fa-chevron-right" />
      </span>

      <h1>{{ novinka.title }}</h1>

      <div class="tags">
        <router-link
          v-for="tag in novinka.tags"
          :key="tag"
          :to="`/novinky?tag=${tag}`"
        >
          {{ tag }}
        </router-link>
      </div>

      <div class="author_n_date">
        <div :style="!novinka.author ? 'visibility: hidden' : ''">
          Autor:
          <router-link :to="`/staff/${novinka.author}`">
            {{ novinka.author }}
          </router-link>
        </div>
        <div>
          {{
            new Date(novinka.date * 1000).toLocaleDateString('cs', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })
          }}
        </div>
      </div>
      <p>{{ novinka.sub }}</p>
    </div>

    <section>
      <img v-lazy="cover" alt="main" />
    </section>
    <main v-html="novinka.text" />
  </div>
</template>

<script>
import { getData } from '../assets/js/dataFetcher';
import { backendUrl } from '../assets/js/dev';

export default {
  data() {
    return {
      novinka: {},
      soused: {},
    };
  },
  computed: {
    cover() {
      return `${backendUrl}/novinka/cover/${this.$route.params.id}`;
    },
  },
  watch: {
    $route: 'load',
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
        document.title = 'iNvolute | ' + this.novinka.title;
        this.$Progress.finish();
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.novinka
  background-color: $bgGray

.header
  color: $textGray
  padding: 5.5vh calc(30% + 20px)
  padding-bottom: 1%
  text-align: left
  background-color: #02021f
  background-repeat: no-repeat !important
  background-size: cover !important
  background-position: center center !important
  @include large-device
    padding: 5vh 15%
    padding-bottom: 2%
  @include small-device
    padding: 4%

  .arrows
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
    margin-bottom: 2%
    font-size: 3.5rem
    color: $purple
    @include small-device
      font-size: 2.2rem
  .tags
    display: flex
    margin-bottom: 15px
    a
      background-color: $darkPurple
      border-radius: 16px
      padding: 2px 7.5px
      margin: 0 5px
      &:first-of-type
        margin-left: 0
      color: $textGray
      text-decoration: none
      font-size: .85rem
      &:hover
        text-decoration: underline
  .author_n_date
    display: flex
    div
      display: block
      width: 50%
      &:last-of-type
        text-align: right
    a
      color: $textGray
      text-decoration: none
      &:hover
        text-decoration: underline
  p
    @include small-device
      font-size: 1rem

section
  padding-left: 0 !important
  padding-right: 0 !important
  border-bottom: 2px solid $textGray
  margin: 3.5vh calc(30% + 20px)
  margin-bottom: 0
  @include large-device
    margin: 3.5vh 15%
    margin-bottom: 0
  @include small-device
    margin: 4%
    margin-bottom: 0
  img
    display: flex
    max-width: 100%
    margin: auto
    margin-bottom: 30px

/deep/ main
  text-align: center
  padding: 3.5vh calc(30% + 20px)
  white-space: break-spaces
  @include large-device
    padding: 3.5vh 15%
  @include small-device
    padding: 4%

  /deep/ *:not(img, iframe)
    text-align: left
  /deep/ img, iframe
    display: flex
    margin: 0 auto
    max-width: 100%
    cursor: auto !important
  /deep/ iframe
    width: 100%
    height: 350px
    @include small-device-portrait
      height: 200px
    @include small-device-landscape
      height: 80vh
  /deep/ p
    margin: 1px 0
</style>

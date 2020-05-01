<template>
  <div>
    <div class="support">
      <div>
        <div class="header">
          <h1>Podpoř <span>Involute</span></h1>
          <h2>Sleduj, lajkuj, sdílej a podporuj... Nebudeš litovat!</h2>
        </div>

        <div class="links">
          <a
            v-for="link in links"
            :key="link._id"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            :title="link.name"
          >
            <img :src="link.ico" :alt="link.name" />
            <p>{{ link.sub }}</p>
          </a>
        </div>
      </div>

      <footer>
        Esport tým <a href=".">iNvolute</a> 2011 - 2020 | iNvolute s.r.o.,
        Primátorská 296/38, Libeň, 180 00 Praha 8, IČ: 06180167
      </footer>
    </div>
  </div>
</template>

<script>
import { getData } from '../assets/js/dataFetcher';

export default {
  data() {
    return {
      links: [],
    };
  },
  async created() {
    this.links = await getData('/links');
  },
};
</script>

<style lang="sass" scoped>
.support
  background-color: $bgBlack
  display: grid
  justify-items: center

  .header
    @include medium-device
      padding: 10px
    h1, h2
      margin: 0
    h1
      text-transform: uppercase
      font-size: 35px
      padding-top: 75px
      font-size: 50px
      color: $textGray
      span
        color: $purple
    h2
      color: gray
      font-weight: normal
      margin-bottom: 75px

  .links
    display: flex
    flex-wrap: wrap
    width: $baselineWidth
    max-width: $maxWidth
    margin: 0 auto
    margin-bottom: 80px
    a
      flex-grow: 1
      text-decoration: none
      color: unset
      border-bottom: 5px solid transparent
      padding-bottom: 40px
      margin-bottom: 20px
      @include transition(border-bottom-color)
      @include small-device
        padding: 20px
      img
        height: 4rem
        margin-bottom: 1rem
      p
        color: $textGray
        margin: 0
      &:hover
        border-bottom-color: $purple

footer
  padding: 40px
  color: gray
  font-size: 19px
  @include small-device
    font-size: 1rem
    padding: 40px 10px
  a
    color: $purple
    text-decoration: none
    font-weight: bold
</style>

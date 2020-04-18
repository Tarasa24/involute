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
          >
            <b>{{ link.name }}</b>
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
  background-color: black
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
    display: grid
    width: $baselineWidth
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr))
    margin: 0 auto
    margin-bottom: 80px
    @include large-device
      width: 90%
    a
      text-decoration: none
      color: unset
      border-bottom: 5px solid black
      padding-bottom: 40px
      @include transition(border-bottom-color)
      @include small-device
        padding: 20px
      b
        color: $purple
        font-size: 35px
      p
        color: $textGray
        margin: 0
      &:hover
        border-bottom-color: $purple

footer
  padding: 40px
  background-color: black
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

<template>
  <div>
    <div class="hrac">
      <div
        class="header"
        :style="
          'background: linear-gradient(0deg, rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(' +
          game.bg +
          ')'
        "
      >
        <h3>{{ game.name }}</h3>
        <h1>{{ player.name }}</h1>
        <h2>{{ player.desc }}</h2>
      </div>
      <div class="wrapper">
        <main>
          <div>
            <h1>Hráč</h1>
            <h2>Něco málo o mě</h2>
          </div>

          <p>
            {{ player.text }}
          </p>

          <div>
            <h1>Sestava</h1>
            <h2>Na čem hraju</h2>
          </div>

          <table>
            <tbody>
              <tr v-for="(item, index) in player.sestava" :key="item">
                <td>{{ index }}</td>
                <td>{{ item }}</td>
              </tr>
            </tbody>
          </table>

          <div>
            <h1>Podporuj</h1>
            <h2>Tady mě najdeš</h2>
          </div>

          <div class="links">
            <a
              v-if="player.links.facebook"
              class="fab fa-facebook-f"
              :href="player.links.facebook"
            />
            <a
              v-if="player.links.instagram"
              class="fab fa-instagram"
              :href="player.links.instagram"
            />
            <a
              v-if="player.links.twitch"
              class="fab fa-twitch"
              :href="player.links.twitch"
            />
            <a
              v-if="player.links.twitter"
              class="fab fa-twitter"
              :href="player.links.twitter"
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { getData } from '../assets/js/dataFetcher';

export default {
  data() {
    return {
      player: { name: '', sestava: {}, links: [] },
      game: { name: '', bg: '' },
    };
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  async created() {
    this.$Progress.start();
    let game = this.$route.params.game;
    let name = this.$route.params.name;

    let data = await getData('/hrac', { code: true, params: [game, name] });

    if (data !== 400) {
      this.player = data.player;
      this.game = data.game;
    } else {
      this.$Progress.fail();
      this.$router.replace('/hraci');
    }

    this.$Progress.finish();
  },
};
</script>

<style lang="sass" scoped>
@mixin left()
  padding-left: 22%
  @include large-device
    padding-left: 5%

.hrac
  color: white
  text-align: left

  .header
    background-repeat: no-repeat !important
    background-size: cover !important
    background-position: center center !important
    justify-self: left
    padding: 37.5vh 0 5vh 0
    @include left()
    width: inherit
    h1, h2, h3
      text-transform: uppercase
    h1
      color: $purple
      font-size: 4.5rem
      @include small-device
        font-size: 3.5rem
    h2
      font-size: rem
    h3
      font-size: 1.5rem
      padding-bottom: 2.5vh

  .wrapper
    background-color: white
    color: black
    width: auto
    padding: 5vh 25vw 5vh 0
    @include left()
    @include large-device
      padding-right: 5%

  main
    display: grid
    grid-template-columns: repeat(2, auto)
    column-gap: 3.5vw
    row-gap: 4vh
    text-align: left
    @include small-device
      grid-template-columns: auto
    h1, h2
      text-transform: uppercase
    h1
      color: $purple
      font-size: 2.75rem
      @include medium-device
        font-size: 2rem
    h2
      @include medium-device
        font-size: 1.2rem

    p
      line-height: 1.5rem
      margin: 0

  td
    padding-bottom: 10px
  td:nth-child(odd)
    font-weight: bold

  .links
    display: flex
    a
      font-size: 2rem
      width: 80px
      height: fit-content
      padding: 15px 0
      text-align: center
      color: black
      text-decoration: none
      border: $purple 1px solid
      border-left: 0
      @include transition(color)
      &:hover
        color: $purple
      &:first-child
        border-left: $purple 1px solid
      @include small-device
        font-size: 1.5rem
        padding: calc(1.5rem / 2) 0
        width: 15%
</style>

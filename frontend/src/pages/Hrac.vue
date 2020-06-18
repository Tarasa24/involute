<template>
  <div>
    <div class="hrac">
      <div
        class="header"
        :style="
          game.bg
            ? `background: linear-gradient(0deg, rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url('${game.bg}')`
            : 'black'
        "
      >
        <img v-lazy="cover" :alt="$route.params.name + ' portrét'" />
        <h1>{{ player.name }}</h1>
        <h2>{{ player.role }}</h2>
        <h3>{{ game.name }}</h3>
      </div>
      <div class="wrapper">
        <main>
          <div v-if="Object.keys(player.about).length > 0">
            <h1>Hráč</h1>
            <h2>Něco málo o mně</h2>
          </div>

          <table v-if="Object.keys(player.about).length > 0">
            <tr v-for="(a, q) in player.about" :key="q">
              <td>
                {{
                  q == 'Proč právě má hra?' ? q.replace('má hra', game.name) : q
                }}
              </td>
              <td>{{ a }}</td>
            </tr>
          </table>

          <div v-if="Object.keys(player.sestava).length > 0">
            <h1>Sestava</h1>
            <h2>Na čem hraju</h2>
          </div>

          <table v-if="Object.keys(player.sestava).length > 0">
            <tr v-for="(a, q) in player.sestava" :key="q">
              <td>{{ q }}</td>
              <td>{{ a }}</td>
            </tr>
          </table>

          <div v-if="Object.keys(player.links).length > 0">
            <h1>Socials</h1>
            <h2>Tady mě najdeš</h2>
          </div>

          <div class="links" v-if="Object.keys(player.links).length > 0">
            <a
              v-if="player.links.facebook"
              class="fab fa-facebook-f"
              :href="player.links.facebook"
              target="_blank"
              rel="noopener noreferrer"
            />
            <a
              v-if="player.links.instagram"
              class="fab fa-instagram"
              :href="player.links.instagram"
              target="_blank"
              rel="noopener noreferrer"
            />
            <a
              v-if="player.links.twitch"
              class="fab fa-twitch"
              :href="player.links.twitch"
              target="_blank"
              rel="noopener noreferrer"
            />
            <a
              v-if="player.links.twitter"
              class="fab fa-twitter"
              :href="player.links.twitter"
              target="_blank"
              rel="noopener noreferrer"
            />
            <a
              v-if="player.links.web"
              class="fas fa-link"
              :href="player.links.web"
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { getData } from '../assets/js/dataFetcher';
import { backendUrl } from '../assets/js/dev';

export default {
  data() {
    return {
      player: { about: {}, sestava: {}, links: {} },
      game: {},
    };
  },
  computed: {
    cover() {
      return `${backendUrl}/hrac/cover/${this.$route.params.name}`;
    },
  },
  async created() {
    this.$Progress.start();
    let name = this.$route.params.name;

    let data = await getData('/hrac', { code: true, params: [name] });

    if (data !== 400) {
      this.player = data.player;
      this.game = data.game || {};
      document.title = 'iNvolute | ' + this.player.name;
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
    padding: 12.5vh 0 5vh 0
    @include left()
    width: inherit
    img
      height: 35vh
      margin-bottom: 2vh
    h1, h2, h3
      text-transform: uppercase
    h1
      color: $purple
      font-size: 4.5rem
      @include small-device
        font-size: 3.5rem
    h2
      font-size: rem
      padding-bottom: 2.5px
    h3
      font-size: 1rem
      color: gray

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

  table
    width: 100%
    td
      padding-bottom: 7px
      &:first-child
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

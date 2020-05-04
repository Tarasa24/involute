<template>
  <div>
    <div class="header">
      <h1>Seznamte se</h1>
      <h1>To jsme my!</h1>
    </div>

    <div class="players">
      <div
        class="game"
        v-for="game in games"
        :key="game.name"
        :style="
          'background: linear-gradient(0deg, rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(' +
          game.bg +
          ')'
        "
      >
        <div>
          <h1>{{ game.name }}</h1>

          <div class="portraits">
            <div
              class="portrait"
              v-for="player in game.players"
              :key="player.name"
            >
              <router-link :to="'/hrac/' + player.name">
                <img :src="player.img" :alt="player.name" />
                <h2>
                  {{ player.name }}
                </h2>
              </router-link>
              <span>
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
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getData } from '../assets/js/dataFetcher';

export default {
  data() {
    return {
      games: null,
    };
  },
  async created() {
    this.$Progress.start();
    this.games = await getData('/hraci');
    this.$Progress.finish();
  },
};
</script>

<style lang="sass" scoped>
.header
  background-color: $bgGray
  padding: 30px 0
  h1
    color: $purple
    font-size: 3.5rem
    text-transform: uppercase
    &:nth-child(1)
      font-size: 5rem
      @include small-device
        font-size: 3rem
    &:nth-child(2)
      letter-spacing: 1.5rem
      font-weight: bolder
      @include small-device
        font-size: 2rem
        letter-spacing: 1rem

.players
  .game
    background-repeat: no-repeat !important
    background-size: cover !important
    background-position: center center !important
    display: grid
    justify-items: center
    align-items: left
    h1, h2
      text-transform: uppercase
      color: $purple
    h1
      text-align: left
      font-size: 2.5rem
      padding: 40px 0
      @include outside-boundaries
        padding-left: 2.5%
      @include medium-device
        font-size: 2.2rem
        padding-left: 5%
        padding-right: 0
      @include small-device-portrait
        font-size: 2rem
      @include small-device-landscape
        font-size: 2.2
        padding-top: 20px
    h2
      margin: 15px 0 10px 0
      font-size: 20px

    > div
      width: $baselineWidth
      display: grid
      max-width: $maxWidth
      @include medium-device
        width: 100%

    .portraits
      display: flex
      justify-self: center
      align-items: baseline
      overflow: auto
      max-width: 100%
      @include scrollbar(5px, gray, transparent)
      @include large-device
        justify-self: start
      @include medium-device
        width: auto
      .portrait
        margin: 0 10px 25px 0
        img
          width: 180px
          @include small-device-landscape
            width: auto
            height: 60vh
        a, .fab, .fas
          font-size: 17px
          color: $textGray
          text-decoration: none
        span
          display: flex
          width: 80%
          margin: 0 auto
        .fab, .fas
          display: inline-flex
          margin: 0 auto
          @include transition(color)
          &:hover
            color: $purple
        @include medium-device
          &:first-of-type
            padding-left: 5vw
          &:last-of-type
            padding-right: 5vw
</style>

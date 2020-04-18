<template>
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
</template>

<script>
import { getData } from '../../assets/js/dataFetcher';

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
      font-size: 45px
      padding: 40px 0
      @include large-device
        font-size: 2rem
        padding-left: 5%
        padding-right: 0
      @include small-device-portrait
        font-size: 1.5rem
      @include small-device-landscape
        font-size: 1.5rem
        padding-top: 20px
    h2
      margin: 15px 0 10px 0
      font-size: 20px

    > div
      width: $baselineWidth
      display: grid
      @include large-device
        width: 100%

    .portraits
      display: flex
      overflow: auto
      @include scrollbar(5px, gray, transparent)
      @include small-device
        margin: 0 20px
      .portrait
        margin: 0 10px 25px 0
        min-height: 300px
        width: 165px
        min-width: 165px
        @include small-device-landscape
          width: 125px
        img
          width: 100%
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
</style>

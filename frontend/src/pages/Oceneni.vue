<template>
  <main>
    <Header>
      <h1>Ocenění</h1>
      <h2>Vi Von Zulul</h2>
    </Header>

    <div class="wrapper">
      <div class="row" v-for="oceneni in data" :key="oceneni._id">
        <img
          :src="iconsObj[oceneni.game]"
          :title="oceneni.game"
          :alt="oceneni.game"
          class="game-icon"
        />
        <div class="award-info">
          <h1>{{ oceneni.title }}</h1>
          <a>{{ oceneni.player }}</a>
        </div>
        <img
          v-if="placementObj[oceneni.placement] !== undefined"
          :src="placementObj[oceneni.placement]"
          :alt="oceneni.placement"
          class="award-place"
        />
        <p v-else class="award-place">{{ oceneni.placement }}</p>
      </div>
    </div>
  </main>
</template>

<script>
import Header from '../components/misc/Header';

import { getData } from '../assets/js/dataFetcher';

export default {
  components: { Header },
  data() {
    return {
      data: {},
      placementObj: {
        '1.': require('../assets/img/icons/ico_award_gold.png'),
        '2.': require('../assets/img/icons/ico_award_silver.png'),
        '3.': require('../assets/img/icons/ico_award_bronze.png'),
      },
      iconsObj: {},
    };
  },
  async created() {
    this.$Progress.start();
    this.data = await getData('/oceneni');

    const iconsArray = await getData('/icons');
    var icons = {};
    iconsArray.forEach(e => {
      icons[e.name] = e.icon;
    });
    this.iconsObj = icons;
    this.$Progress.finish();
  },
};
</script>

<style lang="sass" scoped>
main
  background-color: $bgGray
.wrapper
  display: grid
  justify-items: center
  padding-bottom: 5%
  .row
    background-color: $dark
    width: $baselineWidth
    height: 60px
    display: grid
    grid-template-columns: 80px auto 80px
    align-items: center
    padding: 0.5rem 0
    border-bottom: 1px solid $darkPurple
    @include large-device
      margin: 0 5%
      width: 90%
    @include small-device-portrait
      h1
        font-size: .2rem
    .award-info
      margin-right: auto
      color: white
      text-align: left
      h1, p, a
        margin: 0
      h1
        font-size: 1.15rem
        font-weight: normal
      p
        font-size: .75rem
      a
        color: $purple
        &[href]
          text-decoration: underline
          @include transition(letter-spacing)
          &:hover
            letter-spacing: 3px


    .game-icon, .award-place
      align-self: center
      margin: auto
      width: 60px
    .award-place
      color: white
      font-weight: bolder
      font-size: 1.3rem
</style>

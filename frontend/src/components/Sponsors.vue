<template>
  <div class="wrapper">
    <div class="sponsors">
      <a
        v-for="sponsor in sponsors"
        :key="sponsor._id"
        :href="sponsor.url"
        :title="sponsor.name"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img :src="sponsor.img" :alt="'${sponsor.name} logo'" />
      </a>
    </div>
  </div>
</template>

<script>
import { getData } from '../assets/js/dataFetcher';

export default {
  data() {
    return {
      sponsors: [],
    };
  },
  async created() {
    this.$Progress.start();
    this.sponsors = await getData('/sponzori');
    this.$Progress.finish();
  },
};
</script>

<style lang="sass" scoped>
.wrapper
  position: sticky
  top: -1px
  z-index: 1
  display: grid
  justify-self: center
  justify-items: center
  position: sticky
  bottom: 0
  background-color: $bgBlack
  @include medium-device
    padding: 0 1%
  @include small-device
    height: auto

.sponsors
  width: $baselineWidth
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr))
  align-items: center
  @include large-device
    width: 100%
  @include small-device
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr))
  a
    padding: 10px
    display: grid
    justify-items: center
  img
    width: auto
    max-width: 100%
    max-height: 60px
    filter: brightness(0) invert(1)
    opacity: .95
    @include transition(opacity)
    &:hover
      opacity: .7
</style>

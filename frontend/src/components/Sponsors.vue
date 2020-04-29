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
  bottom: 0
  z-index: 1
  display: grid
  justify-self: center
  justify-items: center
  position: sticky
  bottom: 0
  background-color: $bgBlack
  min-height: 65px
  @include medium-device
    padding: 0 1%
  @include small-device
    height: auto
  @include small-device
    position: unset

.sponsors
  width: $baselineWidth
  max-width: $maxWidth
  display: flex
  flex-wrap: wrap
  align-items: center
  @include medium-device
    width: 100%
  a
    flex-grow: 1
    display: grid
    justify-items: center
  img
    padding: 10px
    width: auto
    max-width: 100%
    max-height: 60px
    @include medium-device
      max-width: 120px
    @include small-device-portrait
      max-width: 80px
    filter: brightness(0) invert(1)
    opacity: .95
    @include transition(opacity)
    &:hover
      opacity: .7
</style>

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
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  async created() {
    this.$Progress.start();
    this.sponsors = await getData('/sponzori');
    this.$Progress.finish();
  },

  methods: {
    handleScroll() {
      const el = document.getElementsByClassName('wrapper')[1];
      const viewportOffset = el.getBoundingClientRect();
      const topDistance = viewportOffset.top;

      if (topDistance < 5 && !el.classList.contains('sticky'))
        el.classList.add('sticky');
      else if (topDistance > 5 && el.classList.contains('sticky'))
        el.classList.remove('sticky');
    },
  },
};
</script>

<style lang="sass" scoped>
.wrapper
  display: grid
  justify-self: center
  justify-items: center
  position: sticky
  bottom: 0
  background-color: black
  @include medium-device
    padding: 0 1%
  @include small-device
    height: auto

.sponsors
  width: $baselineWidth
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr))
  column-gap: 20px
  align-items: center
  @include large-device
    padding: 0 20px
    width: calc(100% - 40px)
  @include small-device
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr))
  img
    width: auto
    max-width: 100%
    filter: brightness(0) invert(1)
    opacity: .95
    @include transition(opacity)
    &:hover
      opacity: .7
    @include small-device
      padding: 5px 0
      max-height: 35px

.sticky
  position: sticky
  top: 0
  z-index: 1
</style>

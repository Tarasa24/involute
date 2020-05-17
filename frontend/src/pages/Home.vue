<template>
  <div id="home">
    <div class="head">
      <video
        v-if="width > 767"
        src="/video/involuteWeb.mp4"
        poster="/img/thumb/involuteWeb.png"
        autoplay
        muted
        loop
      />
      <img v-else src="/img/thumb/involuteWeb.png" alt="involuteWeb.png" />
      <div class="text">
        <span>
          <h1>My jsme <strong>iNvolute</strong></h1>
          <br />
          <h2>
            iNvolute, založen 1. března 2016, je e-sportová organizace řadící se
            do nejmladších profesionálních týmů na české a slovenské herní
            scéně.
          </h2>
          <br />
          <router-link to="/about"
            ><button>Zjistit více <i class="fas fa-arrow-right" /></button
          ></router-link>
        </span>
      </div>
    </div>

    <!-- <Sponsors /> -->
    <News />
    <Media />
  </div>
</template>

<script>
//import Sponsors from '../components/Sponsors.vue';
import News from '../components/News.vue';
import Media from './Media.vue';

export default {
  components: { News, Media },
  data() {
    return {
      width: window.innerWidth,
    };
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
    });
  },
  unmounted() {
    window.removeEventListener('resize');
  },
};
</script>

<style lang="sass" scoped>
.head
  text-align: left
  color: $textGray
  position: relative
  text-align: center
  width: 100%
  height: 90vh
  overflow: hidden
  &::before
    content: ''
    background: rgba(2, 2, 31, 0.4)
    width: 100%
    height: 100%
    position: absolute
    left: 0
    top: 0
    z-index: 1

  video, img
    min-height: 100%
    position: absolute
    left: 50%
    top: 50%
    transform: translate(-50%, -50%)
  video
    width: 100%

.text
  width: 100%
  position: absolute
  left: 50%
  top: 50%
  transform: translate(-50%, -50%)
  display: grid
  justify-items: center
  z-index: 1
  @include outside-boundaries
    padding-left: 2.5%
    width: 100% - 2.5%
  @include medium-device
    padding-left: 5%
    width: 100% - 5%
  span
    text-align: left
    width: $baselineWidth
    max-width: $maxWidth
    @include medium-device
      width: auto

  h1
    font-size: 3.5rem
    letter-spacing: 5px
    margin: 2% 0
    strong
      color: $purple
    text-transform: uppercase
    @include medium-device
      font-size: 3rem
    @include small-device
      font-size: 2.2rem
  h2
    margin-right: 45%
    line-height: 1.5
    letter-spacing: .8px
    font-weight: normal
    @include medium-device
      font-size: 1.05rem
      margin-right: 15%
    @include small-device-portrait
      font-size: .9rem
  button
    margin-top: 30px
    @include btn($purple, $purple)
    padding: 20px
    font-size: 1.8rem
    .fas
      margin-left: 15px
    @include medium-device
      font-size: 1.2rem
      margin-top: 10px
</style>

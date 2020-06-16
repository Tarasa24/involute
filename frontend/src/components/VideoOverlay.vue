<template>
  <div class="main">
    <div
      class="thumb"
      @click="open"
      :style="`background: url('https://img.youtube.com/vi/${videoCode}/0.jpg'), white`"
    >
      <span>
        <h5>Video</h5>
        <a>{{ title }}</a>
      </span>
    </div>

    <div v-if="visible" class="overlay" @click="close">
      <button @click="close">×</button>
      <iframe
        :src="`https://www.youtube-nocookie.com/embed/${videoCode}?autoplay=1`"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    videoCode: {
      type: String,
      requried: true,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  asyncComputed: {
    async title() {
      const result = await fetch(
        `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${this.videoCode}`
      );
      const { title } = await result.json();
      return title;
    },
  },
  methods: {
    open() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
  },
};
</script>

<style lang="sass" scoped>
.overlay
  position: fixed
  top: 0
  left: 0
  height: 100%
  width: 100%
  background-color: rgba(0,0,0,.8)
  z-index: 9
  overflow: hidden
  display: grid
  align-items: center
  justify-items: center
iframe
  width: 60vw
  height: 60vh
  @include large-device
    width: 90vw
    height: 60vh
  @include small-device-landscape
    height: 80vh

button
  color: #fff
  position: absolute
  top: 0
  right: 0
  background-color: transparent
  border: none
  font-size: 25px
  width: 50px
  height: 50px
  cursor: pointer
  z-index: 1
  &:focus
    outline: 0

.thumb
  cursor: pointer
  background-repeat: no-repeat !important
  background-size: cover !important
  background-position: center center !important
  width: 100%
  height: 25vh
  max-width: 600px
  max-height: 240px
  position: relative
  justify-self: center
  margin-bottom: 50px
  @include small-device-portrait
    height: 35vh
  @include small-device-landscape
    height: 70vh
  @include transition(transform)
  img
    max-width: 100%
    max-height: 40vh
  span
    position: absolute
    bottom: 0
    left: 0
    width: calc(100% - 10px)
    z-index: 2
    color: white
    background-color: rgba(black,.8)
    padding: 10px 5px
    text-align: left
    font-weight: bold
    @include transition(color)
  &:hover
    i
      color: red
    span
      color: $purple
    transform: scale(.96)
</style>

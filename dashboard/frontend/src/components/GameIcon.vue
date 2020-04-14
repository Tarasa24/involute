<template>
  <div class="top">
    <div v-if="visible" class="overlay">
      <div class="container">
        <h2>
          Vyberte hru
        </h2>
        <button class="fas fa-times close" @click="close" />
        <img
          class="icon"
          v-for="game in icons"
          :key="game._id"
          :src="game.icon"
          :alt="game.name"
          :title="game.name"
          @click="handleChoose"
        />
        <router-link to="/hry" title="Přidat hru" class="fas fa-plus">
        </router-link>
      </div>
    </div>
    <img
      v-if="value != undefined"
      :src="iconsObj[value]"
      :alt="value"
      :title="value"
      @click="open"
    />
    <button class="choose" type="button" v-else @click="open">
      Vybrat
    </button>
  </div>
</template>

<script>
export default {
  props: ['value', 'icons'],
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    iconsObj() {
      var iconsObj = {};
      this.icons.forEach(e => {
        iconsObj[e.name] = e.icon;
      });
      return iconsObj;
    },
  },
  methods: {
    open() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    handleChoose(event) {
      this.$emit('input', event.target.title);
      this.close();
    },
  },
};
</script>

<style lang="sass" scoped>
.top
  max-height: 100%

.overlay
  position: fixed
  top: 0
  left: 0
  z-index: 1
  background-color: rgba(0, 0, 0, .4)
  width: 100%
  height: 100%
  padding-top: 10%

.container
  background-color: white
  width: 70%
  margin: 0 auto
  position: relative
  padding: 1px
  h2
    margin: 10px
  button
    border: 0
    cursor: pointer
  .close
    position: absolute
    right: 10px
    top: 10px
    padding: 5px
    font-size: 1.2rem
    background-color: transparent
  .icon, a
    width: 60px
    margin: 30px 5px 5px 5px
    cursor: pointer
  a
    padding: 30px 0
    line-height: 0
    position: relative
    bottom: 30px

img
  cursor: pointer
  width: 60px
  filter: brightness(0)
  @include small-device-portrait
    width: 40px

.choose
  background-color: transparent
  border: 0
  cursor: pointer
  color: gray
  &:focus
    outline: 0
  @include small-device-portrait
    font-size: .6rem
</style>

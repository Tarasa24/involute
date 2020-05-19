<template>
  <div>
    <div class="wrapper">
      <div class="partneri">
        <div class="header">
          <h1>Partneři</h1>
          <h3>Ti, kdo za námi stojí</h3>
        </div>

        <div class="partner" v-for="partner in partners" :key="partner.id">
          <div class="text">
            <h2>{{ partner.name }}</h2>
            <p>{{ partner.description }}</p>
            <a :href="partner.url" target="_blank" rel="noopener noreferrer"
              >Navštivte webové stránky</a
            >
          </div>
          <img :src="partner.img" :alt="partner.name + '_logo'" />
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
      partners: null,
    };
  },
  async created() {
    this.$Progress.start();
    this.partners = await getData('/partneri');
    this.$Progress.finish();
  },
};
</script>

<style lang="sass" scoped>
.wrapper
  background-color: $bgGray
  display: grid
  justify-items: center

.partneri
  padding: 40px 0
  text-align: left
  .header
    justify-self: left
    padding-bottom: 5vh
    @include small-device
      padding-left: 5%
    h1
      margin: 0
      text-transform: uppercase
      font-size: 50px
      color: $purple
    h3
      margin: 0
      text-transform: uppercase
      color: black
      font-weight: bolder
  .partner
    display: grid
    &:nth-child(odd)
      grid-template-columns: 40vw auto
      grid-template-areas: "header header" "text img"
    &:nth-child(even)
      grid-template-columns: auto 40vw
      grid-template-areas: "header header" "img text"
    column-gap: 2.5vw

    border-bottom: 1px solid black
    padding: 2.5vh 0
    @include small-device
      display: block
      padding: 2.5vh 5%
    .text
      grid-area: text
      align-self: center
      h2
        text-transform: uppercase
        font-size: 2rem
    img
      grid-area: img
      align-self: center
      width: 255px
      @include small-device
        max-width: 75%
        width: auto
        display: table
        margin: 5% auto
    a
      color: $purple
      text-decoration: none
      @include transition(letter-spacing)
      &:hover
        letter-spacing: 2.5px
</style>

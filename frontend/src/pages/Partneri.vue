<template>
  <div class="wrapper">
    <Nav />
    <div class="partneri">
      <div
        class="partner"
        v-for="(partner, index) in partners"
        :key="partner.id"
      >
        <div class="header" v-if="index === 0">
          <h1>Partneři</h1>
          <h3>Ti, kdo za námi stojí</h3>
        </div>

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
    <Footer />
  </div>
</template>

<script>
import Nav from '../components/Nav.vue';
import Footer from '../components/Footer.vue';
import { getData } from '../assets/js/dataFetcher';

export default {
  components: { Nav, Footer },
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
.partneri
  background-color: $bgGray
  padding: 40px 0
  text-align: left
  display: grid
  grid-template-columns: 1fr
  justify-items: center
  align-items: center
  .header
    justify-self: left
    padding-bottom: 5vh
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
      grid-template-columns: 30vw auto
      grid-template-areas: "header header" "text img"
    &:nth-child(even)
      grid-template-columns: auto 30vw
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
      padding: 0 5vw
      filter: brightness(75%)
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

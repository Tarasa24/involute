<template>
  <div id="home">
    <Nav />
    <div class="head">
      <span>
        <h1>Nové <span>iNvolute</span> stránky?</h1>
        <h1>Tady je máš!</h1>
        <h2>
          Zase změna, ale teď je to tak, jak jsme chtěli. Product placement
          nechceme, na novinky z her jsou jiné portály, tak tady vidíš, kdo jsme
          prostě MY!
        </h2>
      </span>
    </div>

    <Sponsors />
    <News />
    <Players />
    <Footer />
  </div>
</template>

<script>
import Nav from '../components/Nav.vue';
import Sponsors from '../components/Sponsors.vue';
import News from '../components/News.vue';
import Players from '../components/Players.vue';
import Footer from '../components/Footer.vue';
export default {
  components: { Nav, Sponsors, News, Players, Footer },
};
</script>

<style lang="sass" scoped>
.head
  padding: 25vh 0
  text-align: left
  background-color: #02021f
  color: $textGray
  display: grid
  justify-items: center
  @include large-device
    padding-left: 5%
  @include small-device-portrait
    padding-left: 5%

  span
    width: $baselineWidth
    @include large-device
      width: auto

  h1
    font-size: 55px
    letter-spacing: 5px
    margin: 2% 0
    span
      color: $purple
    @include medium-device
      font-size: 3rem
    @include small-device-portrait
      font-size: 2rem
    @include small-device-landscape
      font-size: 2.5rem
  h2
    margin-right: 45%
    line-height: 1.5
    letter-spacing: .8px
    font-weight: normal
    @include medium-device
      font-size: 1.2rem
      margin-right: 15%
    @include small-device-portrait
      font-size: .9rem
</style>

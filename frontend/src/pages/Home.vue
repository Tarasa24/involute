<template>
  <div id="home">
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
    <Media />
  </div>
</template>

<script>
import Sponsors from '../components/Sponsors.vue';
import News from '../components/news/News.vue';
import Media from './Media.vue';

export default {
  components: { Sponsors, News, Media },
};
</script>

<style lang="sass" scoped>
.head
  text-align: left
  background-color: #02021f
  color: $textGray
  display: grid
  justify-items: center
  align-items: center
  padding: 15% 0
  @include outside-boundaries
    padding-left: 2.5%
  @include medium-device
    padding-left: 5%

  span
    width: $baselineWidth
    max-width: $maxWidth
    @include medium-device
      width: auto

  h1
    font-size: 3.5rem
    letter-spacing: 5px
    margin: 2% 0
    span
      color: $purple
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
</style>

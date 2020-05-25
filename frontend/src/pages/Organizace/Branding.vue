<template>
  <main>
    <Header>
      <h1>Branding & Presskit</h1>
    </Header>

    <div class="wrapper">
      <h1>Naše logo</h1>
      <h4>
        Prosíme neupravujte, neměňte, nezkreslujte ani nepřebarvujte oficiální
        logo iNvolute
      </h4>
      <div class="imgs">
        <a
          :href="require('../../assets/img/branding/inv-black-eye.png')"
          download
        >
          <img
            class="whiteBGPattern"
            v-lazy="
              require('../../assets/img/branding/resized/inv-black-eye.webp')
            "
            alt="inv-black-eye.webp"
          />
        </a>
        <a
          :href="require('../../assets/img/branding/inv-white-eye.png')"
          download
        >
          <img
            class="blackBGPattern"
            v-lazy="
              require('../../assets/img/branding/resized/inv-white-eye.webp')
            "
            alt="inv-white-eye.webp"
          />
        </a>
      </div>
      <div class="imgs">
        <a :href="require('../../assets/img/branding/inv-faded.png')" download>
          <img
            class="whiteBGPattern"
            v-lazy="require('../../assets/img/branding/resized/inv-faded.webp')"
            alt="inv-faded.webp"
          />
        </a>
        <a :href="require('../../assets/img/branding/inv-black.png')" download>
          <img
            class="whiteBGPattern"
            v-lazy="require('../../assets/img/branding/resized/inv-black.webp')"
            alt="inv-black.webp"
          />
        </a>
        <a :href="require('../../assets/img/branding/inv-white.png')" download>
          <img
            class="blackBGPattern"
            v-lazy="require('../../assets/img/branding/resized/inv-white.webp')"
            alt="inv-white.webp"
          />
        </a>
      </div>

      <h1>Ochranná zóna & minimální velikost</h1>
      <div class="imgs">
        <a
          :href="require('../../assets/img/branding/inv-spacing.png')"
          download
        >
          <img
            v-lazy="
              require('../../assets/img/branding/resized/inv-spacing.webp')
            "
            alt="inv-spacing.webp"
          />
        </a>
        <a
          :href="require('../../assets/img/branding/inv-min-size.png')"
          download
        >
          <img
            v-lazy="
              require('../../assets/img/branding/resized/inv-min-size.webp')
            "
            alt="inv-min-size.webp"
          />
        </a>
      </div>

      <h1>iNvolute barvy</h1>
      <div class="cards">
        <div class="card" style="background-color: #a807eb;">
          <span>Popiči fialová</span>
          <span>
            #a807eb<br />
            CMYK 26, 89, 0, 8
          </span>
        </div>
        <div class="card" style="background-color: #f900f2;">
          <span>Růžová</span>
          <span>
            #f900f2<br />
            CMYK 0, 100, 3, 2
          </span>
        </div>
        <div class="card" style="background-color: #441867;">
          <span>Dravě fialová</span>
          <span>
            #441867<br />
            CMYK 46, 92, 0, 51
          </span>
        </div>
        <div class="card" style="background-color: #000000;">
          <span>Černá</span>
          <span>
            #000000<br />
            CMYK 0, 0, 0, 100
          </span>
        </div>
        <div class="card black" style="background-color: #ffffff;">
          <span>Prostě bílá</span>
          <span>
            #ffffff<br />
            CMYK 0, 0, 0, 0
          </span>
        </div>
      </div>

      <h1>Presskit</h1>
      <h4>
        Stáhněte si kompletní presskit iNvolute a získejte: loga, bannery a
        další
      </h4>
      <div class="download">
        <a href="https://mega.nz" target="_blank" rel="noopener noreferrer">
          <button><i class="fas fa-download" /> Stáhnout</button>
        </a>
      </div>
    </div>
  </main>
</template>

<script>
import Header from '../../components/misc/Header';

export default {
  components: { Header },
};
</script>

<style lang="sass" scoped>
main
  background-color: $bgGray
  padding: 2%

.wrapper
  width: $baselineWidth
  margin: auto
  text-align: left
  @include medium-device
    width: 100%
  h1
    text-transform: uppercase
    color: $purple
    margin-top: 80px
    &:first-of-type
      margin-top: 30px
    @include small-device
      font-size: 1.5rem

.imgs
  display: flex
  align-items: center
  width: 100%
  margin-top: 30px
  a
    flex-grow: 1
    flex-wrap: wrap
    margin: 0 10px
    &:first-of-type
      margin-left: 0
    &:last-of-type
      margin-right: 0
  img
    max-width: 100%
    max-height: 50vh
    background-size: 20px 20px
    background-position: 0 0, 30px 30px
    position: relative
    left: 50%
    transform: translate(-50%, 0)
  .whiteBGPattern
    border-radius: 10%
    background-color: $textGray
    background-image: linear-gradient(45deg,#f6f6f6 25%,transparent 0,transparent 75%,#f6f6f6 0,#f6f6f6),linear-gradient(45deg,#f6f6f6 25%,transparent 0,transparent 75%,#f6f6f6 0,#f6f6f6)
  .blackBGPattern
    border-radius: 10%
    background-color: $bgBlack
    background-image: linear-gradient(45deg,#2e3033 25%,transparent 0,transparent 75%,#2e3033 0,#2e3033),linear-gradient(45deg,#2e3033 25%,transparent 0,transparent 75%,#2e3033 0,#2e3033)

.cards
  display: flex
  margin: 30px 0
  @include large-device
    display: block
  .card
    flex-grow: 1
    height: 200px
    max-width: 190px
    width: auto
    position: relative
    border-radius: 10%
    margin: 20px 10px 0 10px
    border: 1px solid $textGray
    @include transition(transform)
    @include large-device
      border-radius: 0
      height: 100px
      max-width: 100%
      margin-left: 0
      margin-right: 0
    &:hover
      transform: scale(.96)
    span
      width: 100%
      text-align: center
      color: white
      transform: translate(-50%, 0)
      &:first-of-type
        position: absolute
        top: 10px
        left: 50%
        font-weight: bold
      &:last-of-type
        position: absolute
        bottom: 10px
        left: 50%
  .black
    span
      color: black

.download
  text-align: center
  margin: 80px 0
  button
    margin: auto
    width: 40%
    @include btn($purple, $purple)
    font-size: 1.8rem
    @include medium-device
      width: 60%
    @include small-device
      width: 80%
      font-size: 1rem
</style>

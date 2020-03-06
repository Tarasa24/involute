<template>
  <div>
    <div class="support">
      <div class="header">
        <h1>Podpoř <span>Involute</span></h1>
        <h2>Sleduj, lajkuj, sdílej a podporuj... Nebudeš litovat!</h2>
      </div>

      <div class="links">
        <a href="https://www.facebook.com/Team.iNvolute/">
          <b>Facebook</b>
          <p>/teaminvolute</p>
        </a>
        <a href="https://twitter.com/iNvoluteGG">
          <b>Twitter</b>
          <p>/teaminvolute</p>
        </a>
        <a href="https://www.twitch.tv/teaminvolute">
          <b>Twitch</b>
          <p>/teaminvolute</p>
        </a>
        <a href="https://www.youtube.com/channel/involute">
          <b>YouTube</b>
          <p>/teaminvoluteTV</p>
        </a>
      </div>
    </div>

    <footer>
      Esport tým <a href=".">iNvolute</a> 2011 - 2020 | iNvolute s.r.o.,
      Primátorská 296/38, Libeň, 180 00 Praha 8, IČ: 06180167
    </footer>
  </div>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
.support
  background-color: black

  .header
    @include medium-device
      padding: 10px
    h1, h2
      margin: 0
    h1
      text-transform: uppercase
      font-size: 35px
      padding-top: 75px
      font-size: 50px
      color: $textGray
      span
        color: $purple
    h2
      color: gray
      font-weight: normal
      margin-bottom: 75px

  .links
    display: inline-flex
    margin-bottom: 80px
    @include small-device-portrait
      display: grid
      margin: 0 10%
    @include small-device-landscape
      width: 100%
      overflow: scroll
      @include scrollbar(5px, gray, transparent)
    a
      text-decoration: none
      color: unset
      padding: 0 5vw
      border-bottom: 5px solid black
      @include transition(border-bottom-color)
      @include medium-device
        padding: 0 20px
      @include small-device
        margin-bottom: 5%

      b
        color: $purple
        font-size: 35px
      p
        color: $textGray
        margin: 0
        padding-bottom: 40px
      &:hover
        border-bottom-color: $purple

footer
  padding: 40px
  background-color: black
  color: gray
  font-size: 19px
  @include small-device
    font-size: 1rem
    padding: 40px 10px
  a
    color: $purple
    text-decoration: none
    font-weight: bold
</style>

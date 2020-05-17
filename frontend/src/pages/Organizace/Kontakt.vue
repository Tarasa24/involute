<template>
  <main>
    <Header>
      <h1>Kontakt</h1>
      <h2>Neváhejte se na nás obrátit</h2>
    </Header>

    <div class="wrapper">
      <div class="contact">
        <h2>Adresa</h2>
        <p>
          <strong>iNvolute s.r.o.,</strong><br />
          Primátorská 296/38,<br />
          Praha 8, Libeň,<br />
          180 00,<br />
          IČ: 06180167
        </p>

        <h2>Kontakt</h2>
        <span>
          <span class="fas fa-envelope" />
          <a href="mailto:info@teaminvolute.eu">info@teaminvolute.eu</a>
        </span>
        <br />
        <span>
          <span class="fas fa-phone" />
          <a href="tel:+420534534614">+420 534 534 614</a>
        </span>
        <p>
          V případě jakýchkoliv otázek nás neváhejte kontaktovat skrze email,
          nebo se připojte na náš
          <a
            href="https://discord.gg/ydPkm3C"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>
          server, kde máte záruku nějrychlejší odpovědi.
        </p>
      </div>
      <div class="map">
        <l-map :zoom="14" :center="[50.113584, 14.473182]" id="mapid">
          <l-tile-layer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          />
          <l-marker :lat-lng="latLng(50.113584, 14.473182)">
            <l-icon :icon-anchor="[16, 37]" class-name="anchor">
              <div class="headline">
                iNvolute HQ
              </div>
              <img src="../../assets/img/logo.png" />
            </l-icon>
          </l-marker>
        </l-map>
      </div>
    </div>
  </main>
</template>

<script>
import Header from '../../components/misc/Header';
import { latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker, LIcon } from 'vue2-leaflet';

export default {
  components: { Header, LMap, LTileLayer, LMarker, LIcon },
  created() {
    if (!document.getElementById('leafletCss')) {
      var el = document.createElement('link');
      el.rel = 'stylesheet';
      el.type = 'text/css';
      el.id = 'leafletCss';
      el.href = 'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css';
      document.head.appendChild(el);
    }
  },
  destroyed() {
    const el = document.getElementById('leafletCss');
    if (el) {
      document.head.removeChild(el);
    }
  },
  methods: {
    latLng(x, y) {
      return latLng(x, y);
    },
  },
};
</script>

<style lang="sass" scoped>
main
  background-color: $bgGray
  display: grid
  justify-items: center
  padding-bottom: 5%

.wrapper
  display: grid
  width: $baselineWidth
  grid-template-columns: repeat(2, 1fr)
  @include large-device
    width: 100%
    grid-template-columns: auto

  .map
    padding-left: 2.5%
    width: calc(100% - 5%)
    @include large-device
      padding-right: 2.5%
      margin-top: 40px
    #mapid
      height: 400px
      z-index: 0
      border: 1px solid $bgBlack
      border-radius: 10px
    /deep/ .anchor
      background-color: $bgGray
      padding: 10px
      border: 1px solid $textGray
      border-radius: 0 20px 20px 20px
      box-shadow: 5px 3px 10px rgba(0, 0, 0, 0.2)
      width: auto !important
      height: auto !important
      margin: 0 !important
      text-align: center
      .headline
        text-align: center
        font-weight: bold
        white-space: pre
      img
        margin: auto
        height: 60px
        margin-top: 10px
  .contact
    padding-right: 2.5%
    @include large-device
      padding-left: 2.5%

  img
    max-width: 90%
    justify-self: center
  div
    text-align: left
    h2
      margin: 10px 0
      color: $purple
    p
      margin: 10px 0
    span
      margin-bottom: 10px
      .fas
        color: $pink
        padding: 0 2% 0 0
      a
        text-decoration: none
        color: black
        @include transition(letter-spacing)
        &:hover
          letter-spacing: .1em
</style>

<template>
  <aside>
    <router-link to="/">
      <h1 :style="`background-image: url(${image})`">iNvolute</h1>
    </router-link>
    <nav>
      <router-link to="/traffic">
        <i class="fas fa-chart-line" />Traffic
      </router-link>
      <router-link to="/novinky">
        <i class="fas fa-newspaper" />Novinky
      </router-link>
      <router-link to="/media">
        <i class="fas fa-photo-video" />Media
      </router-link>
      <router-link to="/oceneni">
        <i class="fas fa-trophy" />Ocenění
      </router-link>
      <router-link to="/uzivatele">
        <i class="fas fa-user-cog" />Uživatelé
      </router-link>
      <router-link to="/databaze">
        <i class="fas fa-database" />Databáze
      </router-link>
      <router-link to="/hraci" class="tab">
        <i class="fas fa-user-friends" />Hráči
      </router-link>
      <router-link to="/hry" class="tab">
        <i class="fas fa-gamepad" />Hry
      </router-link>
      <router-link to="/partneri" class="tab">
        <i class="fas fa-handshake" />Partneři
      </router-link>
      <router-link to="/sponzori" class="tab">
        <i class="fas fa-money-bill-wave" />Sponzoři
      </router-link>
      <router-link to="/staff" class="tab">
        <i class="fas fa-user-tie" />Staff
      </router-link>
      <router-link to="/odkazy" class="tab">
        <i class="fas fa-external-link-alt" />Odkazy
      </router-link>
    </nav>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      image:
        process.env.NODE_ENV == 'production'
          ? '/dashboard/img/icon.webp'
          : '/img/icon.webp',
    };
  },
};
</script>

<style lang="sass" scoped>
aside
  width: 100%
  min-height: 100vh
  background-color: $lighterGray

h1
  font-weight: 100
  font-size: 1.8rem
  margin: 7.5px 0
  background-size: 0 0
  @include medium-device
    font-size: 0
    margin: 10%
    height: calc( 53px - 2 * 5.3px )
    background-repeat: no-repeat
    background-size: cover
    background-position: center center

nav
  display: grid
  grid-template-columns: auto
  grid-auto-rows: 50px
  text-align: left
  position: sticky
  top: 0
  max-height: 100vh
  overflow-y: auto
  @include scrollbar(5px, $grayOutline)

  a
    padding: 4% 5%
    font-size: 1.2rem
    white-space: nowrap
    border: 1px $grayOutline solid
    border-top: unset
    text-decoration: none
    color: black
    &:first-of-type
      border-top: 1px $grayOutline solid
    i
      margin-right: 5%
      color: $purple
    @include transition(letter-spacing)
    &:hover
      letter-spacing: .4rem

    @include medium-device
      font-size: .8rem
      display: grid
      align-items: center
      justify-items: center
      i
        font-size: 1.7rem
        margin: 0
      &:hover
        letter-spacing: 0

  .tab
    padding-left: 12%
    @include medium-device
      i
        font-size: 1.2rem
      padding-left: 0
</style>

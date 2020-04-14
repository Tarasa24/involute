<template>
  <aside>
    <router-link to="/">
      <h1>iNvolute</h1>
    </router-link>
    <nav>
      <router-link to="/traffic" title="Traffic">
        <i class="fas fa-chart-line" />Traffic
      </router-link>
      <router-link to="/eshop" title="Eshop">
        <i class="fas fa-shopping-basket" />Eshop
      </router-link>
      <router-link to="/novinky" title="Novinky">
        <i class="fas fa-newspaper" />Novinky
      </router-link>
      <router-link to="/oceneni" title="Ocenění">
        <i class="fas fa-trophy" />Ocenění
      </router-link>
      <router-link to="/uzivatele" title="Uživatelé">
        <i class="fas fa-user-cog" />Uživatelé
      </router-link>
      <router-link to="/databaze" title="Databáze">
        <i class="fas fa-database" />Databáze
      </router-link>
      <router-link to="/hry_hraci" class="tab">
        <i class="fas fa-gamepad" />Hry/Hráči
      </router-link>
      <router-link to="/partneri" class="tab">
        <i class="fas fa-handshake" />Partneři
      </router-link>
      <router-link to="/sponzori" class="tab">
        <i class="fas fa-money-bill-wave" />Sponzoři
      </router-link>
      <router-link to="/odkazy" class="tab">
        <i class="fas fa-external-link-alt" />Odkazy
      </router-link>
    </nav>
  </aside>
</template>

<script>
export default {};
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
  @include medium-device
    font-size: 0
    margin: 10%
    height: calc( 53px - 2 * 5.3px )
    background-image: url('/dashboard/img/logo.png')
    background-repeat: no-repeat
    background-size: cover
    background-position: center center

nav
  display: grid
  grid-template-columns: auto
  grid-auto-rows: 50px
  text-align: left
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
      font-size: 0
      display: grid
      align-items: center
      justify-items: center
      i
        font-size: 1.7rem
      &:hover
        letter-spacing: 0

  .tab
    padding-left: 12%
    @include medium-device
      display: none
</style>

<template>
  <aside>
    <router-link to="./traffic">
      <i class="fas fa-chart-line" />Traffic
    </router-link>
    <router-link to="./eshop">
      <i class="fas fa-shopping-basket" />Eshop
    </router-link>
    <router-link to="./databaze">
      <i class="fas fa-database" />Databáze
    </router-link>
    <router-link to="./novinky" class="tab">
      <i class="fas fa-newspaper" />Novinky
    </router-link>
    <router-link to="./hry_hraci" class="tab">
      <i class="fas fa-gamepad" />Hry/Hráči
    </router-link>
    <router-link to="./partneri" class="tab">
      <i class="fas fa-handshake" />Partneři
    </router-link>
    <router-link to="./sponzori" class="tab">
      <i class="fas fa-money-bill-wave" />Sponzoři
    </router-link>
    <router-link to="./odkazy" class="tab">
      <i class="fas fa-external-link-alt" />Odkazy
    </router-link>
    <router-link to="./uzivatele" class="tab">
      <i class="fas fa-user-cog" />Uživatelé
    </router-link>
  </aside>
</template>

<script>
export default {};
</script>

<style lang="sass" scoped>
aside
  display: grid
  grid-template-columns: auto
  grid-auto-rows: 50px
  text-align: left
  width: 100%
  min-height: calc( 100vh - 58px )
  background-color: $lighterGray

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

.tab
  padding-left: 12%
</style>

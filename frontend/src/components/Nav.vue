<template>
  <nav>
    <div class="wrapper">
      <router-link to="/" class="img"
        ><img src="../assets/img/logo.png" alt="involute logo"
      /></router-link>
      <span>
        <router-link to="/">Home</router-link>
        <router-link to="/novinky">Novinky</router-link>
        <router-link to="/media">Média</router-link>
        <router-link to="/hraci">Hráči</router-link>
        <router-link to="/partneri">Partneři</router-link>
        <router-link to="/oceneni">Ocenění</router-link>
        <router-link to="/kontakt">Kontakt</router-link>
        <div v-if="authenticated">
          <a :href="dashboardUrl">Dashboard</a>
          <a :href="authUrl + '/logout'">Logout</a>
        </div>
      </span>
    </div>
  </nav>
</template>

<script>
import { authUrl, dashboardUrl } from '../assets/js/dev';

export default {
  data() {
    return {
      authenticated: false,
      authUrl: authUrl,
      dashboardUrl: dashboardUrl,
    };
  },
  async created() {
    const result = await fetch(authUrl + '/validateJWT', {
      method: 'POST',
      credentials: 'include',
    });

    this.authenticated = result.status == 204;
  },
};
</script>

<style lang="sass" scoped>
nav
  background-color: $bgBlack
  color: white
  @include medium-device
    overflow-x: scroll
    overflow-y: hidden
    @include scrollbar(2px, gray, transparent)
  @include outside-boundaries
    padding-left: 2.5%
    font-size: 1.2rem

.wrapper
  width: $baselineWidth
  max-width: $maxWidth
  margin: 0 auto
  display: grid
  grid-template-columns: 80px auto
  @include medium-device
    width: 100%

  .img
    display: grid
    align-items: center
    justify-self: right
  img
    padding: 7px
    max-width: 70px

  span
    display: flex
    flex-wrap: wrap
    @include medium-device
      width: 800px
    a
      flex-grow: 1
      text-transform: uppercase
      text-decoration: none
      color: #B4B4B4

      padding: 35px 10px
      border-bottom: 2px transparent solid
      @include transition(color)
      &:hover
        color: $purple
        border-bottom-color: $purple

  .login
    color: $purple
    &:hover
      color: $pink
  div
    display: contents
    a
      color: $purple
      &:hover
        color: $pink
</style>

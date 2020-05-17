<template>
  <nav>
    <div v-if="width > 767" class="wrapper">
      <router-link to="/" class="img"
        ><img src="../assets/img/logo.png" alt="involute logo"
      /></router-link>
      <span>
        <router-link to="/">Home</router-link>
        <router-link to="/novinky">Novinky</router-link>
        <router-link to="/media">Média</router-link>
        <div class="dropdown">
          <router-link to="/hraci"
            >Team <i class="fas fa-caret-down"
          /></router-link>
          <div class="hidden">
            <router-link to="/hraci">Hráči</router-link>
            <router-link to="/staff">Staff</router-link>
            <router-link to="/oceneni">Ocenění</router-link>
          </div>
        </div>
        <div class="dropdown">
          <router-link to="/about"
            >Organizace <i class="fas fa-caret-down"
          /></router-link>
          <div class="hidden">
            <router-link to="/about">O nás</router-link>
            <router-link to="/kontakt">Kontakt</router-link>
            <router-link to="/branding">Branding</router-link>
          </div>
        </div>
        <div v-if="authenticated" class="auth">
          <a :href="dashboardUrl">Dashboard</a>
          <a :href="authUrl + '/logout'">Logout</a>
        </div>
      </span>
    </div>

    <div v-else class="mobile">
      <router-link to="/" class="img">
        <img src="../assets/img/logo.png" alt="involute logo" />
      </router-link>
      <h1>#INWIN</h1>
      <button @click="toggle">
        <i v-if="!menuVisible" class="fas fa-bars" />
        <i v-if="menuVisible" class="fas fa-times" />
      </button>
      <span>
        <router-link to="/">Home</router-link>
        <router-link to="/novinky">Novinky</router-link>
        <router-link to="/media">Média</router-link>
        <div class="dropdown">
          <router-link to="/hraci">Team</router-link>
          <div class="hidden">
            <router-link to="/hraci">Hráči</router-link>
            <router-link to="/staff">Staff</router-link>
            <router-link to="/oceneni">Ocenění</router-link>
          </div>
        </div>
        <div class="dropdown">
          <router-link to="/about">Organizace</router-link>
          <div class="hidden">
            <router-link to="/about">O nás</router-link>
            <router-link to="/kontakt">Kontakt</router-link>
            <router-link to="/branding">Branding</router-link>
          </div>
        </div>
        <div v-if="authenticated" class="auth">
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
      width: window.innerWidth,
      menuVisible: false,
    };
  },
  watch: {
    $route(to, from) {
      if (to !== from && this.menuVisible) this.toggle();
    },
  },
  async created() {
    const result = await fetch(authUrl + '/validateJWT', {
      method: 'POST',
      credentials: 'include',
    });

    this.authenticated = result.status == 204;
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
    });
    window.addEventListener('scroll', () => {
      if (this.menuVisible) this.toggle();
    });
  },
  unmounted() {
    window.removeEventListener('resize');
    window.removeEventListener('scroll');
  },
  methods: {
    toggle() {
      this.menuVisible = !this.menuVisible;
      document
        .getElementsByClassName('mobile')[0]
        .lastChild.classList.toggle('menuVisible');
    },
  },
};
</script>

<style lang="sass" scoped>
nav
  background-color: $bgBlack
  color: white
  @include outside-boundaries
    padding-left: 2.5%
    font-size: 1.2rem

.wrapper
  width: $baselineWidth
  max-width: $maxWidth
  margin: auto
  display: grid
  grid-template-columns: 80px 1fr
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
    a,
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

  .dropdown
    position: relative
    flex-grow: 1
    display: flex
    &:hover, &:focus
      .hidden
        opacity: 1
        pointer-events: auto
    .hidden
      @include transition(opacity)
      background-color: $bgBlack
      position: absolute
      z-index: 2
      top: 100%
      left: 50%
      transform: translate(-50%, 0)
      display: grid
      pointer-events: none
      opacity: 0
      width: max-content
      min-width: 100%

  .auth
    display: contents
    a
      color: $purple
      &:hover
        color: $pink

.mobile
  min-height: 92px
  position: relative
  img
    padding: 7px
    max-width: 70px
    position: absolute
    left: 0
    top: 50%
    transform: translate(0, -50%)
  button
    position: absolute
    right: 0
    top: 50%
    margin: 0 15px
    transform: translate(0, -50%)
    @include btn($purple, $purple)
    min-width: 43px
    min-height: 43px
  h1
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    color: #B4B4B4
  span
    position: absolute
    top: 100%
    left: 0
    width: calc(100% - 40px)
    z-index: 2
    display: grid
    text-align: left
    padding: 10px 20px
    background-color: $bgBlack
    @include transition(opacity)
    opacity: 0
    pointer-events: none
    overflow-y: auto
    max-height: calc(100vh - 92px)
    a
      color: white
      text-transform: uppercase
      text-decoration: none
      padding: 10px 0
    .dropdown
      padding-top: 10px
      .hidden
        padding: 5px 0 0 20px
        display: grid
    .auth
      display: grid
      a
        color: $purple
        &:hover, &:active
          color: $pink

  .menuVisible
    opacity: 1
    pointer-events: auto
</style>

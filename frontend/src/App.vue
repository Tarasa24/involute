<template>
  <div id="app">
    <vue-progress-bar />
    <Nav />
    <!-- <Sponsors v-if="!['/', '/partneri'].includes(this.$route.path)" /> -->
    <router-view />
    <Footer />
    <CookieConsent ref="cookies" @change="handleCookieChange" />
  </div>
</template>

<script>
import Nav from './components/Nav.vue';
//import Sponsors from './components/Sponsors.vue';
import Footer from './components/Footer.vue';
import CookieConsent from './components/CookieConsent.vue';

export default {
  name: 'App',
  components: { Nav, Footer, CookieConsent },
  created() {
    this.$nextTick(() => {
      this.init(this.$refs.cookies.cookies);
    });
  },
  methods: {
    init(cookies) {
      if (cookies.tracking) {
        //load tracking scripts
        this.loadScript(
          null,
          "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){" +
            '(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),' +
            'm=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)' +
            "})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');" +
            `ga('create', '${process.env.GA_MEASUREMENT_ID}', 'auto');` +
            "ga('send', 'pageview');"
        );
      }
      if (cookies.marketing) {
        //load markteting scripts
      }
    },
    handleCookieChange(payload) {
      this.init(payload);
    },
    loadScript(src, innerHTML = null) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      if (src !== null) script.setAttribute('src', src);
      else script.textContent = innerHTML;
      document.head.insertBefore(script, document.head.firstChild);
    },
  },
};
</script>

<style lang="sass">
@font-face
  font-family: 'skoda'
  src: url('/fonts/SkodaPro_Regular.woff') format('woff')
  font-weight: normal
  font-style: normal
  font-display: swap

@font-face
  font-family: 'skoda'
  src: url('/fonts/SkodaPro_Bold.woff') format('woff')
  font-weight: bold
  font-style: normal
  font-display: swap

@font-face
  font-family: 'skoda'
  src: url('/fonts/SkodaPro_Bolder.woff') format('woff')
  font-weight: bolder
  font-style: normal
  font-display: swap

#app
  font-family: skoda, Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
body
  margin: 0 auto
  background-color: black

h1, h2, h3, h4, h5, h6
  margin: 0
</style>

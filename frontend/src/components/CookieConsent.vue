<template>
  <footer v-if="!consented && cookiesEnabled">
    <div class="text">
      <div>
        <h3>Tato webová stránka používá cookies</h3>
        <p>
          K personalizaci reklam, poskytování funkcí sociálních médií a analýze
          naší návštěvnosti využíváme soubory cookie. Informace o tom, jak náš
          web používáte, sdílíme s třetími stranammi pro inzerci a analýzu.
          Třetí strany tyto údaje mohou zkombinovat s dalšími informacemi, které
          jste jim poskytli nebo které získali v důsledku toho, že používáte
          jejich služby. Pokud pokračujete v používání našich webových stránek,
          souhlasíte s našimi soubory cookie.
        </p>
        <p>
          Další informace naleznete v našich
          <router-link to="/cookies"
            >zásadách pro používání souborů cookie</router-link
          >.
        </p>
      </div>
      <div class="checks">
        <input type="checkbox" checked disabled />
        <label disabled>Nutné</label>

        <input type="checkbox" id="tracking" v-model="cookies.tracking" />
        <label for="tracking">Statistické</label>

        <input type="checkbox" id="marketing" v-model="cookies.marketing" />
        <label for="marketing">Marketingové</label>
      </div>
    </div>
    <div>
      <button @click="acceptAll">Povolit všechny cookies</button>
      <button @click="acceptSome">Povolit vybrané cookies</button>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      cookies: { necessary: true, tracking: false, marketing: false },
      consented: true,
      cookiesEnabled: navigator.cookieEnabled,
    };
  },
  created() {
    var cookies = window.localStorage.getItem('cookie:consent');
    if (cookies == null) this.consented = false;
    else {
      this.consented = true;
      this.cookies = JSON.parse(cookies);
    }
  },
  methods: {
    acceptAll() {
      this.cookies = { necessary: true, tracking: true, marketing: true };
      window.localStorage.setItem(
        'cookie:consent',
        JSON.stringify(this.cookies)
      );
      this.consented = true;
      this.$emit('change', this.cookies);
    },
    acceptSome() {
      window.localStorage.setItem(
        'cookie:consent',
        JSON.stringify(this.cookies)
      );
      this.consented = true;
      this.$emit('change', this.cookies);
    },
  },
};
</script>

<style lang="sass" scoped>
footer
  padding: 20px 10%
  text-align: left
  position: fixed
  bottom: 0
  left: 0
  width: 80%
  color: white
  background-color: $dark
  z-index: 9
  display: grid
  grid-template-columns: 80% 20%
  align-items: center
  @include large-device
    width: 96%
    padding: 20px 2%
  @include small-device-portrait
    grid-template-columns: 100%
    grid-row-gap: 10px

.text
  margin-right: 5%
  h3
    @include small-device
      font-size: 1rem
  p
    @include medium-device
      font-size: .85rem
    @include small-device
      font-size: .7rem
  a
    color: white

.checks
  margin-top: 10px
  label
    margin-right: 20px
    &:last-of-type
      margin-right: 0
    &[disabled]
      color: gray
    @include small-device
      font-size: .7rem

button
  width: 100%
  justify-self: center
  margin: 5px 0
  &:nth-of-type(1)
    @include btn($purple, $purple)
  &:nth-of-type(2)
    @include btn($dark, $dark)
    border: 1px solid $darkPurple
  @include small-device
    font-size: .8rem !important
</style>

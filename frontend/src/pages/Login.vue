<template>
  <main>
    <div v-if="stage == 'initial'">
      <Header>
        <h1>Login</h1>
        <h3>Zadejte své přihlašovací jméno a ultra tajné heslo</h3>
      </Header>

      <form @submit="handleSubmitLogin">
        <input required type="text" placeholder="Přihlašovací jméno" />
        <br />
        <input required type="password" placeholder="Heslo" />
        <br />
        <input type="checkbox" id="remeber" />
        <label title="Vázano na IP adresu" for="remeber"
          >Zapamatovat na 30 dní</label
        >
        <button type="submit">Přihlásit se</button>
      </form>
    </div>

    <div v-else-if="stage == 'totp'">
      <Header>
        <h1>Login</h1>
        <h3>Ověřte, že to jste skutečně vy</h3>
      </Header>

      <form @submit="handleSubmitTotp">
        <input
          required
          type="number"
          placeholder="2FA kód"
          @input="handleInput"
          maxlength="6"
        />
        <button type="submit">Ověřit</button>
      </form>
    </div>

    <div v-else-if="stage == 'loading'">
      <Header>
        <h1>Login</h1>
        <h3>Načítání</h3>
      </Header>

      <div class="centerChild">
        <div class="lds-roller">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </div>

    <div v-else-if="stage == 'error'">
      <Header>
        <h1>Login</h1>
        <h3>Chybka se vloudila</h3>
      </Header>

      <div class="centerChild">
        <div>
          <h4>Nespávné údaje</h4>
          <button @click="handleBack">Zkusit znovu</button>
        </div>
      </div>
    </div>

    <div v-else class="finish">
      <Header>
        <h1>Login</h1>
        <h3>Vítejte, {{ this.body.username }}!</h3>
      </Header>
      <div class="centerChild">
        <div>
          <span class="fas fa-lock-open" />
          <br />
          <i
            >Za moment budete přesměrován(a), nebo klikněte
            <router-link to="/" replace>zde</router-link>
          </i>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Header from '../components/misc/Header';

import { authUrl } from '../assets/js/dev';

export default {
  components: { Header },
  data() {
    return {
      stage: 'initial',
      body: {},
    };
  },
  watch: {
    stage: 'focus',
  },
  created() {
    this.focus();
  },
  methods: {
    async handleSubmitLogin(event) {
      event.preventDefault();

      this.body = {
        username: event.target[0].value,
        password: event.target[1].value,
        remember: event.target[2].checked,
      };

      this.stage = 'loading';

      const result = await fetch(authUrl + '/validateUser', {
        method: 'POST',
        body: JSON.stringify(this.body),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (result.status == 200) this.stage = 'totp';
      else this.stage = 'error';
    },
    async handleSubmitTotp(event) {
      event.preventDefault();

      this.body.totp = event.target[0].value;

      this.stage = 'loading';

      const result = await fetch(authUrl + '/issueJWT', {
        method: 'POST',
        body: JSON.stringify(this.body),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (result.status == 200) {
        this.stage = 'finsih';
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else this.stage = 'error';
    },
    handleInput(event) {
      const el = event.target;
      if (el.value.length > el.maxLength)
        el.value = el.value.slice(0, el.maxLength);
    },
    handleBack() {
      if (this.body.totp == undefined) {
        this.body = {};
        this.stage = 'initial';
      } else this.stage = 'totp';
    },
    focus() {
      const el = document.querySelector('input');
      if (el != undefined) this.$nextTick(() => el.focus());
    },
  },
};
</script>

<style lang="sass" scoped>
main
  background-color: $bgGray
  padding-bottom: 5%

form
  width: ($baselineWidth / 100) * 40
  margin: 0 auto
  @include small-device
    width: 90%
  input:not([type="checkbox"])
    width: calc( 100% - 2% )
    font-size: 1.25rem
    border-radius: .25rem
    border: 1px solid #ced4da
    padding: 3% 0
    padding-left: 2%
    &:not(:last-of-type)
      margin-bottom: 10px

button
  @include btn($purple, $purple)
  width: 100%
  padding: 12.5px
  margin-top: 5%

.centerChild
  height: 22.5vh
  @include small-device
    height: 30vh
  display: grid
  align-items: center
  justify-items: center

.fas
  font-size: 2.9rem
  color: white
  background-color: black
  border-radius: 50%
  width: 90px
  height: 90px
  margin-bottom: 2%
  &::before
    position: relative
    top: 22.5%
</style>

<!-- Animations -->
<style lang="sass" scoped>
.lds-roller
  display: inline-block
  position: relative
  width: 80px
  height: 80px
  div
    animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite
    transform-origin: 40px 40px
    &:after
      content: ' '
      display: block
      position: absolute
      width: 7px
      height: 7px
      border-radius: 50%
      background: $purple
      margin: -4px 0 0 -4px
    &:nth-child(1)
      animation-delay: -0.036s
    &:nth-child(1):after
      top: 63px
      left: 63px
    &:nth-child(2)
      animation-delay: -0.072s
    &:nth-child(2):after
      top: 68px
      left: 56px
    &:nth-child(3)
      animation-delay: -0.108s
    &:nth-child(3):after
      top: 71px
      left: 48px
    &:nth-child(4)
      animation-delay: -0.144s
    &:nth-child(4):after
      top: 72px
      left: 40px
    &:nth-child(5)
      animation-delay: -0.18s
    &:nth-child(5):after
      top: 71px
      left: 32px
    &:nth-child(6)
      animation-delay: -0.216s
    &:nth-child(6):after
      top: 68px
      left: 24px
    &:nth-child(7)
      animation-delay: -0.252s
    &:nth-child(7):after
      top: 63px
      left: 17px
    &:nth-child(8)
      animation-delay: -0.288s
    &:nth-child(8):after
      top: 56px
      left: 12px
@keyframes lds-roller
  0%
    transform: rotate(0deg)
  100%
    transform: rotate(360deg)

.fas
  animation: 1s flash linear 3

@keyframes flash
  0%
    opacity: 1
  50%
    opacity: .1
  100%
    opacity: 1
</style>

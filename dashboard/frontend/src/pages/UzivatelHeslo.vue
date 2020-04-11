<template>
  <form @submit="handleSubmit">
    <strong>
      Vzhledem k designu zabezpečení je při změně hesla potřeba regenerovat 2FA
      kód!
    </strong>
    <EditPassword ref="pass" v-model="password" :oldPass="tier < 3" />

    <Edit2FA v-model="user" :oldPass="false" />

    <button type="submit" class="submitBtn">
      Uložit
    </button>
    <br />
    <strong v-if="name == $route.params.name">
      Kombinace nového hesla a 2FA kódu začne platit okamžitě po stisknutí
      tlačítka, z tohoto důvodu budete odhlášeni
    </strong>
    <strong v-else>
      Kombinace nového hesla a 2FA kódu začne platit okamžitě po stisknutí
      tlačítka
    </strong>
  </form>
</template>

<script>
import EditPassword from '../components/EditPassword';
import Edit2FA from '../components/Edit2FA';

import { postAuthData, getTokenPayload } from '../assets/js/dataFetcher';

export default {
  components: { EditPassword, Edit2FA },
  data() {
    return {
      user: { name: this.$route.params.name, totp: '' },
      password: '',
      tier: 1,
      name: ''
    };
  },
  async created() {
    const { tier, name } = await getTokenPayload();
    this.tier = tier;
    this.name = name;
  },
  methods: {
    async handleSubmit(event) {
      event.preventDefault();

      if (this.password == '') alert('Zadaná hesla nejsou stejná');
      else {
        const result = await postAuthData(
          '/updatePass/' + this.$route.params.name,
          JSON.stringify({
            oldPass: this.$refs.pass.pass0,
            newPass: this.password,
            totp: this.user.totp
          })
        );

        if (result.status == 301 && this.user.name == this.name)
          window.location.href =
            process.env.NODE_ENV === 'production'
              ? '/api/auth/logout'
              : 'http://localhost:300/logout';
        else if (result.status == 301) this.$router.push('/uzivatele');
        else alert('Něco se pokazilo. Zkontroluje si prosím správnost hesla');
      }
    }
  }
};
</script>

<style lang="sass" scoped>
strong
  &:nth-of-type(1)
    color: $purple
    font-size: 1.5rem

.submitBtn
  @include btn($acceptGreen)
  margin-bottom: 20px
</style>

<template>
  <form @submit="handleSubmit">
    <Edit2FA ref="2FA" v-model="user" />
    <strong v-if="name == $route.params.name">
      Nový secret začne platit okamžitě po stisknutí tlačítka, z tohoto důvodu
      budete odhlášeni
    </strong>
    <strong v-else>
      Nový secret začne platit okamžitě po stisknutí tlačítka
    </strong>
    <br />
    <button type="submit" class="submitBtn">Uložit</button>
  </form>
</template>

<script>
import Edit2FA from '../components/Edit2FA';

import { getTokenPayload, postAuthData } from '../assets/js/dataFetcher';

export default {
  components: { Edit2FA },
  data() {
    return {
      user: {
        name: this.$route.params.name,
        totp: ''
      },
      tier: 0,
      name: ''
    };
  },
  async created() {
    const { token, name } = await getTokenPayload();
    this.token = token;
    this.name = name;
  },
  methods: {
    async handleSubmit(event) {
      event.preventDefault();

      const result = await postAuthData(
        '/updateTotp/' + this.$route.params.name,
        JSON.stringify({
          password: this.$refs['2FA'].pass,
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
};
</script>

<style lang="sass" scoped>
.submitBtn
  @include btn($acceptGreen)
  margin-top: 20px
</style>

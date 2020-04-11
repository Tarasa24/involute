<template>
  <main>
    <form v-if="newUser" @submit="handleSubmitNew">
      <div class="header">
        <h1 class="fas fa-user-circle" />
        <br />
        <input
          type="text"
          v-model="user.name"
          :disabled="!canEdit.self"
          placeholder="Jméno"
          maxlength="32"
          required
        />
        <br />
        <h2>Tier</h2>
        <VueNumberInput
          v-model="user.tier"
          :min="1"
          :max="3"
          controls
          inline
          :disabled="!canEdit.all"
          required
        />
      </div>

      <EditPassword v-model="user.password" :oldPass="false" />
      <Edit2FA v-model="user" :oldPass="false" />
      <button type="submit" class="submitBtn">Přidat</button>
    </form>

    <form v-else @submit="handleSubmit">
      <div class="header">
        <h1 class="fas fa-user-circle" />
        <br />
        <input
          type="text"
          v-model="user.name"
          :disabled="!canEdit.self && !canEdit.all"
          placeholder="Jméno"
          maxlength="32"
          required
        />
        <p>
          Naposledy přihlášen(a):
          <b>{{
            new Date(user.timestamp * 1000).toLocaleString('cs-CS', {})
          }}</b>
        </p>
        <h2>Tier</h2>
        <VueNumberInput
          v-model="user.tier"
          :min="1"
          :max="3"
          controls
          inline
          :disabled="!canEdit.all"
          required
        />
      </div>
      <div class="editUser">
        <button
          :disabled="!canEdit.self && !canEdit.all"
          @click="handlePageChange('/heslo')"
        >
          Změnit heslo
        </button>
        <button
          :disabled="!canEdit.self && !canEdit.all"
          @click="handlePageChange('/2FA')"
        >
          Vygenerovat 2FA
        </button>
        <button :disabled="!canEdit.all" @click="handleRemove">
          Odstranit uživatele
        </button>
      </div>
      <button :disabled="!canEdit.self && !canEdit.all" type="submit">
        Uložit
      </button>
    </form>
  </main>
</template>

<script>
import VueNumberInput from '@chenfengyuan/vue-number-input';
import EditPassword from '../components/EditPassword';
import Edit2FA from '../components/Edit2FA';

import {
  getData,
  getTokenPayload,
  postAuthData,
  deleteAuthData
} from '../assets/js/dataFetcher';

export default {
  components: {
    VueNumberInput,
    EditPassword,
    Edit2FA
  },
  props: {
    newUser: {
      type: Boolean
    }
  },
  data() {
    return {
      user: { tier: 1, name: '', password: '' },
      canEdit: { self: true, all: true }
    };
  },
  async created() {
    if (!this.newUser) {
      try {
        const { _id, name, tier, lastJWT } = await getData(
          '/uzivatel/' + this.$route.params.name
        );
        this.user._id = _id;
        this.user.name = name;
        this.user.tier = tier;
        this.user.timestamp = lastJWT.timestamp;

        const payload = await getTokenPayload();
        this.canEdit.self = payload.name === this.user.name;
        this.canEdit.all = payload.tier >= 3;
      } catch (error) {
        this.$router.replace('/uzivatele');
      }
    }
  },
  methods: {
    handlePageChange(page) {
      this.$router.push(this.$route.path + page);
    },
    async handleRemove(event) {
      event.preventDefault();
      if (confirm(`Opravdu chcete ${this.user.name} odstranit?`)) {
        const result = await deleteAuthData(
          '/deleteUser/' + this.$route.params.name
        );
        if (result.status == 202) this.$router.replace('/uzivatele');
        else alert('Vyskytla se chyba');
      }
    },
    async handleSubmitNew(event) {
      event.preventDefault();
      if (this.user.password == '') alert('Zadaná hesla nejsou stejná');
      else {
        const result = await postAuthData(
          '/createUser',
          JSON.stringify(this.user)
        );
        if (result.status == 202) this.$router.push('/uzivatele');
        else if (result.status == 409)
          alert('Uživatel s tímto jménem již existuje');
        else alert('Vyskytla se chyba');
      }
    },
    async handleSubmit(event) {
      event.preventDefault();
      const result = await postAuthData(
        '/updateUser/' + this.$route.params.name,
        JSON.stringify({ name: this.user.name, tier: this.user.tier })
      );

      if (result.status == 202 && !this.canEdit.self)
        this.$router.push('/uzivatele');
      else if (result.status == 202 && this.canEdit.self)
        window.location.href =
          process.env.NODE_ENV === 'production'
            ? '/api/auth/logout'
            : 'http://localhost:300/logout';
      else alert('Vyskytla se chyba');
    }
  }
};
</script>

<style lang="sass" scoped>
h2
  margin: 25px 0 15px 0

.header
  margin-bottom: 2.5%
  h1
    margin: 0
    font-size: 5rem
    margin-bottom: 10px
  input[type="text"]
    width: 45%
    padding: 10px
    border: 0
    font-weight: bold
    font-size: 1.75rem
    text-align: center
    &:focus
      outline: 1px $grayOutline solid
    @include small-device
      width: 90%
  input[disabled]
    background-color: white
    cursor: not-allowed

  /deep/ .number-input__button:hover::before, /deep/ .number-input__button:hover::after
      background-color: $purple

.editUser
  button
    margin: 10px
    &:nth-of-type(1), &:nth-of-type(2)
      @include btn($infoBlue)
    &:nth-of-type(3)
      @include btn($deleteRed)
    &[disabled]
      filter: brightness(.8)
      cursor: not-allowed
      &:hover
        filter: brightness(.8)

button[type="submit"]
  margin-top: 25px
  @include btn($acceptGreen)
  &[disabled]
      filter: brightness(.8)
      cursor: not-allowed
      &:hover
        filter: brightness(.8)
</style>

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
      </div>
      <h2>Heslo</h2>
      <Password v-model="user.password" :toggle="true" required />
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
            user.timestamp != undefined
              ? new Date(user.timestamp * 1000).toLocaleString('cs-CS', {})
              : 'Nikdy'
          }}</b>
        </p>
      </div>
      <div class="editUser">
        <button
          type="button"
          :disabled="!canEdit.self && !canEdit.all"
          @click="handlePageChange('/heslo')"
        >
          Změnit heslo
        </button>
        <button
          type="button"
          :disabled="!canEdit.self && !canEdit.all"
          @click="handlePageChange('/2FA')"
        >
          Vygenerovat 2FA
        </button>
        <button
          type="button"
          :disabled="
            (canEdit.self && canEdit.all) || canEdit.self || !canEdit.all
          "
          @click="handleRemove"
        >
          Odstranit uživatele
        </button>
      </div>
    </form>
  </main>
</template>

<script>
import Password from 'vue-password-strength-meter';
import Edit2FA from '../components/Edit2FA';

import {
  getData,
  getTokenPayload,
  postAuthData,
  deleteAuthData,
} from '../assets/js/dataFetcher';

export default {
  components: {
    Password,
    Edit2FA,
  },
  props: {
    newUser: {
      type: Boolean,
    },
  },
  data() {
    return {
      user: { tier: 1, name: '', password: '' },
      canEdit: { self: true, all: true },
    };
  },
  async created() {
    if (!this.newUser) {
      try {
        const { _id, name, lastJWT } = await getData(
          '/uzivatel/' + this.$route.params.name
        );
        this.user._id = _id;
        this.user.name = name;
        this.user.timestamp = lastJWT.timestamp;

        const payload = await getTokenPayload();
        this.canEdit.self = payload.name === this.user.name;
        this.canEdit.all = payload.admin;
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
          JSON.stringify(Object.assign(this.user, { lastJWT: {} }))
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
        JSON.stringify({ name: this.user.name })
      );

      if (result.status == 202 && !this.canEdit.self)
        this.$router.push('/uzivatele');
      else if (result.status == 202 && this.canEdit.self)
        window.location.href =
          process.env.NODE_ENV === 'production'
            ? '/api/auth/logout'
            : 'http://localhost:300/logout';
      else alert('Vyskytla se chyba');
    },
  },
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

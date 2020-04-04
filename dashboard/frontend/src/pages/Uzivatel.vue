<template>
  <main>
    <form action="">
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
          :max="8"
          controls
          inline
          :disabled="!canEdit.all"
          required
        />
      </div>

      <div class="editUser" v-if="!editMode">
        <button :disabled="!canEdit.self" @click="handleEdit">
          Změnit heslo / 2FA
        </button>
        <button :disabled="!canEdit.all">Odstranit účet</button>
      </div>

      <div v-else class="createUser">
        <h2>
          {{ newUser ? 'Heslo' : 'Heslo (stávající, nebo nové)' }}
        </h2>

        <VuePasswordAuto v-model="user.password">
          <template v-slot:password-input="props">
            <input
              type="password"
              :value="props.value"
              @input="props.updatePassword"
              :required="newUser"
            />
          </template>
        </VuePasswordAuto>

        <div v-if="user.name.length > 0">
          <h2>
            {{
              newUser
                ? '2FA kód'
                : 'Nově vygenerovaný 2FA kód (nabyde platnosti po uložení)'
            }}
          </h2>
          <i>{{ user.totp }}</i
          ><br />
          <img
            :src="qr"
            :title="
              encodeURI(
                `otpauth://totp/${this.user.name}?secret=${this.user.totp}&issuer=iNvolute`
              )
            "
          />
          <br />
        </div>
      </div>
      <button type="submit">Uložit</button>
    </form>
  </main>
</template>

<script>
import { VuePasswordAuto } from 'vue-password';
import VueNumberInput from '@chenfengyuan/vue-number-input';

import base32Encode from 'base32-encode';
import QRCode from 'qrcode';

import { getData, getTokenPayload } from '../assets/js/dataFetcher';

export default {
  components: {
    VuePasswordAuto,
    VueNumberInput,
  },
  props: {
    newUser: {
      type: Boolean,
    },
  },
  data() {
    return {
      editUser: false,
      user: { tier: 1, name: '', password: '' },
      canEdit: { self: true, all: true },
      qr: '',
    };
  },
  computed: {
    name() {
      return this.user.name;
    },
    editMode() {
      return this.newUser || this.editUser;
    },
  },
  watch: {
    name: 'generateQR',
  },
  async created() {
    if (!this.newUser) {
      try {
        const { name, tier } = await getData(
          '/uzivatel/' + this.$route.params.name
        );
        this.user.name = name;
        this.user.tier = tier;

        const payload = await getTokenPayload();
        this.canEdit.self = payload.name == this.user.name || payload.tier >= 3;
        this.canEdit.all = payload.tier >= 3;
      } catch (error) {
        this.$router.replace('/uzivatele');
      }
    }
  },
  methods: {
    async generateQR() {
      if (this.user.name.length > 0) {
        this.user.totp = base32Encode(
          window.crypto.getRandomValues(new Uint8Array(35)),
          'RFC3548',
          { padding: false }
        ).toLowerCase();
        this.qr = await QRCode.toDataURL(
          encodeURI(
            `otpauth://totp/${this.user.name}?secret=${this.user.totp}&issuer=iNvolute`
          )
        );
      } else this.qr = '';
    },
    handleEdit(event) {
      event.preventDefault();
      this.editUser = true;
    },
  },
};
</script>

<style lang="sass" scoped>
h2
  margin: 40px 0 15px 0

.header
  margin-bottom: 2.5%
  h1
    margin: 0
    font-size: 5rem
    margin-bottom: 10px
  input[type="text"]
    width: 60%
    padding: 10px
    border: 0
    font-weight: bold
    font-size: 1.75rem
    text-align: center
    &:focus
      outline: 1px $grayOutline solid
  input[disabled]
    background-color: white
    cursor: not-allowed

.editUser
  button
    margin: 10px
    &:nth-of-type(1)
      @include btn($infoBlue)
    &:nth-of-type(2)
      @include btn($deleteRed)
    &[disabled]
      filter: brightness(.8)
      cursor: not-allowed
      &:hover
        filter: brightness(.8)

.createUser
  .VuePassword
    width: 60%
    margin: 0 auto
    input
      width: 100%
      border: 1px $grayOutline solid
      padding: 5px
      &:focus
        outline: 0

button[type="submit"]
  margin-top: 2%
  @include btn($acceptGreen)
</style>

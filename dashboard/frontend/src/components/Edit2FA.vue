<template>
  <div class="container">
    <h2>2FA kód</h2>

    <input
      type="password"
      v-model="pass"
      v-if="oldPass"
      placeholder="Stávající heslo"
      required
    />

    <div>
      <i>{{ value.totp }}</i
      ><br />
      <img
        v-if="value.name.length > 0"
        :src="qr"
        :title="
          encodeURI(
            `otpauth://totp/${this.value.name}?secret=${this.value.totp}&issuer=iNvolute`
          )
        "
      />
      <div v-else style="height: 200px;" />
    </div>
    <br />
  </div>
</template>

<script>
import base32Encode from 'base32-encode';
import QRCode from 'qrcode';

export default {
  props: { value: {}, oldPass: { default: true } },
  data() {
    return {
      qr: '',
      pass: '',
    };
  },
  computed: {
    name() {
      return this.value.name;
    },
  },
  watch: {
    name: 'generateQR',
  },
  created() {
    this.value.totp = base32Encode(
      window.crypto.getRandomValues(new Uint8Array(35)),
      'RFC3548',
      { padding: false }
    ).toLowerCase();

    this.generateQR();
    this.$emit('input', this.value);
  },
  methods: {
    async generateQR() {
      if (this.value.name.length > 0) {
        this.qr = await QRCode.toDataURL(
          encodeURI(
            `otpauth://totp/${this.value.name}?secret=${this.value.totp}&issuer=iNvolute`
          )
        );
      } else this.qr = '';
    },
  },
};
</script>

<style lang="sass" scoped>
input
  background-color: #f1f1f1
  border: 1px solid #f1f1f1
  border-radius: 2px
  box-sizing: border-box
  font-size: 14px
  padding: 13px
  width: 400px
  margin: 10px
i
  word-break: break-all
</style>

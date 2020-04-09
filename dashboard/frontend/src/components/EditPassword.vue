<template>
  <div>
    <h2>
      Heslo
    </h2>

    <input
      v-if="oldPass"
      type="password"
      class="oldPass"
      placeholder="Stávající heslo"
      v-model="pass0"
      required
    />

    <VuePasswordAuto v-model="pass1">
      <template v-slot:password-input="props">
        <input
          type="password"
          :value="props.value"
          @input="props.updatePassword"
          placeholder="Nové heslo"
          required
        />
      </template>
    </VuePasswordAuto>

    <VuePasswordAuto v-model="pass2">
      <template v-slot:password-input="props">
        <input
          type="password"
          :value="props.value"
          @input="props.updatePassword"
          @blur="handleBlur"
          placeholder="Nové heslo znovu"
          required
        />
      </template>
    </VuePasswordAuto>
    <br />
  </div>
</template>

<script>
import { VuePasswordAuto } from 'vue-password';

export default {
  props: { value: {}, oldPass: { default: true } },
  components: { VuePasswordAuto },
  data() {
    return {
      pass0: '',
      pass1: '',
      pass2: '',
    };
  },
  watch: {
    pass2: 'handleInput',
  },
  methods: {
    async handleInput() {
      if (this.pass1 === this.pass2) {
        document.querySelector('.VuePassword').classList.remove('red');
        document.querySelector('.VuePassword').classList.add('green');

        this.$emit('input', this.pass1);
      } else {
        document.querySelector('.VuePassword').classList.remove('green');
        document.querySelector('.VuePassword').classList.add('red');
        this.$emit('input', '');
      }
    },
    handleBlur() {
      document.querySelector('.VuePassword').classList.remove('green');
    },
  },
};
</script>

<style lang="sass" scoped>
.VuePassword
  width: 45%
  margin: 15px auto
  input
    width: 100%
    border: 1px $grayOutline solid
    padding: 5px
    &:focus
      outline: 0
  @include small-device
    width: 90%
.red
  box-shadow: 0px 0px 4px .7px red
.green
  box-shadow: 0px 0px 4px .7px lime
.oldPass
  padding: 5px
  width: calc( 45% - 10px )
  border: 1px $grayOutline solid
  &:focus
    outline: 0
  @include small-device
    width: calc( 90% - 10px )
</style>

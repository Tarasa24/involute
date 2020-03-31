<template>
  <main>
    <FilePicker ref="FilePicker" v-model="data.img" />
    <div class="wrapper">
      <div class="container" @click="handleClick">
        <img :src="staticUrl + data.img" :alt="data.name" />
        <span><b>Změnit obrázek</b></span>
      </div>
      <aside>
        <input class="h1" type="text" v-model="data.name" />
        <input class="h2" type="text" v-model="data.sub" />
        <textarea v-model="data.text" />
        <span>
          <b>Cena (v Kč):</b>
          <input type="number" v-model="data.price" />
        </span>
        <span>
          <b>Počet kusů:</b>
          <input type="number" v-model="data.stock" />
        </span>

        <div>
          <button @click="handleSave">Uložit</button>
          <button @click="handleDelete">Smazat</button>
        </div>
        <i class="notification" />
      </aside>
    </div>
  </main>
</template>

<script>
import FilePicker from '../components/FilePicker';

import { getData, postData, deleteData } from '../assets/js/dataFetcher';
import { staticUrl } from '../assets/js/dev';

export default {
  components: { FilePicker },
  data() {
    return {
      data: {},
      staticUrl: staticUrl,
    };
  },
  async created() {
    this.$Progress.start();
    this.data = await getData('/produkt/' + this.$route.params.id);
    this.$Progress.finish();
  },
  methods: {
    async handleSave() {
      const data = this.data;
      delete data._id;

      this.$Progress.start();
      const result = await postData(
        '/produkt/' + this.$route.params.id,
        JSON.stringify(data)
      );

      if (result.status == 202) {
        this.$Progress.finish();
        document.querySelector('.notification').classList.add('anim');
        document.querySelector('.notification').innerHTML = 'Úspěšně uloženo';
      } else {
        this.$Progress.fail();
        document.querySelector('.notification').classList.add('anim');
        document.querySelector('.notification').innerHTML = 'Vyskytla se chyba';
      }
    },
    async handleDelete() {
      if (confirm(`Opravdu chcete "${this.data.name}" smazat z databáze?`)) {
        this.$Progress.start();
        const result = await deleteData(
          '/produkt/' + this.$route.params.id,
          JSON.stringify({ _id: this.data._id })
        );

        if (result.status == 202) {
          this.$Progress.finish();
          this.$router.replace('/eshop');
        } else {
          this.$Progress.fail();
          document.querySelector('.notification').classList.add('anim');
          document.querySelector('.notification').innerHTML =
            'Vyskytla se chyba';
        }
      }
    },
    handleClick() {
      this.$refs.FilePicker.show = true;
    },
  },
};
</script>

<style lang="sass" scoped>
input
  border: 0
  width: calc( 100% - 10px )
  padding: 10px
  text-align: left
  font-family: unset
  font-size: 1rem
  display: block
  margin-right: auto
  &:focus
    outline: 1px $grayOutline solid

textarea
  padding: 5px 10px
  width: calc( 100% - 20px )
  min-height: 145px
  height: 25%
  resize: vertical
  font-family: unset
  font-size: 1.2rem
  border: 0

  &:focus
    outline: 1px $grayOutline solid

.h1
  font-size: 2.5rem
  font-weight: bold
  color: $purple

.h2
  font-size: 1.5rem
  font-weight: bold

.wrapper
  display: grid
  width: 99%
  grid-template-columns: 35% auto
  column-gap: 20px
  margin-top: 20px
  @include medium-device
    grid-template-columns: auto

  .container
    position: relative
    text-align: center
    color: white
    img
      width: 100%
      @include transition(filter)
    span
      visibility: hidden
      opacity: 0
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      @include transition(opacity)
    &:hover
      cursor: pointer
      img
        filter: brightness(.9)
      span
        visibility: visible
        opacity: 1

  textarea
    margin: 2.5% 0

  span
    display: flex
    padding-left: 10px
    font-size: 1.1rem
    b
      white-space: nowrap
      margin: auto 5px auto 0

  div
    button
      margin: 5% auto
      min-width: 10%
      &:nth-of-type(1)
        margin-right: 5%
        @include btn($acceptGreen)
      &:nth-of-type(2)
        margin-left: 5%
        @include btn($deleteRed)
      &:active
        position: relative
        top: 2px

  .notification
    @keyframes blink-animation
      100%
        opacity: 1
      50%
        opacity: 0
      100%
        opacity: 1
    &.anim
      animation: blink-animation 1.5s 3
</style>

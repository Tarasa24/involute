<template>
  <main>
    <form class="wrapper" @submit="handleSubmit">
      <div class="container" @click="handleClick">
        <img :src="data.img" :alt="data.name" />
        <span
          :style="
            +newProdukt && this.data.img == undefined
              ? 'color: gray; opacity: 1; visibility: visible'
              : ''
          "
        >
          <b>Změnit obrázek</b>
        </span>
      </div>
      <aside>
        <input
          class="h1"
          type="text"
          v-model="data.name"
          placeholder="Jméno produktu"
          required
        />
        <input
          class="h2"
          type="text"
          v-model="data.sub"
          placeholder="Podnadpis"
          required
        />
        <textarea v-model="data.text" placeholder="Popis" />
        <span>
          <b>Cena (v Kč):</b>
          <input
            type="number"
            v-model="data.price"
            :placeholder="randomPrice"
            required
          />
        </span>
        <span>
          <b>Počet kusů:</b>
          <input
            type="number"
            v-model="data.stock"
            :placeholder="randomKs"
            required
          />
        </span>

        <div>
          <button type="submit">
            {{ newProdukt ? 'Publikovat' : 'Uložit' }}
          </button>
          <button v-if="!newProdukt" @click="handleDelete">Smazat</button>
        </div>
      </aside>
    </form>

    <FileUpload ref="FileUpload" v-model="data.img" />
  </main>
</template>

<script>
import FileUpload from '../components/FileUpload';
import {
  getData,
  postData,
  deleteData,
  putData,
} from '../assets/js/dataFetcher';

export default {
  props: { newProdukt: { type: Boolean } },
  components: { FileUpload },
  data() {
    return {
      data: {},
      randomPrice: this.randomNumber(50, 500, 2),
      randomKs: this.randomNumber(50, 500, 0),
    };
  },
  async created() {
    if (!this.newProdukt) {
      this.$Progress.start();
      this.data = await getData('/produkt/' + this.$route.params.id);
      this.$Progress.finish();
    }
  },
  methods: {
    async handleSubmit(event) {
      event.preventDefault();

      const data = this.data;
      delete data._id;

      this.$Progress.start();
      let result;
      if (this.newProdukt) {
        result = await putData('/produkt', JSON.stringify(data));
      } else {
        result = await postData(
          '/produkt/' + this.$route.params.id,
          JSON.stringify(data)
        );
      }

      if (result.status == 202) {
        this.$Progress.finish();
        this.$router.push('/eshop');
      } else {
        this.$Progress.fail();
        alert('Vyskytla se chyba');
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
      this.$refs.FileUpload.open();
    },
    randomNumber(min, max, fixed) {
      return (Math.random() * (max - min) + min).toFixed(fixed);
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
    min-height: 450px
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
</style>

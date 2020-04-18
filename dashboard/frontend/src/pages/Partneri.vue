<template>
  <main>
    <h1>Partneři</h1>
    <form
      class="partner"
      v-for="(partner, index) in partneri"
      :key="partner._id"
      @submit="handleSubmit(partner)"
    >
      <div class="img" @click="openRef(partner._id)">
        <img :src="partner.img" :alt="partner.name" />
        <span
          :style="
            +newPartner.img == undefined
              ? 'color: gray; opacity: 1; visibility: visible'
              : ''
          "
        >
          <b>Změnit obrázek</b>
        </span>
      </div>

      <div class="text">
        <input
          type="text"
          v-model="partner.name"
          placeholder="Název"
          required
        />
        <textarea v-model="partner.description" placeholder="Popis" />
        <input
          type="url"
          v-model="partner.url"
          placeholder="https://"
          required
        />
      </div>
      <span class="btns">
        <button type="submit">Uložit</button>
        <button type="button" @click="handleDelete(index)">Odstranit</button>
      </span>
      <FileUpload v-model="partner.img" :ref="partner._id" />
    </form>

    <form class="partner" @submit="handleNew">
      <div class="img" @click="openRef('newPartner')">
        <img :src="newPartner.img" :alt="newPartner.name" />
        <span
          :style="
            newPartner.img == undefined
              ? 'color: gray; opacity: 1; visibility: visible'
              : ''
          "
        >
          <b>Změnit obrázek</b>
        </span>
      </div>
      <div class="text">
        <input
          type="text"
          v-model="newPartner.name"
          placeholder="Název"
          required
        />
        <textarea v-model="newPartner.description" placeholder="Popis" />
        <input
          type="url"
          v-model="newPartner.url"
          placeholder="https://"
          required
        />
      </div>
      <span class="btns">
        <button type="submit">Vytvořit</button>
      </span>
      <FileUpload v-model="newPartner.img" ref="newPartner" />
    </form>
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
  components: { FileUpload },
  data() {
    return {
      partneri: [],
      newPartner: {},
    };
  },
  async created() {
    this.$Progress.start();
    this.partneri = await getData('/partneri');
    this.$Progress.finish();
  },
  methods: {
    async handleSubmit(partner) {
      event.preventDefault();

      partner = Object.assign({}, partner);
      const id = partner._id;
      delete partner._id;

      const response = await postData(
        '/partner/' + id,
        JSON.stringify(partner)
      );

      if (response.status !== 202) alert('Vyskytla se chyba');
    },
    async handleDelete(partnerIndex) {
      const id = this.partneri[partnerIndex]._id;

      if (confirm('Opravdu chcete tohoto partnera smazat?')) {
        const response = await deleteData('/partner/' + id);
        if (response.status === 202) {
          this.partneri.splice(partnerIndex, 1);
        } else alert('Vyskytla se chyba');
      }
    },
    async handleNew() {
      event.preventDefault();

      const response = await putData(
        '/partner',
        JSON.stringify(this.newPartner)
      );

      if (response.status === 202) {
        const { id } = await response.json();

        this.newPartner._id = id;
        this.partneri.push(this.newPartner);

        this.newPartner = {};
      } else alert('Vyskytla se chyba');
    },
    openRef(ref) {
      if (ref != 'newPartner') this.$refs[ref][0].open();
      else this.$refs.newPartner.open();
    },
  },
};
</script>

<style lang="sass" scoped>
main
  width: 90%
  margin: 0 auto
.partner
  display: grid
  &:nth-child(odd)
    grid-template-columns: auto 25%
    grid-template-areas: "text img" "btns btns"
  &:nth-child(even)
    grid-template-columns: 25% auto
    grid-template-areas: "img text" "btns btns"
  column-gap: 2.5vw
  padding: 2.5vh 0
  border-bottom: 1px solid #000

.img
  grid-area: img
  align-self: center
  position: relative
  text-align: center
  color: white
  img
    padding: 10px
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

.text
  grid-area: text
  align-self: center
  input, textarea
    text-align: left
    font-size: .9rem
    padding: 10px
    width: calc( 100% - 20px )
    border: 0
    font-family: inherit
    &:focus
      outline: 1px solid $grayOutline
  textarea
    min-height: 120px
    resize: vertical
  input
    &:nth-of-type(1)
      font-size: 1.9rem

.btns
  grid-area: btns
  button
    margin: 15px
    width: 105px
    &:nth-of-type(1)
      @include btn($acceptGreen)
    &:nth-of-type(2)
      @include btn($deleteRed)
</style>

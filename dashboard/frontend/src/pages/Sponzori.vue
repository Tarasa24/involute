<template>
  <main>
    <h1>Sponzoři</h1>

    <div class="sponsors">
      <form
        class="sponsor"
        v-for="(sponsor, index) in sponsors"
        :key="sponsor._id"
        @submit="handleSubmit(sponsor)"
      >
        <div class="img" @click="openRef(sponsor._id)">
          <img :src="sponsor.img" :alt="sponsor.name" />
          <span
            :style="
              +sponsor.img == undefined
                ? 'color: gray; opacity: 1; visibility: visible'
                : ''
            "
          >
            <b>Změnit obrázek</b>
          </span>
        </div>

        <input
          type="text"
          v-model="sponsor.name"
          placeholder="Název"
          required
        />
        <input
          type="url"
          v-model="sponsor.url"
          placeholder="https://"
          required
        />
        <span>
          <button type="submit" class="fas fa-save" />
          <button
            type="button"
            class="fas fa-trash-alt"
            @click="handleDelete(index)"
          />
        </span>
        <FileUpload v-model="sponsor.img" :ref="sponsor._id" />
      </form>

      <form class="sponsor" @submit="handleNew">
        <div class="img" @click="openRef('newSponsor')">
          <img :src="newSponsor.img" :alt="newSponsor.name" />
          <span
            :style="
              newSponsor.img == undefined
                ? 'color: gray; opacity: 1; visibility: visible'
                : ''
            "
          >
            <b>Změnit obrázek</b>
          </span>
        </div>

        <input
          type="text"
          v-model="newSponsor.name"
          placeholder="Název"
          required
        />
        <input
          type="url"
          v-model="newSponsor.url"
          placeholder="https://"
          required
        />
        <button type="submit" class="fas fa-plus" />
        <FileUpload v-model="newSponsor.img" ref="newSponsor" />
      </form>
    </div>
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
      sponsors: [],
      newSponsor: {},
    };
  },
  async created() {
    this.sponsors = await getData('/sponzori');
  },
  methods: {
    openRef(ref) {
      if (ref != 'newSponsor') this.$refs[ref][0].open();
      else this.$refs.newSponsor.open();
    },
    async handleSubmit(sponsor) {
      event.preventDefault();

      sponsor = Object.assign({}, sponsor);
      const id = sponsor._id;
      delete sponsor._id;

      const result = await postData('/sponzor/' + id, JSON.stringify(sponsor));

      if (result.status === 202)
        this.$notify({
          type: 'success',
          title: '<i class="fas fa-check" />',
          text: 'Úspěšně uloženo',
        });
      else alert('Vyskytla se chyba');
    },
    async handleDelete(sponsorIndex) {
      event.preventDefault();

      const id = this.sponsors[sponsorIndex]._id;

      if (confirm('Opravdu chcete tohoto sponzora smazat?')) {
        const result = await deleteData('/sponzor/' + id);

        if (result.status === 202) this.sponsors.splice(sponsorIndex, 1);
        else alert('Vyskytla se chyba');
      }
    },
    async handleNew() {
      event.preventDefault();

      const result = await putData('/sponzor', JSON.stringify(this.newSponsor));

      if (result.status === 202) {
        const { id } = await result.json();
        this.newSponsor._id = id;
        this.sponsors.push(this.newSponsor);
        this.newSponsor = {};
      } else alert('Vyskytla se chyba');
    },
  },
};
</script>

<style lang="sass" scoped>
.sponsors
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr))
  grid-gap: 10px
  .sponsor
    display: grid
    grid-template-areas: "img"
    grid-template-rows: 120px
    border-bottom: 2px solid $purple
    &:nth-of-type(odd)
      background-color: $lighterGray
    &:nth-of-type(even)
      background-color: $darkerGray

input, button
  padding: 10px
  border: 0
  background-color: transparent
  &:focus
    outline: 0

button
  margin: 0 5px
  cursor: pointer
  font-size: 1rem
  &:nth-of-type(1)
    color: $acceptGreen
  &:nth-of-type(2)
    color: $deleteRed

.img
  grid-area: img
  align-self: center
  position: relative
  text-align: center
  color: black
  img
    padding: 5px
    max-width: calc( 90% - 20px )
    max-height: 100px
    opacity: 1
    filter: brightness(0)
    @include transition(opacity)
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
      opacity: .2
    span
      visibility: visible
      opacity: 1
</style>

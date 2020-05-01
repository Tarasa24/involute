<template>
  <main>
    <h1>Odkazy</h1>
    <div class="links">
      <form
        class="link"
        v-for="(link, index) in links"
        :key="link._id"
        @submit="handleEdit(link)"
      >
        <div class="icon" @click="openRef(link._id)">
          <img v-if="link.ico" :src="link.ico" :alt="link.name" />
          <span
            :style="
              link.ico == undefined
                ? 'color: gray; opacity: 1; visibility: visible'
                : ''
            "
          >
            <b>Změnit ikonu</b>
          </span>
        </div>

        <input type="text" v-model="link.name" placeholder="Název" required />
        <input type="text" v-model="link.sub" placeholder="Handle" required />
        <input type="url" v-model="link.url" placeholder="https://" required />
        <button type="submit" class="fas fa-save" />
        <button
          type="button"
          class="fas fa-trash-alt"
          @click="handleDelete(index)"
        />
        <FileUpload v-model="link.ico" :ref="link._id" />
      </form>

      <form class="link" @submit="handleNew">
        <div class="icon" @click="openRef('newLink')">
          <img v-if="newLink.ico" :src="newLink.ico" :alt="newLink.name" />
          <span
            :style="
              newLink.ico == undefined
                ? 'color: gray; opacity: 1; visibility: visible'
                : ''
            "
          >
            <b>Změnit ikonu</b>
          </span>
        </div>

        <input
          type="text"
          v-model="newLink.name"
          placeholder="Název"
          required
        />
        <input
          type="text"
          v-model="newLink.sub"
          placeholder="Handle"
          required
        />
        <input
          type="url"
          v-model="newLink.url"
          placeholder="https://"
          required
        />
        <button type="submit" class="fas fa-plus" />

        <FileUpload v-model="newLink.ico" ref="newLink" />
      </form>
    </div>
  </main>
</template>

<script>
import {
  getData,
  postData,
  putData,
  deleteData,
} from '../assets/js/dataFetcher';
import FileUpload from '../components/FileUpload';

export default {
  components: { FileUpload },
  data() {
    return {
      links: [],
      newLink: {},
    };
  },
  async created() {
    this.links = await getData('/links');
  },
  methods: {
    openRef(ref) {
      if (ref != 'newLink') this.$refs[ref][0].open();
      else this.$refs.newLink.open();
    },
    async handleEdit(link) {
      event.preventDefault();

      link = Object.assign({}, link);
      const id = link._id;
      delete link._id;

      const response = await postData('/odkaz/' + id, JSON.stringify(link));

      if (response.status === 202)
        this.$notify({
          type: 'success',
          title: '<i class="fas fa-check" />',
          text: 'Úspěšně uloženo',
        });
      else alert('Vyskytla se chyba');
    },
    async handleNew() {
      event.preventDefault();

      const response = await putData('/odkaz', JSON.stringify(this.newLink));

      if (response.status === 202) {
        const { id } = await response.json();

        this.newLink._id = id;
        this.links.push(this.newLink);

        this.newLink = {};
      } else alert('Vyskytla se chyba');
    },
    async handleDelete(linkIndex) {
      const linkId = this.links[linkIndex]._id;

      if (confirm('Opravdu chcete tento odkaz smazat?')) {
        const response = await deleteData('/odkaz/' + linkId);

        if (response.status === 202) {
          this.links.splice(linkIndex, 1);
        } else alert('Vyskytla se chyba');
      }
    },
  },
};
</script>

<style lang="sass" scoped>
input
  text-align: center
  padding: 5px
  border: 0
  width: calc( 100% - 10px )
  background-color: transparent
  margin: 2px 0
  &:focus
    outline: 0
  &:nth-of-type(1)
    font-size: 1.7rem

.links
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr))
  grid-gap: 10px
  .link
    border-bottom: 2px solid $purple
    &:nth-of-type(odd)
      background-color: $lighterGray
    &:nth-of-type(even)
      background-color: $darkerGray

button
  padding: 3px !important
  margin: 5px
  background-color: transparent
  border: 0
  cursor: pointer
  font-size: 1rem
  &:nth-of-type(1)
    color: $acceptGreen
  &:nth-of-type(2)
    color: $deleteRed

.icon
  position: relative
  color: black
  height: 3.8rem
  margin-top: 5px
  img
    padding: 5px
    height: calc( 100% - 10px )
    opacity: 1
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

<template>
  <main>
    <h1>Média</h1>

    <div class="wrapper">
      <div v-if="newFile.type == undefined" class="add">
        <h3>Přidat</h3>
        <button class="fab fa-youtube" @click="setType('video')" />
        <button class="far fa-images" @click="setType('images')" />
      </div>
      <div v-else class="add">
        <button class="fas fa-undo" @click="setType(undefined)" />
      </div>

      <hr />

      <div class="file">
        <div v-if="newFile.type == 'video'">
          <img
            :src="`https://img.youtube.com/vi/${newFile.code}/0.jpg`"
            alt="thumb"
            class="img"
          />
          <form @submit="handleNew(newFile)">
            <i class="fab fa-youtube" />
            <input
              type="text"
              v-model="newFile.code"
              placeholder="Youtube id (dQw4w9WgXcQ)"
              required
            />
            <br />
            <span>
              <button type="submit">Přidat</button>
            </span>
          </form>
        </div>
        <div v-else-if="newFile.type == 'images'">
          <Gallery v-model="newFile.gallery" />
          <form @submit="handleNew(newFile)">
            <i class="far fa-images" />
            <input
              type="text"
              v-model="newFile.title"
              placeholder="Titulek"
              required
            />
            <br />
            <span>
              <button type="submit">Přidat</button>
            </span>
          </form>
        </div>
      </div>

      <div v-for="(file, index) in media" :key="file._id" class="file">
        <div v-if="file.type == 'video'">
          <a
            :href="`https://www.youtube.com/watch?v=${file.code}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              :src="`https://img.youtube.com/vi/${file.code}/0.jpg`"
              alt="thumb"
              class="img"
            />
          </a>
          <form @submit="handleEdit(file)">
            <i class="fab fa-youtube" />
            <input
              type="text"
              v-model="file.code"
              placeholder="Youtube id (dQw4w9WgXcQ)"
              required
            />
            <br />
            <span>
              <button type="submit">Uložit</button>
              <button type="button" @click="handleDelete(index)">
                Odstranit
              </button>
            </span>
          </form>
        </div>
        <div v-else>
          <Gallery v-model="file.gallery" />
          <form @submit="handleEdit(file)">
            <i class="far fa-images" />
            <input
              type="text"
              v-model="file.title"
              placeholder="Titulek"
              required
            />
            <br />
            <span>
              <button type="submit">Uložit</button>
              <button type="button" @click="handleDelete(index)">
                Odstranit
              </button>
            </span>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Gallery from '../components/Gallery';
import {
  getData,
  postData,
  deleteData,
  putData,
} from '../assets/js/dataFetcher';

export default {
  components: { Gallery },
  data() {
    return {
      media: [],
      newFile: { gallery: [] },
    };
  },
  async created() {
    this.media = await getData('/media/0/12');
  },
  methods: {
    setType(type) {
      this.$set(this.newFile, 'type', type);
    },
    async handleEdit(file) {
      event.preventDefault();
      file = Object.assign({}, file);
      const id = file._id;
      delete file._id;
      const response = await postData('/media/' + id, JSON.stringify(file));

      if (response.status === 202)
        this.$notify({
          type: 'success',
          title: '<i class="fas fa-check" />',
          text: 'Úspěšně uloženo',
        });
      else alert('Vyskytla se chyba');
    },
    async handleDelete(fileIndex) {
      event.preventDefault();

      const id = this.media[fileIndex]._id;

      if (confirm('Opravdu chcete tuto položku smazat?')) {
        const result = await deleteData('/media/' + id);

        if (result.status === 202) this.media.splice(fileIndex, 1);
        else alert('Vyskytla se chyba');
      }
    },
    async handleNew() {
      event.preventDefault();

      var newFile = Object.assign({}, this.newFile);
      if (this.newFile.type == 'video') delete newFile.gallery;

      const result = await putData('/media', JSON.stringify(newFile));

      if (result.status === 202) {
        const { id, gallery } = await result.json();
        if (gallery) this.newFile.gallery = gallery;
        this.newFile._id = id;
        this.media.unshift(this.newFile);
        this.newFile = { gallery: [] };
      } else alert('Vyskytla se chyba');
    },
  },
};
</script>

<style lang="sass" scoped>
.wrapper
  width: 70%
  margin: auto
  @include medium-device
    width: calc( 100% - 4% )

.add > button
  @include btn($infoBlue)
  margin: 10px
  border-radius: 25%
  font-size: 3rem

.file > div
  display: grid
  grid-template-columns: 60% 40%
  justify-items: center
  align-items: center
  margin-bottom: 20px
  border: 1px solid $grayOutline
  padding: 20px
  @include small-device
    display: block
  .img
    width: auto
    max-width: 100%
    max-height: 30vh
    @include transition(transform)
    &:hover
      transform: scale(.96)
  i
    font-size: 3rem
    margin: 20px 0
    color: $purple
    width: 100%
  input
    border: 0
    padding: 10px
    width: 95%
    text-align: center
    font-size: 1.5rem
    margin-bottom: 60px
    &:focus
      outline: 1px solid $grayOutline
    @include small-device
      margin-bottom: 20px

  form
    position: relative
    span
      button
        margin: 5px 10px
        width: 110px
        padding: 10px !important
        &:nth-of-type(1)
          @include btn($acceptGreen)
        &:nth-of-type(2)
          @include btn($deleteRed)
</style>

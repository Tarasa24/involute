<template>
  <main>
    <h1>Media</h1>

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

      <div class="file" v-if="newFile.type != undefined">
        <div>
          <img
            v-if="newFile.type == 'video'"
            :src="`https://img.youtube.com/vi/${newFile.code}/0.jpg`"
            alt="thumb"
            class="img"
          />
          <Gallery
            v-else-if="newFile.type == 'images'"
            v-model="newFile.gallery"
          />
          <form @submit="handleNew(newFile)">
            <i
              :class="
                newFile.type == 'video' ? 'fab fa-youtube' : 'far fa-images'
              "
            />
            <input
              v-if="newFile.type == 'video'"
              type="text"
              v-model="newFile.code"
              placeholder="Youtube id (dQw4w9WgXcQ)"
              required
            />
            <input
              v-else-if="newFile.type == 'images'"
              type="text"
              v-model="newFile.title"
              placeholder="Titulek"
              required
            />
            <br />
            <div class="tags">
              <a
                v-for="(tag, index) in newFile.tags"
                :key="tag"
                @click="handleTagDelete(index, newFile)"
              >
                {{ tag }}
                <i aria-label="Odstranit tag" class="fas fa-times" />
              </a>
              <select @change="handleSelectTag(newFile)">
                <option value="">Vyberte z existujících tagů</option>
                <option
                  v-for="tag in newFile.tags
                    ? tags.filter(value => newFile.tags.indexOf(value) === -1)
                    : tags"
                  :key="tag"
                >
                  {{ tag }}
                </option>
              </select>
              <button type="button" @click="handleNewTag(newFile)">
                Nebo přidejte nový
                <i class="fas fa-plus" />
              </button>
            </div>
            <span class="buttons">
              <button type="submit">Přidat</button>
            </span>
          </form>
        </div>
      </div>

      <div v-for="(file, index) in media" :key="file._id" class="file">
        <div>
          <img
            v-if="file.type == 'video'"
            :src="`https://img.youtube.com/vi/${file.code}/0.jpg`"
            alt="thumb"
            class="img"
          />
          <Gallery v-else v-model="file.gallery" />
          <form @submit="handleEdit(file)">
            <i
              :class="
                newFile.type == 'video' ? 'fab fa-youtube' : 'far fa-images'
              "
            />
            <input
              v-if="file.type == 'video'"
              type="text"
              v-model="file.code"
              placeholder="Youtube id (dQw4w9WgXcQ)"
              required
            />
            <input
              v-else
              type="text"
              v-model="file.title"
              placeholder="Titulek"
              required
            />
            <br />
            <div class="tags">
              <a
                v-for="(tag, index) in file.tags"
                :key="tag"
                @click="handleTagDelete(index, file)"
              >
                {{ tag }}
                <i aria-label="Odstranit tag" class="fas fa-times" />
              </a>
              <select @change="handleSelectTag(file)">
                <option value="">Vyberte z existujících tagů</option>
                <option
                  v-for="tag in file.tags
                    ? tags.filter(value => file.tags.indexOf(value) === -1)
                    : tags"
                  :key="tag"
                >
                  {{ tag }}
                </option>
              </select>
              <button type="button" @click="handleNewTag(file)">
                Nebo přidejte nový
                <i class="fas fa-plus" />
              </button>
            </div>
            <span class="buttons">
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
      newFile: { gallery: [], tags: [] },
      tags: [],
    };
  },
  async created() {
    this.media = await getData('/media/0/12');
    this.tags = await getData('/media/tags');
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
    handleTagDelete(index, obj) {
      obj.tags.splice(index, 1);
    },
    handleSelectTag(obj) {
      const val = event.target.value;
      this.tags.splice(event.target.selectedIndex - 1, 1);
      event.target.value = '';

      if (obj.tags) obj.tags.push(val);
      else this.$set(obj, 'tags', [val]);
    },
    handleNewTag(obj) {
      const val = prompt('Zadejte jméno nového tagu:');
      if (!val) return;
      else if (obj.tags) {
        if (obj.tags.indexOf(val) !== -1) return;
        else obj.tags.push(val);
      } else this.$set(obj, 'tags', [val]);
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
    margin-bottom: 30px
    &:focus
      outline: 1px solid $grayOutline
    @include small-device
      margin-bottom: 20px

  form
    position: relative
    .tags
      text-align: center
      display: grid
      margin-bottom: 20px
      a, select, button
        width: fit-content
        justify-self: center
        background-color: $darkPurple
        border-radius: 16px
        border: 0
        padding: 2px 7.5px
        margin: 0 10px 10px 0
        white-space: nowrap
        color: white
        text-decoration: none
        font-size: .85rem
        cursor: pointer
        &:nth-last-child(1), &:nth-last-child(2)
          background-color: $purple
        i
          padding: 2.5px 5px
          margin: 0
          width: auto
          color: white
          font-size: .8rem
    .buttons
      button
        margin: 5px 10px
        width: 110px
        padding: 10px !important
        &:nth-of-type(1)
          @include btn($acceptGreen)
        &:nth-of-type(2)
          @include btn($deleteRed)
</style>

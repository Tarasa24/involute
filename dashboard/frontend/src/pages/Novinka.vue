<template>
  <main>
    <div
      class="header"
      :style="
        novinka.bg
          ? `background: linear-gradient(0deg, rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${novinka.bg})`
          : 'background-color: black'
      "
    >
      <i
        class="far fa-edit"
        title="Přidat hlavní náhledový obrázek"
        @click="handleClick"
      />
      <input
        placeholder="Nadpis"
        type="text"
        class="title"
        v-model="novinka.title"
      />
      <div class="tags">
        <a
          v-for="(tag, index) in novinka.tags"
          :key="tag"
          @click="handleTagDelete(index)"
        >
          {{ tag }}
          <i aria-label="Odstranit tag" class="fas fa-times" />
        </a>
        <select @change="handleSelectTag">
          <option value="">Vyberte jeden z existujících tagů</option>
          <option
            v-for="tag in novinka.tags
              ? tags.filter(value => this.novinka.tags.indexOf(value) === -1)
              : tags"
            :key="tag"
          >
            {{ tag }}
          </option>
        </select>
        <button @click="handleNewTag">
          Nebo přidejte nový
          <i class="fas fa-plus" />
        </button>
      </div>

      <span>
        <div class="author">
          <select v-model="novinka.author">
            <option value="">Bez autora</option>
            <option :value="self._id" v-if="self">{{ self.name }}</option>
            <option
              v-for="uzivatel in uzivatele"
              :key="uzivatel._id"
              :value="uzivatel._id"
            >
              {{ uzivatel.name }}
            </option>
          </select>
        </div>
        <datepicker :language="cs" v-model="novinka.date" />
      </span>
      <textarea placeholder="Krátký popisek" v-model="novinka.sub" />
    </div>

    <vue-editor
      class="editor"
      v-model="novinka.text"
      :editorToolbar="quill.customToolbar"
      :customModules="quill.customModulesForEditor"
      :editorOptions="quill.editorSettings"
    />

    <span v-if="newArticle" class="new">
      <button @click="handleSubmit(false)">Publikovat</button>
      <button @click="handleSubmit(true)">Uložit koncept</button>
    </span>
    <span v-else class="edit">
      <button @click="handleSubmit(novinka.draft)">Uložit změny</button>
      <button v-if="novinka.draft" @click="handleSubmit(false)">
        Publikovat
      </button>
      <button @click="handleDelete">Odstranit</button>
    </span>

    <FileUpload ref="FileUpload" v-model="novinka.bg" />
  </main>
</template>

<script>
import { VueEditor } from 'vue2-editor';
import ImageResize from 'quill-image-resize-module';
import VideoResize from 'quill-video-resize-module';
import Datepicker from 'vuejs-datepicker';
import { cs } from 'vuejs-datepicker/dist/locale';

import FileUpload from '../components/FileUpload';

import {
  getData,
  postData,
  deleteData,
  putData,
  getTokenPayload,
} from '../assets/js/dataFetcher';

export default {
  components: { VueEditor, Datepicker, FileUpload },
  props: {
    newArticle: {
      type: Boolean,
    },
  },
  watch: {
    novinka: {
      handler() {
        this.changed = true;
      },
      deep: true,
    },
  },
  data() {
    return {
      quill: {
        customToolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image', 'video'],
        ],
        customModulesForEditor: [
          { alias: 'imageResize', module: ImageResize },
          { alias: 'videoResize', module: VideoResize },
        ],
        editorSettings: {
          placeholder: 'Text',
          modules: {
            imageResize: {
              modules: ['Resize', 'DisplaySize'],
            },
            videoResize: {
              modules: ['Resize', 'DisplaySize'],
            },
          },
        },
      },
      cs: cs,
      novinka: {},
      changed: false,
      uzivatele: [],
      self: null,
      tags: [],
    };
  },
  mounted() {
    window.addEventListener('beforeunload', e => this.handleUnload(e));
  },
  unmounted() {
    window.removeEventListener('beforeunload', e => this.handleUnload(e));
  },
  async created() {
    this.uzivatele = await getData('/uzivatele');
    this.tags = await getData('/novinky/tags');

    if (!this.newArticle) {
      this.novinka = await getData('/novinka/' + this.$route.params.id);

      this.novinka.pinned = Boolean(this.novinka.pinned);
      this.novinka.draft = Boolean(this.novinka.draft);
      this.novinka.date = new Date(this.novinka.date * 1000);
      if (!this.novinka.author) this.novinka.author = '';

      this.$nextTick(() => {
        this.changed = false;
      });
    } else {
      this.novinka.date = new Date();

      this.self = await getTokenPayload();
      for (let i = 0; i < this.uzivatele.length; i++) {
        if (this.uzivatele[i].name == this.self.name) {
          this.uzivatele.splice(i, 1);
          break;
        }
      }
      const self = await getData('/uzivatel/' + this.self.name);
      this.self._id = self._id;
      this.novinka.author = self._id;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.changed) {
      if (confirm('Opravdu chcete odejít? Máte neuložené změny!')) {
        next();
        this.changed = false;
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
  methods: {
    async handleSubmit(draft) {
      var date = this.novinka.date;
      date.setHours(12);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      date = (date.getTime() - date.getTimezoneOffset() * 60 * 1000) / 1000;

      var data = Object.assign({}, this.novinka);
      data.date = date;

      data.draft = draft;

      if (!draft)
        if (!confirm('Opravdu chcete publikovat tento článek?')) return;

      this.$Progress.start();
      let result;
      if (!this.newArticle) {
        result = await postData(
          '/novinka/' + this.$route.params.id,
          JSON.stringify(data)
        );
      } else {
        data.created = Math.ceil(new Date().getTime() / 1000);
        result = await putData('/novinka', JSON.stringify(data));
      }

      if (result.status == 202) {
        this.$Progress.finish();
        this.changed = false;
        this.$router.push('/novinky');
      } else {
        this.$Progress.fail();
        alert('Vyskytla se chyba');
      }
    },
    async handleDelete() {
      if (confirm('Opravdu chcete tento článek smazat z databáze?')) {
        this.$Progress.start();
        const result = await deleteData('/novinka/' + this.$route.params.id);
        if (result.status == 202) {
          this.$Progress.finish();
          this.$router.push('/novinky');
        } else {
          this.$Progress.fail();
          alert('Vyskytla se chyba');
        }
      }
    },
    handleClick() {
      this.$refs.FileUpload.open();
    },
    handleUnload(e) {
      if (this.changed) {
        e.preventDefault();
        e.returnValue = '';
      }
    },
    handleTagDelete(index) {
      this.novinka.tags.splice(index, 1);
    },
    handleSelectTag(event) {
      const val = event.target.value;
      this.tags.splice(event.target.selectedIndex - 1, 1);
      event.target.value = '';

      if (this.novinka.tags) this.novinka.tags.push(val);
      else this.$set(this.novinka, 'tags', [val]);
    },
    handleNewTag() {
      const val = prompt('Zadejte jméno nového tagu:');
      if (!val) return;
      else if (this.novinka.tags) {
        if (this.novinka.tags.indexOf(val) !== -1) return;
        else this.novinka.tags.push(val);
      } else this.$set(this.novinka, 'tags', [val]);
    },
  },
};
</script>

<style lang="sass" scoped>
/deep/ .ql-editor iframe
  pointer-events: none

main
  width: 80%
  margin: 0 auto
  @include small-device
    width: 85vw

.header
  text-align: center
  background-repeat: no-repeat !important
  background-size: cover !important
  background-position: center center !important
  margin-bottom: 1%
  padding: 12px 15px
  .fa-edit
    font-size: 2.5rem
    color: white
    margin: 2.5% auto
    margin-bottom: 7.5%
    cursor: pointer
    opacity: .2
    @include transition(opacity)
    &:hover
      opacity: 1

  /deep/ input, textarea
    color: white
    border: 0
    width: 100%
    margin: 0
    padding: 15px 0
    font-family: inherit
    font-size: 1rem
    background: none
    &:focus
      outline: 0
    &::placeholder
      color: $grayOutline
      font-style: italic
  .title
    width: 100%
    font-weight: bold
    font-size: 2.5rem
    color: $purple
    font-family: sans-serif
    &::placeholder
      font-family: Roboto

  .tags
    text-align: left
    a, select, button
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
        color: white
        font-size: .8rem
  span
    display: flex
    .author
      width: 50%
      align-self: center
      text-align: left
      select
        background-color: rgba(black, 0.4)
        color: white
        border-radius: 16px
        border: 0
        font-size: .95rem
        padding: 10px 5px
    .vdp-datepicker
      width: 50%
      /deep/ .selected
        background: $purple
        color: white

      /deep/ .cell:not(.blank).day, .cell:not(.blank).month, .cell:not(.blank).year
        &:hover
          border: 1px solid $grayOutline
  textarea
    width: 100%
    resize: none
    padding-bottom: 0
    height: 8vh
    @include medium-device
      height: 8rem

.editor
  max-width: 80vw
  @include small-device
    max-width: 85vw

.edit
  button
    margin-top: 5vh
    width: 180px
    &:nth-of-type(1)
      @include btn($acceptGreen)
      margin-right: 15px
    &:nth-of-type(2)
      margin: 0 15px
      @include btn($infoBlue)
    &:last-of-type
      margin-left: 15px
      @include btn($deleteRed)

.new
  button
    margin-top: 5vh
    width: 180px
    &:nth-of-type(1)
      @include btn($acceptGreen)
      margin-right: 15px
    &:nth-of-type(2)
      @include btn($infoBlue)
      margin: 0 15px
</style>

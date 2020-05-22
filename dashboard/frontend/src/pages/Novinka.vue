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
      <span>
        <input
          placeholder="Hra / Téma"
          type="text"
          v-model="novinka.game"
          class="game"
        />
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
      <button @click="handleSubmit(true)">Uložit změny</button>
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
    };
  },
  mounted() {
    window.addEventListener('beforeunload', e => this.handleUnload(e));
  },
  unmounted() {
    window.removeEventListener('beforeunload', e => this.handleUnload(e));
  },
  async created() {
    if (!this.newArticle) {
      this.novinka = await getData('/novinka/' + this.$route.params.id);

      this.novinka.pinned = Boolean(this.novinka.pinned);
      this.novinka.draft = Boolean(this.novinka.draft);
      this.novinka.date = new Date(this.novinka.date * 1000);

      this.$nextTick(() => {
        this.changed = false;
      });
    } else {
      this.novinka.date = new Date();
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
  i
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
    text-transform: uppercase
    font-weight: bold
    font-size: 2.5rem
    color: $purple
    font-family: sans-serif
    &::placeholder
      font-family: Roboto
  span
    display: flex
    .game
      width: 50%
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

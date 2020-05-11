<template>
  <main>
    <div
      class="header"
      :style="
        'background: linear-gradient(0deg, rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(' +
        bg +
        ')'
      "
    >
      <i
        class="far fa-edit"
        title="Přidat hlavní náhledový obrázek"
        @click="handleClick"
      />
      <input placeholder="Nadpis" type="text" class="title" v-model="title" />
      <span>
        <input
          placeholder="Hra / Téma"
          type="text"
          v-model="game"
          class="game"
        />
        <datepicker :language="datepicker.cs" v-model="date" />
      </span>
      <textarea placeholder="Krátký popisek" v-model="sub" />
    </div>

    <vue-editor
      class="editor"
      v-model="text"
      :editorToolbar="quill.customToolbar"
      :customModules="quill.customModulesForEditor"
      :editorOptions="quill.editorSettings"
    />

    <button v-if="newArticle" @click="handleSubmit">Publikovat</button>
    <span v-else>
      <button @click="handleSubmit">Uložit</button>
      <button @click="handleDelete">Odstranit</button>
    </span>

    <FileUpload ref="FileUpload" v-model="bg" />
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
      datepicker: {
        cs: cs,
      },

      title: undefined,
      pinned: false,
      game: undefined,
      date: new Date(),
      sub: undefined,
      bg: undefined,
      text: undefined,
      created: undefined,
    };
  },
  async created() {
    if (!this.newArticle) {
      const result = await getData('/novinka/' + this.$route.params.id);

      this.title = result.title;
      this.pinned = Boolean(result.pinned);
      this.game = result.game;
      this.date = new Date(result.date * 1000);
      this.sub = result.sub;
      this.bg = result.bg;
      this.text = result.text;
      this.created = result.created;
    }
  },
  methods: {
    async handleSubmit() {
      var date = this.date;
      date.setHours(12);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      date = (date.getTime() - date.getTimezoneOffset() * 60 * 1000) / 1000;

      var data = {
        title: this.title,
        pinned: this.pinned,
        game: this.game,
        date: date,
        sub: this.sub,
        bg: this.bg,
        text: this.text,
        created: this.created,
      };

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
    width: calc( 100% - 4% )

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

button
  margin-top: 5vh
  width: 125px
  &:nth-of-type(1)
    @include btn($acceptGreen)
    margin-right: 15px
  &:nth-of-type(2)
    margin-left: 15px
    @include btn($deleteRed)
</style>

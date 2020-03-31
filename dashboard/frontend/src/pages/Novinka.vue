<template>
  <main>
    <div class="header">
      <input placeholder="Nadpis" type="text" class="title" v-model="title" />
      <span>
        <input placeholder="Hra" type="text" v-model="game" class="game" />
        <datepicker :language="datepicker.cs" v-model="date" />
      </span>
      <textarea placeholder="Krátký popiskek" v-model="sub" />
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
  </main>
</template>

<script>
import { VueEditor } from 'vue2-editor';
import ImageResize from 'quill-image-resize-module';
import VideoResize from 'quill-video-resize-module';
import Datepicker from 'vuejs-datepicker';
import { cs } from 'vuejs-datepicker/dist/locale';

import {
  getData,
  postData,
  deleteData,
  putData,
} from '../assets/js/dataFetcher';

export default {
  components: { VueEditor, Datepicker },
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
      game: undefined,
      date: new Date(),
      sub: undefined,
      text: undefined,
      created: undefined,
    };
  },
  async created() {
    if (!this.newArticle) {
      const result = await getData('/novinka/' + this.$route.params.id);

      this.title = result.title;
      this.game = result.game;
      this.date = new Date(result.date * 1000);
      this.sub = result.sub;
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
        game: this.game,
        date: date,
        sub: this.sub,
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
      this.$Progress.start();
      const result = await deleteData('/novinka/' + this.$route.params.id);

      if (result.status == 202) {
        this.$Progress.finish();
        this.$router.push('/novinky');
      } else {
        this.$Progress.fail();
        alert('Vyskytla se chyba');
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

.header
  text-align: left
  /deep/ input, textarea
    border: 0
    width: 100%
    margin: 0
    padding: 10px
    font-family: inherit
    font-size: 1rem
    &:focus
      outline: 1px $grayOutline solid
  .title
    text-transform: uppercase
    font-size: 2.5rem
    color: $purple
    font-weight: bold
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
    width: calc( 100% - 20px )
    resize: none

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

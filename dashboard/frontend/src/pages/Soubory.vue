<template>
  <main>
    <div>
      <h1>Správce souborů</h1>
      <div>
        {{ target.currentPath }}, {{ target.type }},
        {{ humanFileSize(target.size) }},
      </div>
      <div class="fs">
        <div
          class="icon"
          @click="handleBack()"
          v-if="currentDepth.length !== 0"
        >
          <div>
            <i class="fas fa-level-up-alt" />
            <br />
            <i>Zpět</i>
          </div>
        </div>

        <div class="icon" @click="handleNewDirectory">
          <div>
            <i class="fas fa-plus" />
            <br />
            <i>Nová složka</i>
          </div>
        </div>

        <div class="icon" @click="handleUploadClick">
          <div>
            <i class="fas fa-upload" />
            <br />
            <i>Nahrát soubor</i>
          </div>
        </div>

        <div
          class="icon"
          @click="handleClick(index, child)"
          v-for="(child, index) in target.children"
          :key="index"
        >
          <div>
            <i v-if="child.type == 'directory'" class="fas fa-folder" />
            <i v-else class="fas fa-file" />
            <br />
            <b>{{ child.name }}</b>
            <br />
            {{ humanFileSize(child.size) }}
          </div>
        </div>
      </div>
    </div>

    <div
      class="selected"
      ref="selected"
      v-if="Object.entries(selected).length !== 0"
    >
      <div class="preview">
        <span v-if="selected.type == 'directory'" class="fas fa-folder" />
        <a
          v-else-if="selected.contentType.includes('image/')"
          :href="selected.url"
          target="_blank"
        >
          <img :src="selected.url + '?height=720'" :alt="selected.name" />
        </a>
        <textarea
          v-else-if="selected.contentType.includes('text/')"
          v-model="selected.text"
        />
        <form v-else method="get" :action="selected.url">
          <button type="submit">
            <i class="fas fa-download" />{{ selected.name }}
          </button>
        </form>
      </div>
      <div class="info">
        <div>
          <h2>{{ selected.name }}</h2>
          <i v-if="selected.type == 'directory'"
            >{{ selected.type }} ({{ humanFileSize(selected.size) }})</i
          >
          <i v-else></i>
        </div>
        <div>
          <button @click="handleDelete">Odstranit</button>
        </div>
      </div>
    </div>

    <div style="display:none">
      <input ref="uploadTrigger" type="file" @change="handleUpload" />
    </div>
  </main>
</template>

<script>
import { staticUrl } from '../assets/js/dev';

export default {
  data() {
    return {
      tree: {},
      currentDepth: [],
      target: {},
      selected: {},
      baseUrl: staticUrl,
    };
  },
  async created() {
    await this.created();
  },
  methods: {
    async created() {
      const result = await fetch(this.baseUrl + '/tree');
      this.tree = await result.json();
      this.geturrentDirectory();
    },
    humanFileSize(size) {
      if (size < 1024) return size + ' B';
      let i = Math.floor(Math.log(size) / Math.log(1024));
      let num = size / Math.pow(1024, i);
      let round = Math.round(num);
      num = round < 10 ? num.toFixed(2) : round < 100 ? num.toFixed(1) : round;
      return `${num} ${'KMGTPEZY'[i - 1]}B`;
    },
    geturrentDirectory() {
      var temp = this.tree;
      var tempPath = '/';
      for (let i = 0; i < this.currentDepth.length; i++) {
        temp = temp.children[this.currentDepth[i]];

        if (i >= 1) tempPath += '/' + temp.name;
        else tempPath += temp.name;
      }
      temp.currentPath = tempPath;
      this.target = temp;
    },
    async handleClick(index, target) {
      var url = target.path
        .slice(target.path.search('/public'))
        .replace('/public', '/');

      if (target.type == 'directory') {
        this.currentDepth.push(index);
        this.selected = {
          type: target.type,
          name: target.name,
          size: target.size,
          url: this.baseUrl + url,
        };
        this.geturrentDirectory();
      } else {
        const response = await fetch(this.baseUrl + url);
        let contentType;
        for (let entry of response.headers.entries()) {
          if (entry[0] == 'content-type') {
            contentType = entry[1];
            break;
          }
        }

        var text = '';
        if (contentType.includes('text/')) text = await response.text();

        this.selected = {
          type: target.type,
          name: target.name,
          size: target.size,
          url: this.baseUrl + url,
          contentType: contentType,
          text: text,
        };
      }
    },
    handleBack() {
      this.currentDepth.pop();
      this.selected = {};
      this.geturrentDirectory();
    },
    handleUploadClick() {
      this.$refs.uploadTrigger.click();
    },
    async handleUpload(event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      await fetch(
        `${this.baseUrl}/upload${this.target.currentPath}/${file.name}`,
        {
          method: 'POST',
          body: formData,
        }
      );
      await this.created();
    },
    async handleNewDirectory() {
      const dirName = prompt('Zadejte název složky');

      if (dirName != null) {
        const response = await fetch(
          this.baseUrl + this.target.currentPath + '/' + dirName,
          {
            method: 'PUT',
          }
        );

        if (response.status === 202) {
          this.created();
        } else alert('Vyskytla se chyba');
      }
    },
    async handleDelete() {
      if (
        confirm(
          `Opravdu chcete "${this.selected.name}" ${
            this.selected.type == 'directory'
              ? '(včetně souborů uvnititř složky!)'
              : ''
          } smazat?`
        )
      ) {
        const response = await fetch(this.selected.url, {
          method: 'DELETE',
        });

        if (response.status === 202) {
          if (this.selected.type == 'directory') this.handleBack();
          this.selected = {};
          this.created();
        } else alert('Vyskytla se chyba');
      }
    },
  },
};
</script>

<style lang="sass" scoped>
main
  display: grid
  grid-template-rows: 50% 50%
.fs
  display: flex
  flex-wrap: wrap
  overflow: auto
  height: 70%
  padding: 0 10px
  border-bottom: 2px $grayOutline dashed
  .icon
    width: 128px
    height: 128px
    display: grid
    cursor: pointer
    margin: 0 8.5px

    .fa-level-up-alt, .fa-plus, .fa-upload
      color: $purple

    div
      align-self: center
      justify-self: center
      max-width: 128px
      max-height: 128px
    b
      word-wrap: break-word

.selected
  padding: 2%
  display: grid
  grid-template-columns: 50% 50%

  .preview
    justify-self: center
    align-self: center
    display: contents

    span
      font-size: 8rem
      align-self: center

    textarea
      width: 100%
      height: 100%
      resize: none
      border: 0
      font-family: inherit
      &:focus
        outline: 0
    img
      padding: 10px
      max-width: 100%
      max-height: 100%
    button
      margin: 25% 0
      @include btn($infoBlue)
      i
        margin-right: 5px

  .info
    display: grid
    align-items: center
    h2
      font-weight: bold
      margin: 0
    button
      @include btn($deleteRed)
</style>

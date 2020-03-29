<template>
  <main v-if="show" @click="handleClickOutside">
    <div class="overlay">
      <div>
        <span class="fas fa-times" @click="handleClose" />
        <h1>Vyberte soubor</h1>
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
              Zpět
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
        <a
          :href="selected.url + '?format=png'"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img :src="selected.url" :alt="selected.name" />
        </a>
        <div class="info">
          <div>
            <h2>{{ selected.name }}</h2>
            <i>{{ humanFileSize(selected.size) }}</i>
          </div>
          <button @click="handleSubmit">Vybrat</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      tree: {},
      currentDepth: [],
      target: {},
      selected: {},
    };
  },
  async created() {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? '/static'
        : 'http://localhost:3000';
    const result = await fetch(baseUrl + '/tree');
    this.tree = await result.json();
    this.geturrentDirectory();
  },
  methods: {
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
    humanFileSize(size) {
      if (size < 1024) return size + ' B';
      let i = Math.floor(Math.log(size) / Math.log(1024));
      let num = size / Math.pow(1024, i);
      let round = Math.round(num);
      num = round < 10 ? num.toFixed(2) : round < 100 ? num.toFixed(1) : round;
      return `${num} ${'KMGTPEZY'[i - 1]}B`;
    },
    handleClick(index, target) {
      if (target.type == 'directory') {
        this.currentDepth.push(index);
        this.geturrentDirectory();
      } else {
        var url = target.path
          .slice(target.path.search('/public/'))
          .replace(
            '/public',
            process.env.NODE_ENV === 'production'
              ? '/static'
              : 'http://localhost:3000'
          );
        var urlSafe = target.path
          .slice(target.path.search('/public/'))
          .replace('/public', '/static');

        this.selected = {
          name: target.name,
          size: target.size,
          url: url,
          urlSafe: urlSafe,
        };
      }
    },
    handleBack() {
      this.currentDepth.pop();
      this.geturrentDirectory();
    },
    handleSubmit() {
      this.$parent.data.img = this.selected.urlSafe;
      this.handleClose();
    },
    handleClose() {
      this.show = false;
    },
    handleClickOutside(e) {
      if (e.target.tagName == 'MAIN') this.handleClose();
    },
  },
};
</script>

<style lang="sass" scoped>
main
  position: fixed
  top: 0
  left: 0
  background-color: rgba(0, 0, 0, .7)
  width: 100%
  height: 100%
  z-index: 9998

.overlay
  background-color: $lighterGray
  opacity: .975
  border: 1px $grayOutline solid
  position: fixed
  top: 10%
  left: 10%
  z-index: 9999
  width: 80%
  height: 80%
  backdrop-filter: blur(2px)

  display: grid
  grid-template-rows: 50% 50%

span
  position: absolute
  top: 0
  right: 0
  padding: 20px
  cursor: pointer

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
  img
    max-width: calc( 100% - 2 * 10px )
    max-height: calc( 100% - 2 * 10px )
    justify-self: center
    align-self: center
    padding: 10px
  .info
    display: grid
    align-items: center
    h2
      font-weight: bold
      margin: 0
    button
      margin: 5%
      @include btn(#2ecc71)
      width: inherit

.fa-level-up-alt
  color: $purple
</style>

<template>
  <div class="gallery">
    <img v-if="images.length > 0" :src="images[0]" @click="open" />
    <span v-else class="fas fa-plus" @click="open" />

    <div v-if="visible" class="overlay" @click="handleOutside">
      <div class="container">
        <h3>Nahrát</h3>
        <br />
        <div
          class="drop-area"
          @dragenter="highlight(true, '.drop-area', 'highlight-blue')"
          @dragleave="highlight(false, '.drop-area', 'highlight-blue')"
          @drop="highlight(false, '.drop-area', 'highlight-blue')"
        >
          <i class="fas fa-upload" />
          <input
            type="file"
            name="file-input"
            multiple="True"
            @change="handleFileInput"
          />
        </div>
        <h3>Seřadit</h3>
        <draggable
          v-model="images"
          class="images"
          @start="drag = true"
          @end="drag = false"
          @change="handleChange"
        >
          <img
            v-for="(image, index) in images"
            :key="image"
            :src="image"
            draggable
            @dragstart="dragStart(index)"
          />
        </draggable>
        <i
          class="fas fa-trash trash"
          @dragenter="highlight(true, '.trash', 'highlight-red')"
          @dragleave="highlight(false, '.trash', 'highlight-red')"
          @dragover.prevent
          @drop="handleDelete"
        />
      </div>
      <button class="fas fa-times" @click="close" />
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import Compressor from 'compressorjs';

export default {
  components: { draggable },
  props: ['value'],
  data() {
    return {
      visible: false,
      images: [],
    };
  },
  created() {
    this.images = this.value;
  },
  methods: {
    open() {
      this.visible = true;
      this.disableScroll();
    },
    close() {
      this.visible = false;
      this.enableScroll();
    },
    disableScroll() {
      var x = window.scrollX;
      var y = window.scrollY;
      window.onscroll = function() {
        window.scrollTo(x, y);
      };
      document.documentElement.style.scrollBehavior = 'unset';
    },
    enableScroll() {
      window.onscroll = function() {};
      document.documentElement.style = '';
    },
    handleOutside() {
      if (event.target.classList[0] == 'overlay') this.close();
    },
    highlight(higlighted, query, className) {
      if (higlighted) document.querySelector(query).classList.add(className);
      else document.querySelector(query).classList.remove(className);
    },
    dragStart(index) {
      event.dataTransfer.setData('index', index);
      event.dataTransfer.dropEffect = 'move';
    },
    handleDelete() {
      this.highlight(false, '.trash', 'highlight-red');
      this.images.splice(Number(event.dataTransfer.getData('index')), 1);
    },
    handleChange() {
      this.$emit('input', this.images);
    },
    async handleFileInput(event) {
      const files = event.target.files;

      function compress(file) {
        return new Promise((resolve, reject) => {
          new Compressor(file, {
            convertSize: 2500000,
            maxWidth: 1920,
            maxHeight: 1080,
            success(result) {
              resolve(result);
            },
            error(err) {
              reject(err);
            },
          });
        });
      }

      function toBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

      for (let i = 0; i < files.length; i++) {
        const compressed = await compress(files[i]);
        this.images.push(await toBase64(compressed));
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.gallery
  height: fit-content

.overlay
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(black, .8)
  z-index: 2

.container
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  background-color: white
  width: 70vw
  .drop-area
    position: relative
    @include transition(background-color)
    input
      cursor: pointer
      opacity: 0.0
      filter: alpha(opacity=0)
      line-height: 30vh
      width: 100%
      z-index: 9
    i
      font-size: 3rem
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
  .images
    height: 3 * 90px + 5px
    overflow: auto
    img
      height: 80px
      margin: 5px
      cursor: move
  .trash
    font-size: 2rem
    width: calc(100% - 50px)
    padding: 25px
    @include transition(background-color)
button
  position: absolute
  top: 0
  right: 0
  background-color: transparent
  border: 0
  &:focus
    outline: 0
  color: white
  font-size: 1.5rem
  padding: 15px
  cursor: pointer

img, span
  font-size: 3rem
  width: auto
  max-width: 100%
  max-height: 30vh
  cursor: pointer
  @include transition(transform)
  &:hover
    transform: scale(.96)

.highlight-blue
  background-color: rgba($infoBlue, .1)
.highlight-red
  background-color: rgba($deleteRed, .1)
</style>

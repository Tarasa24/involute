<template>
  <div class="gallery">
    <img
      v-if="images.length > 0"
      :src="`${staticUrl}/${images[0]}`"
      @click="open"
    />
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
            :src="`${staticUrl}/${image}`"
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

export default {
  components: { draggable },
  props: ['value'],
  data() {
    return {
      visible: false,
      images: [],
      staticUrl:
        process.env.NODE_ENV === 'production'
          ? '/static'
          : 'http://localhost:5000',
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
      window.onscroll = function () {
        window.scrollTo(x, y);
      };
      document.documentElement.style.scrollBehavior = 'unset';
    },
    enableScroll() {
      window.onscroll = function () {};
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
    async handleDelete() {
      this.highlight(false, '.trash', 'highlight-red');

      const index = Number(event.dataTransfer.getData('index'));
      const element = this.images[index];

      const response = await fetch(`${this.staticUrl}/api/rm${element}`, {
        method: 'DELETE',
      });

      if (response.status == 200) this.images.splice(index, 1);
      else alert('Vyskytla se chyba');
    },
    handleChange() {
      this.$emit('input', this.images);
    },
    async handleFileInput(event) {
      const files = event.target.files;

      const data = new FormData();

      for (const file of files) {
        data.append('files[]', file, file.name);
      }

      const response = await fetch(`${this.staticUrl}/api/upload`, {
        method: 'POST',
        body: data,
      });

      if (response.status == 202) {
        this.images = this.images.concat(await response.json());
        this.$emit('input', this.images);
      } else alert('Vyskytla se chyba');
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

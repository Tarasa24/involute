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
          <div v-for="(image, index) in images" :key="image">
            <i class="fas fa-grip-lines" />
            <img
              v-lazy="`${staticUrl}/${image}`"
              draggable
              @dragstart="dragStart(index)"
            />
            <span>
              <a
                class="fas fa-angle-up"
                :disabled="index === 0"
                @click="handleMove(index, index - 1)"
              />
              <a
                class="fas fa-angle-down"
                :disabled="index === images.length - 1"
                @click="handleMove(index, index + 1)"
              />
              <a class="fas fa-times" @click="handleDelete(index)" />
            </span>
          </div>
        </draggable>
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
    },
    close() {
      this.visible = false;
    },
    handleOutside() {
      if (event.target.classList[0] == 'overlay') this.close();
    },
    highlight(higlighted, query, className) {
      if (higlighted) document.querySelector(query).classList.add(className);
      else document.querySelector(query).classList.remove(className);
    },
    async handleDelete(index) {
      const element = this.images[index];

      if (confirm('Opravdu checete tento soubor odstranit?')) {
        const response = await fetch(`${this.staticUrl}/api/rm${element}`, {
          method: 'DELETE',
        });

        if (response.status == 200) this.images.splice(index, 1);
        else alert('Vyskytla se chyba');
      }
    },
    handleMove(fromIndex, toIndex) {
      if (toIndex >= 0 && toIndex <= this.images.length - 1) {
        var element = this.images[fromIndex];
        this.images.splice(fromIndex, 1);
        this.images.splice(toIndex, 0, element);
      }
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
  position: relative
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  background-color: white
  width: 70vw
  height: 80vh
  overflow: auto
  @include medium-device
    width: 90vw
  h3
    transform: translate(0, 50%)
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
    padding-bottom: 20px
    div
      display: flex
      align-items: center
      position: relative
      margin: auto
      width: 90%
      border: 1px solid $grayOutline
      border-bottom-width: 0
      &:last-of-type
        border-bottom-width: 1px
      cursor: move
      .fa-grip-lines
        margin: 0 20px
        @include small-device
          display: none
      img
        height: 80px
        margin: 5px
      span
        position: absolute
        right: 10px
        font-size: 1.5rem
        z-index: 3
        background-color: white
        @include small-device
          font-size: 1.2rem
          right: 0
        a
          margin: 0 5px
          padding: 5px
          &[disabled]
            color: $grayOutline
            cursor: not-allowed
          @include small-device
            margin: 0 2px
        .fa-times
          color: $deleteRed
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

.highlight-blue
  background-color: rgba($infoBlue, .1)
.highlight-red
  background-color: rgba($deleteRed, .1)
</style>

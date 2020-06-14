<template>
  <main>
    <Header>
      <h1>Media</h1>
    </Header>

    <div class="media">
      <div class="file" v-for="file in media" :key="file._id">
        <VideoOverlay
          v-if="file.type == 'video'"
          class="video"
          :videoCode="file.code"
        />
        <div v-else class="image">
          <div
            class="img"
            :style="`background: url('${file.gallery[0]}'), white`"
            @click="openGallery(file)"
          >
            <span>
              {{ file.title }}
            </span>
          </div>
          <vue-gallery-slideshow
            :images="file.gallery"
            :index="file.index"
            @close="closeGallery(file)"
          ></vue-gallery-slideshow>
        </div>
      </div>
    </div>

    <PagePicker url="/media" :total="total" :perPage="perPage" />
  </main>
</template>

<script>
import { getData } from '../assets/js/dataFetcher';
import { staticUrl } from '../assets/js/dev';

import VueGallerySlideshow from 'vue-gallery-slideshow';
import VideoOverlay from '../components/VideoOverlay';
import Header from '../components/misc/Header';
import PagePicker from '../components/misc/PagePicker';

export default {
  components: { VueGallerySlideshow, VideoOverlay, Header, PagePicker },
  props: {
    perPage: {
      default: 6,
    },
  },
  data() {
    return {
      media: [],
      total: 0,
      staticUrl: staticUrl,
    };
  },
  watch: {
    $route: 'load',
  },
  async created() {
    this.load();
  },
  methods: {
    openGallery(file) {
      file.index = 0;
      this.disableScroll();
    },
    closeGallery(file) {
      file.index = null;
      this.enableScroll();
    },
    disableScroll() {
      var x = window.scrollX;
      var y = window.scrollY;
      window.onscroll = function () {
        window.scrollTo(x, y);
      };
    },
    enableScroll() {
      window.onscroll = function () {};
    },
    async load() {
      this.$Progress.start();
      this.total = await getData('/media/length');
      var media = await getData(
        `/media/${(this.$route.params.page - 1 || 0) * this.perPage}/${
          this.perPage
        }`
      );
      media.forEach(file => {
        file.index = null;
        if (file.type == 'images') {
          for (let i = 0; i < file.gallery.length; i++) {
            file.gallery[i] = this.staticUrl + file.gallery[i];
          }
        }
      });
      this.media = media;
      this.$Progress.finish();
    },
  },
};
</script>

<style lang="sass" scoped>
main
  text-align: center
  background-color: $bgGray
  @include medium-device
    grid-template-columns: 100%
    padding: 5%

.media
  margin: auto
  display: grid
  width: $baselineWidth
  max-width: $maxWidth
  grid-template-columns: repeat(3, minmax(180px, 1fr))
  column-gap: 4vw
  @include large-device
    column-gap: 10px
  @include medium-device
    grid-template-columns: repeat(2, 1fr)
    width: 100%
  @include small-device-portrait
    grid-template-columns: 1fr
    max-width: $maxWidth
    margin: 0
  @include outside-boundaries
    width: 70%

.image, .video
  margin-bottom: 50px

.image
  cursor: pointer
  span
    position: absolute
    bottom: 0
    left: 0
    width: calc(100% - 10px)
    z-index: 2
    color: white
    background-color: rgba(black,.8)
    padding: 10px 5px
    text-align: left
    font-weight: bold
    @include transition(color)
  .img
    background-repeat: no-repeat !important
    background-size: cover !important
    background-position: center center !important
    width: 100%
    height: 25vh
    max-width: 600px
    max-height: 240px
    position: relative
    justify-self: center
    margin-bottom: 50px
    @include small-device-portrait
      height: 35vh
    @include small-device-landscape
      height: 70vh
    @include transition(transform)
  &:hover
    .img
      transform: scale(.96)
    span
      color: $purple
</style>

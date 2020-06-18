<template>
  <main>
    <Header>
      <h1>Media</h1>
      <a v-if="$route.query.tag && $route.path.includes('/media')" class="tag">
        {{ $route.query.tag }}
      </a>
      <div v-else-if="$route.path.includes('/media')" class="tags">
        <router-link
          class="tag"
          :to="'/media?tag=' + tag[0]"
          v-for="tag in tags"
          :key="tag[0]"
        >
          {{ `${tag[0]} (${tag[1]})` }}
        </router-link>
      </div>
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
              <h6>Foto</h6>
              <a>{{ file.title }}</a>
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
      tags: [],
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
    },
    closeGallery(file) {
      file.index = null;
    },
    async load() {
      this.$Progress.start();
      let media;
      if (this.$route.query.tag) {
        this.total = await getData(
          `/media/length?tag=${this.$route.query.tag}`
        );
        media = await getData(
          `/media/${(this.$route.params.page - 1 || 0) * this.perPage}/${
            this.perPage
          }?tag=${this.$route.query.tag}`
        );
      } else {
        this.total = await getData('/media/length');
        this.tags = await getData('/media/tags');
        media = await getData(
          `/media/${(this.$route.params.page - 1 || 0) * this.perPage}/${
            this.perPage
          }`
        );
      }

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

.tags
  width: 70vw
  margin: auto
  overflow: auto
  padding: 10px 0 12.5px 0
  @include scrollbar(5px, gray, $textGray)
  @include medium-device
    width: 100%
  a
    white-space: nowrap

.tag
  background-color: $darkPurple
  border-radius: 16px
  padding: 2px 7.5px
  margin: 7px
  color: $textGray
  text-decoration: none
  font-size: 1rem
  position: relative
  top: 5px

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
    z-index: 1
    color: white
    background-color: rgba(black,.8)
    padding: 10px 5px
    text-align: left
    font-weight: bold
    @include transition(color)
    h6
      font-size: 15px
      font-weight: normal
    a
      font-size: 18px
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

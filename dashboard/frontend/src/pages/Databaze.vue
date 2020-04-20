<template>
  <main>
    <h1>Databáze</h1>

    <div class="wrapper">
      <Box
        title="Počet kolekcí"
        icon="fas fa-list"
        :number="stats.collections || 0"
      />
      <Box
        title="Celková velikost dat (v MB)"
        icon="fas fa-database"
        :number="(stats.dataSize / 1048576).toFixed(2) || 0"
      />
      <Box
        title="Počet objektů"
        icon="fas fa-file-alt"
        :number="stats.objects || 0"
      />
      <Box
        title="Průměrná velikost objektu (v kB)"
        icon="fas fa-database"
        :number="(stats.avgObjSize / 1024).toFixed(2) || 0"
      />
    </div>
    <iframe v-if="width > 800" :src="stats.url" frameborder="0" />
    <a v-else :href="stats.url">
      <button>
        <span class="fas fa-external-link-alt" />
        MongoDB monitoring
      </button>
    </a>
  </main>
</template>

<script>
import Box from '../components/Box';

import { getData } from '../assets/js/dataFetcher';

export default {
  components: { Box },
  data() {
    return {
      stats: {},
      width: window.innerWidth,
    };
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize);
  },
  async created() {
    this.$Progress.start();
    this.stats = await getData('/dbstats');
    this.$Progress.finish();
  },
  methods: {
    onResize() {
      this.width = window.innerWidth;
    },
  },
};
</script>

<style lang="sass" scoped>
.wrapper
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(280px + 2*10px, 1fr))

iframe
  margin-top: 5%
  width: 100%
  height: 3400px
button
  margin-top: 10%
  @include btn($infoBlue)
</style>

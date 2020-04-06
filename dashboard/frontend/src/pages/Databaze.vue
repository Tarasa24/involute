<template>
  <main>
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
    <iframe :src="stats.url" frameborder="0" />
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
    };
  },
  async created() {
    this.$Progress.start();
    this.stats = await getData('/dbstats');
    this.$Progress.finish();
  },
};
</script>

<style lang="sass" scoped>
.wrapper
  display: flex
  *
    &:first-child
      margin-left: 0
    &:last-child
      margin-right: 0

iframe
  margin-top: 5%
  width: 100%
  height: 350vh
</style>

<template>
  <main>
    <div>
      <img :src="image" alt="logo" />
      <h1>Vítejte, {{ name }}</h1>
    </div>
  </main>
</template>

<script>
import { getTokenPayload } from '../assets/js/dataFetcher';

export default {
  data() {
    return {
      name: null,
      image:
        process.env.NODE_ENV == 'production'
          ? '/dashboard/img/logo.png'
          : '/img/logo.png',
    };
  },
  async created() {
    const { name } = await getTokenPayload();
    this.name = name;
  },
};
</script>

<style lang="sass" scoped>
main
  display: grid
  align-items: center

img
  max-width: calc( 100% - 20px )
  max-height: 75vh
  width: auto
  height: auto
  padding: 10px
</style>

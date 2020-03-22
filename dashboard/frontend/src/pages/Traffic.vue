<template>
  <main>
    <div class="wrapper">
      <Box title="Active connections" icon="fas fa-users" number="69420" />
      <Box
        title="Reading connections"
        icon="fas fa-envelope-open-text"
        number="69420"
      />
      <Box title="Writing connections" icon="fas fa-pen-alt" number="69420" />
      <Box title="Idling connections" icon="fas fa-clock" number="69420" />
    </div>

    <iframe @load="handleLoad" :src="iframeSrc" />
  </main>
</template>

<script>
import Box from '../components/Box';

export default {
  components: { Box },
  data() {
    return {
      iframeSrc: 
        process.env.NODE_ENV === 'production'
          ? '/goaccess'
          : 'http://localhost/goaccess'
    }
  },
  methods: {
    handleLoad(event) {
      const iframe = event.target;
      iframe.style.height =
        iframe.contentWindow.document.body.scrollHeight + 'px';
      iframe.contentWindow.GoAccess.Nav.setTheme('bright');
    },
  },
};
</script>

<style lang="sass" scoped>
.wrapper
  display: flex
  padding: 0 3%
  *
    margin: auto

main
  padding: 2%

iframe
  border: 0

  margin-top: 5%
  width: 100%
  // height is being replaced in production
  height: 4000px
</style>

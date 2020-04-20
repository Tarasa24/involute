<template>
  <main>
    <h1>Traffic</h1>

    <div class="wrapper">
      <Box
        title="Active connections"
        icon="fas fa-users"
        :number="connections.active || 0"
      />
      <Box
        title="Reading connections"
        icon="fas fa-envelope-open-text"
        :number="connections.reading || 0"
      />
      <Box
        title="Writing connections"
        icon="fas fa-pen-alt"
        :number="connections.writing || 0"
      />
      <Box
        title="Idling connections"
        icon="fas fa-clock"
        :number="connections.idling || 0"
      />
    </div>

    <iframe @load="handleLoad" :src="iframeSrc" />
  </main>
</template>

<script>
import Box from '../components/Box';
import io from 'socket.io-client';

export default {
  components: { Box },
  data() {
    return {
      iframeSrc:
        process.env.NODE_ENV === 'production'
          ? '/goaccess'
          : 'http://localhost/goaccess',
      socket: undefined,
      connections: {},
    };
  },
  created() {
    const url =
      process.env.NODE_ENV === 'production'
        ? window.location.hostname
        : 'http://localhost:8181';

    const path =
      process.env.NODE_ENV === 'production'
        ? '/dashboard/api/socket.io'
        : '/socket.io';

    this.socket = io(url, {
      transports: ['websocket'],
      path: path,
    });

    this.socket.on('status', data => {
      this.connections = JSON.parse(data);
    });
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
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(190px + 2*10px, 1fr))

iframe
  border: 0

  margin-top: 5%
  width: 100%
  // height is being replaced in production
  height: 3900px
</style>

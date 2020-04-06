<template>
  <div style="display: none;">
    <input ref="uploadTrigger" type="file" @change="handleUpload" />
  </div>
</template>

<script>
import imageCompression from 'browser-image-compression';

export default {
  prop: ['value'],
  methods: {
    open() {
      this.$refs.uploadTrigger.click();
    },
    async handleUpload(event) {
      const file = event.target.files[0];

      const scaled = await imageCompression(file, { maxSizeMB: 2 });
      const base64 = await imageCompression.getDataUrlFromFile(scaled);
      this.$emit('input', base64);
    },
  },
};
</script>

<style></style>

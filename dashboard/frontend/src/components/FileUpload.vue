<template>
  <div style="display: none;">
    <input
      ref="uploadTrigger"
      type="file"
      accept="image/*"
      @change="handleUpload"
    />
  </div>
</template>

<script>
import Compressor from 'compressorjs';

export default {
  prop: ['value'],
  methods: {
    open() {
      this.$refs.uploadTrigger.click();
    },
    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    async handleUpload(event) {
      const file = event.target.files[0];
      function compress(file) {
        return new Promise((resolve, reject) => {
          new Compressor(file, {
            convertSize: 2500000,
            maxWidth: 1920,
            maxHeight: 1080,
            success(result) {
              resolve(result);
            },
            error(err) {
              reject(err);
            },
          });
        });
      }

      const compressed = await compress(file);
      const base64 = await this.toBase64(compressed);

      this.$emit('input', base64);
    },
  },
};
</script>

<style></style>

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/sass/global.sass"`,
      },
    },
  },
};

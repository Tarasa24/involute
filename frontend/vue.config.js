const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/sass/global.sass"`,
      },
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),
      new CompressionPlugin({
        include: /\.(html|css|js|ico|svg|png|webp)$/,
        minRatio: 0.9,
      }),
    ],
  },
  chainWebpack(config) {
    config.plugins.delete('prefetch');
  },
};

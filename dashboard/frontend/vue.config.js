const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  devServer: {
    port: 8180,
  },
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
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        Quill: 'quill/dist/quill.js',
      }),
      new CompressionPlugin({
        include: /\.(html|css|js|ico|svg)$/,
        minRatio: 0.9,
      }),
    ],
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/dashboard/' : '/',
  chainWebpack(config) {
    config.plugins.delete('prefetch');
  },
};

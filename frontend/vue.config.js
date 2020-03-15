const webpack = require('webpack');

module.exports = {
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
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      })
    ]
  }
};

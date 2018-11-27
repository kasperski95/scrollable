var path = require('path');

module.exports = {
  watch: true,

  mode: "production",

  entry: "./src/index.jsx",

  output: {
      path: path.resolve("./"),
      filename: "index.js",
      libraryTarget: 'commonjs2'
  },

  module: {
      rules: [
          {
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              use: {
                  loader: 'babel-loader'
              }
          }
      ]
  },
  externals: {
    "react": "commonjs react",
    "react-dom": "commonjs react-dom"
  }
};


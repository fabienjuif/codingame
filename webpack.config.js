const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: '',
  entry: {
    build: [
      './src',
    ],
  },
  output: {
    path: path.join(__dirname),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    root: [path.resolve('./src'), path.resolve('./src/components')],
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel'],
    }],
  },
}

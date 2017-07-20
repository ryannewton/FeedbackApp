const webpack = require('webpack');
const path = require('path');

const config = {
  devtool: 'cheap-module-source-map',
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    './src/index.js'
  ],
  output: {
    path: './public',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test:     /\.jsx?$/,
        exclude: /node_modules/,
        loaders:  ['babel-loader']
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ]
};

module.exports = config;

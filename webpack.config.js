// webpack.config.js

// eslint-disable-next-line
const webpack = require('webpack');
// const node = require('node-loader');
const nodeExternals = require('webpack-node-externals');

const config = {
  mode: 'production',
  target: 'node',
  externals: [nodeExternals()],
  entry: __dirname + '/src/check.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/lib',
    filename: 'check.js',
  },
};

module.exports = config;

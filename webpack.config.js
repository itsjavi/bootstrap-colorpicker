'use strict';
const path = require('path');
const webpack = require('webpack');
const libraryName = 'bootstrap-colorpicker';
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

let entries = {};

entries[libraryName] = './src/js/plugin.js';
entries[libraryName + '.min'] = './src/js/plugin.js';

module.exports = {
  mode: 'production',
  entry: entries,
  output: {
    filename: '[name].js',
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  resolve: {
    modules: [
      path.resolve('./src/js'),
      path.resolve('./node_modules')
    ]
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [
            require.resolve('babel-preset-env')
          ]
        }
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules|docs/
      }
    ]
  },
  externals: {
    'jquery': {
      root: 'jQuery',
      commonjs2: 'jquery',
      commonjs: 'jquery',
      amd: 'jquery'
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery'
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        include: /\.min\.js$/,
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: false
        },
        sourceMap: true
      })
    ]
  }
};

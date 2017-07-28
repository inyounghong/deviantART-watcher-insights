const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const precss = require('precss');
const autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'eval',
  entry: './app/main',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      title: 'D3/Webpack/ES6 Starterkit',
      description: 'Work in progress starter kit for data visualisation with D3',
      filename: 'index.html',
      template: 'template.html',
      files : {
        css : 'styles.css',
        js : 'bundle.js',
        html : 'content.html'
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'app'),
        exclude: /node_modules/
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url?limit=800',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /\.css$/, 
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
      },
      { 
        test: /\.json?$/, 
        loader: 'json-loader' 
      }
    ]
  },
  postcss: function () {
    return [precss, autoprefixer];
  },
  devServer: {
    port: 8000,
    historyApiFallback: true
  }
};

var webpack = require("webpack")
var path = require("path")
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
entry: "./main",
  output: {
    path: path.resolve(__dirname, "server", "static"),
    publicPath: "/static/",
    filename: "[name].[hash].js",
    sourceMapFilename: "[name].[hash].map.js",
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, 'server', 'static'),
    publicPath: '/static/',
    historyApiFallback: {
      index: '/static/index.html'
    },
    proxy: {
      "/api/*": {
        target: 'http://localhost:8080',
      }
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel'],
        exclude: path.resolve(__dirname, "node_modules"),
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      }
    ]
  },
  resolve: {
    extensions: ["", ".js", ".jsx", ".css", ".min.css"],
    root: [
      path.resolve('./client')
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client', 'html', 'index.ejs'),
    }),
    new webpack.ProvidePlugin({
      'React': 'react',
      'R': 'ramda',
      'jquery': 'jquery',
      'toastr': 'toastr'
    }),
  // new CopyWebpackPlugin([
  //     { from: 'assets' },
  // ]),
  ]
};

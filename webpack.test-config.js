var base = require('./webpack.config.js')
var webpack = require('webpack')
base.target = 'node'
base.plugins = [
  new webpack.ProvidePlugin({
    'React': 'react',
    'R': 'ramda',
    'jquery': 'jquery',
    'toastr': 'toastr'
  })
]
module.exports = base

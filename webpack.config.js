var webpack = require("webpack");
var path = require("path");
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./main",
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
        filename: "/js/bundle.js",
        sourceMapFilename: "/js/bundle.map.js",
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: './dist',
        historyApiFallback: {
            index: 'index.html'
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
                loaders: [
                    'react-hot',
                    'babel-loader',
                ],
                exclude: path.resolve(__dirname, "node_modules"),
            },
        ]
    },
    resolve: {
        extensions: ["", ".js", ".jsx"],
        root: [
            path.resolve('./client')
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            'React': 'react',
            'R': 'ramda',
            'jquery': 'jquery',
            'toastr': 'toastr'
        }),
        new CopyWebpackPlugin([
            { from: 'assets' },
        ]),
    ]
};

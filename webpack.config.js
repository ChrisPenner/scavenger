var webpack = require("webpack");
var path = require("path");
module.exports = {
    entry: "./main",
    output: {
        path: path.resolve(__dirname, "server"),
        filename: "bundle.js",
        sourceMapFilename: "bundle.map.js",
    },
    devtool: 'sourceMap',
    devServer: {
        port: 3000,
        inline: true,
        historyApiFallback: {
            index: 'index.html'
        }
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/, 
                loader: "babel-loader",
                exclude: path.resolve(__dirname, "node_modules"),
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ["transform-object-rest-spread"],
                }
            },
        ]
    },
    resolve: {
        extensions: ["", ".js", ".jsx"]
    },
    plugins: [
        new webpack.ProvidePlugin({
            'React': 'react',
        }),
    ]
};
